import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import { getContactById, addContactActivity } from "@/lib/crm/contacts";
import { z } from "zod";

const addNoteSchema = z.object({
  note: z.string().min(1).max(10000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const contact = await getContactById(supabase, id);
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = addNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Note is required", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await addContactActivity(supabase, {
      contact_id: id,
      type: "note",
      metadata: { content: parsed.data.note },
      created_by_id: user.id,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CRM contact note POST error:", err);
    return NextResponse.json(
      { error: "Failed to add note" },
      { status: 500 }
    );
  }
}
