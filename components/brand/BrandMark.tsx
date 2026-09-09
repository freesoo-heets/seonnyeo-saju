export default function BrandMark({
  size = "md",
  inverted = false,
  withWordmark = false,
  compact = false,
}: {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  withWordmark?: boolean;
  compact?: boolean;
}) {
  const sizeClass =
    size === "lg"
      ? "h-16 w-16"
      : size === "sm"
        ? "h-10 w-10"
        : "h-12 w-12";

  const svgClass =
    size === "lg"
      ? "h-9 w-9"
      : size === "sm"
        ? "h-6 w-6"
        : "h-7 w-7";

  return (
    <div className={`inline-flex items-center ${compact ? "gap-2.5" : "gap-3"}`}>
      <span
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(72,47,60,0.08)] ${
          inverted
            ? "border-white/20 bg-white/8"
            : "border-[#ccb68e] bg-[linear-gradient(145deg,#fffaf0,#f5ead8)]"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" className={svgClass} fill="none">
          <path
            d="M40.3 9.5c-9.2 3.1-14.5 13-11.4 22.3 3.1 9.2 13 14.4 22.2 11.4-4.9 7.9-14.2 12.1-23.4 9.8C15.1 49.9 7.4 37.2 10.5 24.6 13.2 13.8 22.7 6.3 33.7 5.9c2.3-.1 4.5.2 6.6.8Z"
            fill={inverted ? "#f6e5bc" : "#67495f"}
          />
          <path
            d="m46.5 13.4 1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8-4.8-1.7 4.8-1.7 1.7-4.8Z"
            fill={inverted ? "#f4d99c" : "#b9975d"}
          />
          <circle cx="48.5" cy="33.8" r="2.2" fill={inverted ? "#f4d99c" : "#b9975d"} />
        </svg>
      </span>

      {withWordmark ? (
        <span className="min-w-0 text-left">
          <span
            className={`block text-[9px] font-black tracking-[0.26em] ${
              inverted ? "text-[#e5cf9e]" : "text-[#a48757]"
            }`}
          >
            SEONNYEO SAJU
          </span>
          <span
            className={`mt-0.5 block font-serif text-lg font-semibold leading-none ${
              inverted ? "text-white" : "text-[#4a3944]"
            }`}
          >
            선녀사주
          </span>
        </span>
      ) : null}
    </div>
  );
}
