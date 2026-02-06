import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { UserRoleManager } from "./UserRoleManager";
import { InviteForm } from "./InviteForm";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user: me },
  } = await supabase.auth.getUser();
  if (!me) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin")) redirect("/admin/dashboard");

  const [
    { data: profiles },
    { data: userRoles },
    { data: postCounts },
    { data: roleOptions },
    invitesResult,
    auditResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, avatar_url, bio"),
    supabase.from("user_roles").select("user_id, role_id, roles(name)"),
    supabase.from("posts").select("author_id"),
    supabase.from("roles").select("id, name").order("name"),
    supabase.from("invites").select("id, email, created_at, roles(name)").is("used_at", null).order("created_at", { ascending: false }),
    supabase.from("role_audit_log").select("id, target_user_id, action, role_name, performed_by_id, created_at").order("created_at", { ascending: false }).limit(50),
  ]);

  const pendingInvites = invitesResult.error ? [] : (invitesResult.data ?? []);
  const auditLog = auditResult.error ? [] : (auditResult.data ?? []);

  const roleByUser = (userRoles ?? []).reduce(
    (acc, ur) => {
      const raw = ur as unknown as { roles: { name: string } | { name: string }[] | null };
      const roleObj = Array.isArray(raw.roles) ? raw.roles[0] : raw.roles;
      const name = roleObj?.name;
      if (name) acc[ur.user_id] = [...(acc[ur.user_id] ?? []), name];
      return acc;
    },
    {} as Record<string, string[]>
  );

  const postsByAuthor = (postCounts ?? []).reduce(
    (acc, p) => {
      acc[p.author_id] = (acc[p.author_id] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const performerIds = [...new Set((auditLog ?? []).map((a) => a.performed_by_id))];
  const { data: performerProfiles } = performerIds.length > 0
    ? await supabase.from("profiles").select("id, full_name").in("id", performerIds)
    : { data: [] };
  const performerNames = (performerProfiles ?? []).reduce(
    (acc, p) => {
      acc[p.id] = p.full_name || p.id.slice(0, 8);
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Users & roles</h2>
        <p className="text-slate-500 mt-1">
          Invite users and assign roles. You cannot change your own roles.
        </p>
      </div>

      <InviteForm roleOptions={roleOptions ?? []} />

      {(pendingInvites ?? []).length > 0 && (
        <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Pending invites</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            {(pendingInvites as Array<{ email: string; created_at: string; roles: { name: string } | null }>).map((inv) => (
              <li key={inv.email}>
                {inv.email} → {inv.roles?.name ?? "—"} ({new Date(inv.created_at).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Roles</th>
                <th className="px-6 py-4">Posts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(profiles ?? []).map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-6 py-5">
                    <span className="font-medium text-slate-800">{profile.full_name || profile.id.slice(0, 8)}</span>
                    {profile.id === me.id && (
                      <span className="ml-2 text-xs text-slate-400">(you)</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {(profile as { email?: string | null }).email ?? "—"}
                  </td>
                  <td className="px-6 py-5">
                    <UserRoleManager
                      userId={profile.id}
                      currentRoles={roleByUser[profile.id] ?? []}
                      isMe={profile.id === me.id}
                      roleOptions={roleOptions ?? []}
                    />
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">{postsByAuthor[profile.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Role audit log</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {(auditLog ?? []).length === 0 ? (
            <p className="px-6 py-8 text-slate-500 text-sm">No role changes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(auditLog ?? []).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-800">{row.action}</td>
                      <td className="px-6 py-5 text-sm text-slate-800">{row.role_name}</td>
                      <td className="px-6 py-5 text-sm text-slate-600">{performerNames[row.performed_by_id] ?? row.performed_by_id.slice(0, 8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
