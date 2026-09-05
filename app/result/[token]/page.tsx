export const instant = false;

import crypto from "crypto";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";

import ResultPinForm from "@/components/result/ResultPinForm";
import ResultActions from "@/components/result/ResultActions";

function accessValue(
  token: string,
  pin: string
) {
  const secret =
    process.env.SUPABASE_SECRET_KEY;

  if (!secret) {
    return "";
  }

  return crypto
    .createHmac("sha256", secret)
    .update(`${token}:${pin}`)
    .digest("hex");
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const { token } =
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
      .eq(
        "result_token",
        token
      )
      .single();

  if (
    error ||
    !reading ||
    !["completed", "delivered"].includes(
      reading.status
    )
  ) {
    notFound();
  }

  const cookieStore =
    await cookies();

  const accessCookie =
    cookieStore.get(
      `saju_result_${token}`
    )?.value;

  const correctAccess =
    accessValue(
      token,
      reading.result_pin
    );

  if (
    !accessCookie ||
    accessCookie !== correctAccess
  ) {
    return (
      <ResultPinForm
        token={token}
      />
    );
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

  const hanja =
    sajuInfo.hanja ??
    {};

  const dayMaster =
    sajuInfo.dayMaster ??
    null;

  const counts =
    sajuInfo.counts ??
    {};

  const sections = [
    [
      "전체적인 사주",
      reading.general_reading,
    ],
    [
      "성격 / 기질",
      reading.personality_reading,
    ],
    [
      "연애 / 결혼운",
      reading.love_reading,
    ],
    [
      "재물운",
      reading.money_reading,
    ],
    [
      "직업 / 사업운",
      reading.career_reading,
    ],
    [
      "건강운",
      reading.health_reading,
    ],
    [
      "질문에 대한 답변",
      reading.question_answer,
    ],
  ];

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-8 text-neutral-900 sm:px-6">

      <div className="mx-auto max-w-3xl">

        <header className="text-center">

          <div className="text-5xl">
            
          </div>

          <div className="mt-4 text-sm font-bold text-[#795d72]">
            선녀사주
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            {reading.customer_name}님의 사주풀이
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            {reading.consultation_number}
          </p>

        </header>
        <ResultActions
          customerName={reading.customer_name}
        />



        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">

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


        {reading.day_pillar && (

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

            <div className="text-sm font-bold text-[#795d72]">
              사주 원국
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">

              <Pillar
                title="시주"
                korean={
                  reading.hour_pillar
                }
                hanja={
                  hanja.hour
                }
              />

              <Pillar
                title="일주"
                korean={
                  reading.day_pillar
                }
                hanja={
                  hanja.day
                }
                highlight
              />

              <Pillar
                title="월주"
                korean={
                  reading.month_pillar
                }
                hanja={
                  hanja.month
                }
              />

              <Pillar
                title="년주"
                korean={
                  reading.year_pillar
                }
                hanja={
                  hanja.year
                }
              />

            </div>


            {dayMaster && (

              <div className="mt-6 rounded-2xl bg-purple-50 p-5">

                <div className="text-xs font-bold text-[#795d72]">
                  일간
                </div>

                <div className="mt-2 text-2xl font-bold">

                  {dayMaster.hanja}
                  {" "}
                  {dayMaster.korean}

                  <span className="ml-2 text-sm font-medium text-neutral-600">
                    {dayMaster.yinYang}
                    {" "}
                    {dayMaster.element}
                  </span>

                </div>

              </div>

            )}


            <div className="mt-6">

              <div className="text-sm font-bold">
                오행 분포
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">

                {[
                  "목",
                  "화",
                  "토",
                  "금",
                  "수",
                ].map(
                  (
                    element
                  ) => (

                    <div
                      key={
                        element
                      }
                      className="rounded-xl bg-[#f7f1e8] p-3 text-center"
                    >

                      <div className="text-xs text-neutral-500">
                        {element}
                      </div>

                      <div className="mt-1 text-xl font-bold">
                        {counts[
                          element
                        ] ?? 0}
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

        )}


        {reading.question && (

          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

            <h2 className="text-lg font-bold">
              상담 질문
            </h2>

            <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#f7f1e8] p-5 leading-7 text-neutral-700">
              {reading.question}
            </div>

          </section>

        )}


        <section className="mt-4 space-y-4">

          {sections.map(
            (
              [
                title,
                content,
              ]
            ) => {

              if (
                !String(
                  content ?? ""
                ).trim()
              ) {
                return null;
              }

              return (

                <div
                  key={
                    String(
                      title
                    )
                  }
                  className="rounded-3xl bg-white p-5 shadow-sm sm:p-7"
                >

                  <h2 className="text-lg font-bold">
                    {title}
                  </h2>

                  <div className="mt-4 whitespace-pre-wrap leading-8 text-neutral-700">
                    {content}
                  </div>

                </div>

              );
            }
          )}

        </section>


        {reading.final_message && (

          <section className="mt-4 rounded-3xl bg-purple-50 p-6 sm:p-8">

            <div className="text-sm font-bold text-purple-700">
              선녀님의 한마디
            </div>

            <div className="mt-4 whitespace-pre-wrap text-lg leading-8">
              {reading.final_message}
            </div>

          </section>

        )}


        <footer className="py-10 text-center text-xs text-neutral-400">
          선녀사주  개인 상담 결과
        </footer>

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
      <div className="text-xs text-neutral-500">
        {label}
      </div>

      <div className="mt-1 font-bold">
        {value}
      </div>
    </div>
  );
}


function Pillar({
  title,
  korean,
  hanja,
  highlight = false,
}: {
  title: string;
  korean?: string | null;
  hanja?: string | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 text-center ${
        highlight
          ? "bg-purple-50"
          : "bg-[#f7f1e8]"
      }`}
    >
      <div className="text-xs text-neutral-500">
        {title}
      </div>

      <div className="mt-2 text-xl font-bold sm:text-2xl">
        {hanja ?? "-"}
      </div>

      <div className="mt-1 text-sm font-bold">
        {korean ?? "-"}
      </div>
    </div>
  );
}

