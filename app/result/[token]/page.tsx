export const instant = false;

import crypto from "crypto";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";

import ResultPinForm from "@/components/result/ResultPinForm";
import ResultActions from "@/components/result/ResultActions";
import BrandMark from "@/components/brand/BrandMark";
import {
  ElementBadge,
  ElementSurface,
  getCharElement,
} from "@/components/saju/FiveElementDisplay";

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
    <main className="saju-page min-h-screen bg-[#f7f1e8] px-4 py-8 text-neutral-900 sm:px-6">

      <div className="mx-auto max-w-3xl">

        <header className="saju-hero-card overflow-hidden rounded-[30px] border border-[#dfd0bd] p-6 text-center sm:p-9">
          <div className="flex justify-center"><BrandMark size="sm" withWordmark compact /></div>
          <p className="saju-eyebrow mt-5">SEONNYEO SAJU · RESULT</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#392c3b] sm:text-4xl">
            {reading.customer_name}님의 사주풀이
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#877b75]">
            타고난 기운과 현재의 흐름을 차분하게 정리한 개인 상담 결과입니다.
          </p>
          <p className="mt-4 text-xs font-bold tracking-[0.08em] text-[#a08561]">
            {reading.consultation_number}
          </p>
        </header>
        <ResultActions
          customerName={reading.customer_name}
        />



        <section className="saju-panel mt-8 rounded-[28px] p-5 sm:p-7">

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

          <section className="mt-5 rounded-[30px] border border-[#e5d8c8] bg-[rgba(255,253,249,0.97)] p-5 shadow-[0_14px_45px_rgba(75,50,62,0.07)] sm:p-7">

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

              <ElementSurface
                element={dayMaster.element}
                className="mt-6 rounded-[22px] p-5"
              >
                <div className="text-xs font-bold opacity-75">
                  일간 · 나 자신
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-black">{dayMaster.hanja}</span>
                  <span className="text-xl font-bold">{dayMaster.korean}</span>
                  <span className="text-sm font-semibold opacity-75">
                    {dayMaster.yinYang} {dayMaster.element}
                  </span>
                </div>
              </ElementSurface>

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

                    <ElementBadge
                      key={element}
                      element={element}
                      count={counts[element] ?? 0}
                    />

                  )
                )}

              </div>

            </div>

          </section>

        )}


        {reading.question && (

          <section className="mt-5 rounded-[30px] border border-[#e5d8c8] bg-[rgba(255,253,249,0.97)] p-5 shadow-[0_14px_45px_rgba(75,50,62,0.07)] sm:p-7">

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
                  className="saju-panel rounded-[28px] p-5 sm:p-7"
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
  const hanjaChars = Array.from(hanja ?? "");
  const koreanChars = Array.from(korean ?? "");
  const stemHanja = hanjaChars[0] ?? "-";
  const branchHanja = hanjaChars[1] ?? "-";
  const stemKorean = koreanChars[0] ?? "";
  const branchKorean = koreanChars[1] ?? "";

  return (
    <div
      className={`relative rounded-[24px] border p-2.5 text-center sm:p-3 ${
        highlight
          ? "border-[#b987ec] bg-[#fbf7ff] shadow-[0_10px_30px_rgba(139,92,246,0.10)]"
          : "border-[#eadfd3] bg-[#fffdf9]"
      }`}
    >
      {highlight ? (
        <span className="absolute -right-1.5 -top-2 rounded-full bg-[#7c3aed] px-2.5 py-1 text-[10px] font-bold text-white">
          나 자신
        </span>
      ) : null}

      <div className={`pb-2 text-xs font-bold ${highlight ? "text-[#6d28d9]" : "text-[#796f6a]"}`}>
        {title}
      </div>

      <ElementSurface
        element={getCharElement(stemHanja)}
        className="rounded-2xl px-2 py-3"
      >
        <div className="text-3xl font-black leading-none sm:text-4xl">{stemHanja}</div>
        <div className="mt-2 text-xs font-bold">{stemKorean}</div>
      </ElementSurface>

      <ElementSurface
        element={getCharElement(branchHanja)}
        className="mt-2 rounded-2xl px-2 py-3"
      >
        <div className="text-3xl font-black leading-none sm:text-4xl">{branchHanja}</div>
        <div className="mt-2 text-xs font-bold">{branchKorean}</div>
      </ElementSurface>
    </div>
  );
}

