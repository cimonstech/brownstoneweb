import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLakehouseThankYouHtml, getLakehouseThankYouText } from "@/lib/emails/lakehouse-thank-you";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let body: { email?: string; consent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const consent = body.consent === true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Please agree to receive updates about Lakehouse at Celestia." },
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
      await supabase.from("lakehouse_leads").insert({ email, consent } as any);
    }
  } catch (dbErr) {
    console.warn("Lakehouse lead DB insert failed (optional):", dbErr);
  }

  const from =
    process.env.CONTACT_FROM_EMAIL || "Brownstone <onboarding@resend.dev>";
  const subject = "Your Lakehouse at Celestia details";

  const html = getLakehouseThankYouHtml(baseUrl);
  const text = getLakehouseThankYouText(baseUrl);

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "We could not send the email. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
