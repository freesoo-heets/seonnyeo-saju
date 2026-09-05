import fs from "node:fs";

const file =
  "app/admin/members/page.tsx";

if (!fs.existsSync(file)) {
  console.log(
    "[WARN] 회원관리 페이지가 없습니다."
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
    "회원관리 로그아웃"
  )
) {
  console.log(
    "[SKIP] 회원관리 로그아웃 이미 존재"
  );

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  process.exit(0);
}

const marker =
  '<Link\n            href="/admin"';

if (content.includes(marker)) {

  content =
    content.replace(
      marker,
      `<div className="flex gap-2">
          {/* 회원관리 로그아웃 */}

          <LogoutButton
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600"
          />

          <Link
            href="/admin"`
    );

  const closingMarker =
    `>
             상담관리로
          </Link>`;

  if (
    content.includes(
      closingMarker
    )
  ) {

    content =
      content.replace(
        closingMarker,
        `>
             상담관리로
          </Link>

        </div>`
      );
  }

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  console.log(
    "[OK] 회원관리 페이지 로그아웃 버튼 추가"
  );

} else {

  fs.writeFileSync(
    file,
    content,
    "utf8"
  );

  console.log(
    "[WARN] 회원관리 헤더 위치 자동 감지 실패"
  );
}
