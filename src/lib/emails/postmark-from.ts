/**
 * From address for Postmark emails. Editable via .env.local:
 *
 *   POSTMARK_FROM=Brownstone Construction <candace@brownstoneltd.com>
 *
 * Or just the email:
 *   POSTMARK_FROM=candace@brownstoneltd.com
 */
export function getPostmarkFrom(): string {
  const v = process.env.POSTMARK_FROM?.trim();
  if (v) return v;
  return "Brownstone Construction <candace@brownstoneltd.com>";
}
