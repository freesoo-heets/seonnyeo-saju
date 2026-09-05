import { redirect as authRedirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/permissions";
﻿export const instant = false;

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import LogoutButton from "@/components/admin/LogoutButton";
import AdminReadingsList from "@/components/admin/AdminReadingsList";

export default async function AdminPage() {

  const adminAccess = await requireAdmin();

  if (!adminAccess) {
    authRedirect("/auth/login");
  }


  const authClient =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await authClient.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }


  const supabase =
    createAdminClient();


  const {
    data: readings,
    error,
  } =
    await supabase
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
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


  if (error) {
    throw new Error(
      error.message
    );
  }


  const allReadings =
    readings ?? [];


  const pendingCount =
    allReadings.filter(
      (item) =>
        item.status === "pending"
    ).length;


  const writingCount =
    allReadings.filter(
      (item) =>
        item.status === "writing"
    ).length;


  const completedCount =
    allReadings.filter(
      (item) =>
        item.status === "completed" ||
        item.status === "delivered"
    ).length;


  const today =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Asia/Seoul",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      }
    ).format(
      new Date()
    );


  const todayCount =
    allReadings.filter(
      (item) => {

        const date =
          new Intl.DateTimeFormat(
            "en-CA",
            {
              timeZone:
                "Asia/Seoul",

              year:
                "numeric",

              month:
                "2-digit",

              day:
                "2-digit",
            }
          ).format(
            new Date(
              item.created_at
            )
          );

        return date === today;
      }
    ).length;


  return (

    <main className="min-h-screen bg-[#faf7f2] px-4 py-6 text-neutral-900 sm:px-6">

      <div className="mx-auto max-w-5xl">


        <header className="flex items-center justify-between gap-4">

          <div>

            <div className="text-sm font-bold text-purple-600">
               선녀사주
            </div>

            <h1 className="mt-1 text-3xl font-bold text-neutral-950">
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


        <AdminReadingsList
          readings={allReadings}
        />

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

      <div className="text-xs font-medium text-neutral-500 sm:text-sm">
        {label}
      </div>

      <div className="mt-2 text-2xl font-bold text-neutral-950">

        {value}

        <span className="ml-1 text-sm font-normal text-neutral-400">
          건
        </span>

      </div>

    </div>

  );
}
