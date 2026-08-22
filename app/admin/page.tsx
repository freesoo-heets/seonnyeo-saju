import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import LogoutButton from "@/components/admin/LogoutButton";

const statusMap: Record<
  string,
  {
    text: string;
    className: string;
  }
> = {
  pending: {
    text: "접수",
    className: "bg-yellow-50 text-yellow-700",
  },

  reviewed: {
    text: "확인",
    className: "bg-blue-50 text-blue-700",
  },

  writing: {
    text: "풀이중",
    className: "bg-purple-50 text-purple-700",
  },

  completed: {
    text: "풀이완료",
    className: "bg-green-50 text-green-700",
  },

  delivered: {
    text: "전달완료",
    className: "bg-neutral-100 text-neutral-600",
  },
};

export default async function AdminPage() {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();

  const { data: readings, error } = await supabase
    .from("readings")
    .select(
      `
      id,
      consultation_number,
      customer_name,
      gender,
      birth_date,
      question_categories,
      question,
      status,
      created_at
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const allReadings = readings ?? [];

  const pendingCount = allReadings.filter(
    (item) => item.status === "pending"
  ).length;

  const writingCount = allReadings.filter(
    (item) => item.status === "writing"
  ).length;

  const completedCount = allReadings.filter(
    (item) =>
      item.status === "completed" ||
      item.status === "delivered"
  ).length;

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const todayCount = allReadings.filter((item) => {
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(item.created_at));

    return date === today;
  }).length;

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 sm:px-6">

      <div className="mx-auto max-w-5xl">

        <header className="flex items-center justify-between gap-4">

          <div>

            <div className="text-sm text-neutral-500">
               선녀사주
            </div>

            <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">
              관리자
            </h1>

          </div>

          <LogoutButton />

        </header>


        <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <DashboardCard
            label="오늘 접수"
            value={todayCount}
          />

          <DashboardCard
            label="풀이 대기"
            value={pendingCount}
          />

          <DashboardCard
            label="풀이 중"
            value={writingCount}
          />

          <DashboardCard
            label="완료"
            value={completedCount}
          />

        </section>


        <section className="mt-8">

          <div className="mb-4 flex items-end justify-between">

            <div>

              <h2 className="text-xl font-bold text-neutral-900">
                상담 목록
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                최근 접수순으로 표시됩니다.
              </p>

            </div>

            <span className="text-sm text-neutral-400">
              전체 {allReadings.length}건
            </span>

          </div>


          {allReadings.length === 0 ? (

            <div className="rounded-3xl bg-white p-10 text-center text-neutral-400 shadow-sm">
              아직 접수된 상담이 없습니다.
            </div>

          ) : (

            <div className="space-y-3">

              {allReadings.map((reading) => {
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

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <div className="text-xs font-medium text-neutral-400">
                          {reading.consultation_number}
                        </div>

                        <div className="mt-2 flex items-center gap-2">

                          <h3 className="text-lg font-bold text-neutral-900">
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
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${status.className}`}
                      >
                        {status.text}
                      </span>

                    </div>


                    {categories.length > 0 && (

                      <div className="mt-4 flex flex-wrap gap-1.5">

                        {categories.map((category: string) => (

                          <span
                            key={category}
                            className="rounded-full bg-[#faf7f2] px-3 py-1 text-xs text-neutral-600"
                          >
                            {category}
                          </span>

                        ))}

                      </div>

                    )}


                    {reading.question && (

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">
                        {reading.question}
                      </p>

                    )}


                    <div className="mt-4 text-right text-sm font-medium text-neutral-900">
                      상담 보기 
                    </div>

                  </Link>

                );
              })}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}


function DashboardCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">

      <div className="text-xs text-neutral-500 sm:text-sm">
        {label}
      </div>

      <div className="mt-2 text-2xl font-bold text-neutral-900">
        {value}
        <span className="ml-1 text-sm font-normal text-neutral-400">
          건
        </span>
      </div>

    </div>
  );
}
