import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const { data: viewRow } = await supabase
      .from("admin_lead_views")
      .select("last_viewed_at")
      .eq("user_id", user.id)
      .maybeSingle();

    const lastViewed = viewRow?.last_viewed_at;

    let count = 0;
    if (lastViewed) {
      const result = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gt("created_at", lastViewed);
      count = result.count ?? 0;
    } else {
      const result = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true });
      count = result.count ?? 0;
    }

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
