"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";

export async function saveNowSelling(slots: Array<{ position: number; image_url: string | null; property_name: string | null; project_link: string | null }>) {
  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return { error: "Forbidden" };
  }
  const supabase = await createClient();
  for (const slot of slots) {
    const { error } = await supabase
      .from("now_selling")
      .upsert(
        {
          position: slot.position,
          image_url: slot.image_url || null,
          property_name: slot.property_name?.trim() || null,
          project_link: slot.project_link?.trim() || null,
        },
        { onConflict: "position" }
      );
    if (error) return { error: error.message };
  }
  revalidatePath("/blog");
  revalidatePath("/admin/now-selling");
  return { ok: true };
}
