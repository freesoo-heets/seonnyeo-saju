"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({
  className = "",
}: LogoutButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function logout() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "로그아웃 요청에 실패했습니다."
        );
      }

      router.replace(
        "/auth/login"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      alert(
        "로그아웃 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={className}
    >
      {loading
        ? "로그아웃 중..."
        : "로그아웃"}
    </button>
  );
}
