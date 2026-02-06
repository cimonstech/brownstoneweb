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

/** Get current user's permission names (uses RPC get_user_permissions). */
export async function getUserPermissions(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: names } = await supabase.rpc("get_user_permissions", {
    user_uuid: user.id,
  });
  return (names ?? []) as string[];
}

/** Check if the user has a given permission (e.g. 'users:manage'). Admin role has all permissions. */
export function hasPermission(permissions: string[], permission: string): boolean {
  return permissions.includes(permission);
}

export function canPublish(roles: RoleName[]): boolean {
  return roles.includes("admin") || roles.includes("moderator");
}

export function isAdmin(roles: RoleName[]): boolean {
  return roles.includes("admin");
}
