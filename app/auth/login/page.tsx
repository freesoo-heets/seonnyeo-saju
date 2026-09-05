import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ef] px-5 py-10">

      <div className="w-full max-w-md">

        <LoginForm />

        <div className="mt-5 text-center">

          <a
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            ← 선녀사주 메인으로
          </a>

        </div>

      </div>

    </main>
  );
}
