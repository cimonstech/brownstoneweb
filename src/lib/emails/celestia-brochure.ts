/**
 * Celestia property brochure email — townhouse (primary) and Lakehouse.
 * Used when a user requests the brochure on Celestia, townhouses, or Lakehouse pages.
 * Celestia logo + Brownstone brand colors.
 */

const CELESTIA_LOGO_URL =
  "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main/CelestiaLogo-bstone.png";

// Brownstone palette
const EARTHY = "#411600";
const PRIMARY = "#EF641C";
const PRIMARY_LIGHT = "#5c3d2e";
const MUTED = "#7a5c4a";
const BORDER = "#e6dfdb";
const BG = "#fdfcfb";
const BG_PAGE = "#f8f6f6";
const WHITE = "#ffffff";

export type BrochureProject = "celestia" | "townhouse" | "lakehouse";

export function getCelestiaBrochureHtml(
  baseUrl: string,
  project: BrochureProject,
  brochurePdfUrl?: string | null
): string {
  const townhouseUrl = `${baseUrl}/celestia/townhouses`;
  const lakehouseUrl = `${baseUrl}/celestia/lakehouse`;
  const celestiaUrl = `${baseUrl}/celestia`;

  const hasPdf = !!brochurePdfUrl?.trim();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Celestia Brochure — Brownstone Construction</title>
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 24px 16px !important; }
      .card { padding: 24px 20px !important; }
      .logo { max-width: 140px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
      .heading { font-size: 22px !important; }
      .subhead { font-size: 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:${BG_PAGE};color:${EARTHY};-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BG_PAGE};">
    <tr>
      <td align="center" class="wrapper" style="padding:48px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
          <tr>
            <td style="background-color:${BG};border:1px solid ${BORDER};border-radius:4px;box-shadow:0 4px 20px rgba(65,22,0,0.08);overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="card" style="padding:44px 36px;">
                <tr>
                  <td style="padding-bottom:28px;text-align:center;border-bottom:3px solid ${EARTHY};">
                    <img src="${CELESTIA_LOGO_URL}" alt="Celestia by Brownstone" width="180" height="auto" class="logo" style="max-width:180px;height:auto;display:block;margin:0 auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:28px;padding-bottom:8px;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:${MUTED};font-weight:600;">Thank you for your interest</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;font-size:26px;line-height:1.3;font-weight:600;color:${EARTHY};" class="heading">
                    Your Celestia Property Brochure
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 24px;font-size:16px;line-height:1.7;color:${PRIMARY_LIGHT};">
                    Thank you for taking the time to explore Celestia. As requested, here are the highlights and next steps for our luxury residences in Akosombo — 90 minutes from Accra.
                  </td>
                </tr>
                ${hasPdf ? `
                <tr>
                  <td style="padding:24px 0;background:linear-gradient(135deg, rgba(65,22,0,0.04) 0%, rgba(239,100,28,0.06) 100%);border-radius:4px;border:1px solid ${BORDER};margin-bottom:24px;">
                    <p style="margin:0 0 16px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};font-weight:600;">Download your brochure</p>
                    <a href="${brochurePdfUrl}" style="display:inline-block;padding:14px 28px;background-color:${PRIMARY};color:${WHITE};text-decoration:none;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;border-radius:4px;">Download PDF Brochure</a>
                  </td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding:24px 0;border-top:1px solid ${BORDER};">
                    <p style="margin:0 0 14px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};font-weight:600;">Now available — Phase 1</p>
                    <p style="margin:0 0 16px;font-size:17px;font-weight:600;color:${EARTHY};">Luxury Townhomes at Celestia</p>
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.75;color:${PRIMARY_LIGHT};">
                      Two-bedroom ensuite terraced homes with private Jacuzzis, waterfront access, and turnkey investment potential. High occupancy year-round; professional management available.
                    </p>
                    <a href="${townhouseUrl}" class="btn" style="display:inline-block;padding:14px 28px;background-color:${EARTHY};color:${BG};text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">View Townhouses</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 0;border-top:1px solid ${BORDER};">
                    <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};font-weight:600;">The social core</p>
                    <p style="margin:0 0 14px;font-size:17px;font-weight:600;color:${EARTHY};">The Lakehouse</p>
                    <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:${PRIMARY_LIGHT};">
                      Wellness amenities, elevated workspaces, pool, bar, and private jetty. The communal heart of Celestia.
                    </p>
                    <a href="${lakehouseUrl}" class="btn" style="display:inline-block;padding:14px 28px;background-color:${EARTHY};color:${BG};text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Explore the Lakehouse</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 0 0;border-top:1px solid ${BORDER};font-size:14px;line-height:1.65;color:${PRIMARY_LIGHT};">
                    To see the full Celestia vision — townhomes, chalets, and the Lakehouse — visit our <a href="${celestiaUrl}" style="color:${PRIMARY};text-decoration:underline;font-weight:600;">main Celestia page</a>.
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 0 0;font-size:13px;line-height:1.6;color:${MUTED};">
                    For priority delivery of future updates, add this address to your contacts. Reply to this email anytime for a private viewing or the full prospectus.
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 0 0;font-size:14px;line-height:1.5;color:${PRIMARY_LIGHT};">
                    With best regards,<br>
                    <strong style="color:${EARTHY};">The Brownstone Team</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0;text-align:center;font-size:11px;color:${MUTED};">
              Brownstone Construction Limited · Celestia Akosombo
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

export function getCelestiaBrochureText(
  baseUrl: string,
  brochurePdfUrl?: string | null
): string {
  const townhouseUrl = `${baseUrl}/celestia/townhouses`;
  const lakehouseUrl = `${baseUrl}/celestia/lakehouse`;
  const celestiaUrl = `${baseUrl}/celestia`;

  let block = `
THANK YOU FOR YOUR INTEREST — Your Celestia Property Brochure

Thank you for taking the time to explore Celestia. Here are the highlights and next steps for our luxury residences in Akosombo — 90 minutes from Accra.
`;
  if (brochurePdfUrl?.trim()) {
    block += `\n\nDownload your brochure (PDF): ${brochurePdfUrl.trim()}\n`;
  }
  block += `

NOW AVAILABLE — PHASE 1: Luxury Townhomes at Celestia
Two-bedroom ensuite terraced homes with private Jacuzzis, waterfront access, and turnkey investment potential.

View Townhouses: ${townhouseUrl}

THE LAKEHOUSE — The social core
Wellness amenities, elevated workspaces, pool, bar, and private jetty.

Explore the Lakehouse: ${lakehouseUrl}

Full Celestia vision: ${celestiaUrl}

For priority delivery of future updates, add this address to your contacts. Reply anytime for a private viewing or the full prospectus.

With best regards,
The Brownstone Team

Brownstone Construction Limited · Celestia Akosombo
`;
  return block.trim();
}
