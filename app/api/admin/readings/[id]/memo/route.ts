import { requireAdmin } from "@/lib/auth/permissions";
﻿import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  const adminAccess = await requireAdmin();

  if (!adminAccess) {
    return Response.json(
      {
        error: "관리자 권한이 필요합니다.",
      },
      {
        status: 403,
      }
    );
  }

  try {
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

    const { id } =
      await context.params;

    const body =
      await request.json();

    const memo =
      String(
        body.memo ?? ""
      );

    const supabase =
      createAdminClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("readings")
        .update({
          internal_memo:
            memo,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          id
        )
        .select(
          "id,internal_memo"
        )
        .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            "내부메모 저장에 실패했습니다.",

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

  } catch (error) {
    console.error(
      "Internal memo error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "내부메모 저장 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
