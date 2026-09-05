import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type RecoveryBody = {
  token?: string;
  password?: string;
};

const TARGET_NICKNAME = "퐁당";

export async function POST(request: Request) {
  // 1회성 복구용 API입니다. 복구가 끝나면 이 파일/폴더를 반드시 삭제하세요.
  const configuredToken = process.env.ADMIN_RECOVERY_TOKEN;

  if (!configuredToken || configuredToken.length < 24) {
    return NextResponse.json(
      { error: "ADMIN_RECOVERY_TOKEN이 안전하게 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  let body: RecoveryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (typeof body.token !== "string" || body.token !== configuredToken) {
    return NextResponse.json({ error: "복구 권한이 없습니다." }, { status: 403 });
  }

  if (
    typeof body.password !== "string" ||
    body.password.length < 8 ||
    body.password.length > 128
  ) {
    return NextResponse.json(
      { error: "새 비밀번호는 8자 이상 128자 이하로 입력해주세요." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, nickname, role")
    .eq("nickname", TARGET_NICKNAME)
    .eq("role", "admin")
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "복구 대상 관리자 계정을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const { data: authUser, error: authLookupError } =
    await admin.auth.admin.getUserById(profile.id);

  if (authLookupError || !authUser.user) {
    return NextResponse.json(
      { error: "복구 대상의 인증 계정을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(profile.id, {
    password: body.password,
  });

  if (updateError) {
    console.error("[admin-recovery] password update error:", updateError);
    return NextResponse.json(
      { error: "관리자 비밀번호를 변경하지 못했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "퐁당 관리자 비밀번호가 변경되었습니다. 이제 복구 API를 삭제해주세요.",
  });
}
