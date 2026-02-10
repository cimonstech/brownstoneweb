import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getCelestiaBrochureHtml,
  getCelestiaBrochureText,
  type BrochureProject,
} from "@/lib/emails/celestia-brochure";

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

  const html = getCelestiaBrochureHtml(baseUrl, project, brochurePdfUrl);
  const text = getCelestiaBrochureText(baseUrl, brochurePdfUrl);

  const from =
    process.env.CONTACT_FROM_EMAIL || "Brownstone <onboarding@resend.dev>";
  const subject = "Your Celestia Property Brochure — Brownstone Construction";

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Resend error (brochure):", error);
    return NextResponse.json(
      { error: "We could not send the brochure. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
