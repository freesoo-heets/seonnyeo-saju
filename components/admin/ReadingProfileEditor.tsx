"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "연애",
  "결혼",
  "재물",
  "직업",
  "사업",
  "건강",
  "자녀",
  "인간관계",
  "올해운세",
];

export default function ReadingProfileEditor({
  reading,
}: {
  reading: any;
}) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);

  const [customerName, setCustomerName] =
    useState(reading.customer_name ?? "");

  const [gender, setGender] =
    useState(reading.gender ?? "male");

  const [calendarType, setCalendarType] =
    useState(reading.calendar_type ?? "solar");

  const [birthDate, setBirthDate] =
    useState(reading.birth_date ?? "");

  const [birthHour, setBirthHour] =
    useState(
      reading.birth_hour !== null &&
      reading.birth_hour !== undefined
        ? String(reading.birth_hour)
        : ""
    );

  const [birthMinute, setBirthMinute] =
    useState(
      reading.birth_minute !== null &&
      reading.birth_minute !== undefined
        ? String(reading.birth_minute)
        : ""
    );

  const [birthTimeUnknown, setBirthTimeUnknown] =
    useState(Boolean(reading.birth_time_unknown));

  const [lunarLeapMonth, setLunarLeapMonth] =
    useState(Boolean(reading.lunar_leap_month));

  const [questionCategories, setQuestionCategories] =
    useState<string[]>(
      reading.question_categories ?? []
    );

  const [question, setQuestion] =
    useState(reading.question ?? "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleCategory(category: string) {
    setQuestionCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/admin/readings/${reading.id}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.detail
            ? `${result.error} (${result.detail})`
            : result.error ?? "수정에 실패했습니다."
        );
        return;
      }

      setMessage(
        "상담자 정보와 만세력이 함께 갱신되었습니다."
      );

      setEditing(false);

      router.refresh();
    } catch {
      setErrorMessage(
        "서버 연결 중 오류가 발생했습니다."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
        >
          상담정보 수정
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/40 p-5">

      <div className="flex items-center justify-between">

        <div>
          <div className="text-sm font-bold text-purple-700">
            상담정보 수정
          </div>

          <div className="mt-1 text-xs text-neutral-500">
            출생정보를 수정하면 만세력도 자동으로 다시 계산됩니다.
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-sm text-neutral-500"
        >
          닫기
        </button>

      </div>


      <div className="mt-5 space-y-5">

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">
            이름 / 닉네임
          </span>

          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
          />
        </label>


        <div>

          <span className="text-sm font-medium text-neutral-700">
            성별
          </span>

          <div className="mt-2 grid grid-cols-2 gap-2">

            {[
              ["male", "남성"],
              ["female", "여성"],
            ].map(([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                className={`rounded-xl border py-3 text-sm font-bold ${
                  gender === value
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {label}
              </button>

            ))}

          </div>

        </div>


        <label className="block">

          <span className="text-sm font-medium text-neutral-700">
            생년월일
          </span>

          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
          />

        </label>


        <div>

          <span className="text-sm font-medium text-neutral-700">
            양력 / 음력
          </span>

          <div className="mt-2 grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() => setCalendarType("solar")}
              className={`rounded-xl border py-3 text-sm font-bold ${
                calendarType === "solar"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700"
              }`}
            >
              양력
            </button>

            <button
              type="button"
              onClick={() => setCalendarType("lunar")}
              className={`rounded-xl border py-3 text-sm font-bold ${
                calendarType === "lunar"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700"
              }`}
            >
              음력
            </button>

          </div>

        </div>


        {calendarType === "lunar" && (

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={lunarLeapMonth}
              onChange={(e) =>
                setLunarLeapMonth(e.target.checked)
              }
            />

            <span className="text-sm text-neutral-700">
              윤달
            </span>

          </label>

        )}


        {!birthTimeUnknown && (

          <div className="grid grid-cols-2 gap-2">

            <select
              value={birthHour}
              onChange={(e) => setBirthHour(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3"
            >
              <option value="">
                시간
              </option>

              {Array.from({ length: 24 }).map((_, hour) => (
                <option key={hour} value={hour}>
                  {hour}시
                </option>
              ))}
            </select>


            <select
              value={birthMinute}
              onChange={(e) => setBirthMinute(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3"
            >
              <option value="">
                분
              </option>

              {Array.from({ length: 60 }).map((_, minute) => (
                <option key={minute} value={minute}>
                  {minute}분
                </option>
              ))}
            </select>

          </div>

        )}


        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={birthTimeUnknown}
            onChange={(e) =>
              setBirthTimeUnknown(e.target.checked)
            }
          />

          <span className="text-sm text-neutral-700">
            출생시간 모름
          </span>

        </label>


        <div>

          <span className="text-sm font-medium text-neutral-700">
            상담 분야
          </span>

          <div className="mt-2 grid grid-cols-3 gap-2">

            {categories.map((category) => {

              const active =
                questionCategories.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    toggleCategory(category)
                  }
                  className={`rounded-xl border py-2.5 text-sm ${
                    active
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  {category}
                </button>
              );

            })}

          </div>

        </div>


        <label className="block">

          <span className="text-sm font-medium text-neutral-700">
            궁금한 내용
          </span>

          <textarea
            rows={6}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-2 w-full resize-y rounded-xl border border-neutral-200 bg-white p-4"
          />

        </label>

      </div>


      {message && (
        <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}


      <div className="mt-5 grid grid-cols-2 gap-2">

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-xl border border-neutral-200 bg-white py-3 font-bold text-neutral-700"
        >
          취소
        </button>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-neutral-900 py-3 font-bold text-white disabled:opacity-50"
        >
          {saving
            ? "저장 중..."
            : "수정 저장"}
        </button>

      </div>

    </div>
  );
}
