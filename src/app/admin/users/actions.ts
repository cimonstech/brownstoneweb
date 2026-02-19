"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";

const MODERATOR_ALLOWED_ROLES = ["moderator", "author"];

export async function assignRole(userId: string, roleName: string) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  const canManage = isAdmin(roles) || roles.includes("moderator");
  if (!canManage) return { error: "Forbidden" };
  if (!isAdmin(roles) && (roleName === "admin" || !MODERATOR_ALLOWED_ROLES.includes(roleName))) {
    return { error: "You can only assign moderator or author" };
  }

  const { data: me } = await supabase.auth.getUser();
  const performedBy = me?.user?.id;
  if (!performedBy) return { error: "Unauthorized" };

  const { data: role } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();
  if (!role) return { error: "Unknown role" };

  const { error } = await supabase.from("user_roles").insert({
    user_id: userId,
    role_id: role.id,
  });
  if (error) {
    if (error.code === "23505") return { error: "User already has this role" };
    return { error: error.message };
  }

  await supabase.from("role_audit_log").insert({
    target_user_id: userId,
    action: "assigned",
    role_name: roleName,
    performed_by_id: performedBy,
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeRole(userId: string, roleName: string) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  const canManage = isAdmin(roles) || roles.includes("moderator");
  if (!canManage) return { error: "Forbidden" };
  if (!isAdmin(roles) && (roleName === "admin" || !MODERATOR_ALLOWED_ROLES.includes(roleName))) {
    return { error: "You can only remove moderator or author" };
  }

  const { data: me } = await supabase.auth.getUser();
  const performedBy = me?.user?.id;
  if (!performedBy) return { error: "Unauthorized" };
  if (userId === performedBy) return { error: "You cannot change your own roles" };

  const { data: role } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();
  if (!role) return { error: "Unknown role" };

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role_id", role.id);
  if (error) return { error: error.message };

  await supabase.from("role_audit_log").insert({
    target_user_id: userId,
    action: "removed",
    role_name: roleName,
    performed_by_id: performedBy,
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  const canDelete = isAdmin(roles) || roles.includes("moderator");
  if (!canDelete) return { error: "Forbidden" };

  const { data: me } = await supabase.auth.getUser();
  if (!me?.user?.id) return { error: "Unauthorized" };
  if (userId === me.user.id) return { error: "You cannot delete your own account" };

  const { data: targetRoleRows } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userId);
  const roleNames = (targetRoleRows ?? [])
    .map((r: unknown) => {
      const row = r as { roles: { name: string } | { name: string }[] | null };
      const roles = row.roles;
      const name = Array.isArray(roles) ? roles[0]?.name : roles?.name;
      return name;
    })
    .filter(Boolean) as string[];
  if (!isAdmin(roles) && roleNames.includes("admin")) {
    return { error: "Moderators cannot delete admin users" };
  }

  const admin = createAdminClient();
  const { error: authError } = await admin.auth.admin.deleteUser(userId);
  if (authError) return { error: authError.message };

  // We do not delete the user's profile or posts: their posts remain and can be deleted separately.
  // Author attribution may still show if profile row remains; remove profile if you want to anonymize.

  revalidatePath("/admin/users");
  return { ok: true };
}
