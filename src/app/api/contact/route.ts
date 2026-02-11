import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getContactReceivedHtml, getContactReceivedText } from "@/lib/emails/contact-received";

export async function POST(request: Request) {
  const to = process.env.CONTACTFORMMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "Contact recipient not configured (CONTACTFORMMAIL)." },
      { status: 503 }
    );
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured (RESEND_API_KEY)." },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let body: { name?: string; email?: string; projectType?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, projectType, message } = body;
  const emailTrimmed = email?.trim() ?? "";
  if (!name?.trim() || !emailTrimmed || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const fromInquiry =
    process.env.RESEND_FROM_SUPPORT || process.env.CONTACT_FROM_EMAIL || "Brownstone Support <support@brownstoneltd.com>";
  const fromAutoReply =
    process.env.RESEND_FROM_NOREPLY || process.env.CONTACT_FROM_EMAIL || "Brownstone <noreply@brownstoneltd.com>";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://brownstoneltd.com";

  try {
    const { error: inquiryError } = await resend.emails.send({
      from: fromInquiry,
      to: to.trim(),
      replyTo: emailTrimmed,
      subject: `Website inquiry from ${name.trim()}${projectType ? ` — ${projectType}` : ""}`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${emailTrimmed}`,
        projectType ? `Project type: ${projectType}` : null,
        "",
        "Message:",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (inquiryError) {
      console.error("Resend error (inquiry):", inquiryError);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 502 }
      );
    }

    const brownstoneLogoUrl =
      typeof process.env.BROWNSTONE_LOGO_URL === "string" && process.env.BROWNSTONE_LOGO_URL.trim()
        ? process.env.BROWNSTONE_LOGO_URL.trim()
        : undefined;

    const { error: autoReplyError } = await resend.emails.send({
      from: fromAutoReply,
      to: emailTrimmed,
      subject: "We've received your message — Brownstone Construction",
      html: getContactReceivedHtml(baseUrl, brownstoneLogoUrl),
      text: getContactReceivedText(baseUrl),
    });

    if (autoReplyError) {
      console.error("Resend error (auto-reply):", autoReplyError);
      // Inquiry was sent; don't fail the request, only log
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
