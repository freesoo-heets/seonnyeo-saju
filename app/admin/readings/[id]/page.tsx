export const instant = false;

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import ReadingEditor from "@/components/admin/ReadingEditor";
import TraditionalSajuAnalysis from "@/components/admin/TraditionalSajuAnalysis";

import CalculateSajuButton from "@/components/admin/CalculateSajuButton";
import ResultLinkButton from "@/components/admin/ResultLinkButton";


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
    data: {
      user,
    },
  } =
    await authClient.auth.getUser();

  if (!user) {
    redirect(
      "/admin/login"
    );
  }

  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

  const {
    data:
      reading,

    error,
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
        ).padStart(
          2,
          "0"
        )}:${String(
          reading.birth_minute
        ).padStart(
          2,
          "0"
        )}`;


  const sajuInfo =
    reading.five_elements ??
    {};

  const counts =
    sajuInfo.counts ??
    {};

  const hanja =
    sajuInfo.hanja ??
    {};

  const dayMaster =
    sajuInfo.dayMaster ??
    null;

  const pillarDetails =
    sajuInfo.pillarDetails ??
    {};

  const voidBranches =
    sajuInfo.voidBranches ??
    [];

  const tenGods =
    reading.ten_gods ??
    {};

  const daewoon =
    reading.daewoon ??
    null;

  const yearFortune =
    reading.year_fortune ??
    null;


  return (

    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 text-neutral-900 sm:px-6">

      <div className="mx-auto max-w-5xl">

        <Link
          href="/admin"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
           상담 목록
        </Link>


        <header className="mt-5">

          <div className="text-xs font-medium text-neutral-500">
            {reading.consultation_number}
          </div>

          <h1 className="mt-2 text-3xl font-bold text-neutral-950">
            {reading.customer_name}님 사주
          </h1>

        </header>
        {["completed", "delivered"].includes(reading.status) && (
          <div className="mt-4">
            <ResultLinkButton
              token={reading.result_token}
            />
          </div>
        )}



        {/* 고객 정보 */}

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

          <h2 className="text-lg font-bold text-neutral-950">
            상담자 정보
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">

            <Info
              label="성별"
              value={
                reading.gender ===
                "male"
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
              value={
                birthTime
              }
            />

          </div>

        </section>


        {/* 질문 */}

        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

          <h2 className="text-lg font-bold text-neutral-950">
            궁금한 내용
          </h2>

          {reading.question_categories?.length >
            0 && (

            <div className="mt-4 flex flex-wrap gap-2">

              {reading.question_categories.map(
                (
                  category: string
                ) => (

                  <span
                    key={
                      category
                    }
                    className="rounded-full bg-[#faf7f2] px-3 py-1.5 text-sm font-medium text-neutral-700"
                  >
                    {category}
                  </span>

                )
              )}

            </div>

          )}

          <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-[#faf7f2] p-5 leading-7 text-neutral-800">
            {reading.question}
          </div>

        </section>


        {/* 만세력 */}

        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

            <div>

              <div className="text-sm font-bold text-purple-700">
                 만세력
              </div>

              <h2 className="mt-1 text-2xl font-bold text-neutral-950">
                사주 원국
              </h2>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                한국 표준시  진태양시 보정 없음  자정 일경계
              </p>

            </div>

            <CalculateSajuButton
              readingId={
                reading.id
              }
            />

          </div>


          {reading.day_pillar ? (

            <>

              {/* 원국 4주 */}

              <div className="mt-7 grid grid-cols-4 gap-2">

                <Pillar
                  title="시주"
                  korean={
                    reading.hour_pillar
                  }
                  details={
                    pillarDetails.hour
                  }
                  tenGod={
                    tenGods?.hour
                  }
                />

                <Pillar
                  title="일주"
                  korean={
                    reading.day_pillar
                  }
                  details={
                    pillarDetails.day
                  }
                  tenGod={
                    tenGods?.day
                  }
                  highlight
                />

                <Pillar
                  title="월주"
                  korean={
                    reading.month_pillar
                  }
                  details={
                    pillarDetails.month
                  }
                  tenGod={
                    tenGods?.month
                  }
                />

                <Pillar
                  title="년주"
                  korean={
                    reading.year_pillar
                  }
                  details={
                    pillarDetails.year
                  }
                  tenGod={
                    tenGods?.year
                  }
                />

              </div>


              {/* 일간 */}

              {dayMaster && (

                <div className="mt-6 rounded-2xl bg-purple-50 p-5">

                  <div className="text-xs font-bold text-purple-700">
                    일간  나 자신
                  </div>

                  <div className="mt-2 flex flex-wrap items-baseline gap-2">

                    <span className="text-3xl font-bold text-neutral-950">
                      {dayMaster.hanja}
                    </span>

                    <span className="text-xl font-bold text-neutral-900">
                      {dayMaster.korean}
                    </span>

                    <span className="text-sm font-medium text-neutral-600">
                      {dayMaster.yinYang}
                      {" "}
                      {dayMaster.element}
                    </span>

                  </div>

                </div>

              )}


              {/* 오행 */}

              <div className="mt-8">

                <h3 className="text-lg font-bold text-neutral-950">
                  오행 분포
                </h3>

                <div className="mt-3 grid grid-cols-5 gap-2">

                  {elementOrder.map(
                    (
                      element
                    ) => (

                      <div
                        key={
                          element
                        }
                        className="rounded-2xl bg-[#faf7f2] p-3 text-center"
                      >

                        <div className="text-sm font-medium text-neutral-600">
                          {element}
                        </div>

                        <div className="mt-1 text-2xl font-bold text-neutral-950">
                          {counts[
                            element
                          ] ?? 0}
                        </div>

                      </div>

                    )
                  )}

                </div>

                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  현재 수치는 천간과 지지의 본 오행을 기준으로 단순 집계합니다.
                  지장간 세력과 계절 가중치는 아직 반영하지 않습니다.
                </p>

              </div>


              {/* 공망 */}

              <div className="mt-8">

                <h3 className="text-lg font-bold text-neutral-950">
                  공망
                </h3>

                {voidBranches.length >
                  0 ? (

                  <div className="mt-3 flex flex-wrap gap-2">

                    {voidBranches.map(
                      (
                        item: string
                      ) => (

                        <span
                          key={
                            item
                          }
                          className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-800"
                        >
                          {item}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="mt-2 text-sm text-neutral-500">
                    표시할 공망 정보가 없습니다.
                  </p>

                )}

              </div>


              {/* 대운 */}

              {daewoon && (

                <div className="mt-8">

                  <div className="flex flex-wrap items-end justify-between gap-2">

                    <div>

                      <h3 className="text-lg font-bold text-neutral-950">
                        대운
                      </h3>

                      <p className="mt-1 text-sm text-neutral-600">
                        {daewoon.forward
                          ? "순행"
                          : "역행"}

                        {"  "}

                        대운 시작 약{" "}
                        <strong>
                          {daewoon.startAge}세
                        </strong>
                      </p>

                    </div>

                    <div className="text-sm text-neutral-600">
                      현재 만 나이{" "}
                      <strong>
                        {daewoon.currentAge}세
                      </strong>
                    </div>

                  </div>


                  {(daewoon.startYears !==
                    undefined ||
                    daewoon.startMonths !==
                    undefined) && (

                    <div className="mt-3 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">

                      세부 시작값 :

                      {" "}

                      {daewoon.startYears ??
                        0}년{" "}

                      {daewoon.startMonths ??
                        0}개월{" "}

                      {daewoon.startDays ??
                        0}일

                    </div>

                  )}


                  <div className="mt-4 flex gap-2 overflow-x-auto pb-3">

                    {Array.isArray(
                      daewoon.pillars
                    ) &&
                      daewoon.pillars.map(
                        (
                          pillar: any,
                          index: number
                        ) => {

                          const active =
                            index ===
                            daewoon.currentLuckIndex;

                          return (

                            <div
                              key={`${pillar.age}-${index}`}
                              className={`min-w-[90px] rounded-2xl border p-4 text-center ${
                                active
                                  ? "border-purple-300 bg-purple-50 ring-2 ring-purple-100"
                                  : "border-neutral-100 bg-[#faf7f2]"
                              }`}
                            >

                              {active && (

                                <div className="mb-1 text-[10px] font-bold text-purple-700">
                                  현재
                                </div>

                              )}

                              <div className="text-xs font-medium text-neutral-500">
                                {pillar.age}세
                              </div>

                              <div className="mt-2 text-lg font-bold text-neutral-950">
                                {pillar.korean}
                              </div>

                            </div>

                          );
                        }
                      )}

                  </div>

                </div>

              )}


              {/* 세운 */}

              {yearFortune &&
                Array.isArray(
                  yearFortune.years
                ) && (

                <div className="mt-8">

                  <div>

                    <h3 className="text-lg font-bold text-neutral-950">
                      세운
                    </h3>

                    <p className="mt-1 text-sm text-neutral-600">
                      현재 연도를 기준으로 전후 흐름을 표시합니다.
                    </p>

                  </div>


                  <div className="mt-4 overflow-x-auto pb-3">

                    <div className="flex min-w-max gap-2">

                      {yearFortune.years.map(
                        (
                          item: any
                        ) => (

                          <div
                            key={
                              item.year
                            }
                            className={`min-w-[112px] rounded-2xl border p-4 text-center ${
                              item.current
                                ? "border-purple-300 bg-purple-50 ring-2 ring-purple-100"
                                : "border-neutral-100 bg-[#faf7f2]"
                            }`}
                          >

                            {item.current && (

                              <div className="mb-1 text-[10px] font-bold text-purple-700">
                                올해
                              </div>

                            )}

                            <div className="text-xs font-medium text-neutral-500">
                              {item.year}
                            </div>

                            <div className="mt-1 text-xl font-bold text-neutral-950">
                              {item.hanja}
                            </div>

                            <div className="mt-1 text-sm font-bold text-neutral-900">
                              {item.pillar}
                            </div>

                            <div className="mt-3 text-xs leading-5 text-neutral-600">
                              천간{" "}
                              {item.stemTenGod}
                              <br />

                              지지{" "}
                              {item.branchTenGod}
                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )}


              {/* 아직 미적용 */}

              <div className="mt-8 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-5">

                <div className="font-bold text-neutral-900">
                  추가 명리 항목
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">

                  <PendingItem
                    text="십이운성"
                  />

                  <PendingItem
                    text="지장간"
                  />

                  <PendingItem
                    text="신살"
                  />

                  <PendingItem
                    text="귀인"
                  />

                </div>

                <p className="mt-4 text-xs leading-5 text-neutral-500">
                  이 항목들은 계산 기준이나 학파에 따라 결과가 달라질 수 있어
                  선녀사주에서 사용할 기준을 확정한 뒤 별도 계산 모듈로 추가합니다.
                </p>

              </div>

            </>

          ) : (

            <div className="mt-6 rounded-2xl bg-[#faf7f2] p-7 text-center text-sm leading-7 text-neutral-600">

              아직 만세력이 계산되지 않았습니다.

              <br />

              위의 '만세력 다시 계산' 버튼을 눌러주세요.

            </div>

          )}

        </section>


        {/* 풀이 */}


        <TraditionalSajuAnalysis
          twelveStates={reading.twelve_states}
          nobleman={reading.nobleman}
          sinsal={reading.sinsal}
        />
        <ReadingEditor

          readingId={
            reading.id
          }

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

      <div className="text-xs font-medium text-neutral-500">
        {label}
      </div>

      <div className="mt-1 font-bold text-neutral-900">
        {value}
      </div>

    </div>

  );
}


function Pillar({
  title,
  korean,
  details,
  tenGod,
  highlight = false,
}: {
  title: string;

  korean?:
    string |
    null;

  details?:
    any;

  tenGod?:
    any;

  highlight?:
    boolean;
}) {
return (

    <div
      className={`rounded-2xl border p-3 text-center sm:p-5 ${
        highlight
          ? "border-purple-200 bg-purple-50"
          : "border-neutral-100 bg-[#faf7f2]"
      }`}
    >

      <div className="text-xs font-bold text-neutral-500">
        {title}
      </div>

      <div className="mt-3">

        <div className="text-2xl font-bold text-neutral-950 sm:text-3xl">
          {details?.stem?.hanja ??
            "-"}
        </div>

        <div className="mt-1 text-xs font-medium text-neutral-600">
          {details?.stem
            ? `${details.stem.yinYang} ${details.stem.element}`
            : "-"}
        </div>

      </div>

      <div className="my-3 h-px bg-neutral-200" />

      <div>

        <div className="text-2xl font-bold text-neutral-950 sm:text-3xl">
          {details?.branch?.hanja ??
            "-"}
        </div>

        <div className="mt-1 text-xs font-medium text-neutral-600">
          {details?.branch
            ? `${details.branch.yinYang} ${details.branch.element}`
            : "-"}
        </div>

      </div>

      <div className="mt-3 text-sm font-bold text-neutral-900">
        {korean ?? "-"}
      </div>

      <div className="mt-3 space-y-1 text-[11px] font-medium text-neutral-600">

        <div>
          천간{" "}
          {tenGod?.stem ??
            "-"}
        </div>

        <div>
          지지{" "}
          {tenGod?.branch ??
            "-"}
        </div>

      </div>

    </div>

  );
}


function PendingItem({
  text,
}: {
  text: string;
}) {
return (

    <div className="rounded-xl bg-white px-3 py-3 text-center text-sm font-medium text-neutral-600">
      {text}
    </div>

  );
}










