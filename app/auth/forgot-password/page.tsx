import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f1e8] px-4 py-10 text-[#3f343a] sm:px-6">
      <div className="relative w-full max-w-md rounded-[28px] border border-[#d9cbb8] bg-[rgba(255,252,247,0.94)] p-7 text-center shadow-[0_18px_55px_rgba(70,47,60,0.09)] sm:p-9">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#aa8e61]">SEONNYEO SAJU</p>
        <h1 className="mt-3 font-serif text-2xl font-semibold text-[#493943]">비밀번호 재설정</h1>
        <p className="mt-4 text-sm leading-6 text-[#8b7f79]">비밀번호를 잊으신 경우 관리자에게 비밀번호 초기화를 요청해주세요.</p>
        <p className="mt-2 text-xs leading-5 text-[#a79b94]">이메일을 이용한 비밀번호 재설정은 사용하지 않습니다.</p>
        <Link href="/auth/login" className="mt-7 inline-flex rounded-2xl border border-[#604359] bg-[#604359] px-5 py-3 text-sm font-bold text-white">로그인으로 돌아가기</Link>
      </div>
    </main>
  );
}
