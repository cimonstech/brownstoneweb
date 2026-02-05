import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user: me },
  } = await supabase.auth.getUser();
  if (!me) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin")) redirect("/admin/dashboard");

  const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url, bio");
  const { data: userRoles } = await supabase.from("user_roles").select("user_id, role_id, roles(name)");
  const roleByUser = (userRoles ?? []).reduce(
    (acc, ur) => {
      const name = (ur as { roles: { name: string } | null }).roles?.name;
      if (name) acc[ur.user_id] = [...(acc[ur.user_id] ?? []), name];
      return acc;
    },
    {} as Record<string, string[]>
  );

  const { count } = await supabase.from("posts").select("id", { count: "exact", head: true });
  const { data: postCounts } = await supabase.from("posts").select("author_id");
  const postsByAuthor = (postCounts ?? []).reduce(
    (acc, p) => {
      acc[p.author_id] = (acc[p.author_id] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-earthy mb-6">Users</h1>
      <p className="text-grey text-sm mb-4">Admin only. Assign roles in Supabase Dashboard (user_roles table) or add an API to manage roles.</p>
      <div className="bg-white rounded-xl border border-grey/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-grey/10">
            <tr>
              <th className="text-left p-4 font-medium text-earthy">Name</th>
              <th className="text-left p-4 font-medium text-earthy">Roles</th>
              <th className="text-left p-4 font-medium text-earthy">Posts</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id} className="border-t border-grey/5">
                <td className="p-4">
                  {profile.full_name || profile.id.slice(0, 8)}
                  {profile.id === me.id && (
                    <span className="ml-2 text-xs text-grey">(you)</span>
                  )}
                </td>
                <td className="p-4 text-sm capitalize">
                  {(roleByUser[profile.id] ?? []).join(", ") || "—"}
                </td>
                <td className="p-4 text-sm">{postsByAuthor[profile.id] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
