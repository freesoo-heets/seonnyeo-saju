import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function MemberPage() {
  const current = await requireUser();

  if (!current) {
    redirect("/auth/login");
  }

  if (current.profile.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f1e8] px-4 py-6 text-[#3f343a] sm:px-6 sm:py-10">

      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-[340px] w-[340px] rounded-full bg-[#b69eb6]/15 blur-3xl" />

        <div className="absolute -right-24 top-[18%] h-[310px] w-[310px] rounded-full bg-[#d4bd89]/20 blur-3xl" />

        <div className="absolute bottom-[-120px] left-[20%] h-[300px] w-[300px] rounded-full bg-[#afc2b3]/15 blur-3xl" />

        <div className="absolute right-[7%] top-8 text-[130px] leading-none text-[#705168]/[0.035]">
          
        </div>

        <div className="absolute left-[5%] top-[43%] text-4xl text-[#a78d60]/[0.07]">
          
        </div>
      </div>


      <div className="relative mx-auto max-w-5xl">

        {/* 헤더 */}
        <header className="seonnyeo-card overflow-hidden">
          <div className="seonnyeo-gold-line" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9b182] bg-[#faf3e6] text-2xl text-[#73556c]">
                    
                  </div>

                  <div>
                    <p className="seonnyeo-eyebrow">
                      SEONNYEO SAJU
                    </p>

                    <h1 className="mt-1 font-serif text-2xl font-semibold">
                      선녀사주
                    </h1>
                  </div>
                </div>

                <p className="mt-5 text-sm text-[#8c8079]">
                  반가워요,
                </p>

                <p className="mt-1 font-serif text-2xl font-semibold text-[#4e3e48]">
                  {current.profile.nickname} 님
                </p>

                <p className="mt-2 text-sm leading-6 text-[#91857e]">
                  오늘도 당신의 사주에 담긴 이야기를 만나보세요.
                </p>
              </div>

              <LogoutButton
                className="rounded-2xl border border-[#d9cdbf] bg-[#f4ede4] px-4 py-2.5 text-sm font-semibold text-[#74665f] hover:bg-[#ebe2d8] disabled:opacity-50"
              />

            </div>
          </div>
        </header>


        {/* 메인 상담 신청 */}
        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#d7c7b3] bg-[#5d4256] text-white shadow-[0_18px_55px_rgba(71,46,64,0.16)]">

          <div className="relative p-6 sm:p-9">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />

              <div className="absolute -right-2 -top-6 h-40 w-40 rounded-full border border-white/10" />

              <div className="absolute bottom-[-55px] right-8 text-[150px] leading-none text-white/[0.035]">
                
              </div>

              <div className="absolute right-[38%] top-8 text-[#d7bd8a]/35">
                
              </div>
            </div>

            <div className="relative max-w-xl">

              <p className="text-[10px] font-bold tracking-[0.25em] text-[#dac697]">
                SAJU CONSULTATION
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                지금 마음속에 있는
                <br />
                이야기를 들려주세요
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/60">
                생년월일과 태어난 시간을 바탕으로 사주를 살펴보고,
                지금 가장 궁금한 고민을 함께 풀어갑니다.
              </p>

              <Link
                href="/apply"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#dfca9d]/60 bg-[#f8f0df] px-6 text-sm font-bold text-[#594151] shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
              >
                 사주 상담 신청하기
              </Link>

            </div>
          </div>
        </section>


        {/* 메뉴 */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2">

          <Link
            href="/apply"
            className="seonnyeo-card group p-5 transition hover:-translate-y-0.5 hover:border-[#bca67d]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfb990] bg-[#faf3e7] text-lg text-[#76576f]">
              
            </div>

            <h3 className="mt-4 font-serif text-lg font-semibold">
              새로운 상담
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8e827c]">
              생년월일과 고민을 입력하고
              새로운 사주 상담을 신청합니다.
            </p>

            <p className="mt-5 text-sm font-bold text-[#76586f]">
              상담 신청 
            </p>
          </Link>


          <Link
            href="/"
            className="seonnyeo-card group p-5 transition hover:-translate-y-0.5 hover:border-[#bca67d]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfb990] bg-[#faf3e7] text-lg text-[#76576f]">
              
            </div>

            <h3 className="mt-4 font-serif text-lg font-semibold">
              선녀사주 이야기
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8e827c]">
              선녀사주의 안내와
              상담 이용 방법을 확인합니다.
            </p>

            <p className="mt-5 text-sm font-bold text-[#76586f]">
              홈으로 
            </p>
          </Link>

        </section>


        {/* 이용 순서 */}
        <section className="seonnyeo-card mt-5 p-5 sm:p-7">

          <p className="seonnyeo-eyebrow">
            HOW IT WORKS
          </p>

          <h2 className="mt-1 font-serif text-xl font-semibold">
            선녀사주 이용 순서
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            <div className="rounded-[20px] border border-[#e5d9ca] bg-[#fbf7f1] p-4">
              <span className="font-serif text-xl text-[#b19260]">
                01
              </span>

              <p className="mt-3 font-semibold">
                사주 정보 입력
              </p>

              <p className="mt-2 text-xs leading-5 text-[#92867f]">
                생년월일, 태어난 시간과
                궁금한 내용을 작성합니다.
              </p>
            </div>


            <div className="rounded-[20px] border border-[#e5d9ca] bg-[#fbf7f1] p-4">
              <span className="font-serif text-xl text-[#b19260]">
                02
              </span>

              <p className="mt-3 font-semibold">
                선녀의 사주풀이
              </p>

              <p className="mt-2 text-xs leading-5 text-[#92867f]">
                입력된 사주와 고민을 바탕으로
                상담 내용을 풀이합니다.
              </p>
            </div>


            <div className="rounded-[20px] border border-[#e5d9ca] bg-[#fbf7f1] p-4">
              <span className="font-serif text-xl text-[#b19260]">
                03
              </span>

              <p className="mt-3 font-semibold">
                결과 확인
              </p>

              <p className="mt-2 text-xs leading-5 text-[#92867f]">
                전달받은 결과 링크와 PIN으로
                사주풀이를 확인합니다.
              </p>
            </div>

          </div>

        </section>


        <footer className="py-10 text-center">

          <div className="text-[#b19667]">
            　　
          </div>

          <p className="mt-3 text-[10px] tracking-[0.22em] text-[#aa9e97]">
            SEONNYEO SAJU
          </p>

        </footer>

      </div>

    </main>
  );
}