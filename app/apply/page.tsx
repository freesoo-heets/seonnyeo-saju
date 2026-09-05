"use client";

import { FormEvent, useState } from "react";

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

export default function ApplyPage() {
  const [customerName, setCustomerName] = useState("");
  const [gender, setGender] = useState("");
  const [calendarType, setCalendarType] = useState("solar");

  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");

  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false);
  const [lunarLeapMonth, setLunarLeapMonth] = useState(false);

  const [questionCategories, setQuestionCategories] = useState<string[]>([]);
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [completed, setCompleted] = useState(false);
  const [consultationNumber, setConsultationNumber] = useState("");

  function toggleCategory(category: string) {
    setQuestionCategories((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }

      return [...current, category];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/readings", {
        method: "POST",
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
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.detail
            ? `${result.error} (${result.detail})`
            : result.error ?? "상담 접수에 실패했습니다."
        );
        return;
      }

      setConsultationNumber(result.reading.consultation_number);
      setCompleted(true);
    } catch {
      setErrorMessage("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-10 text-[#3f343a] sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <div className="mb-5 text-5xl"></div>

            <h1 className="font-serif text-2xl font-semibold text-[#493943]">
              상담 접수가 완료되었습니다
            </h1>

            <p className="mt-3 leading-7 text-neutral-500">
              선녀님이 상담 내용을 확인한 후
              <br />
              사주풀이를 진행합니다.
            </p>

            <div className="mt-8 rounded-2xl border border-[#e3d7c8] bg-[#fbf7f1] p-5">
              <div className="text-sm text-neutral-500">
                상담번호
              </div>

              <div className="mt-2 text-xl font-bold text-neutral-900">
                {consultationNumber}
              </div>
            </div>

            <div className="mt-5 inline-flex rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">
               풀이 대기
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-8 w-full rounded-2xl border border-neutral-200 py-3 text-neutral-700"
            >
              새로운 상담 등록
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-8 text-[#3f343a] sm:px-6">
      <div className="relative mx-auto w-full max-w-2xl">

        <header className="mb-8 text-center sm:mb-10">
          <div className="text-5xl"></div>

          <h1 className="mt-4 font-serif text-3xl font-semibold text-[#493943] sm:text-4xl">
            선녀사주
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8e817a]">
            정확한 사주풀이를 위해 정보를 입력해주세요.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">

          <section className="rounded-[26px] border border-[#dfd2c1] bg-[rgba(255,253,249,0.94)] p-5 shadow-[0_12px_40px_rgba(70,47,60,0.06)] sm:p-6">
            <h2 className="mb-5 font-serif text-lg font-semibold text-[#493943]">
              기본정보
            </h2>

            <label className="block">
              <span className="text-sm text-neutral-600">
                이름 / 닉네임
              </span>

              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="예: 홍길동"
                className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#876d82]"
              />
            </label>

            <div className="mt-5">
              <span className="text-sm text-neutral-600">
                성별
              </span>

              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  ["male", "남성"],
                  ["female", "여성"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGender(value)}
                    className={`rounded-xl border py-3 ${
                      gender === value
                        ? "border-[#604359] bg-[#604359] text-white"
                        : "border-neutral-200 bg-white text-neutral-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-[#dfd2c1] bg-[rgba(255,253,249,0.94)] p-5 shadow-[0_12px_40px_rgba(70,47,60,0.06)] sm:p-6">
            <h2 className="mb-5 font-serif text-lg font-semibold text-[#493943]">
              출생정보
            </h2>

            <label className="block">
              <span className="text-sm text-neutral-600">
                생년월일
              </span>

              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3"
              />
            </label>

            <div className="mt-5">
              <span className="text-sm text-neutral-600">
                양력 / 음력
              </span>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalendarType("solar")}
                  className={`rounded-xl border py-3 ${
                    calendarType === "solar"
                      ? "border-[#604359] bg-[#604359] text-white"
                      : "border-neutral-200 text-neutral-700"
                  }`}
                >
                  양력
                </button>

                <button
                  type="button"
                  onClick={() => setCalendarType("lunar")}
                  className={`rounded-xl border py-3 ${
                    calendarType === "lunar"
                      ? "border-[#604359] bg-[#604359] text-white"
                      : "border-neutral-200 text-neutral-700"
                  }`}
                >
                  음력
                </button>
              </div>
            </div>

            {calendarType === "lunar" && (
              <label className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lunarLeapMonth}
                  onChange={(e) => setLunarLeapMonth(e.target.checked)}
                />

                <span className="text-sm text-neutral-600">
                  윤달입니다
                </span>
              </label>
            )}

            {!birthTimeUnknown && (
              <div className="mt-5">
                <span className="text-sm text-neutral-600">
                  출생시간
                </span>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    className="rounded-xl border border-neutral-200 px-4 py-3"
                  >
                    <option value="">시간 선택</option>

                    {Array.from({ length: 24 }).map((_, hour) => (
                      <option key={hour} value={hour}>
                        {hour}시
                      </option>
                    ))}
                  </select>

                  <select
                    value={birthMinute}
                    onChange={(e) => setBirthMinute(e.target.value)}
                    className="rounded-xl border border-neutral-200 px-4 py-3"
                  >
                    <option value="">분 선택</option>

                    {Array.from({ length: 60 }).map((_, minute) => (
                      <option key={minute} value={minute}>
                        {minute}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <label className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={birthTimeUnknown}
                onChange={(e) => setBirthTimeUnknown(e.target.checked)}
              />

              <span className="text-sm text-neutral-600">
                출생시간을 모릅니다
              </span>
            </label>
          </section>

          <section className="rounded-[26px] border border-[#dfd2c1] bg-[rgba(255,253,249,0.94)] p-5 shadow-[0_12px_40px_rgba(70,47,60,0.06)] sm:p-6">
            <h2 className="mb-5 font-serif text-lg font-semibold text-[#493943]">
              궁금한 내용
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => {
                const active =
                  questionCategories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`rounded-xl border py-2.5 text-sm ${
                      active
                        ? "border-[#604359] bg-[#604359] text-white"
                        : "border-neutral-200 text-neutral-700"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={7}
              placeholder="선녀님께 궁금한 내용을 자유롭게 작성해주세요."
              className="mt-5 w-full resize-none rounded-xl border border-neutral-200 p-4 outline-none focus:border-[#876d82]"
            />
          </section>

          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl border border-[#604359] bg-[#604359] py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(80,50,72,0.16)] transition hover:bg-[#51374a] disabled:opacity-50"
          >
            {loading
              ? "상담 접수 중..."
              : "사주 상담 신청하기"}
          </button>

        </form>
      </div>
    </main>
  );
}
