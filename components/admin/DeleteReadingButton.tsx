"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteReadingButton({
  readingId,
  consultationNumber,
}: {
  readingId: string;
  consultationNumber: string;
}) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  async function deleteReading() {
    const confirmed = window.confirm(
      `${consultationNumber} 상담을 삭제하시겠습니까?\n\n삭제된 상담은 복구할 수 없습니다.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/readings/${readingId}/delete`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.detail
            ? `${result.error}\n${result.detail}`
            : result.error ?? "삭제에 실패했습니다."
        );

        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      alert("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteReading}
      disabled={deleting}
      className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {deleting
        ? "삭제 중..."
        : "상담 삭제"}
    </button>
  );
}
