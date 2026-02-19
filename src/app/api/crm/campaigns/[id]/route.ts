import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { getCampaignById, addContactsToCampaign } from "@/lib/crm/campaigns";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:campaign");

const addContactsSchema = z.object({
  contact_ids: z.array(z.string().uuid()).min(1),
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
  const campaign = await getCampaignById(supabase, id);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const { data: campaignEmails } = await supabase
    .from("campaign_emails")
    .select("id, contact_id, status, sent_at")
    .eq("campaign_id", id);

  return NextResponse.json({
    campaign,
    campaign_emails: campaignEmails ?? [],
  });
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

  const parsed = addContactsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const campaign = await getCampaignById(supabase, id);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  try {
    await addContactsToCampaign(supabase, id, parsed.data.contact_ids);
    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "update",
      resourceType: "campaign",
      resourceId: id,
      description: `Updated campaign ${id}`,
    }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("Campaign contacts update failed", err);
    return NextResponse.json(
      { error: "Failed to add contacts" },
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
  const campaign = await getCampaignById(supabase, id);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const { error: emailsError } = await supabase
    .from("campaign_emails")
    .delete()
    .eq("campaign_id", id);
  if (emailsError) {
    log.error("Campaign emails deletion failed", emailsError);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }

  const { error: campaignError } = await supabase.from("campaigns").delete().eq("id", id);
  if (campaignError) {
    log.error("Campaign deletion failed", campaignError);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }

  logAuditFromRequest(request, {
    userId: user.id,
    userEmail: user.email,
    action: "delete",
    resourceType: "campaign",
    resourceId: id,
    description: `Deleted campaign ${id}`,
  }).catch(() => {});
  return NextResponse.json({ success: true });
}
