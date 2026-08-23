"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

function isIOS() {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(
    window.navigator.userAgent
  );
}

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  const standaloneMedia =
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

  const iosStandalone =
    (window.navigator as Navigator & {
      standalone?: boolean;
    }).standalone === true;

  return standaloneMedia || iosStandalone;
}

export default function InstallAppButton() {
  const [
    installEvent,
    setInstallEvent,
  ] =
    useState<BeforeInstallPromptEvent | null>(
      null
    );

  const [
    installed,
    setInstalled,
  ] =
    useState(false);

  const [
    showIOSGuide,
    setShowIOSGuide,
  ] =
    useState(false);

  const [
    showAndroidGuide,
    setShowAndroidGuide,
  ] =
    useState(false);

  useEffect(() => {
    setInstalled(
      isStandalone()
    );

    function handleBeforeInstallPrompt(
      event: Event
    ) {
      event.preventDefault();

      setInstallEvent(
        event as BeforeInstallPromptEvent
      );
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallEvent(null);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);


  async function install() {
    if (installed) {
      return;
    }

    if (installEvent) {
      try {
        await installEvent.prompt();

        const choice =
          await installEvent.userChoice;

        if (
          choice.outcome === "accepted"
        ) {
          setInstalled(true);
        }

        setInstallEvent(null);

        return;
      } catch {
        // fallback below
      }
    }

    if (isIOS()) {
      setShowIOSGuide(true);

      return;
    }

    setShowAndroidGuide(true);
  }


  if (installed) {
    return (
      <div className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 text-sm font-bold text-green-700">
        <span>
          
        </span>

        <span>
          앱으로 설치됨
        </span>
      </div>
    );
  }


  return (
    <>
      <button
        type="button"
        onClick={install}
        className="flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-[#d8cce1] bg-[#f5eef9] px-7 text-base font-bold text-[#72578a] transition hover:bg-[#eee3f5]"
      >
        <span className="text-xl">
          
        </span>

        <span>
          앱 설치
        </span>
      </button>


      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="홈 화면 추가 안내"
        >

          <div className="w-full max-w-sm rounded-[1.75rem] bg-white p-6 shadow-xl">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="text-sm font-bold text-purple-600">
                  선녀사주 설치
                </div>

                <h2 className="mt-1 text-xl font-bold text-neutral-900">
                  홈 화면에 추가해주세요
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowIOSGuide(
                    false
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
                aria-label="닫기"
              >
                
              </button>

            </div>


            <div className="mt-6 space-y-4">

              <GuideStep
                number="1"
                text="Safari 하단의 공유 버튼을 누릅니다."
              />

              <GuideStep
                number="2"
                text="'홈 화면에 추가'를 선택합니다."
              />

              <GuideStep
                number="3"
                text="오른쪽 위의 '추가'를 누릅니다."
              />

            </div>


            <div className="mt-6 rounded-2xl bg-[#faf7f2] p-4 text-sm leading-6 text-neutral-600">
              설치가 완료되면 홈 화면에서
              <strong className="mx-1 text-neutral-900">
                선녀사주
              </strong>
              아이콘을 눌러 앱처럼 사용할 수 있습니다.
            </div>


            <button
              type="button"
              onClick={() =>
                setShowIOSGuide(
                  false
                )
              }
              className="mt-5 w-full rounded-2xl bg-neutral-900 py-3.5 font-bold text-white"
            >
              확인
            </button>

          </div>

        </div>
      )}


      {showAndroidGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
        >

          <div className="w-full max-w-sm rounded-[1.75rem] bg-white p-6 shadow-xl">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="text-sm font-bold text-purple-600">
                  선녀사주 설치
                </div>

                <h2 className="mt-1 text-xl font-bold">
                  홈 화면에 추가
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowAndroidGuide(
                    false
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
              >
                
              </button>

            </div>


            <div className="mt-6 space-y-4">

              <GuideStep
                number="1"
                text="브라우저 오른쪽 위 메뉴()를 누릅니다."
              />

              <GuideStep
                number="2"
                text="'앱 설치' 또는 '홈 화면에 추가'를 선택합니다."
              />

              <GuideStep
                number="3"
                text="'설치'를 눌러 완료합니다."
              />

            </div>


            <button
              type="button"
              onClick={() =>
                setShowAndroidGuide(
                  false
                )
              }
              className="mt-6 w-full rounded-2xl bg-neutral-900 py-3.5 font-bold text-white"
            >
              확인
            </button>

          </div>

        </div>
      )}

    </>
  );
}


function GuideStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-purple-700">
        {number}
      </div>

      <div className="pt-1.5 text-sm leading-6 text-neutral-700">
        {text}
      </div>

    </div>
  );
}
