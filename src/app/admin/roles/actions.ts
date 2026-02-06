"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";

export async function createRole(formData: FormData) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

  const name = (formData.get("name") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  const description = (formData.get("description") as string)?.trim() || null;
  if (!name) return { error: "Name is required" };

  const { error } = await supabase.from("roles").insert({ name, description });
  if (error) {
    if (error.code === "23505") return { error: "Role name already exists" };
    return { error: error.message };
  }
  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateRole(id: string, formData: FormData) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

  const name = (formData.get("name") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  const description = (formData.get("description") as string)?.trim() || null;
  if (!name) return { error: "Name is required" };

  const { error } = await supabase.from("roles").update({ name, description }).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "Role name already exists" };
    return { error: error.message };
  }
  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteRole(id: string) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

  const { data: role } = await supabase.from("roles").select("name").eq("id", id).single();
  if (role?.name === "admin") return { error: "Cannot delete the admin role" };

  const { error } = await supabase.from("roles").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { ok: true };
}
