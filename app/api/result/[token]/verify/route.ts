
import {
  checkRateLimit,
  getClientIp,
  hashRateLimitValue,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
﻿import crypto from "crypto";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function createAccessValue(
  token: string,
  pin: string
) {
  const secret =
    process.env.SUPABASE_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "SUPABASE_SECRET_KEY가 없습니다."
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

  // SECURITY_RESULT_PIN_RATE_LIMIT
  const pinIp =
    getClientIp(request);

  const pinIpHash =
    hashRateLimitValue(
      pinIp
    );

  let pinToken =
    "unknown";

  try {

    const contextAny =
      arguments[1];

    if (
      contextAny?.params
    ) {

      const params =
        await contextAny.params;

      if (
        params?.token
      ) {
        pinToken =
          String(
            params.token
          );
      }
    }

  } catch {
    // token을 가져오지 못하면
    // IP 기준으로만 제한합니다.
  }

  const pinTokenHash =
    hashRateLimitValue(
      pinToken
    );

  const pinLimit =
    await checkRateLimit({
      key:
        `result-pin:${pinTokenHash}:${pinIpHash}`,
      limit: 8,
      windowSeconds: 600,
    });

  if (!pinLimit.allowed) {
    return rateLimitResponse(
      "비밀번호 확인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
      pinLimit.resetAt
    );
  }


  try {
    const { token } =
      await context.params;

    const body =
      await request.json();

    const pin =
      String(body.pin ?? "");

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        {
          error: "4자리 확인번호를 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

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
        .single();

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
        maxAge: 60 * 60 * 24 * 7,
        path: `/result/${token}`,
      }
    );

    return response;

  } catch (error) {
    console.error(
      "PIN verify error:",
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
