import {
  calculateFourPillars,
  getHeavenlyStemElement,
  getEarthlyBranchElement,
  getHeavenlyStemYinYang,
  getEarthlyBranchYinYang,
  getTenGod,
  getBranchTenGod,
} from "manseryeok";

type Gender = "male" | "female";

export type SajuInput = {
  birthDate: string;
  birthHour?: number | null;
  birthMinute?: number | null;
  birthTimeUnknown?: boolean;

  calendarType: "solar" | "lunar";
  lunarLeapMonth?: boolean;

  gender: Gender;
};

const hanjaMap: Record<string, string> = {
  갑: "甲",
  을: "乙",
  병: "丙",
  정: "丁",
  무: "戊",
  기: "己",
  경: "庚",
  신: "辛",
  임: "壬",
  계: "癸",

  자: "子",
  축: "丑",
  인: "寅",
  묘: "卯",
  진: "辰",
  사: "巳",
  오: "午",
  미: "未",
  신: "申",
  유: "酉",
  술: "戌",
  해: "亥",
};

function pillarToHanja(
  pillar?: string | null
) {
  if (!pillar) {
    return null;
  }

  return pillar
    .split("")
    .map(
      (char) =>
        hanjaMap[char] ?? char
    )
    .join("");
}

function splitPillar(
  pillar: string
) {
  return {
    stem:
      pillar.charAt(0),

    branch:
      pillar.charAt(1),
  };
}

function getCurrentKoreanYear() {
  return Number(
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "Asia/Seoul",

        year:
          "numeric",
      }
    ).format(
      new Date()
    )
  );
}

function calculateWesternAge(
  birthDate: string
) {
  const today =
    new Date();

  const birth =
    new Date(
      `${birthDate}T00:00:00+09:00`
    );

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const currentMonth =
    today.getMonth();

  const birthMonth =
    birth.getMonth();

  if (
    currentMonth <
      birthMonth ||
    (
      currentMonth ===
        birthMonth &&
      today.getDate() <
        birth.getDate()
    )
  ) {
    age -= 1;
  }

  return Math.max(
    0,
    age
  );
}

function createYearFortunes(
  dayStem: string
) {
  const currentYear =
    getCurrentKoreanYear();

  const years = [];

  for (
    let year =
      currentYear - 3;
    year <=
      currentYear + 7;
    year++
  ) {
    /*
      세운의 연주는 입춘 기준이므로
      해당 연도의 입춘 이후인 6월 15일을
      계산용 대표일로 사용합니다.
    */

    const result =
      calculateFourPillars({
        year,
        month: 6,
        day: 15,
        hour: 12,
        minute: 0,

        dayBoundary:
          "midnight",
      });

    const object =
      result.toObject();

    const pillar =
      object.year;

    const {
      stem,
      branch,
    } =
      splitPillar(
        pillar
      );

    years.push({
      year,

      pillar,

      hanja:
        pillarToHanja(
          pillar
        ),

      stemTenGod:
        getTenGod(
          dayStem as any,
          stem as any
        ),

      branchTenGod:
        getBranchTenGod(
          dayStem as any,
          branch as any
        ),

      current:
        year ===
        currentYear,
    });
  }

  return {
    currentYear,
    years,
  };
}

export function calculateSaju(
  input: SajuInput
) {
  const [
    yearString,
    monthString,
    dayString,
  ] =
    input.birthDate.split(
      "-"
    );

  const year =
    Number(
      yearString
    );

  const month =
    Number(
      monthString
    );

  const day =
    Number(
      dayString
    );

  if (
    !year ||
    !month ||
    !day
  ) {
    throw new Error(
      "생년월일 형식이 올바르지 않습니다."
    );
  }

  /*
   * 출생시간을 모르는 경우
   * 년주/월주/일주만 계산하기 위해
   * 계산용 내부 시간으로 정오 사용.
   *
   * 화면/DB에는 시주를 저장하지 않습니다.
   */

  const hour =
    input.birthTimeUnknown
      ? 12
      : Number(
          input.birthHour ??
            0
        );

  const minute =
    input.birthTimeUnknown
      ? 0
      : Number(
          input.birthMinute ??
            0
        );

  const result =
    calculateFourPillars({
      year,
      month,
      day,
      hour,
      minute,

      isLunar:
        input.calendarType ===
        "lunar",

      isLeapMonth:
        input.calendarType ===
        "lunar"
          ? Boolean(
              input.lunarLeapMonth
            )
          : false,

      gender:
        input.gender,

      dayBoundary:
        "midnight",
    });

  const pillars =
    result.toObject();

  const yearPillar =
    pillars.year;

  const monthPillar =
    pillars.month;

  const dayPillar =
    pillars.day;

  const hourPillar =
    input.birthTimeUnknown
      ? null
      : pillars.hour;

  const allPillars = [
    yearPillar,
    monthPillar,
    dayPillar,

    ...(hourPillar
      ? [hourPillar]
      : []),
  ];

  const elementCounts: Record<
    "목" |
      "화" |
      "토" |
      "금" |
      "수",
    number
  > = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  for (
    const pillar of
      allPillars
  ) {
    const {
      stem,
      branch,
    } =
      splitPillar(
        pillar
      );

    const stemElement =
      getHeavenlyStemElement(
        stem as any
      );

    const branchElement =
      getEarthlyBranchElement(
        branch as any
      );

    if (
      stemElement in
      elementCounts
    ) {
      elementCounts[
        stemElement as keyof typeof elementCounts
      ] += 1;
    }

    if (
      branchElement in
      elementCounts
    ) {
      elementCounts[
        branchElement as keyof typeof elementCounts
      ] += 1;
    }
  }

  const dayStem =
    splitPillar(
      dayPillar
    ).stem;

  const dayBranch =
    splitPillar(
      dayPillar
    ).branch;

  const pillarDetails =
    Object.fromEntries(
      [
        [
          "year",
          yearPillar,
        ],

        [
          "month",
          monthPillar,
        ],

        [
          "day",
          dayPillar,
        ],

        [
          "hour",
          hourPillar,
        ],
      ].map(
        ([
          key,
          pillar,
        ]) => {
          if (!pillar) {
            return [
              key,
              null,
            ];
          }

          const {
            stem,
            branch,
          } =
            splitPillar(
              pillar
            );

          return [
            key,
            {
              korean:
                pillar,

              hanja:
                pillarToHanja(
                  pillar
                ),

              stem: {
                korean:
                  stem,

                hanja:
                  hanjaMap[
                    stem
                  ],

                element:
                  getHeavenlyStemElement(
                    stem as any
                  ),

                yinYang:
                  getHeavenlyStemYinYang(
                    stem as any
                  ),
              },

              branch: {
                korean:
                  branch,

                hanja:
                  hanjaMap[
                    branch
                  ],

                element:
                  getEarthlyBranchElement(
                    branch as any
                  ),

                yinYang:
                  getEarthlyBranchYinYang(
                    branch as any
                  ),
              },
            },
          ];
        }
      )
    );

  const tenGods =
    structuredClone(
      result.tenGods
    ) as any;

  if (
    input.birthTimeUnknown &&
    tenGods
  ) {
    tenGods.hour =
      null;
  }

  const luckPillars =
    result.luckPillars ??
    null;

  const currentAge =
    calculateWesternAge(
      input.birthDate
    );

  let currentLuckIndex =
    -1;

  if (
    luckPillars &&
    Array.isArray(
      luckPillars.pillars
    )
  ) {
    luckPillars.pillars.forEach(
      (
        item: any,
        index: number
      ) => {
        if (
          currentAge >=
          item.age
        ) {
          currentLuckIndex =
            index;
        }
      }
    );
  }

  return {
    pillars: {
      year:
        yearPillar,

      month:
        monthPillar,

      day:
        dayPillar,

      hour:
        hourPillar,
    },

    pillarDetails,

    hanja: {
      year:
        pillarToHanja(
          yearPillar
        ),

      month:
        pillarToHanja(
          monthPillar
        ),

      day:
        pillarToHanja(
          dayPillar
        ),

      hour:
        pillarToHanja(
          hourPillar
        ),
    },

    dayMaster: {
      korean:
        dayStem,

      hanja:
        hanjaMap[
          dayStem
        ] ??
        dayStem,

      element:
        getHeavenlyStemElement(
          dayStem as any
        ),

      yinYang:
        getHeavenlyStemYinYang(
          dayStem as any
        ),
    },

    dayBranch: {
      korean:
        dayBranch,

      hanja:
        hanjaMap[
          dayBranch
        ],
    },

    fiveElements:
      elementCounts,

    tenGods,

    voidBranches:
      result.voidBranches ??
      [],

    luckPillars:
      luckPillars
        ? {
            ...luckPillars,

            currentAge,

            currentLuckIndex,
          }
        : null,

    yearFortune:
      createYearFortunes(
        dayStem
      ),

    options: {
      dayBoundary:
        "midnight",

      trueSolarTime:
        false,

      birthTimeUnknown:
        Boolean(
          input.birthTimeUnknown
        ),
    },
  };
}
