import { NextResponse } from "next/server";
import { ServerClient } from "postmark";
import { getContactReceivedHtml, getContactReceivedText } from "@/lib/emails/contact-received";
import { getPostmarkFrom } from "@/lib/emails/postmark-from";
import { notifyLeadModerator } from "@/lib/emails/lead-notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

const log = logger.create("api:contact");

export async function POST(request: Request) {
  const to = process.env.CONTACTFORMMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "Contact recipient not configured (CONTACTFORMMAIL)." },
      { status: 503 }
    );
  }
  if (!process.env.POSTMARK_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured (POSTMARK_API_KEY)." },
      { status: 503 }
    );
  }

  const client = new ServerClient(process.env.POSTMARK_API_KEY);

  let body: { name?: string; email?: string; projectType?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, projectType, message } = body;
  const emailTrimmed = email?.trim() ?? "";
  if (!name?.trim() || !emailTrimmed || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://brownstoneltd.com";

  // Store lead — requires SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Settings → API)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createAdminClient();
      const { error: insertError } = await supabase.from("leads").insert({
        email: emailTrimmed,
        name: name?.trim() ?? null,
        message: (message?.trim() ?? "").slice(0, 5000) || null,
        source: "contact",
        project: projectType?.trim() || null,
        consent: true,
      } as never);
      if (insertError) log.error("Lead insert failed", insertError);
      else {
        notifyLeadModerator({
          source: "contact",
          email: emailTrimmed,
          name: name?.trim() ?? null,
          message: message?.trim() ?? null,
          project: projectType?.trim() || null,
        }).catch((e) => log.error("Lead notification failed", e));
      }
    } catch (err) {
      log.error("Lead storage failed", err);
    }
  }

  try {
    await client.sendEmail({
      From: getPostmarkFrom("contact"),
      To: to.trim(),
      ReplyTo: emailTrimmed,
      Subject: `Website inquiry from ${name.trim()}${projectType ? ` — ${projectType}` : ""}`,
      TextBody: [
        `Name: ${name.trim()}`,
        `Email: ${emailTrimmed}`,
        projectType ? `Project type: ${projectType}` : null,
        "",
        "Message:",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });

    const brownstoneLogoUrl =
      typeof process.env.BROWNSTONE_LOGO_URL === "string" && process.env.BROWNSTONE_LOGO_URL.trim()
        ? process.env.BROWNSTONE_LOGO_URL.trim()
        : undefined;

    const autoReplyReplyTo =
      process.env.POSTMARK_REPLY_TO?.trim() || process.env.CONTACTFORMMAIL?.trim() || undefined;
    try {
      await client.sendEmail({
        From: getPostmarkFrom("contact"),
        To: emailTrimmed,
        ...(autoReplyReplyTo && { ReplyTo: autoReplyReplyTo }),
        Subject: "We've received your message — Brownstone Construction",
        HtmlBody: getContactReceivedHtml(baseUrl, brownstoneLogoUrl),
        TextBody: getContactReceivedText(baseUrl),
      });
    } catch (autoReplyErr) {
      log.error("Auto-reply email failed", autoReplyErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    log.error("Email send failed", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
