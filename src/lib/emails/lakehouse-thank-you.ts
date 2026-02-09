/**
 * Premium HTML email template for Lakehouse lead auto-response.
 * Refined, understated luxury tone. No spam triggers.
 */

const LOGO_URL = "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main/CelestiaLogo-bstone.png";
const PRIMARY = "#411600";
const PRIMARY_LIGHT = "#5c3d2e";
const MUTED = "#7a5c4a";
const BORDER = "#e6dfdb";
const BG = "#fdfcfb";

export function getLakehouseThankYouHtml(baseUrl: string): string {
  const lakehouseUrl = `${baseUrl}/celestia/lakehouse`;
  const celestiaUrl = `${baseUrl}/celestia`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your exclusive details — Lakehouse at Celestia</title>
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 28px 16px !important; }
      .card { padding: 28px 20px !important; }
      .logo { max-width: 140px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
      .heading { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:#f8f6f6;color:${PRIMARY};-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f6f6;">
    <tr>
      <td align="center" class="wrapper" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;">
          <tr>
            <td style="background-color:${BG};border:1px solid ${BORDER};border-radius:2px;box-shadow:0 2px 8px rgba(65,22,0,0.06);overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="card" style="padding:40px 32px;">
                <tr>
                  <td style="padding-bottom:24px;text-align:center;border-bottom:2px solid ${PRIMARY};">
                    <img src="${LOGO_URL}" alt="Celestia by Brownstone" width="160" height="auto" class="logo" style="max-width:160px;height:auto;display:block;margin:0 auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:28px;padding-bottom:8px;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};font-weight:600;">As requested</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 20px;font-size:24px;line-height:1.35;font-weight:600;color:${PRIMARY};" class="heading">
                    Your exclusive Lakehouse details
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 24px;font-size:16px;line-height:1.7;color:${PRIMARY_LIGHT};">
                    Thank you for your interest in the Lakehouse at Celestia. We have received your request and are pleased to share the following highlights with you.
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 0;border-top:1px solid ${BORDER};">
                    <p style="margin:0 0 14px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};font-weight:600;">Property highlights</p>
                    <ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.9;color:${PRIMARY_LIGHT};">
                      <li style="margin-bottom:6px;">Elevated workspaces with views over Volta Lake</li>
                      <li style="margin-bottom:6px;">Wellness amenities — gym, massage rooms, and reconnection spaces</li>
                      <li style="margin-bottom:6px;">Leisure and social areas — pool, bar, dining, and terrace</li>
                      <li>Private jetty with direct access to the water</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 0;">
                    <a href="${lakehouseUrl}" class="btn" style="display:inline-block;padding:16px 32px;background-color:${PRIMARY};color:#fdfcfb;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Explore the Lakehouse</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 20px;font-size:14px;line-height:1.65;color:${PRIMARY_LIGHT};">
                    To discover the broader Celestia project — including townhouses and chalets — visit our <a href="${celestiaUrl}" style="color:${PRIMARY};text-decoration:underline;">main Celestia page</a>.
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 0 0;border-top:1px solid ${BORDER};font-size:13px;line-height:1.6;color:${MUTED};">
                    For priority delivery of future updates, add this address to your contacts. You may reply to this email at any time if you would like more details or a private viewing.
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 0 0;font-size:13px;line-height:1.5;color:${PRIMARY_LIGHT};">
                    With best regards,<br>
                    <strong style="color:${PRIMARY};">The Brownstone Team</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0 0;text-align:center;font-size:11px;color:${MUTED};">
              Brownstone Construction Limited
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

export function getLakehouseThankYouText(baseUrl: string): string {
  const lakehouseUrl = `${baseUrl}/celestia/lakehouse`;
  const celestiaUrl = `${baseUrl}/celestia`;

  return `
AS REQUESTED — Your exclusive Lakehouse details

Thank you for your interest in the Lakehouse at Celestia. We have received your request and are pleased to share the following highlights with you.

PROPERTY HIGHLIGHTS
• Elevated workspaces with views over Volta Lake
• Wellness amenities — gym, massage rooms, and reconnection spaces
• Leisure and social areas — pool, bar, dining, and terrace
• Private jetty with direct access to the water

Explore the Lakehouse: ${lakehouseUrl}

Discover the broader Celestia project (townhouses and chalets): ${celestiaUrl}

For priority delivery of future updates, add this address to your contacts. You may reply to this email at any time for more details or to arrange a private viewing.

With best regards,
The Brownstone Team

Brownstone Construction Limited
`.trim();
}
