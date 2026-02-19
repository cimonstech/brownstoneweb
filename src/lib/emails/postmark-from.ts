/**
 * From address for Postmark emails. Each flow can use a different sender via .env:
 *
 *   POSTMARK_FROM=Brownstone Construction <candace@brownstoneltd.com>   # fallback
 *   POSTMARK_FROM_CONTACT=Candace from Brownstone <candace@brownstoneltd.com>
 *   POSTMARK_FROM_BROCHURE=Brownstone <info@brownstoneltd.com>
 *   POSTMARK_FROM_LAKEHOUSE=Brownstone Celestia <celestia@brownstoneltd.com>
 *   POSTMARK_FROM_CAMPAIGNS=Candace from Brownstone <candace@brownstoneltd.com>
 *
 * If a flow-specific var is missing, POSTMARK_FROM is used. Format: "Name <email@domain.com>" or just the email.
 */
export type PostmarkFromChannel =
  | "contact"
  | "brochure"
  | "lakehouse"
  | "campaigns";

const ENV_BY_CHANNEL: Record<PostmarkFromChannel, string> = {
  contact: "POSTMARK_FROM_CONTACT",
  brochure: "POSTMARK_FROM_BROCHURE",
  lakehouse: "POSTMARK_FROM_LAKEHOUSE",
  campaigns: "POSTMARK_FROM_CAMPAIGNS",
};

const DEFAULT_FROM = "Brownstone Construction <candace@brownstoneltd.com>";

function getFromEnv(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

/**
 * Returns the From address for the given flow. Use this so each form/campaign can have a different sender.
 * Password reset and invite emails are sent by Supabase (configure sender in Supabase Dashboard → Auth → SMTP).
 */
export function getPostmarkFrom(channel?: PostmarkFromChannel): string {
  if (channel) {
    const envKey = ENV_BY_CHANNEL[channel];
    const value = getFromEnv(envKey);
    if (value) return value;
  }
  const fallback = getFromEnv("POSTMARK_FROM");
  return fallback || DEFAULT_FROM;
}
