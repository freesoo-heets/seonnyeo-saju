import { getTenGod } from "manseryeok";

const branches = [
  "자", "축", "인", "묘", "진", "사",
  "오", "미", "신", "유", "술", "해",
];

const stages = [
  "장생",
  "목욕",
  "관대",
  "건록",
  "제왕",
  "쇠",
  "병",
  "사",
  "묘",
  "절",
  "태",
  "양",
];

const yangStems = [
  "갑",
  "병",
  "무",
  "경",
  "임",
];

const twelveStart: Record<string, string> = {
  갑: "해",
  을: "오",
  병: "인",
  정: "유",
  무: "인",
  기: "유",
  경: "사",
  신: "자",
  임: "신",
  계: "묘",
};


/*
 * 지장간
 *
 * 배열 순서는:
 * 여기  중기  정기
 *
 * 한 글자만 있는 지지는 정기만 존재합니다.
 */
const hiddenStemTable: Record<string, string[]> = {
  자: ["계"],
  축: ["계", "신", "기"],
  인: ["무", "병", "갑"],
  묘: ["을"],
  진: ["을", "계", "무"],
  사: ["무", "경", "병"],
  오: ["병", "기", "정"],
  미: ["정", "을", "기"],
  신: ["무", "임", "경"],
  유: ["신"],
  술: ["신", "정", "무"],
  해: ["무", "갑", "임"],
};


const cheonEulTable: Record<string, string[]> = {
  갑: ["축", "미"],
  무: ["축", "미"],
  경: ["축", "미"],

  을: ["자", "신"],
  기: ["자", "신"],

  병: ["유", "해"],
  정: ["유", "해"],

  신: ["인", "오"],

  임: ["사", "묘"],
  계: ["사", "묘"],
};


const munChangTable: Record<string, string[]> = {
  갑: ["사"],
  을: ["오"],
  병: ["신"],
  정: ["유"],
  무: ["신"],
  기: ["유"],
  경: ["해"],
  신: ["자"],
  임: ["인"],
  계: ["묘"],
};


const munGokTable: Record<string, string[]> = {
  갑: ["해"],
  을: ["자"],
  병: ["인"],
  정: ["묘"],
  무: ["인"],
  기: ["묘"],
  경: ["사"],
  신: ["오"],
  임: ["신"],
  계: ["유"],
};


/*
 * 삼합국 기준
 *
 * 신자진  도화 유 / 역마 인 / 화개 진
 * 인오술  도화 묘 / 역마 신 / 화개 술
 * 해묘미  도화 자 / 역마 사 / 화개 미
 * 사유축  도화 오 / 역마 해 / 화개 축
 */
function getGroupTarget(
  baseBranch: string,
  type: "peach" | "travel" | "hwagae"
) {
  if (
    ["신", "자", "진"].includes(baseBranch)
  ) {
    if (type === "peach") return "유";
    if (type === "travel") return "인";
    return "진";
  }

  if (
    ["인", "오", "술"].includes(baseBranch)
  ) {
    if (type === "peach") return "묘";
    if (type === "travel") return "신";
    return "술";
  }

  if (
    ["해", "묘", "미"].includes(baseBranch)
  ) {
    if (type === "peach") return "자";
    if (type === "travel") return "사";
    return "미";
  }

  if (
    ["사", "유", "축"].includes(baseBranch)
  ) {
    if (type === "peach") return "오";
    if (type === "travel") return "해";
    return "축";
  }

  return null;
}


function splitPillar(pillar?: string | null) {
  if (!pillar) {
    return null;
  }

  return {
    stem: pillar.charAt(0),
    branch: pillar.charAt(1),
  };
}


function getTwelveStage(
  dayStem: string,
  targetBranch: string
) {
  const startBranch =
    twelveStart[dayStem];

  const startIndex =
    branches.indexOf(startBranch);

  const targetIndex =
    branches.indexOf(targetBranch);

  if (
    startIndex < 0 ||
    targetIndex < 0
  ) {
    return null;
  }

  const isForward =
    yangStems.includes(dayStem);

  let offset: number;

  if (isForward) {
    offset =
      (targetIndex - startIndex + 12) % 12;
  } else {
    offset =
      (startIndex - targetIndex + 12) % 12;
  }

  return stages[offset];
}


function findBranchMatches(
  pillarBranches: Record<string, string | null>,
  targets: string[]
) {
  const matches: string[] = [];

  for (
    const [position, branch]
    of Object.entries(pillarBranches)
  ) {
    if (
      branch &&
      targets.includes(branch)
    ) {
      matches.push(position);
    }
  }

  return matches;
}


function analyzeSpecialStar(
  pillarBranches: Record<string, string | null>,
  targets: string[]
) {
  return {
    targets,
    matches:
      findBranchMatches(
        pillarBranches,
        targets
      ),
  };
}


export function analyzeTraditionalSaju({
  yearPillar,
  monthPillar,
  dayPillar,
  hourPillar,
}: {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar?: string | null;
}) {

  const year =
    splitPillar(yearPillar);

  const month =
    splitPillar(monthPillar);

  const day =
    splitPillar(dayPillar);

  const hour =
    splitPillar(hourPillar);

  if (
    !year ||
    !month ||
    !day
  ) {
    throw new Error(
      "사주 원국 정보가 부족합니다."
    );
  }

  const safeYear = year;
  const safeMonth = month;
  const safeDay = day;

  const dayStem =
    safeDay.stem;

  const pillarBranches: Record<
    string,
    string | null
  > = {
    year:
      safeYear.branch,

    month:
      safeMonth.branch,

    day:
      safeDay.branch,

    hour:
      hour?.branch ?? null,
  };


  /*
   * 십이운성
   */
  const twelveStates = {
    year:
      getTwelveStage(
        dayStem,
        safeYear.branch
      ),

    month:
      getTwelveStage(
        dayStem,
        safeMonth.branch
      ),

    day:
      getTwelveStage(
        dayStem,
        safeDay.branch
      ),

    hour:
      hour
        ? getTwelveStage(
            dayStem,
            hour.branch
          )
        : null,
  };


  /*
   * 지장간 + 지장간 십신
   */
  function hiddenStemInfo(
    branch: string
  ) {
    const stems =
      hiddenStemTable[branch] ?? [];

    return stems.map(
      (
        stem,
        index
      ) => ({
        stem,

        role:
          stems.length === 1
            ? "정기"
            : index ===
                stems.length - 1
              ? "정기"
              : index ===
                  stems.length - 2
                ? "중기"
                : "여기",

        tenGod:
          getTenGod(
            dayStem as any,
            stem as any
          ),
      })
    );
  }

  const hiddenStems = {
    year:
      hiddenStemInfo(
        safeYear.branch
      ),

    month:
      hiddenStemInfo(
        safeMonth.branch
      ),

    day:
      hiddenStemInfo(
        safeDay.branch
      ),

    hour:
      hour
        ? hiddenStemInfo(
            hour.branch
          )
        : [],
  };


  /*
   * 귀인
   */

  const cheonEulTargets =
    cheonEulTable[dayStem] ?? [];

  const munChangTargets =
    munChangTable[dayStem] ?? [];

  const munGokTargets =
    munGokTable[dayStem] ?? [];


  const nobleman = {
    cheonEul:
      analyzeSpecialStar(
        pillarBranches,
        cheonEulTargets
      ),

    munChang:
      analyzeSpecialStar(
        pillarBranches,
        munChangTargets
      ),

    munGok:
      analyzeSpecialStar(
        pillarBranches,
        munGokTargets
      ),
  };


  /*
   * 도화 / 역마 / 화개
   *
   * 년지 기준과 일지 기준을 모두 계산
   */
  function makeSamHapStar(
    type:
      | "peach"
      | "travel"
      | "hwagae"
  ) {
    const yearTarget =
      getGroupTarget(
        safeYear.branch,
        type
      );

    const dayTarget =
      getGroupTarget(
        safeDay.branch,
        type
      );

    const targets =
      Array.from(
        new Set(
          [
            yearTarget,
            dayTarget,
          ].filter(
            Boolean
          ) as string[]
        )
      );

    return {
      yearBase:
        yearTarget,

      dayBase:
        dayTarget,

      targets,

      matches:
        findBranchMatches(
          pillarBranches,
          targets
        ),
    };
  }


  const sinsal = {
    peachBlossom:
      makeSamHapStar(
        "peach"
      ),

    travelHorse:
      makeSamHapStar(
        "travel"
      ),

    hwagae:
      makeSamHapStar(
        "hwagae"
      ),
  };


  return {
    twelveStates,

    hiddenStems,

    nobleman,

    sinsal,

    standard: {
      twelveStates:
        "일간 장생지 기준, 양간 순행음간 역행",

      hiddenStems:
        "통상 지장간 여기중기정기 표",

      nobleman:
        "일간 기준",

      sinsal:
        "년지 및 일지 삼합국 기준",
    },
  };
}

