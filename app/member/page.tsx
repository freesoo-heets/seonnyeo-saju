import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
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
    <main className="min-h-screen bg-[#f8f4ef] px-4 py-8 text-[#2c2434] sm:px-6">

      <div className="mx-auto max-w-xl">

        <header className="mb-5 flex items-center justify-between">

          <div>
            <p className="text-sm font-bold tracking-[0.12em] text-purple-600">
              SEONNYEO SAJU
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              회원 페이지
            </p>
          </div>

          <LogoutButton
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 shadow-sm disabled:opacity-50"
          />

        </header>


        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="text-4xl">
            
          </div>

          <h1 className="mt-4 text-2xl font-bold">
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


          <div className="mt-8 rounded-2xl bg-[#f8f4ef] p-4">

            <p className="text-sm font-bold">
              내 계정
            </p>

            <div className="mt-3 flex items-center justify-between text-sm">

              <span className="text-neutral-500">
                닉네임
              </span>

              <span className="font-semibold">
                {current.profile.nickname}
              </span>

            </div>

            <div className="mt-2 flex items-center justify-between text-sm">

              <span className="text-neutral-500">
                회원 권한
              </span>

              <span className="font-semibold">
                일반회원
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
