import crypto from "crypto";

import { NextResponse } from "next/server";

import {
  checkRateLimit,
  getClientIp,
  hashRateLimitValue,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

import { createAdminClient } from "@/lib/supabase/admin";

function createAccessValue(
  token: string,
  pin: string
) {
  const secret =
    process.env.SUPABASE_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "SUPABASE_SECRET_KEY가 설정되어 있지 않습니다."
    );
  }

  return crypto
    .createHmac("sha256", secret)
    .update(`${token}:${pin}`)
    .digest("hex");
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      token: string;
    }>;
  }
) {
  try {
    /*
     * -------------------------------------------------------
     * 1. URL token 확인
     * -------------------------------------------------------
     */
    const { token } =
      await context.params;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "잘못된 결과 링크입니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * 2. Rate Limit
     *
     * 같은 결과 링크 + 같은 IP 기준
     * 10분 동안 최대 8회
     * -------------------------------------------------------
     */
    const clientIp =
      getClientIp(request);

    const ipHash =
      hashRateLimitValue(
        clientIp
      );

    const tokenHash =
      hashRateLimitValue(
        token
      );

    const pinLimit =
      await checkRateLimit({
        key:
          `result-pin:${tokenHash}:${ipHash}`,
        limit: 8,
        windowSeconds: 600,
      });

    if (!pinLimit.allowed) {
      return rateLimitResponse(
        "비밀번호 확인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
        pinLimit.resetAt
      );
    }

    /*
     * -------------------------------------------------------
     * 3. PIN 형식 확인
     * -------------------------------------------------------
     */
    const body =
      await request.json();

    const pin =
      String(
        body?.pin ?? ""
      ).trim();

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        {
          error:
            "4자리 확인번호를 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * 4. 상담 결과 조회
     * -------------------------------------------------------
     */
    const supabase =
      createAdminClient();

    const {
      data: reading,
      error,
    } =
      await supabase
        .from("readings")
        .select(
          "result_pin,status"
        )
        .eq(
          "result_token",
          token
        )
        .maybeSingle();

    if (
      error ||
      !reading ||
      !["completed", "delivered"].includes(
        reading.status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "상담결과를 찾을 수 없습니다.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * 5. PIN 검증
     * -------------------------------------------------------
     */
    if (
      reading.result_pin !== pin
    ) {
      return NextResponse.json(
        {
          error:
            "확인번호가 일치하지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * -------------------------------------------------------
     * 6. 결과 열람 Cookie 발급
     * -------------------------------------------------------
     */
    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      `saju_result_${token}`,
      createAccessValue(
        token,
        pin
      ),
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        maxAge:
          60 * 60 * 24 * 7,
        path:
          `/result/${token}`,
      }
    );

    return response;

  } catch (error) {
    console.error(
      "[result-pin] verify error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "확인번호 검증 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}