"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Reading = {
  id: string;
  consultation_number: string;
  customer_name: string;
  requester_nickname?: string | null;
  gender: string;
  birth_date: string;
  question_categories: string[] | null;
  question: string | null;
  status: string;
  created_at: string;
};

const statusMap: Record<string, { text: string; badge: string }> = {
  pending: { text: "접수", badge: "border-[#dfbd78] bg-[#fff8e8] text-[#8e6b2e]" },
  reviewed: { text: "확인", badge: "border-[#aabbd1] bg-[#f1f5fb] text-[#536b8a]" },
  writing: { text: "풀이중", badge: "border-[#c5afd0] bg-[#f7f0fa] text-[#72577e]" },
  completed: { text: "풀이완료", badge: "border-[#a7cbb0] bg-[#edf7f0] text-[#467155]" },
  delivered: { text: "전달완료", badge: "border-[#bac3bc] bg-[#f2f5f3] text-[#5d6e62]" },
};

const tabs = [
  { value: "all", text: "전체" },
  { value: "pending", text: "접수" },
  { value: "reviewed", text: "확인" },
  { value: "writing", text: "풀이중" },
  { value: "completed", text: "완료" },
  { value: "delivered", text: "전달" },
];

export default function AdminReadingsList({ readings }: { readings: Reading[] }) {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: readings.length };
    for (const reading of readings) {
      result[reading.status] = (result[reading.status] ?? 0) + 1;
    }
    return result;
  }, [readings]);

  const filteredReadings = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return readings.filter((reading) => {
      if (statusFilter !== "all" && reading.status !== statusFilter) return false;
      if (!normalizedKeyword) return true;

      const target = [
        reading.consultation_number,
        reading.requester_nickname ?? "",
        reading.customer_name,
        reading.birth_date,
        reading.question ?? "",
        reading.question_categories?.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return target.includes(normalizedKeyword);
    });
  }, [readings, keyword, statusFilter]);

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-[#55345f] bg-[#55345f] text-white shadow-[0_5px_16px_rgba(84,50,95,0.15)]"
                    : "border-[#e4d8ca] bg-[#fffaf4] text-[#74676d] hover:bg-white"
                }`}
              >
                {tab.text}
                <span className={`ml-2 text-xs ${active ? "text-white/70" : "text-[#aaa09a]"}`}>
                  {counts[tab.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full xl:max-w-sm">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="닉네임, 사주 대상, 상담번호 검색"
            className="w-full rounded-2xl border border-[#dfd3c5] bg-[#fffdf9] px-4 py-3 pr-12 text-sm text-[#453942] outline-none placeholder:text-[#aaa09a] focus:border-[#8d65a0]"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-[#8b7f79] hover:bg-[#f5eee6]"
            >
              지우기
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 text-right text-xs text-[#9a8e88]">
        검색 결과 <strong className="text-[#4e3d49]">{filteredReadings.length}</strong>건
      </div>

      {filteredReadings.length === 0 ? (
        <div className="mt-4 rounded-[24px] border border-dashed border-[#d8c9b8] bg-[#fbf7f1] px-5 py-14 text-center">
          <p className="font-serif text-lg font-semibold text-[#55454e]">조건에 맞는 상담이 없습니다</p>
          <p className="mt-2 text-sm text-[#968a84]">검색어나 상태 필터를 변경해보세요.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-hidden rounded-[22px] border border-[#e5dacd] md:block">
            <table className="w-full border-collapse bg-[#fffdf9]">
              <thead className="bg-[#f5eee5]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8c7e75]">번호</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8c7e75]">신청자 닉네임</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8c7e75]">사주 대상</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8c7e75]">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8c7e75]">신청일</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#8c7e75]">상담</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.map((reading) => {
                  const status = statusMap[reading.status] ?? statusMap.pending;
                  return (
                    <tr key={reading.id} className="border-t border-[#eee5db] transition hover:bg-[#fcf8f3]">
                      <td className="px-4 py-4 text-xs font-bold text-[#9b886d]">{reading.consultation_number}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-[#4b3748]">
                          {reading.requester_nickname ?? "미연결"}
                        </div>
                        {!reading.requester_nickname ? (
                          <div className="mt-1 text-[10px] text-[#b09f95]">기존 비회원 접수</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#63575b]">{reading.customer_name || "-"}</div>
                        <div className="mt-1 text-[11px] text-[#aaa09a]">{reading.birth_date}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.badge}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#817570]">{formatDate(reading.created_at)}</td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/admin/readings/${reading.id}`}
                          className="inline-flex rounded-xl border border-[#cdbb9e] bg-[#fffaf2] px-4 py-2 text-xs font-bold text-[#62445b] transition hover:bg-[#62445b] hover:text-white"
                        >
                          상세 보기
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {filteredReadings.map((reading) => {
              const status = statusMap[reading.status] ?? statusMap.pending;
              return (
                <Link
                  key={reading.id}
                  href={`/admin/readings/${reading.id}`}
                  className="block rounded-[22px] border border-[#e5dacd] bg-[#fffdf9] p-4 shadow-[0_6px_20px_rgba(68,45,58,0.04)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#a38965]">{reading.consultation_number}</div>
                      <div className="mt-2 flex flex-wrap items-baseline gap-2">
                        <strong className="text-base text-[#4b3748]">{reading.requester_nickname ?? "미연결"}</strong>
                        <span className="text-xs text-[#9b908b]">신청자</span>
                      </div>
                      <div className="mt-1 text-sm text-[#6f6465]">사주 대상 · {reading.customer_name || "-"}</div>
                      <div className="mt-2 text-xs text-[#9b908b]">{formatDate(reading.created_at)}</div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${status.badge}`}>
                      {status.text}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}
