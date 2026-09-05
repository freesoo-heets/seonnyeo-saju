import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value, "utf8");
}

function ensureImport(content, importLine) {
  if (content.includes(importLine)) {
    return content;
  }

  return `${importLine}\n${content}`;
}

function findFunctionBodyStart(content, matchIndex) {
  const parenStart = content.indexOf("(", matchIndex);

  if (parenStart === -1) {
    return -1;
  }

  let depth = 0;
  let quote = null;
  let escape = false;

  for (let i = parenStart; i < content.length; i++) {
    const ch = content[i];

    if (quote) {
      if (escape) {
        escape = false;
        continue;
      }

      if (ch === "\\") {
        escape = true;
        continue;
      }

      if (ch === quote) {
        quote = null;
      }

      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "(") {
      depth++;
      continue;
    }

    if (ch === ")") {
      depth--;

      if (depth === 0) {
        for (let j = i + 1; j < content.length; j++) {
          if (content[j] === "{") {
            return j;
          }
        }
      }
    }
  }

  return -1;
}

function patchApiRoute(file) {
  let content = read(file);

  if (!content.includes("@/lib/auth/permissions")) {
    content = ensureImport(
      content,
      'import { requireAdmin } from "@/lib/auth/permissions";'
    );
  }

  const regex =
    /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(/g;

  const matches = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      method: match[1],
    });
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const item = matches[i];

    const bodyStart =
      findFunctionBodyStart(content, item.index);

    if (bodyStart === -1) {
      console.warn(
        `[WARN] Handler body not found: ${file} / ${item.method}`
      );

      continue;
    }

    const existingArea =
      content.slice(
        bodyStart,
        Math.min(bodyStart + 600, content.length)
      );

    if (existingArea.includes("requireAdmin()")) {
      continue;
    }

    const guard = `

  const adminAccess = await requireAdmin();

  if (!adminAccess) {
    return Response.json(
      {
        error: "관리자 권한이 필요합니다.",
      },
      {
        status: 403,
      }
    );
  }
`;

    content =
      content.slice(0, bodyStart + 1) +
      guard +
      content.slice(bodyStart + 1);
  }

  write(file, content);

  console.log(`[OK] API 권한 적용: ${path.relative(root, file)}`);
}

function patchAdminPage(file) {
  let content = read(file);

  if (content.includes("requireAdmin()")) {
    console.log(
      `[SKIP] 이미 관리자 검사 존재: ${path.relative(root, file)}`
    );

    return;
  }

  if (!content.includes("@/lib/auth/permissions")) {
    content = ensureImport(
      content,
      'import { requireAdmin } from "@/lib/auth/permissions";'
    );
  }

  if (!content.includes("redirect as authRedirect")) {
    content = ensureImport(
      content,
      'import { redirect as authRedirect } from "next/navigation";'
    );
  }

  const regex =
    /export\s+default\s+async\s+function\s+[A-Za-z0-9_]*\s*\(/;

  const match = regex.exec(content);

  if (!match) {
    console.warn(
      `[WARN] async page 함수를 찾지 못함: ${path.relative(root, file)}`
    );

    write(file, content);
    return;
  }

  const bodyStart =
    findFunctionBodyStart(content, match.index);

  if (bodyStart === -1) {
    console.warn(
      `[WARN] page body를 찾지 못함: ${path.relative(root, file)}`
    );

    write(file, content);
    return;
  }

  const guard = `

  const adminAccess = await requireAdmin();

  if (!adminAccess) {
    authRedirect("/auth/login");
  }
`;

  content =
    content.slice(0, bodyStart + 1) +
    guard +
    content.slice(bodyStart + 1);

  write(file, content);

  console.log(`[OK] 관리자 페이지 권한 적용: ${path.relative(root, file)}`);
}

function walk(dir) {
  const result = [];

  if (!fs.existsSync(dir)) {
    return result;
  }

  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...walk(full));
    } else {
      result.push(full);
    }
  }

  return result;
}


// --------------------------------------------------
// 관리자 페이지
// --------------------------------------------------

const adminPages = [
  path.join(root, "app", "admin", "page.tsx"),
  path.join(
    root,
    "app",
    "admin",
    "readings",
    "[id]",
    "page.tsx"
  ),
];

for (const file of adminPages) {
  if (fs.existsSync(file)) {
    patchAdminPage(file);
  }
}


// --------------------------------------------------
// 관리자 API 전체
// --------------------------------------------------

const adminApiDir =
  path.join(root, "app", "api", "admin");

const apiFiles =
  walk(adminApiDir).filter(
    (file) =>
      path.basename(file) === "route.ts"
  );

for (const file of apiFiles) {
  patchApiRoute(file);
}


// --------------------------------------------------
// metadataBase
// --------------------------------------------------

const layout =
  path.join(root, "app", "layout.tsx");

if (fs.existsSync(layout)) {
  let content = read(layout);

  if (!content.includes("metadataBase:")) {
    const pattern =
      /export\s+const\s+metadata\s*:\s*Metadata\s*=\s*\{/;

    if (pattern.test(content)) {
      content = content.replace(
        pattern,
        (match) =>
          `${match}
  metadataBase: new URL("https://seonnyeo-saju.vercel.app"),`
      );

      write(layout, content);

      console.log("[OK] metadataBase 적용");
    } else {
      console.warn(
        "[WARN] metadata 선언을 자동으로 찾지 못했습니다."
      );
    }
  } else {
    console.log("[SKIP] metadataBase 이미 존재");
  }
}

console.log("");
console.log("자동 코드 패치 완료");
