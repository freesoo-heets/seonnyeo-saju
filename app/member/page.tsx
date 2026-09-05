import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function MemberPage() {
  const current = await requireUser();

  if (!current) {
    redirect("/auth/login");
  }

  if (current.profile.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f8f4ef] px-5 py-10 text-[#2c2434]">
      <div className="mx-auto max-w-xl">

        <section className="rounded-3xl bg-white p-7 shadow-sm">

          <div className="text-4xl">
            ✦
          </div>

          <p className="mt-4 text-sm font-bold tracking-[0.12em] text-purple-600">
            SEONNYEO SAJU
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            {current.profile.nickname}님
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            선녀사주에 로그인되었습니다.
          </p>

          <div className="mt-8 grid gap-3">

            <Link
              href="/apply"
              className="rounded-2xl bg-neutral-900 px-5 py-4 text-center text-sm font-bold text-white"
            >
              사주 상담 신청
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-neutral-200 px-5 py-4 text-center text-sm font-semibold text-neutral-700"
            >
              선녀사주 메인
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}
