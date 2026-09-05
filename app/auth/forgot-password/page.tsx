import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ef] px-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-sm">

        <div className="text-4xl">
          ✦
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          비밀번호 재설정
        </h1>

        <p className="mt-4 text-sm leading-6 text-neutral-600">
          비밀번호를 잊으신 경우
          관리자에게 비밀번호 초기화를 요청해주세요.
        </p>

        <p className="mt-2 text-xs leading-5 text-neutral-400">
          이메일 주소를 이용한 비밀번호 재설정은
          사용하지 않습니다.
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
