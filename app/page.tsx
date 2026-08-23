import Link from "next/link";

import BrandLogo from "@/components/brand/BrandLogo";
import InstallAppButton from "@/components/pwa/InstallAppButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f4ef] text-[#2c2434]">

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5">

        <header className="flex items-center justify-between py-6">

          <BrandLogo compact />

          <Link
            href="/admin"
            className="rounded-full border border-[#e7ded5] bg-white/70 px-4 py-2 text-xs font-semibold text-[#756a7f] backdrop-blur"
          >
            관리자
          </Link>

        </header>


        <section className="flex flex-1 items-center py-10">

          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">

            <div>

              <div className="inline-flex rounded-full border border-[#e4d7ef] bg-[#f7efff] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#8c69aa]">
                당신의 사주에 담긴 이야기
              </div>

              <h1 className="mt-7 text-[2.7rem] font-bold leading-[1.15] tracking-[-0.065em] text-[#2c2434] sm:text-6xl">
                타고난 흐름을 읽고
                <br />
                당신의 이야기를
                <br />
                풀어드립니다.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#756d78] sm:text-lg">
                생년월일과 출생시간을 바탕으로 만세력을 확인하고,
                궁금한 내용을 선녀님이 직접 살펴봅니다.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/apply"
                  className="flex min-h-[56px] items-center justify-center rounded-2xl bg-[#342b3d] px-7 text-base font-bold text-white shadow-[0_12px_30px_rgba(52,43,61,0.16)] transition hover:-translate-y-0.5 hover:bg-[#463850]"
                >
                  사주 상담 신청하기
                </Link>

                <InstallAppButton />
                <a
                  href="#process"
                  className="flex min-h-[56px] items-center justify-center rounded-2xl border border-[#ddd4cd] bg-white px-7 text-base font-bold text-[#5f5566]"
                >
                  상담 과정 보기
                </a>

              </div>

            </div>


            <div className="relative mx-auto w-full max-w-md">

              <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-[#e9dcf6] blur-3xl" />
              <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-[#f0dfcc] blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-7 shadow-[0_25px_70px_rgba(75,58,84,0.12)] backdrop-blur">

                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-xs font-bold tracking-[0.16em] text-[#a185b9]">
                      FOUR PILLARS
                    </div>

                    <div className="mt-2 text-xl font-bold">
                      오늘의 사주 이야기
                    </div>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5eff8] text-xl">
                    
                  </div>

                </div>


                <div className="mt-7 grid grid-cols-4 gap-2">

                  {[
                    ["時", "시주"],
                    ["日", "일주"],
                    ["月", "월주"],
                    ["年", "년주"],
                  ].map(([hanja, label], index) => (

                    <div
                      key={label}
                      className={`rounded-2xl px-2 py-5 text-center ${
                        index === 1
                          ? "bg-[#efe4f7]"
                          : "bg-[#faf7f3]"
                      }`}
                    >
                      <div className="text-xs font-medium text-[#928897]">
                        {label}
                      </div>

                      <div className="mt-2 text-2xl font-bold text-[#362e3b]">
                        {hanja}
                      </div>
                    </div>

                  ))}

                </div>


                <div className="mt-6 rounded-2xl bg-[#faf7f3] p-5">

                  <div className="text-xs font-bold text-[#998d9e]">
                    선녀님의 풀이
                  </div>

                  <div className="mt-3 space-y-2">

                    <div className="h-2.5 w-full rounded-full bg-[#e9e1e8]" />
                    <div className="h-2.5 w-[88%] rounded-full bg-[#e9e1e8]" />
                    <div className="h-2.5 w-[72%] rounded-full bg-[#e9e1e8]" />

                  </div>

                </div>


                <div className="mt-5 flex items-center gap-3">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eee8e2]">
                    <div className="h-full w-[70%] rounded-full bg-[#9f7fba]" />
                  </div>

                  <div className="text-xs font-bold text-[#9f7fba]">
                    사주풀이
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        <section
          id="process"
          className="pb-14 pt-5"
        >

          <div className="rounded-[2rem] border border-[#e9e1da] bg-white/70 p-6 sm:p-8">

            <div className="text-sm font-bold text-[#896da2]">
              상담은 이렇게 진행됩니다
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <Step
                number="01"
                title="정보 입력"
                description="생년월일, 출생시간과 궁금한 내용을 입력합니다."
              />

              <Step
                number="02"
                title="만세력 확인"
                description="입력한 정보를 기준으로 사주 원국을 계산합니다."
              />

              <Step
                number="03"
                title="선녀님 풀이"
                description="만세력과 질문을 바탕으로 직접 풀이를 작성합니다."
              />

              <Step
                number="04"
                title="결과 확인"
                description="전용 링크와 PIN으로 모바일에서 결과를 확인합니다."
              />

            </div>

          </div>

        </section>


        <footer className="border-t border-[#e9e1da] py-6 text-center text-xs text-[#a1969e]">
          선녀사주  개인 사주 상담
        </footer>

      </div>

    </main>
  );
}


function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-[#faf7f3] p-5">

      <div className="text-xs font-bold text-[#aa90bd]">
        {number}
      </div>

      <div className="mt-3 font-bold text-[#342d39]">
        {title}
      </div>

      <p className="mt-2 text-sm leading-6 text-[#817781]">
        {description}
      </p>

    </div>
  );
}

