import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

function cleanNickname(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function validRole(value: unknown): value is "user" | "admin" {
  return value === "user" || value === "admin";
}

function createInternalEmail() {
  return `u_${crypto.randomUUID()}@users.invalid`;
}

export async function GET() {
  const current = await requireAdmin();

  if (!current) {
    return NextResponse.json(
      {
        error: "관리자 권한이 필요합니다.",
      },
      {
        status: 403,
      }
    );
  }

  const admin = createAdminClient();

  const {
    data,
    error,
  } = await admin
    .from("profiles")
    .select("id, nickname, role, created_at")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "[admin-members] list error:",
      error
    );

    return NextResponse.json(
      {
        error: "회원 목록을 불러오지 못했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    members: data ?? [],
    currentUserId: current.user.id,
  });
}

export async function POST(request: Request) {
  const current = await requireAdmin();

  if (!current) {
    return NextResponse.json(
      {
        error: "관리자 권한이 필요합니다.",
      },
      {
        status: 403,
      }
    );
  }

  let body: {
    nickname?: string;
    password?: string;
    role?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "잘못된 요청입니다.",
      },
      {
        status: 400,
      }
    );
  }

  const nickname = cleanNickname(body.nickname);
  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  const role =
    validRole(body.role)
      ? body.role
      : "user";

  if (nickname.length < 2 || nickname.length > 20) {
    return NextResponse.json(
      {
        error: "닉네임은 2자 이상 20자 이하로 입력해주세요.",
      },
      {
        status: 400,
      }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        error: "비밀번호는 8자 이상 입력해주세요.",
      },
      {
        status: 400,
      }
    );
  }

  const admin = createAdminClient();

  const {
    data: duplicate,
    error: duplicateError,
  } = await admin
    .from("profiles")
    .select("id")
    .ilike("nickname", nickname)
    .maybeSingle();

  if (duplicateError) {
    console.error(
      "[admin-members] duplicate check error:",
      duplicateError
    );

    return NextResponse.json(
      {
        error: "닉네임을 확인하지 못했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  if (duplicate) {
    return NextResponse.json(
      {
        error: "이미 사용 중인 닉네임입니다.",
      },
      {
        status: 409,
      }
    );
  }

  const internalEmail = createInternalEmail();

  const {
    data: createdAuth,
    error: authError,
  } = await admin.auth.admin.createUser({
    email: internalEmail,
    password,
    email_confirm: true,
    user_metadata: {
      nickname,
    },
  });

  if (authError || !createdAuth.user) {
    console.error(
      "[admin-members] create auth error:",
      authError
    );

    return NextResponse.json(
      {
        error: "회원 계정을 생성하지 못했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  const userId = createdAuth.user.id;

  const {
    data: profile,
    error: profileError,
  } = await admin
    .from("profiles")
    .insert({
      id: userId,
      nickname,
      role,
    })
    .select("id, nickname, role, created_at")
    .single();

  if (profileError || !profile) {
    console.error(
      "[admin-members] create profile error:",
      profileError
    );

    try {
      await admin.auth.admin.deleteUser(userId);
    } catch (rollbackError) {
      console.error(
        "[admin-members] rollback error:",
        rollbackError
      );
    }

    return NextResponse.json(
      {
        error: "회원 정보를 생성하지 못했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
    member: profile,
  });
}
