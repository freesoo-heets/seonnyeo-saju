"use client";

import { useState } from "react";

export default function ResultLinkButton({
  token,
}: {
  token: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url =
      `${window.location.origin}/result/${token}`;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.prompt(
        "아래 링크를 복사해주세요.",
        url
      );
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700"
    >
      {copied
        ? "복사 완료"
        : "고객 결과링크 복사"}
    </button>
  );
}
