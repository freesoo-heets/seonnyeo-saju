import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      error,
    } = await supabase.auth.signOut();

    if (error) {
      console.error(
        "[logout] signOut error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "로그아웃하지 못했습니다.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "[logout] unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "로그아웃 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
