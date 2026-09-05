import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nickname =
      String(body.nickname ?? "").trim();

    const password =
      String(body.password ?? "");

    if (!nickname || !password) {
      return NextResponse.json(
        {
          error:
            "닉네임과 비밀번호를 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    const admin =
      createAdminClient();

    const {
      data: profile,
      error: profileError,
    } =
      await admin
        .from("profiles")
        .select("id, nickname, role")
        .ilike("nickname", nickname)
        .maybeSingle();

    if (
      profileError ||
      !profile
    ) {
      return NextResponse.json(
        {
          error:
            "닉네임 또는 비밀번호가 올바르지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: userData,
      error: userError,
    } =
      await admin.auth.admin.getUserById(
        profile.id
      );

    const email =
      userData?.user?.email;

    if (
      userError ||
      !email
    ) {
      console.error(
        "Auth user lookup failed:",
        userError
      );

      return NextResponse.json(
        {
          error:
            "로그인 계정 정보를 확인할 수 없습니다.",
        },
        {
          status: 500,
        }
      );
    }

    const supabase =
      await createClient();

    const {
      error: loginError,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      return NextResponse.json(
        {
          error:
            "닉네임 또는 비밀번호가 올바르지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      success: true,
      role: profile.role,
      nickname: profile.nickname,
      redirectTo:
        profile.role === "admin"
          ? "/admin"
          : "/member",
    });

  } catch (error) {
    console.error(
      "Nickname login error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "로그인 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}

