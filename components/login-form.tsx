"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const cleanNickname = nickname.trim();

    if (cleanNickname.length < 2) {
      setMessage("닉네임은 2자 이상 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setMessage("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/nickname-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: cleanNickname,
          password,
        }),
      });

      let data: {
        ok?: boolean;
        error?: string;
        message?: string;
        redirectTo?: string;
        redirect?: string;
        role?: string;
      } = {};

      const text = await response.text();

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        setMessage(
          data.error ||
            data.message ||
            "로그인하지 못했습니다. 닉네임과 비밀번호를 확인해주세요."
        );

        return;
      }

      const destination =
        data.redirectTo ||
        data.redirect ||
        (data.role === "admin" ? "/admin" : "/member");

      router.push(destination);
      router.refresh();
    } catch (error) {
      console.error("[login] request failed:", error);

      setMessage(
        "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="nickname"
          className="mb-2 block text-sm font-semibold text-[#584850]"
        >
          닉네임
        </label>

        <div className="relative">
          <input
            id="nickname"
            name="nickname"
            type="text"
            autoComplete="username"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="사용할 닉네임을 입력하세요"
            disabled={loading}
            className="h-14 w-full rounded-2xl border border-[#d8cbbb] bg-[#fffdf9] px-4 text-[15px] text-[#40343a] outline-none transition placeholder:text-[#b5aaa3] focus:border-[#92748c] focus:ring-4 focus:ring-[#92748c]/10 disabled:opacity-60"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#b49a70]">
            
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-[#584850]"
        >
          비밀번호
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8자 이상 입력하세요"
            disabled={loading}
            className="h-14 w-full rounded-2xl border border-[#d8cbbb] bg-[#fffdf9] px-4 pr-20 text-[15px] text-[#40343a] outline-none transition placeholder:text-[#b5aaa3] focus:border-[#92748c] focus:ring-4 focus:ring-[#92748c]/10 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-xs font-semibold text-[#806d77] transition hover:bg-[#f3ece5]"
          >
            {showPassword ? "숨기기" : "보기"}
          </button>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-[#e4c6c6] bg-[#fff6f5] px-4 py-3 text-sm leading-6 text-[#995c5c]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="relative h-14 w-full overflow-hidden rounded-2xl border border-[#64465c] bg-[#604359] px-5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(80,50,72,0.18)] transition hover:bg-[#53394d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative z-10">
          {loading ? "인연을 확인하고 있어요..." : "선녀사주 들어가기"}
        </span>

        <div className="absolute inset-x-12 bottom-0 h-10 bg-white/10 blur-2xl" />
      </button>

      <div className="rounded-2xl border border-[#e5d9c9] bg-[#faf5ed] px-4 py-4">
        <div className="flex gap-3">
          <span className="mt-0.5 text-[#a78b5d]">
            
          </span>

          <div>
            <p className="text-xs font-semibold text-[#756761]">
              처음 방문하셨나요?
            </p>

            <p className="mt-1 text-xs leading-5 text-[#9b8e87]">
              사용하지 않은 닉네임과 비밀번호를 입력하면
              별도의 회원가입 없이 일반회원으로 자동 등록됩니다.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}