import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { getCampaigns, createCampaign, addContactsToCampaign } from "@/lib/crm/campaigns";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { logAuditFromRequest } from "@/lib/audit";

const log = logger.create("api:crm:campaigns");

const createCampaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["cold", "newsletter"]).optional(),
  template_id: z.string().uuid().optional().nullable(),
  contact_ids: z.array(z.string().uuid()).optional(),
});

export async function GET() {
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

  try {
    const campaigns = await getCampaigns(supabase);
    return NextResponse.json(campaigns);
  } catch (err) {
    log.error("Campaigns fetch failed", err);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const campaign = await createCampaign(supabase, {
      name: parsed.data.name,
      type: parsed.data.type ?? "cold",
      template_id: parsed.data.template_id ?? null,
    });
    if (parsed.data.contact_ids?.length) {
      await addContactsToCampaign(
        supabase,
        campaign.id,
        parsed.data.contact_ids
      );
    }
    logAuditFromRequest(request, {
      userId: user.id,
      userEmail: user.email,
      action: "create",
      resourceType: "campaign",
      description: `Created campaign ${parsed.data.name}`,
    }).catch(() => {});
    return NextResponse.json(campaign);
  } catch (err) {
    log.error("Campaign creation failed", err);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
