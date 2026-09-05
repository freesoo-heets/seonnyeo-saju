import { requireAdmin } from "@/lib/auth/permissions";
﻿import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedStatuses = [
  "pending",
  "reviewed",
  "writing",
  "completed",
  "delivered",
];

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
    const body = await request.json();

    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "올바르지 않은 상담 상태입니다." },
        { status: 400 }
      );
    }

    const updateData = {
      general_reading: body.generalReading ?? null,
      personality_reading: body.personalityReading ?? null,
      love_reading: body.loveReading ?? null,
      money_reading: body.moneyReading ?? null,
      career_reading: body.careerReading ?? null,
      health_reading: body.healthReading ?? null,
      question_answer: body.questionAnswer ?? null,
      final_message: body.finalMessage ?? null,

      status: body.status ?? "writing",

      updated_at: new Date().toISOString(),

      completed_at:
        body.status === "completed" || body.status === "delivered"
          ? new Date().toISOString()
          : null,
    };

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("readings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);

      return NextResponse.json(
        {
          error: "사주풀이 저장 중 오류가 발생했습니다.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reading: data,
    });
  } catch (error) {
    console.error("PATCH error:", error);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
