import { NextResponse } from "next/server";
import { ServerClient } from "postmark";
import { getPostmarkFrom } from "@/lib/emails/postmark-from";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCelestiaBrochureHtml, getCelestiaBrochureText } from "@/lib/emails/celestia-brochure";


export async function POST(request: Request) {
  if (!process.env.POSTMARK_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  const client = new ServerClient(process.env.POSTMARK_API_KEY);

  let body: { email?: string; consent?: boolean; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const consent = body.consent === true;
  const source = body.source === "exit_intent" ? "exit_intent" : "lakehouse";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Please accept the terms to receive your exclusive details." },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://brownstoneltd.com";

  try {
    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ) {
      const supabase = createAdminClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client infers 'never' for lakehouse_leads insert
      const { error: lakehouseErr } = await supabase.from("lakehouse_leads").insert({ email, consent } as any);
      if (lakehouseErr) console.error("Lakehouse leads insert error:", lakehouseErr);
      const { error: leadsErr } = await supabase.from("leads").insert({
        email,
        source,
        project: "lakehouse",
        consent,
      } as never);
      if (leadsErr) console.error("Unified leads insert error (lakehouse):", leadsErr);
    } else {
      console.warn(
        "Leads not saved: set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local (and redeploy) to store leads."
      );
    }
  } catch (dbErr) {
    console.error("Lakehouse lead DB error:", dbErr);
  }

  const brochurePdfUrl =
    typeof process.env.BROCHURE_PDF_URL === "string" && process.env.BROCHURE_PDF_URL.trim()
      ? process.env.BROCHURE_PDF_URL.trim()
      : null;

  const subject = "Your Celestia Property Brochure — Brownstone Construction";
  const html = getCelestiaBrochureHtml(baseUrl, "lakehouse", brochurePdfUrl);
  const text = getCelestiaBrochureText(baseUrl, brochurePdfUrl, "lakehouse");
  const replyTo = process.env.POSTMARK_REPLY_TO ?? "candace@brownstoneltd.com";

  try {
    await client.sendEmail({
      From: getPostmarkFrom(),
      To: email,
      ReplyTo: replyTo,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
    });
  } catch (err) {
    console.error("Postmark error:", err);
    return NextResponse.json(
      { error: "We could not send the email. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, brochurePdfUrl: brochurePdfUrl ?? undefined });
}
