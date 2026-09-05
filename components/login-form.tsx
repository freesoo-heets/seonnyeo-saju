"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);

    const cleanNickname = nickname.trim();

    if (!cleanNickname) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (cleanNickname.length < 2) {
      setError("닉네임은 2자 이상 입력해주세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/nickname-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: cleanNickname,
            password,
          }),
        }
      );

      const raw = await response.text();

      if (!raw) {
        setError(
          `로그인 서버에서 빈 응답을 받았습니다. (${response.status})`
        );
        return;
      }

      let result: {
        success?: boolean;
        error?: string;
        redirectTo?: string;
      };

      try {
        result = JSON.parse(raw);
      } catch {
        console.error(
          "Nickname login returned non-JSON response:",
          raw
        );

        setError(
          `로그인 서버 응답을 처리할 수 없습니다. (${response.status})`
        );

        return;
      }

      if (!response.ok || !result.success) {
        setError(
          result.error ??
            "닉네임 또는 비밀번호를 확인해주세요."
        );

        return;
      }

      router.replace(
        result.redirectTo || "/member"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Nickname login request failed:",
        error
      );

      setError(
        "로그인 서버에 연결하지 못했습니다."
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
          className="mb-2 block text-sm font-semibold text-neutral-700"
        >
          닉네임
        </label>

        <input
          id="nickname"
          name="nickname"
          type="text"
          autoComplete="username"
          maxLength={20}
          value={nickname}
          onChange={(event) =>
            setNickname(event.target.value)
          }
          placeholder="사용할 닉네임"
          disabled={loading}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-neutral-700"
        >
          비밀번호
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="8자 이상 비밀번호"
          disabled={loading}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
        />
      </div>

      <div className="rounded-xl bg-purple-50 px-4 py-3 text-xs leading-5 text-purple-700">
        처음 이용하는 닉네임은 자동으로 회원 계정이 생성됩니다.
        다음부터 같은 닉네임과 비밀번호로 로그인해주세요.
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-neutral-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "확인 중..."
          : "로그인"}
      </button>
    </form>
  );
}
