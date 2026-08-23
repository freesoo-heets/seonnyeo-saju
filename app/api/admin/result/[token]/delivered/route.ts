import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      token: string;
    }>;
  }
) {
  const authClient =
    await createClient();

  const {
    data: { user },
  } =
    await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error:
          "관리자 로그인이 필요합니다.",
      },
      {
        status: 401,
      }
    );
  }

  const { token } =
    await context.params;

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("readings")
      .update({
        status: "delivered",
        delivered_at:
          new Date().toISOString(),
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "result_token",
        token
      )
      .select()
      .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          "전달완료 처리에 실패했습니다.",
        detail:
          error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
    reading: data,
  });
}
