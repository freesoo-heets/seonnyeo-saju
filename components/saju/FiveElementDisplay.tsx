import type { ReactNode } from "react";

const elementTheme: Record<string, { text: string; bg: string; border: string; soft: string }> = {
  목: { text: "#3f6b4c", bg: "#edf6ef", border: "#bfd6c5", soft: "#f4faf5" },
  화: { text: "#b34f49", bg: "#fff0ee", border: "#e8bbb6", soft: "#fff7f5" },
  토: { text: "#9a7434", bg: "#faf3df", border: "#dfca93", soft: "#fdf9ed" },
  금: { text: "#6f747b", bg: "#f1f3f5", border: "#cfd4da", soft: "#f8f9fa" },
  수: { text: "#405c78", bg: "#edf3f8", border: "#b9cadb", soft: "#f5f8fb" },
};

const charElement: Record<string, string> = {
  甲: "목", 乙: "목", 갑: "목", 을: "목", 寅: "목", 卯: "목", 인: "목", 묘: "목",
  丙: "화", 丁: "화", 병: "화", 정: "화", 巳: "화", 午: "화", 사: "화", 오: "화",
  戊: "토", 己: "토", 무: "토", 기: "토", 辰: "토", 戌: "토", 丑: "토", 未: "토", 진: "토", 술: "토", 축: "토", 미: "토",
  庚: "금", 辛: "금", 경: "금", 신: "금", 申: "금", 酉: "금", 유: "금",
  壬: "수", 癸: "수", 임: "수", 계: "수", 亥: "수", 子: "수", 해: "수", 자: "수",
};

export function getElementTheme(element?: string | null) {
  return elementTheme[element ?? ""] ?? {
    text: "#5f5559",
    bg: "#f7f1e8",
    border: "#dfd2c1",
    soft: "#fbf7f1",
  };
}

export function ElementBadge({ element, count }: { element: string; count?: number }) {
  const theme = getElementTheme(element);
  return (
    <div
      className="rounded-2xl border p-3 text-center shadow-[0_4px_16px_rgba(70,47,60,0.04)]"
      style={{ backgroundColor: theme.soft, borderColor: theme.border }}
    >
      <div className="text-sm font-bold" style={{ color: theme.text }}>{element}</div>
      {typeof count === "number" ? (
        <div className="mt-1 text-2xl font-bold" style={{ color: theme.text }}>{count}</div>
      ) : null}
    </div>
  );
}

export function ElementText({ text, className = "" }: { text?: string | null; className?: string }) {
  if (!text) return <span className={className}>-</span>;
  return (
    <span className={className}>
      {Array.from(text).map((char, index) => {
        const theme = getElementTheme(charElement[char]);
        return (
          <span key={`${char}-${index}`} style={{ color: theme.text }}>{char}</span>
        );
      })}
    </span>
  );
}

export function ElementValue({ element, children, className = "" }: { element?: string | null; children: ReactNode; className?: string }) {
  const theme = getElementTheme(element);
  return <span className={className} style={{ color: theme.text }}>{children}</span>;
}
