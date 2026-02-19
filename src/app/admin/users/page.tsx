import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { UserRoleManager } from "./UserRoleManager";
import { InviteForm } from "./InviteForm";
import { DeleteUserButton } from "./DeleteUserButton";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user: me },
  } = await supabase.auth.getUser();
  if (!me) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator") && !roles.includes("author")) redirect("/admin/dashboard");

  const isAdminViewer = roles.includes("admin");
  const canManageRoles = roles.includes("admin") || roles.includes("moderator");
  const allowedRoleNames = isAdminViewer ? ["admin", "moderator", "author"] : ["moderator", "author"];

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
    supabase.from("invites").select("id, email, role_id, created_at, roles(name)").is("used_at", null).order("created_at", { ascending: false }),
    supabase.from("role_audit_log").select("id, target_user_id, action, role_name, performed_by_id, created_at").order("created_at", { ascending: false }).limit(50),
  ]);

  const roleOptionsFiltered = (roleOptions ?? []).filter((r) => allowedRoleNames.includes(r.name));

  const allInvites = invitesResult.error ? [] : (invitesResult.data ?? []);
  const authEmails = new Set<string>();
  let profilesList: typeof profiles = profiles ?? [];
  let userRolesList = userRoles ?? [];

  try {
    const admin = createAdminClient();
    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const authUsers = authData?.users ?? [];
    authUsers.forEach((u) => {
      if (u.email) authEmails.add(u.email.toLowerCase());
    });

    const inviteByEmail = new Map<string, { id: string; role_id: string }>();
    (allInvites as { email?: string; id?: string; role_id?: string }[]).forEach((inv) => {
      const e = (inv.email ?? "").toLowerCase();
      if (e && inv.role_id && inv.id && !inviteByEmail.has(e)) inviteByEmail.set(e, { id: inv.id, role_id: inv.role_id });
    });

    const profileIds = new Set((profiles ?? []).map((p) => p.id));
    let created = 0;
    let rolesApplied = 0;
    for (const u of authUsers) {
      if (!profileIds.has(u.id)) {
        const fullName = u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? u.id.slice(0, 8);
        const { error: insertErr } = await admin.from("profiles").insert({
          id: u.id,
          email: u.email ?? null,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        } as never);
        if (!insertErr) {
          created++;
          profileIds.add(u.id);
        }
      }
      const inv = u.email ? inviteByEmail.get(u.email.toLowerCase()) : null;
      if (inv) {
        const { error: roleErr } = await admin.from("user_roles").insert({ user_id: u.id, role_id: inv.role_id } as never).select().single();
        if (!roleErr) {
          await admin.from("invites").update({ used_at: new Date().toISOString() } as never).eq("id", inv.id);
          rolesApplied++;
          inviteByEmail.delete(u.email!.toLowerCase());
        }
      }
    }
    if (created > 0 || rolesApplied > 0) {
      if (created > 0) {
        const { data: refetched } = await supabase.from("profiles").select("id, full_name, email, avatar_url, bio");
        profilesList = refetched ?? profilesList;
      } else {
        profilesList = profiles ?? [];
      }
      if (rolesApplied > 0) {
        const { data: refetchedRoles } = await supabase.from("user_roles").select("user_id, role_id, roles(name)");
        userRolesList = refetchedRoles ?? userRolesList;
      }
    } else {
      profilesList = profiles ?? [];
    }
  } catch {
    (profiles ?? []).forEach((p) => {
      const e = (p as { email?: string | null }).email?.toLowerCase();
      if (e) authEmails.add(e);
    });
    profilesList = profiles ?? [];
  }

  const pendingInvites = allInvites.filter(
    (inv: { email?: string }) => !authEmails.has((inv.email ?? "").toLowerCase())
  );
  const auditLog = auditResult.error ? [] : (auditResult.data ?? []);

  const roleByUser = (userRolesList ?? []).reduce(
    (acc, ur) => {
      const raw = ur as unknown as { roles: { name: string } | { name: string }[] | null };
      const roleObj = Array.isArray(raw.roles) ? raw.roles[0] : raw.roles;
      const name = roleObj?.name;
      if (name) acc[ur.user_id] = [...(acc[ur.user_id] ?? []), name];
      return acc;
    },
    {} as Record<string, string[]>
  );

  const adminRoleId = (roleOptions ?? []).find((r) => r.name.toLowerCase() === "admin")?.id;
  const adminUserIdsFromSession = new Set([
    ...(adminRoleId ? (userRolesList ?? []).filter((ur) => ur.role_id === adminRoleId).map((ur) => ur.user_id) : []),
    ...Object.entries(roleByUser).filter(([, names]) => names.some((n) => n.toLowerCase() === "admin")).map(([id]) => id),
  ]);
  let adminUserIds = adminUserIdsFromSession;
  if (!isAdminViewer) {
    const adminClient = createAdminClient();
    const { data: adminRoleData } = await adminClient.from("roles").select("id").ilike("name", "admin").maybeSingle();
    const adminRoleRow = adminRoleData as { id: string } | null;
    if (adminRoleRow?.id) {
      const { data: adminUserRows } = await adminClient.from("user_roles").select("user_id").eq("role_id", adminRoleRow.id);
      const rows = (adminUserRows ?? []) as { user_id: string }[];
      adminUserIds = new Set(rows.map((r) => r.user_id));
    }
  }
  const profilesToShow = isAdminViewer ? profilesList : profilesList.filter((p) => !adminUserIds.has(p.id));

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

      <InviteForm roleOptions={roleOptionsFiltered} />

      {(pendingInvites ?? []).length > 0 && (
        <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Pending invites</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            {(pendingInvites as Array<{ email: string; created_at: string; roles: { name: string } | { name: string }[] | null }>).map((inv) => {
              const role = Array.isArray(inv.roles) ? inv.roles[0] : inv.roles;
              const roleLabel = role?.name && allowedRoleNames.includes(role.name) ? role.name : "—";
              return (
              <li key={inv.email}>
                {inv.email} → {roleLabel} ({new Date(inv.created_at).toLocaleDateString()})
              </li>
              );
            })}
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
                {canManageRoles && <th className="px-6 py-4">Roles</th>}
                <th className="px-6 py-4">Posts</th>
                {canManageRoles && <th className="px-6 py-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profilesToShow.map((profile) => {
                const userRolesDisplay = (roleByUser[profile.id] ?? []).filter((r) => allowedRoleNames.includes(r));
                const rolesForDisplay = (roleByUser[profile.id] ?? []).filter((r) => allowedRoleNames.includes(r));
                const roleLabelUnderName = canManageRoles
                  ? rolesForDisplay.length > 0
                    ? rolesForDisplay.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")
                    : "—"
                  : "";
                return (
                <tr key={profile.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-6 py-5">
                    <div>
                      <span className="font-medium text-slate-800">{profile.full_name || profile.id.slice(0, 8)}</span>
                      {profile.id === me.id && (
                        <span className="ml-2 text-xs text-slate-400">(you)</span>
                      )}
                      {canManageRoles && roleLabelUnderName !== "" && (
                        <p className="text-xs text-slate-400 mt-0.5">{roleLabelUnderName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {(profile as { email?: string | null }).email ?? "—"}
                  </td>
                  {canManageRoles && (
                    <td className="px-6 py-5">
                      <UserRoleManager
                        userId={profile.id}
                        currentRoles={roleByUser[profile.id] ?? []}
                        isMe={profile.id === me.id}
                        roleOptions={roleOptionsFiltered}
                        canSeeAdminRole={isAdminViewer}
                      />
                    </td>
                  )}
                  <td className="px-6 py-5 text-sm text-slate-600">{postsByAuthor[profile.id] ?? 0}</td>
                  {canManageRoles && (
                    <td className="px-6 py-5 text-right">
                      {profile.id !== me.id && (
                        <DeleteUserButton
                          userId={profile.id}
                          userName={profile.full_name || (profile as { email?: string }).email || profile.id.slice(0, 8)}
                        />
                      )}
                    </td>
                  )}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isAdminViewer && (
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
      )}
    </div>
  );
}
