import Link from "next/link";
import { redirect } from "next/navigation";

import AdminReadingsList from "@/components/admin/AdminReadingsList";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireAdmin } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

type Reading = {
  id: string;
  consultation_number: string;
  customer_name: string;
  requester_id: string | null;
  requester_nickname: string | null;
  gender: string;
  birth_date: string;
  question_categories: string[] | null;
  question: string | null;
  status: string;
  created_at: string;
};

function StatusCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#e5d8c8] bg-[rgba(255,253,249,0.92)] p-5 shadow-[0_10px_32px_rgba(71,46,59,0.06)]">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#a58d69]">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <strong className="font-serif text-3xl text-[#3f3040]">{value}</strong>
        <span className="text-xs text-[#938681]">{description}</span>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const current = await requireAdmin();

  if (!current) {
    redirect("/auth/login?next=/admin");
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("readings")
    .select(
      "id, consultation_number, customer_name, requester_id, requester_nickname, gender, birth_date, question_categories, question, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin] readings load error:", error);
  }

  const readings = ((data ?? []) as Reading[]).map((reading) => ({ ...reading }));

  const requesterIds = Array.from(
    new Set(
      readings
        .map((reading) => reading.requester_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  const nicknameByUserId = new Map<string, string>();

  if (requesterIds.length > 0) {
    const { data: profiles, error: profileError } = await admin
      .from("profiles")
      .select("id, nickname")
      .in("id", requesterIds);

    if (profileError) {
      console.error("[admin] profile nickname load error:", profileError);
    }

    for (const profile of profiles ?? []) {
      nicknameByUserId.set(profile.id, profile.nickname);
    }
  }

  const listReadings = readings.map((reading) => ({
    ...reading,
    requester_nickname:
      (reading.requester_id ? nicknameByUserId.get(reading.requester_id) : null) ??
      reading.requester_nickname ??
      null,
  }));

  const total = readings.length;
  const pending = readings.filter((r) => r.status === "pending").length;
  const writing = readings.filter((r) => r.status === "writing").length;
  const completed = readings.filter((r) => ["completed", "delivered"].includes(r.status)).length;

  return (
    <main className="saju-page min-h-screen px-4 py-5 text-[#392f37] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="saju-hero-card overflow-hidden rounded-[32px] border border-[#dfd0bd]">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="saju-eyebrow">SEONNYEO SAJU · ADMIN</p>
                <h1 className="mt-2 font-serif text-3xl font-semibold text-[#34263d] sm:text-4xl">
                  사주 상담 관리
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#877a75]">
                  신청자와 사주 대상을 구분해 상담 흐름을 한눈에 확인합니다.
                </p>
                <p className="mt-2 text-xs text-[#a09189]">관리자 · {current.profile.nickname}</p>
              </div>

              <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Link href="/" className="saju-btn-secondary">홈</Link>
                <Link href="/apply" className="saju-btn-secondary">상담 신청</Link>
                <Link href="/member/readings" className="saju-btn-secondary">내 상담</Link>
                <Link href="/admin/members" className="saju-btn-primary">회원 관리</Link>
                <LogoutButton className="saju-btn-secondary" />
              </nav>
            </div>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatusCard label="ALL" value={total} description="전체 상담" />
          <StatusCard label="NEW" value={pending} description="새 접수" />
          <StatusCard label="WRITING" value={writing} description="풀이 진행" />
          <StatusCard label="DONE" value={completed} description="풀이 완료" />
        </section>

        <section className="saju-panel mt-5 rounded-[30px] p-4 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-[#eadfd2] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="saju-eyebrow">SAJU READING</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#3d3040]">사주 상담록</h2>
              <p className="mt-2 text-sm text-[#8c807a]">
                <strong>신청자 닉네임</strong>과 <strong>사주 대상</strong>을 분리해 표시합니다.
              </p>
            </div>
            <span className="w-fit rounded-full border border-[#dfd2c1] bg-[#fbf6ef] px-3 py-1.5 text-xs font-bold text-[#82746c]">
              총 {total}건
            </span>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-[#e6c5c5] bg-[#fff4f4] p-5 text-sm text-[#9a5555]">
              상담 목록을 불러오지 못했습니다.
            </div>
          ) : (
            <AdminReadingsList readings={listReadings} />
          )}
        </section>
      </div>
    </main>
  );
}
