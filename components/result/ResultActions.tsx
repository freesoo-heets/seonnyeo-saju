"use client";

import {
  useState,
} from "react";

export default function ResultActions({
  customerName,
}: {
  customerName: string;
}) {

  const [message, setMessage] =
    useState("");

  async function share() {

    const shareData = {
      title:
        `${customerName}님의 선녀사주 결과`,

      text:
        `${customerName}님의 선녀사주 상담결과입니다.`,

      url:
        window.location.href,
    };

    try {

      if (
        navigator.share
      ) {

        await navigator.share(
          shareData
        );

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      setMessage(
        "결과 링크를 복사했습니다."
      );

    } catch (
      error
    ) {

      /*
       * 사용자가 공유창을 직접 닫은 경우도
       * 예외가 발생할 수 있으므로
       * 별도 오류 화면은 띄우지 않습니다.
       */

      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return;
      }

      try {

        await navigator.clipboard.writeText(
          window.location.href
        );

        setMessage(
          "공유를 지원하지 않아 링크를 복사했습니다."
        );

      } catch {

        setMessage(
          "공유 기능을 사용할 수 없습니다."
        );

      }
    }
  }


  function printResult() {
    window.print();
  }


  return (

    <div className="result-actions mt-6">

      <div className="grid grid-cols-2 gap-2">

        <button
          type="button"
          onClick={share}
          className="rounded-2xl bg-purple-600 py-3.5 text-sm font-bold text-white"
        >
          결과 공유
        </button>


        <button
          type="button"
          onClick={
            printResult
          }
          className="rounded-2xl border border-neutral-200 bg-white py-3.5 text-sm font-bold text-neutral-700"
        >
          PDF / 인쇄
        </button>

      </div>


      {message && (

        <div className="mt-2 text-center text-xs text-neutral-500">
          {message}
        </div>

      )}

    </div>

  );
}
