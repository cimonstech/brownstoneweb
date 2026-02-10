/**
 * Auto-reply when someone submits the contact form.
 * Uses Brownstone logo when BROWNSTONE_LOGO_URL env is set.
 */

const PRIMARY = "#411600";
const MUTED = "#7a5c4a";
const BORDER = "#e6dfdb";
const BG = "#fdfcfb";

/** Set BROWNSTONE_LOGO_URL in env to show logo in contact auto-reply. */
function getBrownstoneLogoHtml(logoUrl: string | undefined): string {
  if (!logoUrl?.trim()) return "";
  const url = logoUrl.trim();
  return `
          <tr>
            <td style="padding-bottom:24px;text-align:center;border-bottom:2px solid ${PRIMARY};">
              <img src="${url}" alt="Brownstone Construction" width="160" height="auto" style="max-width:160px;height:auto;display:block;margin:0 auto;" />
            </td>
          </tr>`;
}

export function getContactReceivedHtml(
  baseUrl: string,
  brownstoneLogoUrl?: string | null
): string {
  const logoHtml = getBrownstoneLogoHtml(brownstoneLogoUrl ?? undefined);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We've received your message</title>
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:#f8f6f6;color:${PRIMARY};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f6f6;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background-color:${BG};border:1px solid ${BORDER};border-radius:4px;padding:32px 28px;">
          ${logoHtml}
          <tr>
            <td style="${logoHtml ? "padding-top:24px;" : ""}">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};font-weight:600;">Thank you</p>
              <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:${PRIMARY};">
                We've received your inquiry
              </h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:${PRIMARY};">
                Thank you for getting in touch with Brownstone Construction. We have received your message and will respond as soon as possible, usually within one business day.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:${MUTED};">
                If your matter is urgent, you may call us at <a href="tel:+233244028773" style="color:${PRIMARY};text-decoration:underline;">+233 244 028 773</a>.
              </p>
              <p style="margin:24px 0 0;font-size:14px;line-height:1.5;color:${MUTED};">
                With best regards,<br>
                <strong style="color:${PRIMARY};">The Brownstone Team</strong>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;text-align:center;font-size:11px;color:${MUTED};">
          Brownstone Construction Limited
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

export function getContactReceivedText(baseUrl: string): string {
  return `
THANK YOU — We've received your inquiry

Thank you for getting in touch with Brownstone Construction. We have received your message and will respond as soon as possible, usually within one business day.

If your matter is urgent, you may call us at +233 244 028 773.

With best regards,
The Brownstone Team

Brownstone Construction Limited
`.trim();
}
