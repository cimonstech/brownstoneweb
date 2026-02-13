import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { getTemplates, createTemplate } from "@/lib/crm/templates";
import { z } from "zod";

const createTemplateSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  body_html: z.string().min(1),
  variables: z.array(z.string()).optional(),
});

export async function GET() {
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

  try {
    const templates = await getTemplates(supabase);
    return NextResponse.json(templates);
  } catch (err) {
    console.error("CRM templates GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
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

  const parsed = createTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const template = await createTemplate(supabase, {
      name: parsed.data.name,
      subject: parsed.data.subject,
      body_html: parsed.data.body_html,
      variables: parsed.data.variables ?? [],
    });
    return NextResponse.json(template);
  } catch (err) {
    console.error("CRM templates POST error:", err);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
