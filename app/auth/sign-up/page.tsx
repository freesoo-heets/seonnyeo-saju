import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ef] px-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-sm">

        <div className="text-4xl">
          ✦
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          회원가입 안내
        </h1>

        <p className="mt-4 text-sm leading-6 text-neutral-600">
          선녀사주 회원 계정은
          관리자가 직접 생성합니다.
        </p>

        <Link
          href="/auth/login"
          className="mt-7 inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white"
        >
          로그인으로 이동
        </Link>

      </div>

    </main>
  );
}
