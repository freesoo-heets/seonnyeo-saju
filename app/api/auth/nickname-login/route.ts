import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import {
  checkRateLimit,
  getClientIp,
  hashRateLimitValue,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

type LoginBody = {
  nickname?: string;
  password?: string;
};

function normalizeNickname(
  value: string
) {
  return value.trim();
}

function createInternalEmail() {
  return `u_${crypto.randomUUID()}@users.invalid`;
}

export async function POST(
  request: Request
) {
  try {

    /*
     * ========================================================
     * IP 기준 로그인/가입 요청 제한
     *
     * 10분 동안 최대 15회
     * ========================================================
     */

    const clientIp =
      getClientIp(request);

    const ipHash =
      hashRateLimitValue(
        clientIp
      );

    const ipLimit =
      await checkRateLimit({
        key:
          `login:ip:${ipHash}`,
        limit: 15,
        windowSeconds: 600,
      });

    if (!ipLimit.allowed) {
      return rateLimitResponse(
        "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
        ipLimit.resetAt
      );
    }


    /*
     * ========================================================
     * 요청 본문
     * ========================================================
     */

    let body: LoginBody;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "잘못된 요청입니다.",
        },
        {
          status: 400,
        }
      );
    }

    const nickname =
      typeof body.nickname ===
      "string"
        ? normalizeNickname(
            body.nickname
          )
        : "";

    const password =
      typeof body.password ===
      "string"
        ? body.password
        : "";


    /*
     * ========================================================
     * 기본 입력 검증
     * ========================================================
     */

    if (
      !nickname ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "닉네임과 비밀번호를 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      nickname.length < 2 ||
      nickname.length > 20
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "닉네임은 2자 이상 20자 이하로 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      password.length < 8 ||
      password.length > 128
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "비밀번호는 8자 이상 128자 이하로 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * ========================================================
     * 닉네임별 요청 제한
     *
     * 하나의 계정을 대상으로
     * 반복 대입 공격을 방지
     *
     * 10분 최대 8회
     * ========================================================
     */

    const nicknameHash =
      hashRateLimitValue(
        nickname.toLowerCase()
      );

    const nicknameLimit =
      await checkRateLimit({
        key:
          `login:nickname:${nicknameHash}`,
        limit: 8,
        windowSeconds: 600,
      });

    if (
      !nicknameLimit.allowed
    ) {
      return rateLimitResponse(
        "로그인 시도가 너무 많습니다. 약 10분 후 다시 시도해주세요.",
        nicknameLimit.resetAt
      );
    }


    const admin =
      createAdminClient();


    /*
     * ========================================================
     * 기존 회원 조회
     * ========================================================
     */

    const {
      data: existingProfile,
      error: lookupError,
    } = await admin
      .from("profiles")
      .select(
        "id, nickname, role"
      )
      .ilike(
        "nickname",
        nickname
      )
      .maybeSingle();

    if (lookupError) {
      console.error(
        "[nickname-login] profile lookup error:",
        lookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "회원 정보를 확인하는 중 오류가 발생했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    let profile =
      existingProfile;


    /*
     * ========================================================
     * 신규 닉네임
     *
     * 첫 로그인 = 자동가입
     *
     * 동일 IP 기준
     * 하루 최대 5개 신규계정
     * ========================================================
     */

    if (!profile) {

      const signupLimit =
        await checkRateLimit({
          key:
            `signup:ip:${ipHash}`,
          limit: 5,
          windowSeconds: 86400,
        });

      if (
        !signupLimit.allowed
      ) {
        return rateLimitResponse(
          "이 기기에서 생성할 수 있는 신규 계정 수를 초과했습니다. 잠시 후 다시 시도해주세요.",
          signupLimit.resetAt
        );
      }

      const internalEmail =
        createInternalEmail();

      const {
        data:
          createdAuth,
        error:
          createAuthError,
      } =
        await admin.auth.admin.createUser(
          {
            email:
              internalEmail,

            password,

            email_confirm:
              true,

            user_metadata: {
              nickname,
            },
          }
        );

      if (
        createAuthError ||
        !createdAuth.user
      ) {
        console.error(
          "[nickname-login] auth create error:",
          createAuthError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "회원 계정을 생성하지 못했습니다.",
          },
          {
            status: 500,
          }
        );
      }

      const userId =
        createdAuth.user.id;

      const {
        data:
          createdProfile,
        error:
          createProfileError,
      } = await admin
        .from("profiles")
        .insert({
          id: userId,
          nickname,
          role: "user",
        })
        .select(
          "id, nickname, role"
        )
        .single();

      if (
        createProfileError ||
        !createdProfile
      ) {
        console.error(
          "[nickname-login] profile create error:",
          createProfileError
        );

        try {
          await admin.auth.admin.deleteUser(
            userId
          );
        } catch (
          rollbackError
        ) {
          console.error(
            "[nickname-login] rollback error:",
            rollbackError
          );
        }

        return NextResponse.json(
          {
            success: false,
            error:
              "회원 정보를 생성하지 못했습니다.",
          },
          {
            status: 500,
          }
        );
      }

      profile =
        createdProfile;

      console.log(
        "[nickname-login] new member created:",
        profile.id
      );
    }


    /*
     * ========================================================
     * Auth 사용자 조회
     * ========================================================
     */

    const {
      data:
        authUserData,
      error:
        authUserError,
    } =
      await admin.auth.admin.getUserById(
        profile.id
      );

    if (
      authUserError ||
      !authUserData?.user
    ) {
      console.error(
        "[nickname-login] auth user lookup error:",
        authUserError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "회원 인증 정보를 확인할 수 없습니다.",
        },
        {
          status: 500,
        }
      );
    }

    const email =
      authUserData.user.email;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "회원 인증 정보가 올바르지 않습니다.",
        },
        {
          status: 500,
        }
      );
    }


    /*
     * ========================================================
     * 실제 Supabase 세션 생성
     * ========================================================
     */

    const supabase =
      await createClient();

    const {
      data:
        signInData,
      error:
        signInError,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (
      signInError ||
      !signInData.user
    ) {
      console.error(
        "[nickname-login] sign-in failed:",
        signInError?.message
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "닉네임 또는 비밀번호가 올바르지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    const redirectTo =
      profile.role ===
      "admin"
        ? "/admin"
        : "/member";

    return NextResponse.json({
      success: true,
      nickname:
        profile.nickname,
      role:
        profile.role,
      redirectTo,
    });

  } catch (error) {

    console.error(
      "[nickname-login] unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "로그인 처리 중 서버 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
