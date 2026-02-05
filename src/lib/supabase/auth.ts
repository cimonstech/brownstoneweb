import { createClient } from "./server";

export type RoleName = "admin" | "moderator" | "author";

/** Get current user's role names from Supabase (uses RPC get_user_roles). */
export async function getUserRoles(): Promise<RoleName[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: names } = await supabase.rpc("get_user_roles", {
    user_uuid: user.id,
  });
  return (names ?? []) as RoleName[];
}

export function canPublish(roles: RoleName[]): boolean {
  return roles.includes("admin") || roles.includes("moderator");
}

export function isAdmin(roles: RoleName[]): boolean {
  return roles.includes("admin");
}
