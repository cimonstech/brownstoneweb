import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";

const log = logger.create("audit");

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "bulk_delete"
  | "import"
  | "send"
  | "assign_role"
  | "remove_role"
  | "invite"
  | "upload"
  | "login"
  | "logout"
  | "view";

export type AuditResourceType =
  | "contact"
  | "lead"
  | "post"
  | "category"
  | "campaign"
  | "template"
  | "segment"
  | "user"
  | "role"
  | "media"
  | "now_selling"
  | "note"
  | "settings";

interface AuditEntry {
  userId: string;
  userEmail?: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

function extractIpFromHeaders(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

function extractUaFromHeaders(h: Headers): string {
  return h.get("user-agent") || "unknown";
}

/**
 * Log an admin action. Call from API routes, passing the Request object.
 */
export async function logAuditFromRequest(
  request: Request,
  entry: AuditEntry
): Promise<void> {
  const h = new Headers(request.headers);
  const ip = entry.ipAddress ?? extractIpFromHeaders(h);
  const ua = entry.userAgent ?? extractUaFromHeaders(h);
  await insertAuditLog({ ...entry, ipAddress: ip, userAgent: ua });
}

/**
 * Log an admin action. Call from server actions (uses next/headers).
 */
export async function logAuditFromAction(entry: AuditEntry): Promise<void> {
  try {
    const h = await headers();
    const ip = entry.ipAddress ?? extractIpFromHeaders(h);
    const ua = entry.userAgent ?? extractUaFromHeaders(h);
    await insertAuditLog({ ...entry, ipAddress: ip, userAgent: ua });
  } catch {
    await insertAuditLog(entry);
  }
}

async function insertAuditLog(entry: AuditEntry): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("admin_audit_log").insert({
      user_id: entry.userId,
      user_email: entry.userEmail || null,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      description: entry.description,
      metadata: entry.metadata ?? {},
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
    } as never);
  } catch (err) {
    log.error("Failed to write audit log", err);
  }
}
