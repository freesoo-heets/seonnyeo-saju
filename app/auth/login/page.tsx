import Link from "next/link";

import LoginForm from "@/components/login-form";

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5eee5] px-4 py-8 text-[#352d32] sm:px-6">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-28 h-[360px] w-[360px] rounded-full bg-[#b99fba]/20 blur-3xl" />

        <div className="absolute -right-24 top-[20%] h-[320px] w-[320px] rounded-full bg-[#d6be8a]/20 blur-3xl" />

        <div className="absolute bottom-[-140px] left-[20%] h-[360px] w-[360px] rounded-full bg-[#b8c7ba]/15 blur-3xl" />

        <div className="absolute right-[7%] top-8 text-[150px] leading-none text-[#705168]/[0.035]">
          
        </div>

        <div className="absolute left-[8%] top-[32%] text-4xl text-[#a48b62]/[0.08]">
          
        </div>

        <div className="absolute bottom-[14%] right-[12%] text-3xl text-[#7d6378]/[0.07]">
          
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-[#d9cab6] bg-[rgba(255,252,247,0.90)] shadow-[0_30px_80px_rgba(61,41,54,0.12)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]">

          {/* 좌측 브랜드 영역 */}
          <section className="relative hidden overflow-hidden bg-[#594052] p-10 text-white md:flex md:flex-col md:justify-between lg:p-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />

              <div className="absolute bottom-16 left-10 text-[150px] leading-none text-white/[0.035]">
                
              </div>

              <div className="absolute right-12 top-1/3 text-2xl text-[#d8be8d]/40">
                
              </div>

              <div className="absolute bottom-16 right-16 text-lg text-[#d8be8d]/30">
                
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6bd8c]/50 bg-white/5 text-2xl text-[#e0c994]">
                  
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.28em] text-[#dcc99e]">
                    SEONNYEO SAJU
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    당신의 사주에 담긴 이야기
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <p className="text-sm tracking-[0.18em] text-[#d8c69e]">
                   인연을 읽고, 운을 이야기하다
                </p>

                <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.25] tracking-tight">
                  선녀의 시선으로
                  <br />
                  만나는 나의 사주
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                  태어난 순간에 담긴 흐름을 살펴보고,
                  현재의 고민과 앞으로의 이야기를
                  차분하게 풀어드립니다.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="mb-4 h-px w-full bg-gradient-to-r from-[#d8c08e]/50 to-transparent" />

              <p className="font-serif text-sm text-[#e1d6c4]">
                天  地  人
              </p>

              <p className="mt-2 text-xs tracking-[0.18em] text-white/35">
                SEONNYEO SAJU
              </p>
            </div>
          </section>

          {/* 로그인 영역 */}
          <section className="p-5 sm:p-8 lg:p-12">
            {/* 모바일 브랜드 */}
            <div className="mb-8 text-center md:hidden">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#cbb48b] bg-[#faf3e7] text-2xl text-[#75566e] shadow-sm">
                
              </div>

              <p className="mt-4 text-[10px] font-semibold tracking-[0.28em] text-[#a58b60]">
                SEONNYEO SAJU
              </p>

              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#493944]">
                선녀사주
              </h1>
            </div>

            <div className="mb-7">
              <p className="hidden text-[10px] font-semibold tracking-[0.24em] text-[#aa8e61] md:block">
                WELCOME
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#493944] sm:text-3xl">
                반가운 인연이에요
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8b7f79]">
                닉네임과 비밀번호로 선녀사주에 들어오세요.
              </p>
            </div>

            {next?.startsWith("/apply") ? (
              <div className="mb-5 rounded-2xl border border-[#dfcfad] bg-[#fbf4e6] px-4 py-3 text-sm leading-6 text-[#806b45]">
                상담 신청은 로그인한 회원만 이용할 수 있습니다. 로그인 후 상담 신청 화면으로 바로 이동합니다.
              </div>
            ) : null}

            <LoginForm nextPath={next} />

            <div className="mt-7 flex items-center justify-center gap-3 text-xs text-[#9b8f88]">
              <span className="h-px w-8 bg-[#ded2c4]" />
              <span></span>
              <span className="h-px w-8 bg-[#ded2c4]" />
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/"
                className="text-xs font-semibold text-[#7f6b75] transition hover:text-[#573e51]"
              >
                 선녀사주 홈으로
              </Link>
            </div>

            <p className="mt-8 text-center text-[10px] leading-5 text-[#b0a39c]">
              개인정보 보호를 위해 비밀번호는
              다른 서비스와 다르게 설정해주세요.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}