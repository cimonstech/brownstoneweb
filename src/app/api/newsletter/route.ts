import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertContactByEmail, addContactActivity } from "@/lib/crm/contacts";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
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

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName: name?.split(" ")[0],
      lastName: name?.split(" ").slice(1).join(" ") || undefined,
      unsubscribed: false,
    });

    if (error) {
      console.error("Resend newsletter signup error:", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to subscribe" },
        { status: 502 }
      );
    }

    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ) {
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
          metadata: { source: "newsletter", resend_contact_id: data?.id },
        });
      } catch (dbErr) {
        console.warn("CRM newsletter contact sync failed (optional):", dbErr);
      }

      try {
        const supabase = createAdminClient();
        const { error: leadsErr } = await supabase.from("leads").insert({
          email,
          name: name || null,
          source: "newsletter",
          consent: true,
        } as never);
        if (leadsErr) console.error("Unified leads insert error (newsletter):", leadsErr);
      } catch (err) {
        console.error("Leads insert failed (newsletter):", err);
      }
    } else {
      console.warn(
        "Leads/contacts not saved: set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local to store newsletter signups."
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
