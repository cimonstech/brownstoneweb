"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { logAuditFromAction } from "@/lib/audit";

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export async function saveNowSelling(slots: Array<{ position: number; image_url: string | null; property_name: string | null; project_link: string | null }>) {
  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return { error: "Forbidden" };
  }
  const supabase = await createClient();
  for (const slot of slots) {
    const link = slot.project_link?.trim() || null;
    if (link && !isValidUrl(link)) {
      return { error: `Invalid URL for slot ${slot.position}: must start with http:// or https://` };
    }
    const { error } = await supabase
      .from("now_selling")
      .upsert(
        {
          position: slot.position,
          image_url: slot.image_url || null,
          property_name: slot.property_name?.trim() || null,
          project_link: link,
        },
        { onConflict: "position" }
      );
    if (error) return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    logAuditFromAction({
      userId: user.id,
      userEmail: user.email,
      action: "update",
      resourceType: "now_selling",
      description: "Updated now selling slots",
    }).catch(() => {});
  }

  revalidatePath("/blog");
  revalidatePath("/admin/now-selling");
  return { ok: true };
}
