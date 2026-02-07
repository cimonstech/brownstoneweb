import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const roleName = typeof body.role === "string" ? body.role.trim() : "author";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const allowedRoles = ["author", "moderator", "admin"];
  if (!allowedRoles.includes(roleName)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: roleData } = await admin.from("roles").select("id").eq("name", roleName).single();
  const role = roleData as { id: string } | null;
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 500 });

  const { data: { user: me } } = await supabase.auth.getUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${request.nextUrl.origin}/admin/login`,
  });
  if (inviteError) {
    if (inviteError.message?.includes("already been invited") || inviteError.message?.includes("already registered")) {
      return NextResponse.json({ error: "User already invited or already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: inviteError.message ?? "Invite failed" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client infers 'never' for invites insert
  const { error: insertError } = await admin.from("invites").insert({ email, role_id: role.id, invited_by_id: me.id } as any);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Invitation sent" });
}
