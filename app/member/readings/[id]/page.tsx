import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

const stages = [
  { key: "pending", label: "접수", description: "상담 신청 완료" },
  { key: "reviewed", label: "확인", description: "내용 확인" },
  { key: "writing", label: "풀이중", description: "사주풀이 작성" },
  { key: "completed", label: "풀이완료", description: "결과 준비 완료" },
  { key: "delivered", label: "전달완료", description: "결과 전달" },
] as const;

function stageIndex(status: string | null) {
  const index = stages.findIndex((stage) => stage.key === status);
  return index < 0 ? 0 : index;
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8ddd1] bg-[#fbf7f1] p-4">
      <p className="text-[11px] font-bold tracking-[0.08em] text-[#a08d78]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-[#55464f]">{value || "-"}</p>
    </div>
  );
}

export default async function MemberReadingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const current = await requireUser();
  if (!current) redirect("/auth/login?next=/member/readings");

  const { id } = await params;
  const admin = createAdminClient();
  const { data: reading, error } = await admin
    .from("readings")
    .select("*")
    .eq("id", id)
    .eq("requester_id", current.user.id)
    .maybeSingle();

  if (error) console.error("[member/readings/detail] load error:", error);
  if (!reading) notFound();

  const currentStage = stageIndex(reading.status);
  const canViewResult = ["completed", "delivered"].includes(reading.status ?? "") && Boolean(reading.result_token);
  const birthTime = reading.birth_time_unknown
    ? "출생시간 모름"
    : reading.birth_hour === null || reading.birth_minute === null
      ? "-"
      : `${String(reading.birth_hour).padStart(2, "0")}:${String(reading.birth_minute).padStart(2, "0")}`;

  return (
    <main className="saju-page relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-5 text-[#3f343a] sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-28 h-[320px] w-[320px] rounded-full bg-[#b69eb6]/15 blur-3xl" />
        <div className="absolute -right-20 top-[22%] h-[280px] w-[280px] rounded-full bg-[#d4bd89]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href="/member/readings" className="text-sm font-semibold text-[#7d6e75] hover:text-[#4d3948]">
            ← 내 상담내역
          </Link>
          <span className="text-xs font-bold tracking-[0.08em] text-[#a18864]">
            {reading.consultation_number || "상담번호 없음"}
          </span>
        </div>

        <header className="saju-hero-card overflow-hidden rounded-[30px] border border-[#d9cbb8]">
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#b59a67] to-transparent" />
          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="saju-eyebrow">CONSULTATION DETAIL</p>
                <h1 className="mt-2 font-serif text-3xl font-semibold text-[#443640]">
                  {reading.customer_name || "사주 상담"}
                </h1>
                <p className="mt-3 text-sm text-[#8d817b]">신청일 {formatDate(reading.created_at)}</p>
              </div>

              {canViewResult ? (
                <Link href={`/result/${reading.result_token}`} className="saju-btn-primary text-center">
                  사주 결과 보기
                </Link>
              ) : (
                <div className="rounded-2xl border border-[#ded2c4] bg-[#faf6ef] px-4 py-3 text-center text-xs font-semibold text-[#887b76]">
                  결과가 준비되면 확인할 수 있습니다
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="saju-panel mt-5 rounded-[28px] p-5 sm:p-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="saju-eyebrow">PROGRESS</p>
              <h2 className="mt-1 font-serif text-xl font-semibold text-[#473844]">상담 진행 상태</h2>
            </div>
            <strong className="text-sm text-[#6f5268]">{stages[currentStage]?.label}</strong>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-1 sm:gap-2">
            {stages.map((stage, index) => {
              const done = index <= currentStage;
              const active = index === currentStage;
              return (
                <div key={stage.key} className="min-w-0 text-center">
                  <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black sm:h-10 sm:w-10 ${
                    done
                      ? active
                        ? "border-[#604359] bg-[#604359] text-white shadow-[0_4px_14px_rgba(96,67,89,0.2)]"
                        : "border-[#c3aa7e] bg-[#f1e5ce] text-[#80663c]"
                      : "border-[#ded5cb] bg-[#f6f1eb] text-[#b1a7a1]"
                  }`}>
                    {index + 1}
                  </div>
                  <p className={`mt-2 truncate text-[10px] font-bold sm:text-xs ${done ? "text-[#5d4957]" : "text-[#aaa09a]"}`}>
                    {stage.label}
                  </p>
                  <p className="mt-1 hidden text-[10px] leading-4 text-[#9a8f89] sm:block">{stage.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-1">
            {stages.map((stage, index) => (
              <div key={stage.key} className={`h-1.5 flex-1 rounded-full ${index <= currentStage ? "bg-[#9a7a91]" : "bg-[#e5ddd4]"}`} />
            ))}
          </div>
        </section>

        <section className="saju-panel mt-5 rounded-[28px] p-5 sm:p-7">
          <p className="saju-eyebrow">PROFILE</p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-[#473844]">상담 정보</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Info label="사주 대상" value={reading.customer_name ?? "-"} />
            <Info label="성별" value={reading.gender === "male" ? "남성" : reading.gender === "female" ? "여성" : "-"} />
            <Info label="생년월일" value={reading.birth_date ?? "-"} />
            <Info label="달력" value={reading.calendar_type === "solar" ? "양력" : reading.lunar_leap_month ? "음력 · 윤달" : "음력"} />
            <Info label="출생시간" value={birthTime} />
            <Info label="신청 닉네임" value={reading.requester_nickname ?? current.profile.nickname} />
          </div>
        </section>

        <section className="saju-panel mt-5 rounded-[28px] p-5 sm:p-7">
          <p className="saju-eyebrow">QUESTION</p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-[#473844]">상담 질문</h2>

          {reading.question_categories?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {reading.question_categories.map((category: string) => (
                <span key={category} className="rounded-full border border-[#e2d6ca] bg-[#faf5ee] px-3 py-1.5 text-xs font-semibold text-[#75656c]">
                  {category}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-[#ebe1d6] bg-[#fbf7f1] p-5 text-sm leading-7 text-[#65595d]">
            {reading.question || "등록된 질문이 없습니다."}
          </div>
        </section>

        {canViewResult ? (
          <section className="mt-5 overflow-hidden rounded-[28px] border border-[#cab991] bg-gradient-to-br from-[#fffaf0] to-[#f7efe6] p-5 shadow-[0_12px_38px_rgba(79,54,64,0.07)] sm:p-7">
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#a18250]">RESULT READY</p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#4a3744]">사주풀이가 준비되었습니다</h2>
                <p className="mt-2 text-sm leading-6 text-[#877a75]">완료된 상담 결과를 열어 자세한 풀이를 확인하세요.</p>
              </div>
              <Link href={`/result/${reading.result_token}`} className="saju-btn-primary shrink-0 text-center">
                결과 보기
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
