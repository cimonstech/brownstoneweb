"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";

/**
 * Call when the user opens the Leads page. Updates last_viewed_at so the badge shows only new leads (created after this).
 */
export async function markLeadsViewed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) return;

  const { error } = await supabase.from("admin_lead_views").upsert(
    { user_id: user.id, last_viewed_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  if (error) {
    console.error("markLeadsViewed: upsert failed", error);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/leads");
}
