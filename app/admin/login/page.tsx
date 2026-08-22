"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="text-5xl">
            
          </div>

          <h1 className="mt-4 text-3xl font-bold text-neutral-800">
            선녀사주 관리자
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            관리자 계정으로 로그인해주세요.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          <label className="block">

            <span className="text-sm font-medium text-neutral-600">
              이메일
            </span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-600"
            />

          </label>

          <label className="mt-5 block">

            <span className="text-sm font-medium text-neutral-600">
              비밀번호
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-neutral-600"
            />

          </label>

          {errorMessage && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>

        </form>

        <div className="mt-5 text-center">

          <a
            href="/"
            className="text-sm text-neutral-400 hover:text-neutral-700"
          >
             선녀사주 메인으로
          </a>

        </div>

      </div>
    </main>
  );
}
