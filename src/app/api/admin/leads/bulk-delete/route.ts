import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const log = logger.create("api:admin:leads:bulk-delete");

const bodySchema = z.object({
  lead_ids: z.array(z.string().uuid()).min(1).max(200),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead_ids", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("leads")
    .delete()
    .in("id", parsed.data.lead_ids);

  if (error) {
    log.error("Bulk delete failed", error);
    return NextResponse.json(
      { error: "Failed to delete leads" },
      { status: 500 }
    );
  }

  return NextResponse.json({ deleted: parsed.data.lead_ids.length });
}
