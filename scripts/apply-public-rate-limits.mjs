import fs from "node:fs";

function addImport(
  content
) {

  if (
    content.includes(
      "@/lib/security/rate-limit"
    )
  ) {
    return content;
  }

  return `
import {
  checkRateLimit,
  getClientIp,
  hashRateLimitValue,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
${content}`;
}


function findFunctionBodyStart(
  content,
  matchIndex
) {

  const paren =
    content.indexOf(
      "(",
      matchIndex
    );

  if (paren === -1) {
    return -1;
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (
    let i = paren;
    i < content.length;
    i++
  ) {

    const ch =
      content[i];

    if (quote) {

      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        quote = null;
      }

      continue;
    }

    if (
      ch === '"' ||
      ch === "'" ||
      ch === "`"
    ) {
      quote = ch;
      continue;
    }

    if (ch === "(") {
      depth++;
    }

    if (ch === ")") {

      depth--;

      if (depth === 0) {

        for (
          let j = i + 1;
          j < content.length;
          j++
        ) {

          if (
            content[j] === "{"
          ) {
            return j;
          }
        }
      }
    }
  }

  return -1;
}


function patchHandler({
  file,
  method,
  marker,
  guard,
}) {

  if (
    !fs.existsSync(file)
  ) {
    console.log(
      `[WARN] 파일 없음: ${file}`
    );

    return;
  }

  let content =
    fs.readFileSync(
      file,
      "utf8"
    );

  if (
    content.includes(
      marker
    )
  ) {
    console.log(
      `[SKIP] 이미 적용됨: ${file}`
    );

    return;
  }

  content =
    addImport(
      content
    );

  const regex =
    new RegExp(
      `export\\s+async\\s+function\\s+${method}\\s*\\(`
    );

  const match =
    regex.exec(
      content
    );

  if (!match) {

    console.log(
      `[WARN] ${method} 핸들러를 찾지 못함: ${file}`
    );

    fs.writeFileSync(
      file,
      content,
      "utf8"
    );

    return;
  }

  const start =
    findFunctionBodyStart(
      content,
      match.index
    );

  if (start === -1) {
    console.log(
      `[WARN] 함수 본문을 찾지 못함: ${file}`
    );

    return;
  }

  content =
    content.slice(
      0,
      start + 1
    ) +
    guard +
    content.slice(
      start + 1
    );

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  console.log(
    `[OK] Rate Limit 적용: ${file}`
  );
}


/*
 * ==========================================================
 * 상담 신청
 *
 * IP 기준 10분 5건
 * ==========================================================
 */

patchHandler({
  file:
    "app/api/readings/route.ts",

  method:
    "POST",

  marker:
    "SECURITY_READING_RATE_LIMIT",

  guard:
`

  // SECURITY_READING_RATE_LIMIT
  const readingIp = getClientIp(request);

  const readingIpHash =
    hashRateLimitValue(readingIp);

  const readingLimit =
    await checkRateLimit({
      key:
        \`reading:ip:\${readingIpHash}\`,
      limit: 5,
      windowSeconds: 600,
    });

  if (!readingLimit.allowed) {
    return rateLimitResponse(
      "상담 신청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      readingLimit.resetAt
    );
  }

`,
});


/*
 * ==========================================================
 * 결과 PIN 검증
 *
 * IP + 결과토큰 기준
 * 10분 8회
 * ==========================================================
 */

patchHandler({
  file:
    "app/api/result/[token]/verify/route.ts",

  method:
    "POST",

  marker:
    "SECURITY_RESULT_PIN_RATE_LIMIT",

  guard:
`

  // SECURITY_RESULT_PIN_RATE_LIMIT
  const pinIp =
    getClientIp(request);

  const pinIpHash =
    hashRateLimitValue(
      pinIp
    );

  let pinToken =
    "unknown";

  try {

    const contextAny =
      arguments[1];

    if (
      contextAny?.params
    ) {

      const params =
        await contextAny.params;

      if (
        params?.token
      ) {
        pinToken =
          String(
            params.token
          );
      }
    }

  } catch {
    // token을 가져오지 못하면
    // IP 기준으로만 제한합니다.
  }

  const pinTokenHash =
    hashRateLimitValue(
      pinToken
    );

  const pinLimit =
    await checkRateLimit({
      key:
        \`result-pin:\${pinTokenHash}:\${pinIpHash}\`,
      limit: 8,
      windowSeconds: 600,
    });

  if (!pinLimit.allowed) {
    return rateLimitResponse(
      "비밀번호 확인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
      pinLimit.resetAt
    );
  }

`,
});

