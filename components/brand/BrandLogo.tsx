export default function BrandLogo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex items-center justify-center rounded-full border border-[#dacbf1] bg-[#f6efff] ${
          compact
            ? "h-10 w-10"
            : "h-14 w-14"
        }`}
      >
        <span
          className={
            compact
              ? "text-xl"
              : "text-3xl"
          }
        >
          
        </span>
      </div>

      <div>
        <div
          className={`font-bold tracking-[-0.04em] text-[#2c2434] ${
            compact
              ? "text-xl"
              : "text-2xl"
          }`}
        >
          선녀사주
        </div>

        {!compact && (
          <div className="mt-0.5 text-xs tracking-[0.16em] text-[#9b86b4]">
            SEONNYEO SAJU
          </div>
        )}
      </div>

    </div>
  );
}
