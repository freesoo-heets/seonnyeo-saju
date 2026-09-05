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
  fs.readFileSync(
    file,
    "utf8"
  );

if (
  !content.includes(
    "@/components/auth/LogoutButton"
  )
) {
  content =
    'import { LogoutButton } from "@/components/auth/LogoutButton";\n' +
    content;
}

if (
  content.includes(
    'className="seonnyeo-admin-logout"'
  )
) {
  console.log(
    "[SKIP] 관리자 로그아웃 버튼 이미 존재"
  );

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  process.exit(0);
}

const mainPattern =
  /(<main[^>]*>)/;

if (mainPattern.test(content)) {

  content =
    content.replace(
      mainPattern,
      `$1
      <div className="seonnyeo-admin-logout mx-auto mb-4 flex max-w-6xl justify-end px-1">
        <LogoutButton
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 shadow-sm disabled:opacity-50"
        />
      </div>`
    );

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  console.log(
    "[OK] 관리자 페이지 로그아웃 버튼 추가"
  );

} else {

  console.log(
    "[WARN] 관리자 page.tsx main 태그를 찾지 못했습니다."
  );
}
