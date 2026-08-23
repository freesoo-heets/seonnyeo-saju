import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
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
      .select(
        "result_pin,consultation_number,status"
      )
      .eq(
        "result_token",
        token
      )
      .single();

  if (
    error ||
    !data
  ) {
    return NextResponse.json(
      {
        error:
          "상담정보를 찾을 수 없습니다.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    ...data,
  });
}
