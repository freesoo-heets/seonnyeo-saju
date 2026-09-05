import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type PatchBody = {
  nickname?: string;
  password?: string;
  role?: "user" | "admin";
};

function cleanNickname(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validRole(value: unknown): value is "user" | "admin" {
  return value === "user" || value === "admin";
}

async function countAdmins() {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");

  if (error) throw error;
  return count ?? 0;
}

export async function PATCH(request: Request, context: RouteContext) {
  const current = await requireAdmin();

  if (!current) {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { id } = await context.params;

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: target, error: targetError } = await admin
    .from("profiles")
    .select("id, nickname, role")
    .eq("id", id)
    .maybeSingle();

  if (targetError || !target) {
    return NextResponse.json({ error: "회원을 찾을 수 없습니다." }, { status: 404 });
  }

  const updates: { nickname?: string; role?: "user" | "admin" } = {};

  if (body.nickname !== undefined) {
    const nickname = cleanNickname(body.nickname);

    if (nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { error: "닉네임은 2자 이상 20자 이하로 입력해주세요." },
        { status: 400 },
      );
    }

    const { data: duplicate, error: duplicateError } = await admin
      .from("profiles")
      .select("id")
      .ilike("nickname", nickname)
      .neq("id", id)
      .maybeSingle();

    if (duplicateError) {
      return NextResponse.json({ error: "닉네임을 확인하지 못했습니다." }, { status: 500 });
    }

    if (duplicate) {
      return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
    }

    updates.nickname = nickname;
  }

  if (body.role !== undefined) {
    if (!validRole(body.role)) {
      return NextResponse.json({ error: "올바르지 않은 권한입니다." }, { status: 400 });
    }

    if (id === current.user.id && body.role !== "admin") {
      return NextResponse.json(
        { error: "현재 로그인한 관리자 자신의 권한은 해제할 수 없습니다." },
        { status: 400 },
      );
    }

    if (target.role === "admin" && body.role === "user") {
      const adminCount = await countAdmins();
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "마지막 관리자 권한은 해제할 수 없습니다." },
          { status: 400 },
        );
      }
    }

    updates.role = body.role;
  }

  if (body.password !== undefined) {
    if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 128) {
      return NextResponse.json(
        { error: "비밀번호는 8자 이상 128자 이하로 입력해주세요." },
        { status: 400 },
      );
    }

    const { error: passwordError } = await admin.auth.admin.updateUserById(id, {
      password: body.password,
    });

    if (passwordError) {
      console.error("[admin-members] password update error:", passwordError);
      return NextResponse.json({ error: "비밀번호를 변경하지 못했습니다." }, { status: 500 });
    }
  }

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await admin
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      console.error("[admin-members] profile update error:", updateError);
      return NextResponse.json({ error: "회원 정보를 변경하지 못했습니다." }, { status: 500 });
    }

    if (updates.nickname) {
      await admin.auth.admin.updateUserById(id, {
        user_metadata: { nickname: updates.nickname },
      });
    }
  }

  const { data: member } = await admin
    .from("profiles")
    .select("id, nickname, role, created_at")
    .eq("id", id)
    .single();

  return NextResponse.json({ success: true, member });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const current = await requireAdmin();

  if (!current) {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { id } = await context.params;

  if (id === current.user.id) {
    return NextResponse.json(
      { error: "현재 로그인한 관리자 계정은 삭제할 수 없습니다." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: target, error: targetError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", id)
    .maybeSingle();

  if (targetError || !target) {
    return NextResponse.json({ error: "회원을 찾을 수 없습니다." }, { status: 404 });
  }

  if (target.role === "admin") {
    const adminCount = await countAdmins();
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "마지막 관리자 계정은 삭제할 수 없습니다." },
        { status: 400 },
      );
    }
  }

  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    console.error("[admin-members] delete error:", error);
    return NextResponse.json({ error: "회원 계정을 삭제하지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
