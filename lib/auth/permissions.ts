import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type UserRole = "user" | "admin";

export type CurrentProfile = {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    id: string;
    nickname: string;
    role: UserRole;
  };
};

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const admin = createAdminClient();

  const {
    data: profile,
    error: profileError,
  } = await admin
    .from("profiles")
    .select("id, nickname, role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    (profile.role !== "user" && profile.role !== "admin")
  ) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      id: profile.id,
      nickname: profile.nickname,
      role: profile.role as UserRole,
    },
  };
}

export async function requireUser() {
  return await getCurrentProfile();
}

export async function requireAdmin() {
  const current = await getCurrentProfile();

  if (!current) {
    return null;
  }

  if (current.profile.role !== "admin") {
    return null;
  }

  return current;
}
