import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";
import { RolesManager } from "./RolesManager";

export default async function AdminRolesPage() {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) redirect("/admin/posts");

  const { data: roleList } = await supabase
    .from("roles")
    .select("id, name, description, created_at")
    .order("name");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Roles</h2>
        <p className="text-slate-500 mt-1">
          Create and edit roles. Built-in roles (admin, moderator, author) cannot be deleted.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
        <RolesManager roles={roleList ?? []} />
      </div>
    </div>
  );
}
