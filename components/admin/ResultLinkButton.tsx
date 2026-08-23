"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultLinkButton({
  token,
}: {
  token: string;
}) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [delivering, setDelivering] =
    useState(false);

  async function getInfo() {
    const response =
      await fetch(
        `/api/admin/result/${token}`
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ??
          "상담정보 조회 실패"
      );
    }

    return result;
  }

  async function copyResult() {
    setLoading(true);

    try {
      const info =
        await getInfo();

      const url =
        `${window.location.origin}/result/${token}`;

      const message =
` 선녀사주 사주풀이가 완료되었습니다.

상담번호
${info.consultation_number}

결과 확인
${url}

확인번호
${info.result_pin}

 위 링크와 확인번호는 본인만 확인해주세요.`;

      await navigator.clipboard.writeText(
        message
      );

      setCopied(true);

      setTimeout(
        () =>
          setCopied(false),
        2000
      );

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "복사에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markDelivered() {
    const confirmed =
      window.confirm(
        "고객에게 결과를 전달완료 처리하시겠습니까?"
      );

    if (!confirmed) {
      return;
    }

    setDelivering(true);

    try {
      const response =
        await fetch(
          `/api/admin/result/${token}/delivered`,
          {
            method: "POST",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ??
            "처리에 실패했습니다."
        );
        return;
      }

      router.refresh();

    } catch {
      alert(
        "서버 연결 중 오류가 발생했습니다."
      );
    } finally {
      setDelivering(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">

      <button
        type="button"
        onClick={copyResult}
        disabled={loading}
        className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading
          ? "불러오는 중..."
          : copied
            ? "링크 + PIN 복사 완료"
            : "고객 결과링크 + PIN 복사"}
      </button>

      <button
        type="button"
        onClick={markDelivered}
        disabled={delivering}
        className="rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-bold text-green-700 disabled:opacity-50"
      >
        {delivering
          ? "처리 중..."
          : "결과 전달완료"}
      </button>

    </div>
  );
}
