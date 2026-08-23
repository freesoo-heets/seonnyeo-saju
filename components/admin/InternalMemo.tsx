"use client";

import {
  useState,
} from "react";

export default function InternalMemo({
  readingId,
  initialMemo,
}: {
  readingId: string;
  initialMemo?: string | null;
}) {

  const [memo, setMemo] =
    useState(
      initialMemo ?? ""
    );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function save() {

    setSaving(true);
    setMessage("");

    try {

      const response =
        await fetch(
          `/api/admin/readings/${readingId}/memo`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                memo,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {

        setMessage(
          result.error ??
            "저장에 실패했습니다."
        );

        return;
      }

      setMessage(
        "내부메모가 저장되었습니다."
      );

    } catch {

      setMessage(
        "서버 연결 중 오류가 발생했습니다."
      );

    } finally {

      setSaving(false);

    }
  }


  return (

    <section className="mt-4 rounded-3xl border border-amber-100 bg-amber-50/50 p-5 sm:p-7">

      <div>

        <div className="text-sm font-bold text-amber-700">
           관리자 내부메모
        </div>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          이 내용은 고객 결과 페이지에 표시되지 않습니다.
        </p>

      </div>


      <textarea
        rows={5}
        value={memo}
        onChange={
          (
            event
          ) =>
            setMemo(
              event.target.value
            )
        }
        placeholder="상담 중 참고할 내용, 재상담 메모 등을 기록하세요."
        className="mt-4 w-full resize-y rounded-2xl border border-amber-100 bg-white p-4 leading-7 text-neutral-900 outline-none focus:border-amber-300"
      />


      <div className="mt-3 flex items-center justify-between gap-3">

        <div className="text-xs text-neutral-500">
          {message}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving
            ? "저장 중..."
            : "메모 저장"}
        </button>

      </div>

    </section>

  );
}
