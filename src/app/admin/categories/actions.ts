"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";
import { logAuditFromAction } from "@/lib/audit";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required" };
  const slug = (formData.get("slug") as string)?.trim() || slugify(name);
  const description = (formData.get("description") as string)?.trim() || null;

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description,
  });
  if (error) return { error: error.message };

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    logAuditFromAction({
      userId: user.id,
      userEmail: user.email,
      action: "create",
      resourceType: "category",
      description: `Created category ${name}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { ok: true };
}

export async function updateCategory(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  const payload: { name?: string; slug?: string; description?: string | null } = {};
  if (name != null) payload.name = name;
  if (slug != null) payload.slug = slug;
  if (description !== undefined) payload.description = description;

  const { error } = await supabase.from("categories").update(payload).eq("id", id);
  if (error) return { error: error.message };

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    logAuditFromAction({
      userId: user.id,
      userEmail: user.email,
      action: "update",
      resourceType: "category",
      resourceId: id,
      description: `Updated category ${name || id}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) return { error: "Forbidden" };

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    logAuditFromAction({
      userId: user.id,
      userEmail: user.email,
      action: "delete",
      resourceType: "category",
      resourceId: id,
      description: `Deleted category ${id}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { ok: true };
}
