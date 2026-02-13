import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getCelestiaBrochureHtml,
  getCelestiaBrochureText,
  type BrochureProject,
} from "@/lib/emails/celestia-brochure";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let body: { email?: string; project?: string; consent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const project = (body.project === "townhouse" || body.project === "lakehouse" || body.project === "celestia"
    ? body.project
    : "celestia") as BrochureProject;
  const consent = body.consent === true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Please accept the terms to receive the brochure." },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://brownstoneltd.com";

  const brochurePdfUrl =
    typeof process.env.BROCHURE_PDF_URL === "string" && process.env.BROCHURE_PDF_URL.trim()
      ? process.env.BROCHURE_PDF_URL.trim()
      : null;

  // Store lead (optional)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createAdminClient();
      await supabase.from("leads").insert({
        email,
        source: "brochure",
        project,
        consent: true,
      } as never);
    } catch {
      // Ignore
    }
  }

  const html = getCelestiaBrochureHtml(baseUrl, project, brochurePdfUrl);
  const text = getCelestiaBrochureText(baseUrl, brochurePdfUrl, project);

  const from =
    process.env.RESEND_FROM_NOREPLY?.trim() || process.env.CONTACT_FROM_EMAIL || "Brownstone <info@brownstoneltd.com>";
  const subject =
    project === "townhouse"
      ? "Your Celestia Townhouses Brochure — Brownstone Construction"
      : "Your Celestia Property Brochure — Brownstone Construction";

  const replyTo =
    process.env.RESEND_REPLY_TO ?? "info@brownstoneltd.com";

  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Resend error (brochure):", error);
    return NextResponse.json(
      {
        error:
          project === "townhouse"
            ? "We could not send the Celestia Townhouses Brochure. Please try again."
            : "We could not send the brochure. Please try again.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, brochurePdfUrl: brochurePdfUrl ?? undefined });
}
