import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MemberManager } from "@/components/admin/MemberManager";
import BrandMark from "@/components/brand/BrandMark";
import { requireAdmin } from "@/lib/auth/permissions";

export const instant = false;

export default async function AdminMembersPage() {
  const current = await requireAdmin();

  if (!current) {
    redirect("/auth/login");
  }

  return (
    <main className="saju-page relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-6 text-[#3f343a] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-[340px] w-[340px] rounded-full bg-[#b69eb6]/15 blur-3xl" />
        <div className="absolute -right-24 top-[18%] h-[310px] w-[310px] rounded-full bg-[#d4bd89]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="saju-hero-card overflow-hidden rounded-[30px] border border-[#d9cbb8]">
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#b59a67] to-transparent" />
          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <BrandMark size="sm" withWordmark compact />
                <p className="mt-5 text-[10px] font-semibold tracking-[0.26em] text-[#aa8e61]">ADMIN · MEMBER MANAGEMENT</p>
                <h1 className="mt-2 font-serif text-3xl font-semibold text-[#443640]">회원관리</h1>
                <p className="mt-2 text-sm text-[#8b7f79]">회원 계정과 관리자 권한을 안전하게 관리합니다.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href="/admin" className="ss-secondary">상담관리</Link>
                <LogoutButton className="ss-secondary disabled:opacity-50" />
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6">
          <MemberManager />
        </div>
      </div>
    </main>
  );
}
