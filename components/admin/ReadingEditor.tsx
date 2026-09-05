"use client";

import { useState } from "react";

type Props = {
  readingId: string;

  initialStatus: string;

  initialGeneralReading?: string | null;

  initialPersonalityReading?: string | null;

  initialLoveReading?: string | null;

  initialMoneyReading?: string | null;

  initialCareerReading?: string | null;

  initialHealthReading?: string | null;

  initialQuestionAnswer?: string | null;

  initialFinalMessage?: string | null;
};

export default function ReadingEditor({
  readingId,

  initialStatus,

  initialGeneralReading,

  initialPersonalityReading,

  initialLoveReading,

  initialMoneyReading,

  initialCareerReading,

  initialHealthReading,

  initialQuestionAnswer,

  initialFinalMessage,
}: Props) {

  const [status, setStatus] =
    useState(initialStatus);

  const [generalReading, setGeneralReading] =
    useState(initialGeneralReading ?? "");

  const [personalityReading, setPersonalityReading] =
    useState(initialPersonalityReading ?? "");

  const [loveReading, setLoveReading] =
    useState(initialLoveReading ?? "");

  const [moneyReading, setMoneyReading] =
    useState(initialMoneyReading ?? "");

  const [careerReading, setCareerReading] =
    useState(initialCareerReading ?? "");

  const [healthReading, setHealthReading] =
    useState(initialHealthReading ?? "");

  const [questionAnswer, setQuestionAnswer] =
    useState(initialQuestionAnswer ?? "");

  const [finalMessage, setFinalMessage] =
    useState(initialFinalMessage ?? "");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");


  async function saveReading(targetStatus?: string) {

    setSaving(true);

    setMessage("");
    setErrorMessage("");

    const nextStatus =
      targetStatus ?? status;

    try {

      const response = await fetch(
        `/api/admin/readings/${readingId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            generalReading,
            personalityReading,
            loveReading,
            moneyReading,
            careerReading,
            healthReading,
            questionAnswer,
            finalMessage,
            status: nextStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {

        setErrorMessage(
          result.detail
            ? `${result.error} (${result.detail})`
            : result.error ??
              "저장에 실패했습니다."
        );

        return;
      }

      setStatus(nextStatus);

      if (nextStatus === "completed") {
        setMessage(
          "사주풀이가 완료 처리되었습니다."
        );
      } else {
        setMessage(
          "저장되었습니다."
        );
      }

    } catch {

      setErrorMessage(
        "서버 연결 중 오류가 발생했습니다."
      );

    } finally {

      setSaving(false);

    }
  }


  return (

    <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <div className="text-sm text-[#80647a]">
             선녀님 작성영역
          </div>

          <h2 className="mt-1 text-xl font-bold text-neutral-900">
            사주풀이
          </h2>

        </div>


        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm"
        >

          <option value="pending">
            접수
          </option>

          <option value="reviewed">
            확인
          </option>

          <option value="writing">
            풀이중
          </option>

          <option value="completed">
            풀이완료
          </option>

          <option value="delivered">
            전달완료
          </option>

        </select>

      </div>


      <div className="mt-7 space-y-6">

        <ReadingField
          title="전체적인 사주"
          value={generalReading}
          setValue={setGeneralReading}
          placeholder="전체적인 사주 흐름과 특징을 작성해주세요."
        />


        <ReadingField
          title="성격 / 기질"
          value={personalityReading}
          setValue={setPersonalityReading}
          placeholder="성격, 기질, 장점과 주의할 점 등을 작성해주세요."
        />


        <ReadingField
          title="연애 / 결혼운"
          value={loveReading}
          setValue={setLoveReading}
          placeholder="연애와 결혼에 대한 풀이를 작성해주세요."
        />


        <ReadingField
          title="재물운"
          value={moneyReading}
          setValue={setMoneyReading}
          placeholder="재물 흐름과 재물운을 작성해주세요."
        />


        <ReadingField
          title="직업 / 사업운"
          value={careerReading}
          setValue={setCareerReading}
          placeholder="직업, 사업, 사회운을 작성해주세요."
        />


        <ReadingField
          title="건강운"
          value={healthReading}
          setValue={setHealthReading}
          placeholder="건강과 생활에서 주의할 점을 작성해주세요."
        />


        <ReadingField
          title="질문에 대한 답변"
          value={questionAnswer}
          setValue={setQuestionAnswer}
          placeholder="고객이 남긴 질문에 대해 직접 답변해주세요."
          rows={8}
        />


        <ReadingField
          title="선녀님의 한마디"
          value={finalMessage}
          setValue={setFinalMessage}
          placeholder="마지막 조언이나 메시지를 작성해주세요."
        />

      </div>


      {message && (

        <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>

      )}


      {errorMessage && (

        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>

      )}


      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

        <button
          type="button"
          disabled={saving}
          onClick={() =>
            saveReading(
              status === "pending"
                ? "writing"
                : status
            )
          }
          className="rounded-2xl border border-neutral-300 bg-white py-4 font-bold text-neutral-800 disabled:opacity-50"
        >
          {saving
            ? "저장 중..."
            : "임시저장"}
        </button>


        <button
          type="button"
          disabled={saving}
          onClick={() =>
            saveReading("completed")
          }
          className="rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:opacity-50"
        >
          상담 완료
        </button>

      </div>

    </section>
  );
}


function ReadingField({
  title,
  value,
  setValue,
  placeholder,
  rows = 5,
}: {
  title: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {

  return (

    <label className="block">

      <span className="font-bold text-neutral-800">
        {title}
      </span>

      <textarea
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-2xl border border-neutral-200 p-4 leading-7 outline-none focus:border-neutral-500"
      />

    </label>
  );
}
