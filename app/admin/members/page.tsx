import { LogoutButton } from "@/components/auth/LogoutButton";
﻿import Link from "next/link";
import { redirect } from "next/navigation";

import { MemberManager } from "@/components/admin/MemberManager";
import { requireAdmin } from "@/lib/auth/permissions";

export const instant = false;

export default async function AdminMembersPage() {
  const current = await requireAdmin();

  if (!current) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-[#f8f4ef] px-4 py-8 text-[#2c2434] sm:px-6">

      <div className="mx-auto max-w-6xl">

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-bold tracking-[0.12em] text-purple-600">
              SEONNYEO SAJU ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              회원관리
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              회원 계정과 관리자 권한을 관리합니다.
            </p>
          </div>

          <div className="flex gap-2">
          {/* 회원관리 로그아웃 */}

          <LogoutButton
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600"
          />

          <Link
            href="/admin"
            className="inline-flex rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold"
          >
            ← 상담관리로
          </Link>

        </div>

        </div>

        <MemberManager />

      </div>

    </main>
  );
}
