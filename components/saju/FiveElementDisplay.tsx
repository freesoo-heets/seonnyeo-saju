import type { ReactNode } from "react";

export type FiveElement = "목" | "화" | "토" | "금" | "수";

type ElementTheme = {
  text: string;
  bg: string;
  border: string;
  soft: string;
  strong: string;
};

const elementTheme: Record<FiveElement, ElementTheme> = {
  목: { text: "#2f6b45", bg: "#dff1e3", border: "#a9d1b3", soft: "#f0f8f2", strong: "#4f9c69" },
  화: { text: "#a9463f", bg: "#fbe0dc", border: "#efaaa1", soft: "#fff3f1", strong: "#dc6257" },
  토: { text: "#8a6427", bg: "#f8e7b7", border: "#dfbf68", soft: "#fdf7e8", strong: "#d39a2e" },
  금: { text: "#62676f", bg: "#e8ebee", border: "#c8ced4", soft: "#f5f6f7", strong: "#8f969e" },
  수: { text: "#355a7d", bg: "#dfeaf4", border: "#adc4d9", soft: "#f0f5f9", strong: "#4e7fae" },
};

const charElement: Record<string, FiveElement> = {
  甲: "목", 乙: "목", 갑: "목", 을: "목", 寅: "목", 卯: "목", 인: "목", 묘: "목",
  丙: "화", 丁: "화", 병: "화", 정: "화", 巳: "화", 午: "화", 사: "화", 오: "화",
  戊: "토", 己: "토", 무: "토", 기: "토", 辰: "토", 戌: "토", 丑: "토", 未: "토", 진: "토", 술: "토", 축: "토", 미: "토",
  庚: "금", 辛: "금", 경: "금", 신: "금", 申: "금", 酉: "금", 유: "금",
  壬: "수", 癸: "수", 임: "수", 계: "수", 亥: "수", 子: "수", 해: "수", 자: "수",
};

export function getCharElement(char?: string | null): FiveElement | null {
  if (!char) return null;
  return charElement[char] ?? null;
}

export function getElementTheme(element?: string | null): ElementTheme {
  return elementTheme[element as FiveElement] ?? {
    text: "#5f5559",
    bg: "#f7f1e8",
    border: "#dfd2c1",
    soft: "#fbf7f1",
    strong: "#9b8d86",
  };
}

export function ElementBadge({ element, count }: { element: string; count?: number }) {
  const theme = getElementTheme(element);
  return (
    <div
      className="rounded-2xl border p-3 text-center shadow-[0_5px_18px_rgba(70,47,60,0.05)]"
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
        const theme = getElementTheme(getCharElement(char));
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

export function ElementSurface({
  element,
  children,
  className = "",
}: {
  element?: string | null;
  children: ReactNode;
  className?: string;
}) {
  const theme = getElementTheme(element);

  return (
    <div
      className={`border shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${className}`}
      style={{
        background: `linear-gradient(145deg, ${theme.soft} 0%, ${theme.bg} 100%)`,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      {children}
    </div>
  );
}
