import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { getCampaignById, addContactsToCampaign } from "@/lib/crm/campaigns";
import { z } from "zod";

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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CRM campaign PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to add contacts" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

  const { error: emailsError } = await supabase
    .from("campaign_emails")
    .delete()
    .eq("campaign_id", id);
  if (emailsError) {
    console.error("Campaign emails delete error:", emailsError);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }

  const { error: campaignError } = await supabase.from("campaigns").delete().eq("id", id);
  if (campaignError) {
    console.error("Campaign delete error:", campaignError);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
