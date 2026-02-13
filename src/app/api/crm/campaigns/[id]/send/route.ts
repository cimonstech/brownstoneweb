import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getUserRoles } from "@/lib/supabase/auth";
import {
  getCampaignById,
  getCampaignEmailsForSending,
  canSendMoreEmails,
  buildContactVars,
} from "@/lib/crm/campaigns";
import { getTemplateById, interpolateTemplate } from "@/lib/crm/templates";
import { getContactById, addContactActivity } from "@/lib/crm/contacts";
import { MAX_EMAILS_PER_HOUR } from "@/lib/crm/safety";

export async function POST(
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

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const { id } = await params;
  const campaign = await getCampaignById(supabase, id);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (!campaign.template_id) {
    return NextResponse.json(
      { error: "Campaign has no template assigned" },
      { status: 400 }
    );
  }

  const template = await getTemplateById(supabase, campaign.template_id);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const { ok, limit } = await canSendMoreEmails(supabase);
  if (!ok) {
    return NextResponse.json(
      { error: `Sending limit reached: ${limit}` },
      { status: 429 }
    );
  }

  const batchLimit = Math.min(10, MAX_EMAILS_PER_HOUR);
  const pending = await getCampaignEmailsForSending(
    supabase,
    id,
    batchLimit
  );

  if (pending.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      message: "No pending emails to send",
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_NOREPLY?.trim() ||
    process.env.CONTACT_FROM_EMAIL ||
    "Brownstone <info@brownstoneltd.com>";

  let sent = 0;
  const errors: string[] = [];

  for (const ce of pending) {
    const contact = await getContactById(supabase, ce.contact_id);
    if (!contact) continue;

    if (contact.do_not_contact || contact.unsubscribed) {
      await supabase
        .from("campaign_emails")
        .update({ status: "bounced" })
        .eq("id", ce.id);
      continue;
    }

    const vars = buildContactVars(contact);
    const subject = interpolateTemplate(template.subject, vars);
    const bodyHtml = interpolateTemplate(template.body_html, vars);

    const { error } = await resend.emails.send({
      from,
      to: contact.email,
      subject,
      html: bodyHtml,
    });

    if (error) {
      errors.push(`${contact.email}: ${error.message}`);
      continue;
    }

    await supabase
      .from("campaign_emails")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", ce.id);

    await addContactActivity(supabase, {
      contact_id: contact.id,
      type: "email_sent",
      metadata: {
        campaign_id: id,
        campaign_name: campaign.name,
        subject,
      },
      created_by_id: user.id,
    });

    sent++;
  }

  if (sent > 0) {
    const remaining = await getCampaignEmailsForSending(supabase, id, 1);
    const completed = remaining.length === 0;
    await supabase
      .from("campaigns")
      .update({
        status: completed ? "completed" : "sending",
      })
      .eq("id", id);
  }

  return NextResponse.json({
    success: errors.length === 0,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
