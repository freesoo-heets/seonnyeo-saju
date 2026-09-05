import { requireAdmin } from "@/lib/auth/permissions";
﻿import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { calculateSaju } from "@/lib/saju/calculate";
import { analyzeTraditionalSaju } from "@/lib/saju/traditional";

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

    const {
      customerName,
      gender,
      calendarType,
      birthDate,
      birthHour,
      birthMinute,
      birthTimeUnknown,
      lunarLeapMonth,
      questionCategories,
      question,
    } = body;

    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: "이름 또는 닉네임을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!["male", "female"].includes(gender)) {
      return NextResponse.json(
        { error: "성별 값이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    if (!["solar", "lunar"].includes(calendarType)) {
      return NextResponse.json(
        { error: "양력 또는 음력을 선택해주세요." },
        { status: 400 }
      );
    }

    if (!birthDate) {
      return NextResponse.json(
        { error: "생년월일을 입력해주세요." },
        { status: 400 }
      );
    }

    let hour: number | null = null;
    let minute: number | null = null;

    if (!birthTimeUnknown) {
      hour = Number(birthHour);
      minute = Number(birthMinute);

      if (
        Number.isNaN(hour) ||
        hour < 0 ||
        hour > 23 ||
        Number.isNaN(minute) ||
        minute < 0 ||
        minute > 59
      ) {
        return NextResponse.json(
          { error: "출생시간 값이 올바르지 않습니다." },
          { status: 400 }
        );
      }
    }

    const saju = calculateSaju({
      birthDate,
      birthHour: hour,
      birthMinute: minute,
      birthTimeUnknown: Boolean(birthTimeUnknown),
      calendarType,
      lunarLeapMonth: Boolean(lunarLeapMonth),
      gender,
    });

    const traditional = analyzeTraditionalSaju({
      yearPillar: saju.pillars.year,
      monthPillar: saju.pillars.month,
      dayPillar: saju.pillars.day,
      hourPillar: saju.pillars.hour,
    });

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("readings")
      .update({
        customer_name: customerName.trim(),
        gender,
        calendar_type: calendarType,
        birth_date: birthDate,
        birth_hour: hour,
        birth_minute: minute,
        birth_time_unknown: Boolean(birthTimeUnknown),
        lunar_leap_month:
          calendarType === "lunar"
            ? Boolean(lunarLeapMonth)
            : false,

        question_categories:
          Array.isArray(questionCategories)
            ? questionCategories
            : [],

        question: question?.trim() ?? "",

        year_pillar: saju.pillars.year,
        month_pillar: saju.pillars.month,
        day_pillar: saju.pillars.day,
        hour_pillar: saju.pillars.hour,

        five_elements: {
          counts: saju.fiveElements,
          hanja: saju.hanja,
          dayMaster: saju.dayMaster,
          dayBranch: saju.dayBranch,
          pillarDetails: saju.pillarDetails,
          hiddenStems: traditional.hiddenStems,
          voidBranches: saju.voidBranches,
          options: saju.options,
        },

        ten_gods: saju.tenGods,

        twelve_states: {
          stages: traditional.twelveStates,
          hiddenStems: traditional.hiddenStems,
          standard: traditional.standard,
        },

        sinsal: traditional.sinsal,
        nobleman: traditional.nobleman,
        daewoon: saju.luckPillars,
        year_fortune: saju.yearFortune,

        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "상담자 정보 수정에 실패했습니다.",
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
    console.error("Profile update error:", error);

    return NextResponse.json(
      { error: "상담자 정보 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
