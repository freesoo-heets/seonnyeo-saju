"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CalculateSajuButton({
  readingId,
}: {
  readingId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function calculate() {
    setLoading(true);
    setMessage("");

    try {
      const response =
        await fetch(
          `/api/admin/readings/${readingId}/calculate`,
          {
            method: "POST",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.detail
            ? `${result.error} (${result.detail})`
            : result.error ??
              "계산에 실패했습니다."
        );

        return;
      }

      setMessage(
        "만세력을 계산했습니다."
      );

      router.refresh();

    } catch {
      setMessage(
        "서버 연결 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={calculate}
        disabled={loading}
        className="rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-bold text-purple-700 disabled:opacity-50"
      >
        {loading
          ? "계산 중..."
          : "만세력 다시 계산"}
      </button>

      {message && (
        <div className="mt-2 text-xs text-neutral-500">
          {message}
        </div>
      )}
    </div>
  );
}
