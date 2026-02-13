import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { getContacts, createContact } from "@/lib/crm/contacts";
import { z } from "zod";

const createContactSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const tagsParam = searchParams.get("tags");
  const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;

  try {
    const contacts = await getContacts(supabase, {
      status,
      search,
      source,
      tags,
    });
    return NextResponse.json(contacts);
  } catch (err) {
    console.error("CRM contacts GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, name, phone, country_code, company, source, status, tags } =
    parsed.data;

  try {
    const contact = await createContact(supabase, {
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      country_code: country_code?.trim() || null,
      company: company?.trim() || null,
      source: source?.trim() || null,
      status: status ?? "new_lead",
      tags: tags ?? [],
    });
    return NextResponse.json(contact);
  } catch (err) {
    console.error("CRM contacts POST error:", err);
    const message = err && typeof err === "object" && "code" in err
      ? (err as { code?: string }).code === "23505"
        ? "A contact with this email already exists"
        : "Failed to create contact"
      : "Failed to create contact";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
