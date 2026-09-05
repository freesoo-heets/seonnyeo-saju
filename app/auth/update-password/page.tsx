import Link from "next/link";

export default function UpdatePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ef] px-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-sm">

        <div className="text-4xl">
          
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          비밀번호 변경
        </h1>

        <p className="mt-4 text-sm leading-6 text-neutral-600">
          비밀번호 초기화가 필요한 경우
          선녀사주 관리자에게 요청해주세요.
        </p>

        <Link
          href="/auth/login"
          className="mt-7 inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white"
        >
          로그인으로 돌아가기
        </Link>

      </div>

    </main>
  );
}
