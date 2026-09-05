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
      return "작성중";
    case "completed":
      return "완료";
    default:
      return status || "미지정";
  }
}

function getStatusClass(status: string | null) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "writing":
      return "bg-blue-50 text-blue-700";
    case "completed":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

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
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-[#2c2434]">
        {value}
      </p>

      {description ? (
        <p className="mt-2 text-xs text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default async function AdminPage() {
  const current = await requireAdmin();

  if (!current) {
    redirect("/auth/login");
  }

  const admin = createAdminClient();

  const {
    data,
    error,
  } = await admin
    .from("readings")
    .select("id, status, created_at, result_token")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[admin] readings load error:",
      error
    );
  }

  const readings: Reading[] =
    (data ?? []) as Reading[];

  const totalCount =
    readings.length;

  const pendingCount =
    readings.filter(
      (reading) =>
        reading.status === "pending"
    ).length;

  const writingCount =
    readings.filter(
      (reading) =>
        reading.status === "writing"
    ).length;

  const completedCount =
    readings.filter(
      (reading) =>
        reading.status === "completed"
    ).length;

  return (
    <main className="min-h-screen bg-[#f8f4ef] px-4 py-6 text-[#2c2434] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">

        {/* 상단 헤더 */}
        <header className="mb-7 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-purple-600">
                SEONNYEO SAJU ADMIN
              </p>

              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                선녀사주 관리자
              </h1>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                상담 신청 내역과 회원을 관리할 수 있습니다.
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                현재 관리자: {current.profile.nickname}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600"
              >
                홈페이지
              </Link>

              <Link
                href="/apply"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600"
              >
                상담 신청
              </Link>

              <Link
                href="/admin/members"
                className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                회원관리
              </Link>

              <LogoutButton
                className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              />
            </div>

          </div>
        </header>


        {/* 현황 카드 */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <DashboardCard
            label="전체 상담"
            value={totalCount}
          />

          <DashboardCard
            label="접수"
            value={pendingCount}
          />

          <DashboardCard
            label="작성중"
            value={writingCount}
          />

          <DashboardCard
            label="완료"
            value={completedCount}
          />
        </section>


        {/* 상담 목록 */}
        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                상담관리
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                최근 신청된 상담부터 표시됩니다.
              </p>
            </div>

            <p className="text-sm font-semibold text-neutral-400">
              총 {totalCount}건
            </p>
          </div>


          {error ? (
            <div className="mt-6 rounded-2xl bg-red-50 p-5 text-sm leading-6 text-red-600">
              상담 목록을 불러오지 못했습니다.
              잠시 후 다시 시도해주세요.
            </div>
          ) : readings.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
              <p className="font-semibold text-neutral-500">
                아직 등록된 상담이 없습니다.
              </p>

              <Link
                href="/apply"
                className="mt-4 inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white"
              >
                상담 신청하기
              </Link>
            </div>
          ) : (
            <>
              {/* 데스크톱 */}
              <div className="mt-6 hidden overflow-hidden rounded-2xl border border-neutral-100 md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-neutral-500">
                        번호
                      </th>

                      <th className="px-4 py-3 text-xs font-bold text-neutral-500">
                        상태
                      </th>

                      <th className="px-4 py-3 text-xs font-bold text-neutral-500">
                        신청일
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-bold text-neutral-500">
                        관리
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {readings.map(
                      (reading, index) => (
                        <tr
                          key={reading.id}
                          className="border-t border-neutral-100"
                        >
                          <td className="px-4 py-4 text-sm font-semibold">
                            {totalCount - index}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                reading.status
                              )}`}
                            >
                              {getStatusLabel(
                                reading.status
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-neutral-500">
                            {formatDate(
                              reading.created_at
                            )}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <Link
                              href={`/admin/readings/${reading.id}`}
                              className="inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700"
                            >
                              상담 상세
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>


              {/* 모바일 */}
              <div className="mt-6 space-y-3 md:hidden">
                {readings.map(
                  (reading, index) => (
                    <Link
                      key={reading.id}
                      href={`/admin/readings/${reading.id}`}
                      className="block rounded-2xl border border-neutral-100 p-4 transition hover:bg-neutral-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">
                            상담 #{totalCount - index}
                          </p>

                          <p className="mt-1 text-xs text-neutral-400">
                            {formatDate(
                              reading.created_at
                            )}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            reading.status
                          )}`}
                        >
                          {getStatusLabel(
                            reading.status
                          )}
                        </span>
                      </div>

                      <div className="mt-4 border-t border-neutral-100 pt-3 text-right text-xs font-bold text-purple-600">
                        상담 상세 보기 
                      </div>
                    </Link>
                  )
                )}
              </div>
            </>
          )}
        </section>


        {/* 관리 메뉴 */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/members"
            className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-lg font-bold">
              회원관리
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              회원 추가, 관리자 지정, 닉네임 변경,
              비밀번호 초기화 및 회원 삭제
            </p>

            <p className="mt-4 text-sm font-bold text-purple-600">
              회원관리 
            </p>
          </Link>

          <Link
            href="/apply"
            className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-lg font-bold">
              상담 신청 화면
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              실제 고객에게 보이는 상담 신청 화면을 확인합니다.
            </p>

            <p className="mt-4 text-sm font-bold text-purple-600">
              화면 확인 
            </p>
          </Link>
        </section>

      </div>
    </main>
  );
}