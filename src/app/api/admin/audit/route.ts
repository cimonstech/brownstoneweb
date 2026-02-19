import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { logAuditFromRequest } from "@/lib/audit";
import { z } from "zod";

const auditSchema = z.object({
  action: z.enum(["create", "update", "delete", "upload", "view"]),
  resource_type: z.enum([
    "contact", "lead", "post", "category", "campaign", "template",
    "segment", "user", "role", "media", "now_selling", "note", "settings",
  ]),
  resource_id: z.string().max(100).optional(),
  description: z.string().min(1).max(500),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator") && !roles.includes("author")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = auditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  logAuditFromRequest(request, {
    userId: user.id,
    userEmail: user.email,
    action: parsed.data.action,
    resourceType: parsed.data.resource_type,
    resourceId: parsed.data.resource_id,
    description: parsed.data.description,
    metadata: parsed.data.metadata,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roles = await getUserRoles();
  if (!roles.includes("admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") ?? "50", 10)));
  const offset = (page - 1) * limit;

  const action = searchParams.get("action") ?? undefined;
  const resourceType = searchParams.get("resource_type") ?? undefined;
  const userId = searchParams.get("user_id") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  let query = supabase
    .from("admin_audit_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) query = query.eq("action", action);
  if (resourceType) query = query.eq("resource_type", resourceType);
  if (userId) query = query.eq("user_id", userId);
  if (search?.trim()) {
    const term = search.trim().replace(/[,.()"\\%_]/g, "");
    if (term) {
      query = query.or(`description.ilike.%${term}%,user_email.ilike.%${term}%`);
    }
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }

  return NextResponse.json({
    logs: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
