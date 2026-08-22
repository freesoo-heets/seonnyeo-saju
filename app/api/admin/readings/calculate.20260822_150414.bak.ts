import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  calculateSaju,
} from "@/lib/saju/calculate";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authClient =
      await createClient();

    const {
      data: {
        user,
      },
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

    const {
      id,
    } =
      await context.params;

    const supabase =
      createAdminClient();

    const {
      data:
        reading,

      error:
        selectError,
    } =
      await supabase
        .from(
          "readings"
        )
        .select("*")
        .eq(
          "id",
          id
        )
        .single();

    if (
      selectError ||
      !reading
    ) {
      return NextResponse.json(
        {
          error:
            "상담 정보를 찾을 수 없습니다.",
        },
        {
          status: 404,
        }
      );
    }

    const saju =
      calculateSaju({
        birthDate:
          reading.birth_date,

        birthHour:
          reading.birth_hour,

        birthMinute:
          reading.birth_minute,

        birthTimeUnknown:
          reading.birth_time_unknown,

        calendarType:
          reading.calendar_type,

        lunarLeapMonth:
          reading.lunar_leap_month,

        gender:
          reading.gender,
      });

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "readings"
        )
        .update({
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

            dayBranch:
              saju.dayBranch,

            pillarDetails:
              saju.pillarDetails,

            voidBranches:
              saju.voidBranches,

            options:
              saju.options,
          },

          ten_gods:
            saju.tenGods,

          daewoon:
            saju.luckPillars,

          year_fortune:
            saju.yearFortune,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          id
        )
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            "만세력 저장에 실패했습니다.",

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

  } catch (
    error
  ) {
    console.error(
      "Saju recalculate error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "만세력 계산 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
