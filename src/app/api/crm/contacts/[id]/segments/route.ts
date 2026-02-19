import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:contact-segments");

const setSegmentsSchema = z.object({
  segment_ids: z.array(z.string().uuid()),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from("contact_segment_members")
      .select("segment_id")
      .eq("contact_id", id);
    if (error) throw error;
    return NextResponse.json((data ?? []).map((r: { segment_id: string }) => r.segment_id));
  } catch (err) {
    log.error("Contact segments fetch failed", err);
    return NextResponse.json({ error: "Failed to fetch segments" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = setSegmentsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    await supabase.from("contact_segment_members").delete().eq("contact_id", id);

    if (parsed.data.segment_ids.length > 0) {
      const rows = parsed.data.segment_ids.map((segment_id) => ({
        segment_id,
        contact_id: id,
      }));
      const { error } = await supabase
        .from("contact_segment_members")
        .insert(rows as never);
      if (error) throw error;
    }

    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "update",
      resourceType: "contact",
      resourceId: id,
      description: `Updated segments for contact ${id}`,
      metadata: { segment_ids: parsed.data.segment_ids },
    }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("Contact segments update failed", err);
    return NextResponse.json({ error: "Failed to update segments" }, { status: 500 });
  }
}
