import fs from "node:fs";

const file =
  "app/admin/page.tsx";

if (!fs.existsSync(file)) {
  console.log(
    "[WARN] app/admin/page.tsx 없음"
  );

  process.exit(0);
}

let content =
  fs.readFileSync(file, "utf8");

if (
  content.includes('href="/admin/members"')
) {
  console.log(
    "[SKIP] 회원관리 링크가 이미 있습니다."
  );

  process.exit(0);
}

if (
  !content.includes(
    'import Link from "next/link";'
  )
) {
  content =
    'import Link from "next/link";\n' +
    content;
}

/*
 * main 태그 바로 뒤에 버튼 삽입
 */
const mainPattern =
  /(<main[^>]*>)/;

if (mainPattern.test(content)) {
  content = content.replace(
    mainPattern,
    `$1
      <div className="mx-auto mb-4 flex max-w-6xl justify-end px-1">
        <Link
          href="/admin/members"
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 shadow-sm"
        >
          회원관리
        </Link>
      </div>`
  );

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  console.log(
    "[OK] 관리자 메인에 회원관리 버튼 추가"
  );
} else {
  console.log(
    "[WARN] main 태그를 찾지 못했습니다."
  );
}
