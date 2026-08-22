"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Reading = {
  id: string;
  consultation_number: string;
  customer_name: string;
  gender: string;
  birth_date: string;
  question_categories: string[] | null;
  question: string | null;
  status: string;
  created_at: string;
};

const statusMap: Record<
  string,
  {
    text: string;
    badge: string;
  }
> = {
  pending: {
    text: "접수",
    badge: "bg-yellow-50 text-yellow-700",
  },

  reviewed: {
    text: "확인",
    badge: "bg-blue-50 text-blue-700",
  },

  writing: {
    text: "풀이중",
    badge: "bg-purple-50 text-purple-700",
  },

  completed: {
    text: "풀이완료",
    badge: "bg-green-50 text-green-700",
  },

  delivered: {
    text: "전달완료",
    badge: "bg-neutral-100 text-neutral-600",
  },
};

const tabs = [
  {
    value: "all",
    text: "전체",
  },
  {
    value: "pending",
    text: "접수",
  },
  {
    value: "reviewed",
    text: "확인",
  },
  {
    value: "writing",
    text: "풀이중",
  },
  {
    value: "completed",
    text: "풀이완료",
  },
  {
    value: "delivered",
    text: "전달완료",
  },
];

export default function AdminReadingsList({
  readings,
}: {
  readings: Reading[];
}) {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: readings.length,
    };

    for (const reading of readings) {
      result[reading.status] =
        (result[reading.status] ?? 0) + 1;
    }

    return result;
  }, [readings]);

  const filteredReadings = useMemo(() => {
    const normalizedKeyword =
      keyword.trim().toLowerCase();

    return readings.filter((reading) => {
      if (
        statusFilter !== "all" &&
        reading.status !== statusFilter
      ) {
        return false;
      }

      if (!normalizedKeyword) {
        return true;
      }

      const categories =
        reading.question_categories?.join(" ") ?? "";

      const target = [
        reading.consultation_number,
        reading.customer_name,
        reading.birth_date,
        reading.question ?? "",
        categories,
      ]
        .join(" ")
        .toLowerCase();

      return target.includes(normalizedKeyword);
    });
  }, [
    readings,
    keyword,
    statusFilter,
  ]);

  return (
    <section className="mt-8">

      <div className="flex flex-col gap-4">

        <div className="flex items-end justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-neutral-950">
              상담 목록
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              이름, 상담번호, 생년월일, 질문으로 검색할 수 있습니다.
            </p>
          </div>

          <div className="whitespace-nowrap text-sm text-neutral-500">
            검색결과{" "}
            <strong className="text-neutral-900">
              {filteredReadings.length}
            </strong>
            건
          </div>

        </div>


        {/* 검색 */}

        <div className="rounded-2xl bg-white p-3 shadow-sm">

          <div className="relative">

            <input
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              placeholder="이름  상담번호  생년월일  질문 검색"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-neutral-900 outline-none focus:border-purple-400"
            />

            {keyword && (
              <button
                type="button"
                onClick={() =>
                  setKeyword("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                
              </button>
            )}

          </div>

        </div>


        {/* 상태 탭 */}

        <div className="overflow-x-auto pb-1">

          <div className="flex min-w-max gap-2">

            {tabs.map((tab) => {
              const active =
                statusFilter === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(tab.value)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {tab.text}

                  <span
                    className={`ml-2 ${
                      active
                        ? "text-neutral-300"
                        : "text-neutral-400"
                    }`}
                  >
                    {counts[tab.value] ?? 0}
                  </span>
                </button>
              );
            })}

          </div>

        </div>

      </div>


      {/* 목록 */}

      {filteredReadings.length === 0 ? (

        <div className="mt-5 rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="text-3xl">
            
          </div>

          <div className="mt-3 font-bold text-neutral-800">
            조건에 맞는 상담이 없습니다.
          </div>

          <div className="mt-1 text-sm text-neutral-500">
            검색어나 상담 상태를 변경해보세요.
          </div>

        </div>

      ) : (

        <div className="mt-5 space-y-3">

          {filteredReadings.map((reading) => {

            const status =
              statusMap[reading.status] ??
              statusMap.pending;

            const categories =
              reading.question_categories ?? [];

            return (

              <Link
                key={reading.id}
                href={`/admin/readings/${reading.id}`}
                className="block rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <div className="text-xs font-bold text-neutral-400">
                      {reading.consultation_number}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      <h3 className="text-lg font-bold text-neutral-950">
                        {reading.customer_name}
                      </h3>

                      <span className="text-sm text-neutral-400">
                        {reading.gender === "male"
                          ? "남성"
                          : "여성"}
                      </span>

                    </div>

                    <div className="mt-1 text-sm text-neutral-500">
                      {reading.birth_date}
                    </div>

                  </div>


                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${status.badge}`}
                  >
                    {status.text}
                  </span>

                </div>


                {categories.length > 0 && (

                  <div className="mt-4 flex flex-wrap gap-1.5">

                    {categories.map((category) => (

                      <span
                        key={category}
                        className="rounded-full bg-[#faf7f2] px-3 py-1 text-xs font-medium text-neutral-600"
                      >
                        {category}
                      </span>

                    ))}

                  </div>

                )}


                {reading.question && (

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-700">
                    {reading.question}
                  </p>

                )}


                <div className="mt-5 flex items-center justify-between">

                  <div className="text-xs text-neutral-400">
                    {formatDate(reading.created_at)}
                  </div>

                  <div className="text-sm font-bold text-neutral-900">
                    상담 보기 
                  </div>

                </div>

              </Link>

            );
          })}

        </div>

      )}

    </section>
  );
}


function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(
      "ko-KR",
      {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return "";
  }
}
