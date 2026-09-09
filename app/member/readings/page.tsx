import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

type Reading = {
  id: string;
  consultation_number: string | null;
  customer_name: string | null;
  birth_date: string | null;
  question_categories: string[] | null;
  question: string | null;
  status: string | null;
  created_at: string | null;
  result_token: string | null;
};

function getStatusLabel(status: string | null) {
  switch (status) {
    case "pending":
      return "접수";
    case "reviewed":
      return "확인";
    case "writing":
      return "풀이중";
    case "completed":
      return "풀이완료";
    case "delivered":
      return "전달완료";
    default:
      return status || "미지정";
  }
}

function getStatusClass(status: string | null) {
  switch (status) {
    case "pending":
      return "border-[#d7bc8a] bg-[#fff8e8] text-[#896d3f]";
    case "reviewed":
      return "border-[#aab8cf] bg-[#f1f5fb] text-[#536b8a]";
    case "writing":
      return "border-[#bba8c2] bg-[#f5eff7] text-[#72577e]";
    case "completed":
      return "border-[#9fbea7] bg-[#edf6ef] text-[#4d7258]";
    case "delivered":
      return "border-[#aeb8b1] bg-[#f0f4f1] text-[#586b5d]";
    default:
      return "border-[#d8d0c8] bg-[#f5f1ec] text-[#756d69]";
  }
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function MemberReadingsPage() {
  const current = await requireUser();

  if (!current) {
    redirect("/auth/login?next=/member/readings");
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("readings")
    .select(
      "id, consultation_number, customer_name, birth_date, question_categories, question, status, created_at, result_token"
    )
    .eq("requester_id", current.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[member/readings] load error:", error);
  }

  const readings = (data ?? []) as Reading[];

  return (
    <main className="saju-page relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-6 text-[#3f343a] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-[340px] w-[340px] rounded-full bg-[#b69eb6]/15 blur-3xl" />
        <div className="absolute -right-24 top-[18%] h-[310px] w-[310px] rounded-full bg-[#d4bd89]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <header className="overflow-hidden rounded-[30px] border border-[#d9cbb8] bg-[rgba(255,252,247,0.9)] shadow-[0_14px_50px_rgba(72,48,61,0.08)] backdrop-blur-md">
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#b59a67] to-transparent" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] text-[#9b8566]">
                  MY CONSULTATIONS
                </p>

                <h1 className="mt-2 font-serif text-3xl font-semibold text-[#443640]">
                  내 상담내역
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#8d817b]">
                  {current.profile.nickname}님이 신청한 상담의 진행 상태와
                  완료된 사주풀이를 확인할 수 있습니다.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={current.profile.role === "admin" ? "/admin" : "/member"}
                  className="rounded-2xl border border-[#d8ccbd] bg-[#fffaf4] px-4 py-2.5 text-sm font-semibold text-[#6d5e65] transition hover:bg-white"
                >
                  돌아가기
                </Link>

                <Link
                  href="/apply"
                  className="rounded-2xl bg-[#604359] px-4 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(80,50,72,0.14)] transition hover:bg-[#51374a]"
                >
                  새 상담
                </Link>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mt-5 rounded-[24px] border border-[#e6c5c5] bg-[#fff4f4] p-6 text-sm text-[#9a5555]">
            상담내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        ) : readings.length === 0 ? (
          <section className="mt-5 rounded-[28px] border border-dashed border-[#d7c8b6] bg-[rgba(255,252,247,0.9)] px-6 py-16 text-center shadow-[0_10px_34px_rgba(67,45,57,0.05)]">
            <p className="font-serif text-xl font-semibold text-[#56464f]">
              아직 신청한 상담이 없습니다
            </p>

            <p className="mt-2 text-sm leading-6 text-[#968a84]">
              새로운 상담을 신청하면 진행 상태가 이곳에 표시됩니다.
            </p>

            <Link
              href="/apply"
              className="mt-6 inline-flex rounded-2xl bg-[#604359] px-5 py-3 text-sm font-bold text-white"
            >
              첫 상담 신청하기
            </Link>
          </section>
        ) : (
          <section className="mt-5 space-y-4">
            {readings.map((reading) => {
              const canViewResult =
                ["completed", "delivered"].includes(reading.status ?? "") &&
                Boolean(reading.result_token);

              return (
                <article
                  key={reading.id}
                  className="overflow-hidden rounded-[26px] border border-[#ded2c3] bg-[rgba(255,252,247,0.94)] shadow-[0_10px_32px_rgba(66,44,56,0.06)]"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold tracking-[0.08em] text-[#a08662]">
                            {reading.consultation_number || "상담번호 없음"}
                          </span>

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusClass(
                              reading.status
                            )}`}
                          >
                            {getStatusLabel(reading.status)}
                          </span>
                        </div>

                        <h2 className="mt-3 font-serif text-xl font-semibold text-[#493943]">
                          {reading.customer_name || "사주 상담"}
                        </h2>

                        <p className="mt-1 text-xs text-[#9a8e88]">
                          {reading.birth_date || "-"} · {formatDate(reading.created_at)}
                        </p>
                      </div>

                      {canViewResult ? (
                        <Link
                          href={`/result/${reading.result_token}`}
                          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-[#604359] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#51374a]"
                        >
                          결과 확인
                        </Link>
                      ) : (
                        <span className="shrink-0 rounded-2xl border border-[#dfd4c7] bg-[#faf6ef] px-4 py-2.5 text-xs font-semibold text-[#8d817b]">
                          {reading.status === "writing"
                            ? "풀이를 작성하고 있습니다"
                            : "상담 진행 중"}
                        </span>
                      )}
                    </div>

                    {reading.question_categories &&
                      reading.question_categories.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {reading.question_categories.map((category) => (
                            <span
                              key={category}
                              className="rounded-full border border-[#e3d8cc] bg-[#faf6f0] px-3 py-1 text-xs font-medium text-[#71656a]"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                    {reading.question ? (
                      <p className="mt-4 line-clamp-3 rounded-2xl bg-[#fbf7f1] p-4 text-sm leading-6 text-[#6f6465]">
                        {reading.question}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div className="mt-6 rounded-2xl border border-[#e0d4c6] bg-[#faf6ef] p-4 text-xs leading-5 text-[#8d817b]">
          기존에 비로그인 상태로 접수했던 상담은 계정 정보와 연결되어 있지
          않아 이 목록에 자동으로 표시되지 않습니다. 이번 변경 이후 로그인
          상태에서 접수한 상담부터 계정별로 안전하게 연결됩니다.
        </div>
      </div>
    </main>
  );
}
