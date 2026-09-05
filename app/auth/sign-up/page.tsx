import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ef] px-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-sm">

        <div className="text-4xl">
          
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          선녀사주 회원
        </h1>

        <p className="mt-4 text-sm leading-6 text-neutral-600">
          별도의 이메일 회원가입은 필요하지 않습니다.
        </p>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          로그인 화면에서 처음 사용하는
          닉네임과 비밀번호를 입력하면
          회원 계정이 자동으로 생성됩니다.
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
