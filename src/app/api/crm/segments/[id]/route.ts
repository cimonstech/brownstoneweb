import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:segment");

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export async function PATCH(
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

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const update: Record<string, string> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name.trim();
  if (parsed.data.color !== undefined) update.color = parsed.data.color;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("contact_segments")
      .update(update as never)
      .eq("id", id)
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
      action: "update",
      resourceType: "segment",
      resourceId: id,
      description: `Updated segment ${id}`,
    }).catch(() => {});
    return NextResponse.json(data);
  } catch (err) {
    log.error("Segment update failed", err);
    return NextResponse.json({ error: "Failed to update segment" }, { status: 500 });
  }
}

export async function DELETE(
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

  try {
    const { error } = await supabase
      .from("contact_segments")
      .delete()
      .eq("id", id);
    if (error) throw error;
    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "delete",
      resourceType: "segment",
      resourceId: id,
      description: `Deleted segment ${id}`,
    }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("Segment deletion failed", err);
    return NextResponse.json({ error: "Failed to delete segment" }, { status: 500 });
  }
}
