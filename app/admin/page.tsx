import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireAdmin } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

type Reading = {
  id: string;
  status: string | null;
  created_at: string | null;
  result_token: string | null;
};

function getStatusLabel(status: string | null) {
  switch (status) {
    case "pending":
      return "접수";
    case "writing":
      return "풀이중";
    case "completed":
      return "풀이완료";
    default:
      return status || "미지정";
  }
}

function getStatusClass(status: string | null) {
  switch (status) {
    case "pending":
      return "border-[#d7bc8a] bg-[#fff8e8] text-[#896d3f]";
    case "writing":
      return "border-[#bba8c2] bg-[#f5eff7] text-[#72577e]";
    case "completed":
      return "border-[#9fbea7] bg-[#edf6ef] text-[#4d7258]";
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

function DashboardCard({
  symbol,
  label,
  value,
  description,
}: {
  symbol: string;
  label: string;
  value: number;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#ded1c0] bg-[rgba(255,252,247,0.88)] p-5 shadow-[0_8px_30px_rgba(70,45,59,0.06)] backdrop-blur">
      <div className="absolute -right-4 -top-5 text-6xl text-[#8a6a83]/[0.06]">
        {symbol}
      </div>

      <div className="relative">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9b48c]/60 bg-[#fbf6ee] text-lg text-[#7b5c73]">
          {symbol}
        </div>

        <p className="text-xs font-medium tracking-[0.12em] text-[#8a7d79]">
          {label}
        </p>

        <p className="mt-1 font-serif text-3xl font-semibold text-[#3e303a]">
          {value}
        </p>

        {description ? (
          <p className="mt-2 text-xs text-[#9b908b]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const current = await requireAdmin();

  if (!current) {
    redirect("/auth/login");
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("readings")
    .select("id, status, created_at, result_token")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("[admin] readings load error:", error);
  }

  const readings: Reading[] = (data ?? []) as Reading[];

  const totalCount = readings.length;

  const pendingCount = readings.filter(
    (reading) => reading.status === "pending"
  ).length;

  const writingCount = readings.filter(
    (reading) => reading.status === "writing"
  ).length;

  const completedCount = readings.filter(
    (reading) => reading.status === "completed"
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f1e8] text-[#342c33]">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-32 h-[360px] w-[360px] rounded-full bg-[#bba2bd]/15 blur-3xl" />
        <div className="absolute -right-20 top-32 h-[300px] w-[300px] rounded-full bg-[#d9c598]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-[#b9c9bd]/15 blur-3xl" />

        <div className="absolute right-[8%] top-14 text-[120px] leading-none text-[#765a70]/[0.035]">
          
        </div>

        <div className="absolute left-[5%] top-[38%] text-5xl text-[#a18798]/[0.05]">
          
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">

        {/* 상단 */}
        <header className="overflow-hidden rounded-[30px] border border-[#d9cbb8] bg-[rgba(255,252,247,0.86)] shadow-[0_14px_50px_rgba(72,48,61,0.08)] backdrop-blur-md">
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#b59a67] to-transparent" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bca477]/70 bg-[#faf4e9] text-xl text-[#6e5068] shadow-sm">
                    
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.28em] text-[#9b8566]">
                      SEONNYEO SAJU
                    </p>

                    <p className="text-xs text-[#968984]">
                      선녀의 시선으로 읽는 사주 이야기
                    </p>
                  </div>
                </div>

                <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#3c3039] sm:text-4xl">
                  선녀사주
                  <span className="ml-2 text-lg font-normal text-[#8a6f82]">
                    관리자
                  </span>
                </h1>

                <div className="mt-4 flex items-center gap-2 text-sm text-[#817570]">
                  <span className="text-[#b49662]"></span>
                  <span>
                    오늘의 상담과 사주풀이를 관리합니다.
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#a09691]">
                  선녀님  {current.profile.nickname}
                </p>
              </div>

              <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Link
                  href="/"
                  className="rounded-2xl border border-[#ded2c2] bg-[#fffaf3] px-4 py-2.5 text-center text-sm font-medium text-[#685e5b] transition hover:border-[#bda778] hover:bg-white"
                >
                  홈
                </Link>

                <Link
                  href="/apply"
                  className="rounded-2xl border border-[#ded2c2] bg-[#fffaf3] px-4 py-2.5 text-center text-sm font-medium text-[#685e5b] transition hover:border-[#bda778] hover:bg-white"
                >
                  상담신청
                </Link>

                <Link
                  href="/admin/members"
                  className="rounded-2xl border border-[#715168] bg-[#62445b] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_14px_rgba(80,53,72,0.16)] transition hover:bg-[#55394f]"
                >
                  회원관리
                </Link>

                <LogoutButton
                  className="rounded-2xl border border-[#d7ccc0] bg-[#eee7de] px-4 py-2.5 text-sm font-medium text-[#6f625d] transition hover:bg-[#e5ddd3] disabled:opacity-50"
                />
              </nav>
            </div>
          </div>
        </header>

        {/* 운세 현황 */}
        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[#aa8e61]">
                CONSULTATION STATUS
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#443640]">
                오늘의 사주 현황
              </h2>
            </div>

            <span className="hidden text-xs text-[#a0948d] sm:block">
               모든 상담의 흐름을 한눈에 확인하세요
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <DashboardCard
              symbol=""
              label="전체 상담"
              value={totalCount}
            />

            <DashboardCard
              symbol=""
              label="새로운 인연"
              value={pendingCount}
              description="접수 대기"
            />

            <DashboardCard
              symbol=""
              label="풀이중"
              value={writingCount}
              description="사주 해석 진행"
            />

            <DashboardCard
              symbol=""
              label="풀이완료"
              value={completedCount}
              description="운세 전달 완료"
            />
          </div>
        </section>

        {/* 상담 목록 */}
        <section className="mt-6 overflow-hidden rounded-[28px] border border-[#ddd1c1] bg-[rgba(255,252,247,0.9)] shadow-[0_12px_40px_rgba(69,46,59,0.06)] backdrop-blur">
          <div className="border-b border-[#e9ded0] px-5 py-5 sm:px-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#aa8e61]">
                  SAJU READING
                </p>

                <h2 className="mt-1 font-serif text-xl font-semibold text-[#443640]">
                  사주 상담록
                </h2>

                <p className="mt-1 text-sm text-[#918680]">
                  인연이 찾아온 순서대로 상담이 표시됩니다.
                </p>
              </div>

              <div className="rounded-full border border-[#ded2c2] bg-[#faf5ed] px-3 py-1.5 text-xs font-medium text-[#82746c]">
                총 {totalCount}건
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {error ? (
              <div className="rounded-2xl border border-[#e6c5c5] bg-[#fff4f4] p-5 text-sm text-[#9a5555]">
                상담 목록을 불러오지 못했습니다.
              </div>
            ) : readings.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#d7c8b6] bg-[#fbf7f1] py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d6c39c] bg-[#fffaf1] text-2xl text-[#7c6175]">
                  
                </div>

                <p className="mt-4 font-serif text-lg font-semibold text-[#56464f]">
                  아직 찾아온 인연이 없습니다
                </p>

                <p className="mt-2 text-sm text-[#9a8e88]">
                  새로운 상담이 접수되면 이곳에 표시됩니다.
                </p>

                <Link
                  href="/apply"
                  className="mt-5 inline-flex rounded-2xl bg-[#62445b] px-5 py-3 text-sm font-semibold text-white"
                >
                  상담 신청하기
                </Link>
              </div>
            ) : (
              <>
                {/* PC */}
                <div className="hidden overflow-hidden rounded-[20px] border border-[#e6dccf] md:block">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#f5eee5]">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#8c7e75]">
                          순번
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#8c7e75]">
                          사주 상태
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold text-[#8c7e75]">
                          인연이 찾아온 날
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold text-[#8c7e75]">
                          상담
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {readings.map((reading, index) => (
                        <tr
                          key={reading.id}
                          className="border-t border-[#eee5db] transition hover:bg-[#fcf8f3]"
                        >
                          <td className="px-5 py-4">
                            <span className="font-serif text-sm font-semibold text-[#5e4a57]">
                              {String(totalCount - index).padStart(2, "0")}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                reading.status
                              )}`}
                            >
                              {getStatusLabel(reading.status)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-[#817570]">
                            {formatDate(reading.created_at)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/readings/${reading.id}`}
                              className="inline-flex items-center gap-1 rounded-xl border border-[#cdbb9e] bg-[#fffaf2] px-4 py-2 text-xs font-semibold text-[#6d5264] transition hover:bg-[#62445b] hover:text-white"
                            >
                              풀이 보기
                              <span></span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 모바일 */}
                <div className="space-y-3 md:hidden">
                  {readings.map((reading, index) => (
                    <Link
                      key={reading.id}
                      href={`/admin/readings/${reading.id}`}
                      className="block rounded-[20px] border border-[#e4d9cb] bg-[#fffcf7] p-4 shadow-[0_4px_16px_rgba(63,42,53,0.04)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d5c29b] bg-[#faf4e8] font-serif text-sm font-semibold text-[#71586b]">
                            {totalCount - index}
                          </div>

                          <div>
                            <p className="font-serif text-sm font-semibold text-[#4d3d47]">
                              사주 상담
                            </p>

                            <p className="mt-1 text-xs text-[#988b84]">
                              {formatDate(reading.created_at)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${getStatusClass(
                            reading.status
                          )}`}
                        >
                          {getStatusLabel(reading.status)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-end border-t border-[#eee5da] pt-3 text-xs font-semibold text-[#775a70]">
                        사주풀이 확인 
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 관리 메뉴 */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/members"
            className="group rounded-[26px] border border-[#ddd0c0] bg-[rgba(255,252,247,0.86)] p-5 shadow-[0_8px_30px_rgba(60,42,51,0.05)] transition hover:-translate-y-0.5 hover:border-[#b9a176]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb58e] bg-[#faf3e8] text-[#765a70]">
              
            </div>

            <h3 className="mt-4 font-serif text-lg font-semibold text-[#493943]">
              인연 관리
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8d817b]">
              회원 추가, 관리자 지정, 닉네임 변경,
              비밀번호 초기화와 회원 관리를 할 수 있습니다.
            </p>

            <p className="mt-5 text-sm font-semibold text-[#765a70]">
              회원관리 
            </p>
          </Link>

          <Link
            href="/apply"
            className="group rounded-[26px] border border-[#ddd0c0] bg-[rgba(255,252,247,0.86)] p-5 shadow-[0_8px_30px_rgba(60,42,51,0.05)] transition hover:-translate-y-0.5 hover:border-[#b9a176]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb58e] bg-[#faf3e8] text-[#765a70]">
              
            </div>

            <h3 className="mt-4 font-serif text-lg font-semibold text-[#493943]">
              상담 신청 화면
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8d817b]">
              고객이 사주 정보를 입력하고 상담을 신청하는
              실제 화면을 확인합니다.
            </p>

            <p className="mt-5 text-sm font-semibold text-[#765a70]">
              화면 확인 
            </p>
          </Link>
        </section>

        <footer className="py-10 text-center">
          <div className="text-[#b19667]">
              
          </div>

          <p className="mt-2 text-[10px] tracking-[0.2em] text-[#aa9e97]">
            SEONNYEO SAJU
          </p>
        </footer>
      </div>
    </main>
  );
}