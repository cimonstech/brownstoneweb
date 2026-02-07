/**
 * Responsive HTML email template for Lakehouse lead auto-response.
 * Calm, understated luxury tone. No spam triggers.
 */

const LOGO_URL = "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main/CelestiaLogo-bstone.png";

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
  <title>Thank you — Lakehouse at Celestia</title>
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 20px 12px !important; }
      .content { padding: 0 4px !important; }
      .logo { max-width: 140px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; }
      .text-size { font-size: 15px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:#fdfcfb;color:#411600;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fdfcfb;">
    <tr>
      <td align="center" class="wrapper" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;" class="content">
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <img src="${LOGO_URL}" alt="Celestia" width="180" height="auto" class="logo" style="max-width:180px;height:auto;display:block;margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;font-size:18px;line-height:1.6;">
              Thank you for your interest in the Lakehouse at Celestia.
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;font-size:16px;line-height:1.7;color:#5c3d2e;">
              We have received your request. Below are some highlights to help you explore what makes this property unique.
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0;border-top:1px solid #e6dfdb;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;"><strong>Property highlights</strong></p>
              <ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.8;color:#5c3d2e;">
                <li>Elevated workspaces with views over Volta Lake</li>
                <li>Wellness amenities — gym, massage rooms, and reconnection spaces</li>
                <li>Leisure and social areas — pool, bar, dining, and terrace</li>
                <li>Private jetty with direct access to the water</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0;">
              <a href="${lakehouseUrl}" class="btn" style="display:inline-block;padding:14px 28px;background-color:#411600;color:#fdfcfb;text-decoration:none;font-size:14px;letter-spacing:0.05em;">Explore the Lakehouse Experience</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;font-size:14px;line-height:1.6;color:#5c3d2e;">
              For more about the broader Celestia project, including townhomes and chalets, you can explore our <a href="${celestiaUrl}" style="color:#411600;text-decoration:underline;">main Celestia page</a>.
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0;border-top:1px solid #e6dfdb;font-size:13px;line-height:1.6;color:#7a5c4a;">
              For priority updates, consider adding us to your contacts.
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 16px;font-size:14px;line-height:1.6;color:#5c3d2e;">
              Feel free to reply directly if you would like more details.
            </td>
          </tr>
          <tr>
            <td style="padding:32px 0 0;font-size:12px;color:#9a8375;">
              Brownstone Ltd.
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
Thank you for your interest in the Lakehouse at Celestia.

We have received your request. Below are some highlights to help you explore what makes this property unique.

Property highlights:
• Elevated workspaces with views over Volta Lake
• Wellness amenities — gym, massage rooms, and reconnection spaces
• Leisure and social areas — pool, bar, dining, and terrace
• Private jetty with direct access to the water

Explore the Lakehouse Experience: ${lakehouseUrl}

For more about the broader Celestia project: ${celestiaUrl}

For priority updates, consider adding us to your contacts.

Feel free to reply directly if you would like more details.

Brownstone Ltd.
`.trim();
}
