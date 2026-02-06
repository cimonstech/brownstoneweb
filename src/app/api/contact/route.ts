import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  let body: { name?: string; email?: string; projectType?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, projectType, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const from = process.env.CONTACT_FROM_EMAIL || "Brownstone Contact <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from,
      to: to.trim(),
      replyTo: email.trim(),
      subject: `Website inquiry from ${name.trim()}${projectType ? ` — ${projectType}` : ""}`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        projectType ? `Project type: ${projectType}` : null,
        "",
        "Message:",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 502 }
      );
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
