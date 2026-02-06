"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";

export async function assignRole(userId: string, roleName: string) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

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
  if (!isAdmin(roles)) return { error: "Forbidden" };

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
