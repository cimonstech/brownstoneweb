import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:segments");

const createSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { data, error } = await supabase
      .from("contact_segments")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;

    const { data: counts, error: countErr } = await supabase
      .from("contact_segment_members")
      .select("segment_id");
    if (countErr) throw countErr;

    const countMap: Record<string, number> = {};
    (counts ?? []).forEach((r: { segment_id: string }) => {
      countMap[r.segment_id] = (countMap[r.segment_id] ?? 0) + 1;
    });

    const segments = (data ?? []).map((s: { id: string; name: string; color: string; created_at: string }) => ({
      ...s,
      contact_count: countMap[s.id] ?? 0,
    }));

    return NextResponse.json(segments);
  } catch (err) {
    log.error("Segments fetch failed", err);
    return NextResponse.json({ error: "Failed to fetch segments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("contact_segments")
      .insert({ name: parsed.data.name.trim(), color: parsed.data.color ?? "#6B7280" } as never)
      .select()
      .single();
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A segment with this name already exists" }, { status: 409 });
      }
      throw error;
    }
    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "create",
      resourceType: "segment",
      resourceId: data.id,
      description: `Created segment ${parsed.data.name.trim()}`,
    }).catch(() => {});
    return NextResponse.json(data);
  } catch (err) {
    log.error("Segment creation failed", err);
    return NextResponse.json({ error: "Failed to create segment" }, { status: 500 });
  }
}
