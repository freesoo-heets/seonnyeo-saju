import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authClient = await createClient();

    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "관리자 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("readings")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: "상담 삭제에 실패했습니다.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete reading error:", error);

    return NextResponse.json(
      { error: "상담 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
