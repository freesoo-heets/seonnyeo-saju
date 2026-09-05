
import {
  checkRateLimit,
  getClientIp,
  hashRateLimitValue,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
﻿import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { calculateSaju } from "@/lib/saju/calculate";

export async function POST(request: Request) {

  // SECURITY_READING_RATE_LIMIT
  const readingIp = getClientIp(request);

  const readingIpHash =
    hashRateLimitValue(readingIp);

  const readingLimit =
    await checkRateLimit({
      key:
        `reading:ip:${readingIpHash}`,
      limit: 5,
      windowSeconds: 600,
    });

  if (!readingLimit.allowed) {
    return rateLimitResponse(
      "상담 신청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      readingLimit.resetAt
    );
  }


  try {
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
        {
          error:
            "이름 또는 닉네임을 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["male", "female"].includes(gender)
    ) {
      return NextResponse.json(
        {
          error: "성별을 선택해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["solar", "lunar"].includes(
        calendarType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "양력 또는 음력을 선택해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (!birthDate) {
      return NextResponse.json(
        {
          error:
            "생년월일을 입력해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    if (!question?.trim()) {
      return NextResponse.json(
        {
          error:
            "궁금한 내용을 입력해주세요.",
        },
        {
          status: 400,
        }
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
          {
            error:
              "정확한 출생시간을 입력해주세요.",
          },
          {
            status: 400,
          }
        );
      }
    }

    let saju;

    try {
      saju = calculateSaju({
        birthDate,
        birthHour: hour,
        birthMinute: minute,
        birthTimeUnknown:
          Boolean(birthTimeUnknown),

        calendarType,

        lunarLeapMonth:
          Boolean(lunarLeapMonth),

        gender,
      });
    } catch (error) {
      console.error(
        "Saju calculation error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "만세력 계산에 실패했습니다. 입력한 생년월일과 음력/윤달 여부를 확인해주세요.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      createAdminClient();

    const { data, error } =
      await supabase
        .from("readings")
        .insert({
          customer_name:
            customerName.trim(),

          gender,

          calendar_type:
            calendarType,

          birth_date:
            birthDate,

          birth_hour:
            hour,

          birth_minute:
            minute,

          birth_time_unknown:
            Boolean(birthTimeUnknown),

          lunar_leap_month:
            calendarType === "lunar"
              ? Boolean(lunarLeapMonth)
              : false,

          question_categories:
            Array.isArray(
              questionCategories
            )
              ? questionCategories
              : [],

          question:
            question.trim(),

          year_pillar:
            saju.pillars.year,

          month_pillar:
            saju.pillars.month,

          day_pillar:
            saju.pillars.day,

          hour_pillar:
            saju.pillars.hour,

          five_elements: {
            counts:
              saju.fiveElements,

            hanja:
              saju.hanja,

            dayMaster:
              saju.dayMaster,

            voidBranches:
              saju.voidBranches,

            options:
              saju.options,
          },

          ten_gods:
            saju.tenGods,

          daewoon:
            saju.luckPillars,

          status:
            "pending",
        })
        .select(
          `
          id,
          consultation_number,
          result_token,
          status,
          created_at,
          year_pillar,
          month_pillar,
          day_pillar,
          hour_pillar
          `
        )
        .single();

    if (error) {
      console.error(
        "Supabase insert error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "상담 정보를 저장하는 중 오류가 발생했습니다.",

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
      "POST readings error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "서버 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
