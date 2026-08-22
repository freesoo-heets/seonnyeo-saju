import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import ReadingEditor from "@/components/admin/ReadingEditor";
import CalculateSajuButton from "@/components/admin/CalculateSajuButton";

const elementOrder = [
  "목",
  "화",
  "토",
  "금",
  "수",
];

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

  if (
    error ||
    !reading
  ) {
    notFound();
  }

  const birthTime =
    reading.birth_time_unknown
      ? "출생시간 모름"
      : `${String(
          reading.birth_hour
        ).padStart(2, "0")}:${String(
          reading.birth_minute
        ).padStart(2, "0")}`;

  const sajuInfo =
    reading.five_elements ?? {};

  const counts =
    sajuInfo.counts ?? {};

  const hanja =
    sajuInfo.hanja ?? {};

  const dayMaster =
    sajuInfo.dayMaster ?? null;

  const voidBranches =
    sajuInfo.voidBranches ?? [];

  const tenGods =
    reading.ten_gods ?? {};

  const daewoon =
    reading.daewoon ?? null;

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

          <h2 className="text-lg font-bold">
            상담자 정보
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">

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
              value={reading.birth_date}
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

          <h2 className="text-lg font-bold">
            궁금한 내용
          </h2>

          {reading.question_categories?.length >
            0 && (
            <div className="mt-4 flex flex-wrap gap-2">

              {reading.question_categories.map(
                (category: string) => (
                  <span
                    key={category}
                    className="rounded-full bg-[#faf7f2] px-3 py-1.5 text-sm"
                  >
                    {category}
                  </span>
                )
              )}

            </div>
          )}

          <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-[#faf7f2] p-5 leading-7">
            {reading.question}
          </div>

        </section>


        <section className="mt-4 rounded-3xl border border-purple-100 bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

            <div>

              <div className="text-sm font-medium text-purple-600">
                 만세력
              </div>

              <h2 className="mt-1 text-xl font-bold">
                사주 원국
              </h2>

              <p className="mt-1 text-xs text-neutral-400">
                한국 표준시  진태양시 보정 없음  자정 일경계 기준
              </p>

            </div>

            <CalculateSajuButton
              readingId={reading.id}
            />

          </div>


          {reading.day_pillar ? (
            <>

              <div className="mt-7 grid grid-cols-4 gap-2">

                <Pillar
                  title="시주"
                  korean={reading.hour_pillar}
                  hanja={hanja.hour}
                  tenGod={tenGods?.hour?.stem}
                />

                <Pillar
                  title="일주"
                  korean={reading.day_pillar}
                  hanja={hanja.day}
                  tenGod="일간"
                  highlight
                />

                <Pillar
                  title="월주"
                  korean={reading.month_pillar}
                  hanja={hanja.month}
                  tenGod={tenGods?.month?.stem}
                />

                <Pillar
                  title="년주"
                  korean={reading.year_pillar}
                  hanja={hanja.year}
                  tenGod={tenGods?.year?.stem}
                />

              </div>


              {dayMaster && (

                <div className="mt-6 rounded-2xl bg-purple-50/60 p-5">

                  <div className="text-xs text-purple-500">
                    일간  나 자신
                  </div>

                  <div className="mt-2 text-xl font-bold">
                    {dayMaster.hanja}  {dayMaster.korean}
                    <span className="ml-2 text-base font-medium text-neutral-500">
                      {dayMaster.element}
                    </span>
                  </div>

                </div>

              )}


              <div className="mt-7">

                <h3 className="font-bold">
                  오행 분포
                </h3>

                <div className="mt-3 grid grid-cols-5 gap-2">

                  {elementOrder.map(
                    (element) => (

                      <div
                        key={element}
                        className="rounded-2xl bg-[#faf7f2] p-3 text-center"
                      >
                        <div className="text-sm text-neutral-500">
                          {element}
                        </div>

                        <div className="mt-1 text-xl font-bold">
                          {counts[element] ?? 0}
                        </div>

                      </div>

                    )
                  )}

                </div>

                <p className="mt-2 text-xs leading-5 text-neutral-400">
                  현재 오행 수치는 천간 4자와 지지 4자의 본 오행을 단순 집계한 값입니다.
                  지장간 가중치는 포함하지 않습니다.
                </p>

              </div>


              <div className="mt-7">

                <h3 className="font-bold">
                  십신
                </h3>

                <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-100">

                  <TenGodRow
                    name="년주"
                    value={tenGods?.year}
                  />

                  <TenGodRow
                    name="월주"
                    value={tenGods?.month}
                  />

                  <TenGodRow
                    name="일주"
                    value={tenGods?.day}
                  />

                  {!reading.birth_time_unknown && (
                    <TenGodRow
                      name="시주"
                      value={tenGods?.hour}
                    />
                  )}

                </div>

              </div>


              {voidBranches.length > 0 && (

                <div className="mt-7">

                  <h3 className="font-bold">
                    공망
                  </h3>

                  <div className="mt-3 flex gap-2">

                    {voidBranches.map(
                      (item: string) => (

                        <span
                          key={item}
                          className="rounded-full bg-neutral-100 px-4 py-2 text-sm"
                        >
                          {item}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}


              {daewoon && (

                <div className="mt-7">

                  <h3 className="font-bold">
                    대운
                  </h3>

                  <div className="mt-3 rounded-2xl bg-[#faf7f2] p-4">

                    <div className="text-sm text-neutral-500">
                      {daewoon.forward
                        ? "순행"
                        : "역행"}
                      {"  "}
                      대운 시작 약 {daewoon.startAge}세
                    </div>

                    {Array.isArray(
                      daewoon.pillars
                    ) && (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">

                        {daewoon.pillars.map(
                          (
                            pillar: {
                              age: number;
                              korean: string;
                            },
                            index: number
                          ) => (

                            <div
                              key={`${pillar.age}-${index}`}
                              className="min-w-[76px] rounded-xl bg-white p-3 text-center"
                            >
                              <div className="text-xs text-neutral-400">
                                {pillar.age}세
                              </div>

                              <div className="mt-1 font-bold">
                                {pillar.korean}
                              </div>

                            </div>

                          )
                        )}

                      </div>
                    )}

                  </div>

                </div>

              )}

            </>

          ) : (

            <div className="mt-6 rounded-2xl bg-[#faf7f2] p-7 text-center text-sm leading-7 text-neutral-500">
              아직 만세력이 계산되지 않았습니다.
              <br />
              위의 '만세력 다시 계산' 버튼을 눌러주세요.
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

      <div className="mt-1 font-medium">
        {value}
      </div>

    </div>
  );
}


function Pillar({
  title,
  korean,
  hanja,
  tenGod,
  highlight = false,
}: {
  title: string;
  korean?: string | null;
  hanja?: string | null;
  tenGod?: string | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 text-center sm:p-5 ${
        highlight
          ? "bg-purple-50 ring-1 ring-purple-100"
          : "bg-[#faf7f2]"
      }`}
    >

      <div className="text-xs text-neutral-400">
        {title}
      </div>

      <div className="mt-2 text-xl font-bold sm:text-2xl">
        {hanja ?? "-"}
      </div>

      <div className="mt-1 text-sm font-medium">
        {korean ?? "-"}
      </div>

      {tenGod && (
        <div className="mt-2 text-xs text-neutral-400">
          {tenGod}
        </div>
      )}

    </div>
  );
}


function TenGodRow({
  name,
  value,
}: {
  name: string;
  value?: {
    stem?: string;
    branch?: string;
  } | null;
}) {
  return (
    <div className="grid grid-cols-3 border-b border-neutral-100 bg-white px-4 py-3 last:border-b-0">

      <div className="text-sm font-medium">
        {name}
      </div>

      <div className="text-sm text-neutral-600">
        천간 {value?.stem ?? "-"}
      </div>

      <div className="text-sm text-neutral-600">
        지지 {value?.branch ?? "-"}
      </div>

    </div>
  );
}
