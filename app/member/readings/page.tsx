import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import BrandMark from "@/components/brand/BrandMark";

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

const STATUS = {
  pending: { label: "접수", badge: "border-[#d7bc8a] bg-[#fff8e8] text-[#896d3f]", helper: "상담이 접수되었습니다" },
  reviewed: { label: "확인", badge: "border-[#aab8cf] bg-[#f1f5fb] text-[#536b8a]", helper: "상담 내용을 확인했습니다" },
  writing: { label: "풀이중", badge: "border-[#bba8c2] bg-[#f5eff7] text-[#72577e]", helper: "선녀님이 풀이를 작성하고 있습니다" },
  completed: { label: "풀이완료", badge: "border-[#9fbea7] bg-[#edf6ef] text-[#4d7258]", helper: "풀이가 완료되었습니다" },
  delivered: { label: "전달완료", badge: "border-[#aeb8b1] bg-[#f0f4f1] text-[#586b5d]", helper: "상담 결과가 전달되었습니다" },
} as const;

function getStatus(status: string | null) {
  return STATUS[status as keyof typeof STATUS] ?? {
    label: status || "미지정",
    badge: "border-[#d8d0c8] bg-[#f5f1ec] text-[#756d69]",
    helper: "상담 상태를 확인하고 있습니다",
  };
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
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

  if (error) console.error("[member/readings] load error:", error);
  const readings = (data ?? []) as Reading[];

  return (
    <main className="saju-page relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-5 text-[#3f343a] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-[340px] w-[340px] rounded-full bg-[#b69eb6]/15 blur-3xl" />
        <div className="absolute -right-24 top-[18%] h-[310px] w-[310px] rounded-full bg-[#d4bd89]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <header className="saju-hero-card overflow-hidden rounded-[30px] border border-[#d9cbb8]">
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#b59a67] to-transparent" />
          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <BrandMark size="sm" withWordmark compact />
                <p className="saju-eyebrow mt-5">MY CONSULTATIONS</p>
                <h1 className="mt-2 font-serif text-3xl font-semibold text-[#443640]">내 상담내역</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#8d817b]">
                  {current.profile.nickname}님이 신청한 상담의 진행 상태와 상세 내용을 확인할 수 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Link
                  href={current.profile.role === "admin" ? "/admin" : "/member"}
                  className="saju-btn-secondary text-center"
                >
                  돌아가기
                </Link>
                <Link href="/apply" className="saju-btn-primary text-center">새 상담</Link>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-4 flex items-center justify-between px-1 text-xs text-[#938781]">
          <span>최근 신청 순</span>
          <strong className="text-[#5b4555]">총 {readings.length}건</strong>
        </div>

        {error ? (
          <div className="mt-4 rounded-[24px] border border-[#e6c5c5] bg-[#fff4f4] p-6 text-sm text-[#9a5555]">
            상담내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        ) : readings.length === 0 ? (
          <section className="mt-4 rounded-[28px] border border-dashed border-[#d7c8b6] bg-[rgba(255,252,247,0.9)] px-6 py-16 text-center shadow-[0_10px_34px_rgba(67,45,57,0.05)]">
            <p className="font-serif text-xl font-semibold text-[#56464f]">아직 신청한 상담이 없습니다</p>
            <p className="mt-2 text-sm leading-6 text-[#968a84]">새 상담을 신청하면 진행 상태가 이곳에 표시됩니다.</p>
            <Link href="/apply" className="mt-6 inline-flex rounded-2xl bg-[#604359] px-5 py-3 text-sm font-bold text-white">
              첫 상담 신청하기
            </Link>
          </section>
        ) : (
          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            {readings.map((reading) => {
              const status = getStatus(reading.status);
              const canViewResult = ["completed", "delivered"].includes(reading.status ?? "") && Boolean(reading.result_token);

              return (
                <article
                  key={reading.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#ded2c3] bg-[rgba(255,252,247,0.95)] shadow-[0_10px_32px_rgba(66,44,56,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(66,44,56,0.09)]"
                >
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold tracking-[0.08em] text-[#a08662]">
                          {reading.consultation_number || "상담번호 없음"}
                        </p>
                        <h2 className="mt-2 truncate font-serif text-xl font-semibold text-[#493943]">
                          {reading.customer_name || "사주 상담"}
                        </h2>
                      </div>
                      <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#9a8e88]">
                      {reading.birth_date || "생년월일 미입력"} · {formatDate(reading.created_at)}
                    </p>

                    <p className="mt-4 rounded-2xl bg-[#fbf7f1] px-4 py-3 text-xs font-semibold text-[#776a6e]">
                      {status.helper}
                    </p>

                    {reading.question_categories?.length ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {reading.question_categories.slice(0, 4).map((category) => (
                          <span key={category} className="rounded-full border border-[#e3d8cc] bg-[#faf6f0] px-3 py-1 text-xs font-medium text-[#71656a]">
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {reading.question ? (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#766a6b]">{reading.question}</p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-[#ece2d7] bg-[#fbf7f1]/70 p-4">
                    <Link
                      href={`/member/readings/${reading.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-[#d8c9b9] bg-[#fffdf9] px-4 py-2.5 text-sm font-bold text-[#654d5e] transition hover:bg-white"
                    >
                      상담 상세
                    </Link>
                    {canViewResult ? (
                      <Link
                        href={`/result/${reading.result_token}`}
                        className="inline-flex items-center justify-center rounded-xl bg-[#604359] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#51374a]"
                      >
                        결과 보기
                      </Link>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-xl border border-[#e4d9cc] bg-[#f6f0e9] px-4 py-2.5 text-xs font-semibold text-[#a0948d]">
                        결과 준비 중
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div className="mt-6 rounded-2xl border border-[#e0d4c6] bg-[#faf6ef] p-4 text-xs leading-5 text-[#8d817b]">
          계정 연결 기능 적용 전에 비로그인으로 접수한 상담은 자동으로 내 상담내역에 연결되지 않을 수 있습니다.
        </div>
      </div>
    </main>
  );
}
