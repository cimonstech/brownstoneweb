import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import {
  getContactById,
  updateContact,
  getContactActivities,
  addContactActivity,
} from "@/lib/crm/contacts";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:contact");

const updateContactSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  do_not_contact: z.boolean().optional(),
  unsubscribed: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

const addNoteSchema = z.object({
  note: z.string().min(1),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const contact = await getContactById(supabase, id);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    const activities = await getContactActivities(supabase, id);
    return NextResponse.json({ contact, activities });
  } catch (err) {
    log.error("Contact fetch failed", err);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name?.trim() || null;
  if (parsed.data.phone !== undefined) update.phone = parsed.data.phone?.trim() || null;
  if (parsed.data.country_code !== undefined) update.country_code = parsed.data.country_code?.trim() || null;
  if (parsed.data.company !== undefined) update.company = parsed.data.company?.trim() || null;
  if (parsed.data.source !== undefined) update.source = parsed.data.source?.trim() || null;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;
  if (parsed.data.do_not_contact !== undefined) update.do_not_contact = parsed.data.do_not_contact;
  if (parsed.data.unsubscribed !== undefined) update.unsubscribed = parsed.data.unsubscribed;
  if (parsed.data.tags !== undefined) update.tags = parsed.data.tags;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const contact = await updateContact(supabase, id, update);
    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "update",
      resourceType: "contact",
      resourceId: id,
      description: `Updated contact ${id}`,
    }).catch(() => {});
    return NextResponse.json(contact);
  } catch (err) {
    log.error("Contact update failed", err);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const contact = await getContactById(supabase, id);
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  await supabase.from("contact_activities").delete().eq("contact_id", id);
  await supabase.from("campaign_emails").delete().eq("contact_id", id);
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) {
    log.error("Contact deletion failed", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }

  logAuditFromRequest(request, {
    userId: user.id,
    userEmail: user.email,
    action: "delete",
    resourceType: "contact",
    resourceId: id,
    description: `Deleted contact ${contact.email}`,
  }).catch(() => {});
  return NextResponse.json({ success: true });
}
