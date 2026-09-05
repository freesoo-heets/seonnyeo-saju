import Link from "next/link";

import InstallAppButton from "@/components/pwa/InstallAppButton";

function MoonMark({ large = false }: { large?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={large ? "h-10 w-10" : "h-7 w-7"}
      aria-hidden="true"
    >
      <path
        d="M39 10c-10.7 2.9-17 13.9-14.1 24.6C27.8 45.3 38.8 51.6 49.5 48.7 45.2 54.5 38.4 58 30.7 57.3 16.6 56 6.2 43.5 7.5 29.4 8.6 16.9 18.5 7.3 30.6 5.6 3-.4 5.9-.1 8.4.5Z"
        fill="#684b60"
      />
      <path
        d="M45 13l1.5 4.2 4.2 1.5-4.2 1.5L45 24.4l-1.5-4.2-4.2-1.5 4.2-1.5L45 13Z"
        fill="#b49764"
      />
      <circle cx="48" cy="31" r="2" fill="#b49764" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f1e8] text-[#3f343a]">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#aa8ba7]/15 blur-3xl" />
        <div className="absolute -right-32 top-24 h-[420px] w-[420px] rounded-full bg-[#d6bd87]/20 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[25%] h-[450px] w-[450px] rounded-full bg-[#aabdae]/15 blur-3xl" />
      </div>

      {/* NAV */}
      <header className="relative z-10 mx-auto max-w-6xl px-5 pt-5 sm:px-7 sm:pt-7">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9b181] bg-[#faf3e6] shadow-sm">
              <MoonMark />
            </div>

            <div>
              <p className="text-[9px] font-bold tracking-[0.27em] text-[#a88d61]">
                SEONNYEO SAJU
              </p>
              <p className="font-serif text-lg font-semibold text-[#493943]">
                선녀사주
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl border border-[#d8ccbd] bg-[#fffaf3]/80 px-4 py-2.5 text-xs font-semibold text-[#6e6065] backdrop-blur transition hover:bg-white"
            >
              로그인
            </Link>
            <Link
              href="/apply"
              className="hidden rounded-xl border border-[#63465b] bg-[#604359] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_5px_16px_rgba(76,49,68,0.16)] transition hover:bg-[#503749] sm:inline-flex"
            >
              상담 신청
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-7 sm:pb-24 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#cbb383] bg-[#faf2e4] shadow-[0_8px_30px_rgba(81,55,72,0.08)]">
            <MoonMark large />
          </div>

          <p className="mt-6 text-[10px] font-bold tracking-[0.3em] text-[#a98b5b]">
            YOUR STORY WRITTEN IN THE STARS
          </p>

          <h1 className="mt-5 font-serif text-[38px] font-semibold leading-[1.3] tracking-[-0.04em] text-[#40323b] sm:text-6xl sm:leading-[1.2]">
            타고난 운명의 흐름,
            <br />
            <span className="text-[#76596e]">선녀의 시선으로</span>{" "}
            읽어드립니다
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#897d77] sm:text-base sm:leading-8">
            태어난 순간에 담긴 사주의 흐름과
            <br className="hidden sm:block" />
            지금 마음속에 품고 있는 이야기를 함께 살펴봅니다.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#62445a] bg-[#604359] px-7 text-sm font-bold text-white shadow-[0_10px_28px_rgba(77,49,69,0.2)] transition hover:-translate-y-0.5 hover:bg-[#51374a]"
            >
              <span className="text-[#dec898]">✦</span>
              사주 상담 시작하기
            </Link>

            <div className="flex min-h-14 items-stretch [&>button]:min-h-14 [&>button]:w-full [&>button]:rounded-2xl [&>button]:border [&>button]:border-[#dacdbb] [&>button]:bg-[#fffaf3] [&>button]:px-7 [&>button]:text-sm [&>button]:font-bold [&>button]:text-[#76596e] [&>button]:shadow-none sm:[&>button]:w-auto">
              <InstallAppButton />
            </div>
          </div>
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-7 sm:pb-24">
        <div className="overflow-hidden rounded-[30px] border border-[#ddcfbc] bg-[rgba(255,252,247,0.86)] shadow-[0_20px_60px_rgba(65,43,56,0.08)] backdrop-blur">
          <div className="h-px bg-gradient-to-r from-transparent via-[#b39764]/70 to-transparent" />

          <div className="p-6 sm:p-9">
            <div className="text-center">
              <p className="text-[9px] font-bold tracking-[0.28em] text-[#aa8d5e]">
                FOUR PILLARS
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#493943]">
                사주에 담긴 네 개의 기둥
              </h2>
              <p className="mt-3 text-sm text-[#91857e]">
                태어난 년 · 월 · 일 · 시에 담긴 나만의 흐름
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-2 sm:gap-4">
              {[
                ["時", "시주", "시간"],
                ["日", "일주", "나"],
                ["月", "월주", "환경"],
                ["年", "년주", "뿌리"],
              ].map(([hanja, name, description]) => (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-[20px] border border-[#dfd1bf] bg-[#fffdf9] px-2 py-5 text-center shadow-[0_5px_18px_rgba(67,44,58,0.04)] sm:py-7"
                >
                  <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a975]/50 to-transparent" />
                  <p className="font-serif text-3xl text-[#654a5d] sm:text-4xl">{hanja}</p>
                  <p className="mt-3 text-xs font-bold text-[#5d5056] sm:text-sm">{name}</p>
                  <p className="mt-1 hidden text-[10px] text-[#a39790] sm:block">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-7 sm:pb-24">
        <div className="text-center">
          <p className="text-[9px] font-bold tracking-[0.28em] text-[#aa8d5e]">
            CONSULTATION
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
            선녀사주는 이렇게 진행됩니다
          </h2>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "정보 입력", "생년월일과 태어난 시간, 궁금한 이야기를 입력합니다.", "✦"],
            ["02", "만세력 확인", "입력된 정보를 기준으로 사주 원국과 오행을 확인합니다.", "☯"],
            ["03", "선녀의 풀이", "사주의 흐름과 질문을 바탕으로 직접 풀이합니다.", "☾"],
            ["04", "결과 확인", "전용 결과 링크와 PIN으로 편리하게 확인합니다.", "✧"],
          ].map(([number, title, description, symbol]) => (
            <div
              key={number}
              className="rounded-[24px] border border-[#dfd2c2] bg-[rgba(255,253,249,0.9)] p-5 shadow-[0_8px_30px_rgba(65,43,56,0.05)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl text-[#b29461]">{number}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6c39c] bg-[#faf3e8] text-[#76586e]">
                  {symbol}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-[#493943]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#91857f]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-7 sm:pb-24">
        <div className="relative overflow-hidden rounded-[30px] border border-[#5c4055] bg-[#594052] px-6 py-10 text-center text-white shadow-[0_22px_60px_rgba(70,44,62,0.18)] sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-10 h-40 w-40 rounded-full border border-white/10" />

          <div className="relative">
            <p className="text-[9px] font-bold tracking-[0.3em] text-[#ddc797]">
              SEONNYEO SAJU
            </p>
            <h2 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">
              지금 가장 궁금한 이야기는
              <br />
              무엇인가요?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/55">
              연애 · 결혼 · 재물 · 직업 · 인간관계
              <br />
              당신의 사주에 담긴 이야기를 살펴보세요.
            </p>
            <Link
              href="/apply"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#dfca9d]/60 bg-[#f8f0df] px-7 text-sm font-bold text-[#584051] transition hover:-translate-y-0.5 hover:bg-white"
            >
              ✦ 상담 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#dfd4c6]/70 px-5 py-9 text-center">
        <div className="text-[#b19667]">✦　☾　✦</div>
        <p className="mt-3 font-serif text-sm font-semibold text-[#65565e]">선녀사주</p>
        <p className="mt-1 text-[9px] tracking-[0.22em] text-[#aaa09a]">SEONNYEO SAJU</p>
        <p className="mt-4 text-[10px] text-[#b0a69f]">개인 사주 상담</p>
      </footer>
    </main>
  );
}
