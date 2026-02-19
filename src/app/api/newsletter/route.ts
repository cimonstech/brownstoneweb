import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertContactByEmail, addContactActivity } from "@/lib/crm/contacts";
import { notifyLeadModerator } from "@/lib/emails/lead-notify";
import { logger } from "@/lib/logger";

const log = logger.create("api:newsletter");

export async function POST(request: Request) {
  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    return NextResponse.json(
      { error: "Newsletter service not configured" },
      { status: 503 }
    );
  }

  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : undefined;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();
    const contact = await upsertContactByEmail(supabase, email, {
      name: name || undefined,
      source: "newsletter",
      status: "new_lead",
    });
    await addContactActivity(supabase, {
      contact_id: contact.id,
      type: "form_submit",
      metadata: { source: "newsletter" },
    });

    const { error: leadsErr } = await supabase.from("leads").insert({
      email,
      name: name || null,
      source: "newsletter",
      consent: true,
    } as never);
    if (leadsErr) log.error("Lead insert failed", leadsErr);
    else {
      notifyLeadModerator({ source: "newsletter", email, name: name || null }).catch((e) =>
        log.error("Lead notification failed", e)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    log.error("Newsletter subscribe failed", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
