import { ServerClient } from "postmark";
import { getPostmarkFrom } from "@/lib/emails/postmark-from";

export type LeadNotifyPayload = {
  source: string;
  email: string;
  name?: string | null;
  message?: string | null;
  project?: string | null;
};

/**
 * Send a "New lead" notification to the address in EMAIL_LEAD_NOTIFY (e.g. a moderator).
 * Call this after inserting a lead. If EMAIL_LEAD_NOTIFY or POSTMARK_API_KEY is missing, no email is sent.
 */
export async function notifyLeadModerator(payload: LeadNotifyPayload): Promise<void> {
  const to = process.env.EMAIL_LEAD_NOTIFY?.trim();
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!to || !apiKey) return;

  const client = new ServerClient(apiKey);
  const lines = [
    `Source: ${payload.source}`,
    `Email: ${payload.email}`,
    payload.name ? `Name: ${payload.name}` : null,
    payload.project ? `Project: ${payload.project}` : null,
    payload.message ? `Message: ${payload.message.slice(0, 500)}${payload.message.length > 500 ? "…" : ""}` : null,
  ].filter(Boolean);

  await client.sendEmail({
    From: getPostmarkFrom("contact"),
    To: to,
    Subject: `New lead: ${payload.source} — Brownstone`,
    TextBody: `A new lead was submitted.\n\n${lines.join("\n")}`,
    HtmlBody: `<p>A new lead was submitted.</p><pre>${lines.join("\n")}</pre>`,
  });
}
