import Link from "next/link";

export const instant = false;

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f1e8] px-4 py-10 text-[#3f343a] sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-[340px] w-[340px] rounded-full bg-[#b69eb6]/15 blur-3xl" />
        <div className="absolute -right-24 top-[18%] h-[310px] w-[310px] rounded-full bg-[#d4bd89]/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-[28px] border border-[#d9cbb8] bg-[rgba(255,252,247,0.94)] p-7 text-center shadow-[0_18px_55px_rgba(70,47,60,0.09)] sm:p-9">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#aa8e61]">SEONNYEO SAJU</p>
        <h1 className="mt-3 font-serif text-2xl font-semibold text-[#493943]">요청을 처리하지 못했습니다</h1>
        <p className="mt-4 text-sm leading-6 text-[#8b7f79]">잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요.</p>
        {error ? <p className="mt-3 break-all text-xs text-[#a28f88]">오류 코드: {error}</p> : null}
        <Link href="/auth/login" className="mt-7 inline-flex rounded-2xl border border-[#604359] bg-[#604359] px-5 py-3 text-sm font-bold text-white">로그인으로 돌아가기</Link>
      </div>
    </main>
  );
}
