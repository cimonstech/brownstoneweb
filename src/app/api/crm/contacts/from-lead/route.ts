import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { upsertContactByEmail, addContactActivity } from "@/lib/crm/contacts";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:from-lead");

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

  let body: { lead_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const leadId = typeof body.lead_id === "string" ? body.lead_id.trim() : "";
  if (!leadId) {
    return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, email, name, source")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const email = lead.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Lead has no valid email" }, { status: 400 });
  }

  try {
    const contact = await upsertContactByEmail(supabase, email, {
      name: lead.name?.trim() || null,
      source: lead.source ?? "lead",
      status: "new_lead",
    });

    await addContactActivity(supabase, {
      contact_id: contact.id,
      type: "form_submit",
      metadata: { source: "added_from_lead", lead_id: lead.id },
      created_by_id: user.id,
    });

    const { error: updateLeadError } = await supabase
      .from("leads")
      .update({ contact_id: contact.id })
      .eq("id", lead.id);
    if (updateLeadError) {
      log.error("Failed to set lead.contact_id", updateLeadError);
    }

    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "create",
      resourceType: "contact",
      description: `Converted lead to contact ${email}`,
    }).catch(() => {});
    return NextResponse.json({ id: contact.id, email: contact.email, name: contact.name });
  } catch (err) {
    log.error("Contact creation from lead failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add contact" },
      { status: 500 }
    );
  }
}
