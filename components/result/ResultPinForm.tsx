"use client";

import { FormEvent, useState } from "react";

export default function ResultPinForm({
  token,
}: {
  token: string;
}) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/result/${token}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pin,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.error ?? "확인번호가 올바르지 않습니다."
        );
        return;
      }

      window.location.reload();
    } catch {
      setErrorMessage(
        "서버 연결 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e8] px-5 text-neutral-900">
      <div className="w-full max-w-md">

        <div className="text-center">
          <div className="text-5xl">
            
          </div>

          <div className="mt-4 text-sm font-bold text-[#795d72]">
            선녀사주
          </div>

          <h1 className="mt-2 text-2xl font-bold">
            상담결과 확인
          </h1>

          <p className="mt-3 leading-7 text-neutral-500">
            개인정보 보호를 위해
            <br />
            전달받은 4자리 확인번호를 입력해주세요.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 rounded-[28px] border border-[#ddcfbd] bg-[rgba(255,253,249,0.96)] p-6 shadow-[0_18px_55px_rgba(68,45,59,0.09)]"
        >
          <label className="block">

            <span className="text-sm font-bold text-neutral-700">
              확인번호
            </span>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4)
                )
              }
              placeholder="   "
              className="mt-3 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-neutral-900 outline-none focus:border-[#8d7087] focus:ring-4 focus:ring-[#806078]/10"
            />

          </label>

          {errorMessage && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="mt-5 w-full rounded-2xl border border-[#65475e] bg-[#604359] py-4 font-bold text-white shadow-[0_8px_22px_rgba(79,52,71,0.18)] hover:bg-[#52394c] disabled:opacity-40"
          >
            {loading
              ? "확인 중..."
              : "사주풀이 확인하기"}
          </button>

        </form>

      </div>
    </main>
  );
}
