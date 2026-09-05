import { createHash } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: string | null;
};

export function getClientIp(
  request: Request
) {
  const vercelForwarded =
    request.headers.get(
      "x-vercel-forwarded-for"
    );

  if (vercelForwarded) {
    return vercelForwarded
      .split(",")[0]
      .trim();
  }

  const forwarded =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwarded) {
    return forwarded
      .split(",")[0]
      .trim();
  }

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function hashRateLimitValue(
  value: string
) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

export async function checkRateLimit({
  key,
  limit,
  windowSeconds,
}: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {

  const admin =
    createAdminClient();

  const {
    data,
    error,
  } = await admin.rpc(
    "check_rate_limit",
    {
      p_key: key,
      p_limit: limit,
      p_window_seconds:
        windowSeconds,
    }
  );

  if (error) {
    console.error(
      "[rate-limit] RPC error:",
      error
    );

    /*
     * Rate Limit 장애가 사이트 전체 장애로
     * 이어지지 않도록 fail-open.
     */
    return {
      allowed: true,
      remaining: limit,
      resetAt: null,
    };
  }

  const result =
    Array.isArray(data)
      ? data[0]
      : data;

  if (!result) {
    return {
      allowed: true,
      remaining: limit,
      resetAt: null,
    };
  }

  return {
    allowed:
      result.allowed === true,
    remaining:
      Number(
        result.remaining ?? 0
      ),
    resetAt:
      result.reset_at ?? null,
  };
}

export function rateLimitResponse(
  message: string,
  resetAt?: string | null
) {
  const headers =
    new Headers();

  if (resetAt) {

    const seconds =
      Math.max(
        1,
        Math.ceil(
          (
            new Date(
              resetAt
            ).getTime() -
            Date.now()
          ) / 1000
        )
      );

    headers.set(
      "Retry-After",
      String(seconds)
    );
  }

  return Response.json(
    {
      success: false,
      error: message,
    },
    {
      status: 429,
      headers,
    }
  );
}
