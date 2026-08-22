import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import ReadingEditor from "@/components/admin/ReadingEditor";

export default async function ReadingDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const authClient =
    await createClient();

  const {
    data: { user },
  } =
    await authClient.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } =
    await params;

  const supabase =
    createAdminClient();

  const {
    data: reading,
    error,
  } =
    await supabase
      .from("readings")
      .select("*")
      .eq("id", id)
      .single();

  if (error || !reading) {
    notFound();
  }


  const birthTime =
    reading.birth_time_unknown
      ? "출생시간 모름"
      : `${String(
          reading.birth_hour
        ).padStart(
          2,
          "0"
        )}:${String(
          reading.birth_minute
        ).padStart(
          2,
          "0"
        )}`;


  return (

    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 sm:px-6">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/admin"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
           상담 목록
        </Link>


        <header className="mt-5">

          <div className="text-xs font-medium text-neutral-400">
            {reading.consultation_number}
          </div>

          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            {reading.customer_name}님 사주
          </h1>

        </header>


        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

          <h2 className="text-lg font-bold text-neutral-900">
            상담자 정보
          </h2>


          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">

            <Info
              label="성별"
              value={
                reading.gender === "male"
                  ? "남성"
                  : "여성"
              }
            />


            <Info
              label="생년월일"
              value={
                reading.birth_date
              }
            />


            <Info
              label="달력"
              value={
                reading.calendar_type ===
                "solar"
                  ? "양력"
                  : reading.lunar_leap_month
                    ? "음력  윤달"
                    : "음력"
              }
            />


            <Info
              label="출생시간"
              value={birthTime}
            />

          </div>

        </section>


        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

          <h2 className="text-lg font-bold text-neutral-900">
            궁금한 내용
          </h2>


          {reading.question_categories?.length >
            0 && (

            <div className="mt-4 flex flex-wrap gap-2">

              {reading.question_categories.map(
                (category: string) => (

                  <span
                    key={category}
                    className="rounded-full bg-[#faf7f2] px-3 py-1.5 text-sm text-neutral-600"
                  >
                    {category}
                  </span>

                )
              )}

            </div>

          )}


          <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-[#faf7f2] p-5 leading-7 text-neutral-700">
            {reading.question}
          </div>

        </section>


        <section className="mt-4 rounded-3xl border border-dashed border-purple-200 bg-purple-50/40 p-5 sm:p-7">

          <div className="text-sm font-medium text-purple-600">
            만세력
          </div>

          <h2 className="mt-1 text-lg font-bold text-neutral-900">
            사주 원국
          </h2>


          {reading.day_pillar ? (

            <div className="mt-5 grid grid-cols-4 gap-2 text-center">

              <Pillar
                title="시주"
                value={reading.hour_pillar}
              />

              <Pillar
                title="일주"
                value={reading.day_pillar}
              />

              <Pillar
                title="월주"
                value={reading.month_pillar}
              />

              <Pillar
                title="년주"
                value={reading.year_pillar}
              />

            </div>

          ) : (

            <div className="mt-5 rounded-2xl bg-white p-6 text-center text-sm leading-6 text-neutral-500">
              아직 만세력이 계산되지 않았습니다.
              <br />
              다음 단계에서 생년월일과 출생시간을 기준으로 자동 생성하도록 연결합니다.
            </div>

          )}

        </section>


        <ReadingEditor
          readingId={reading.id}

          initialStatus={
            reading.status
          }

          initialGeneralReading={
            reading.general_reading
          }

          initialPersonalityReading={
            reading.personality_reading
          }

          initialLoveReading={
            reading.love_reading
          }

          initialMoneyReading={
            reading.money_reading
          }

          initialCareerReading={
            reading.career_reading
          }

          initialHealthReading={
            reading.health_reading
          }

          initialQuestionAnswer={
            reading.question_answer
          }

          initialFinalMessage={
            reading.final_message
          }
        />

      </div>

    </main>
  );
}


function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div>

      <div className="text-xs text-neutral-400">
        {label}
      </div>

      <div className="mt-1 font-medium text-neutral-800">
        {value}
      </div>

    </div>
  );
}


function Pillar({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {

  return (

    <div className="rounded-2xl bg-white p-4">

      <div className="text-xs text-neutral-400">
        {title}
      </div>

      <div className="mt-2 text-lg font-bold text-neutral-900">
        {value ?? "-"}
      </div>

    </div>
  );
}
