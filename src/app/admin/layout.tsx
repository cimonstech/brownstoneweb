import { AdminShell } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let currentUser: { id: string; email?: string; fullName: string; avatarUrl?: string; roleLabel: string; isAdmin: boolean } | null = null;
  let leadCount = 0;
  if (user) {
    const rolesResult = await getUserRoles();
    const roles = rolesResult;
    if (roles.includes("admin") || roles.includes("moderator")) {
      const { data: viewRow } = await supabase
        .from("admin_lead_views")
        .select("last_viewed_at")
        .eq("user_id", user.id)
        .maybeSingle();
      const lastViewed = viewRow?.last_viewed_at;
      if (lastViewed) {
        const { count } = await supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .gt("created_at", lastViewed);
        leadCount = count ?? 0;
      } else {
        const { count } = await supabase
          .from("leads")
          .select("id", { count: "exact", head: true });
        leadCount = count ?? 0;
      }
    }
    const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
    const name = (profile?.full_name as string | null) || user.email?.split("@")[0] || "User";
    const roleLabel = roles.includes("admin") ? "Admin" : roles.includes("moderator") ? "Moderator" : roles.includes("author") ? "Author" : "User";
    currentUser = {
      id: user.id,
      email: user.email ?? undefined,
      fullName: name,
      avatarUrl: (profile?.avatar_url as string | null) ?? undefined,
      roleLabel,
      isAdmin: roles.includes("admin"),
    };
  }
  return (
    <AdminShell currentUser={currentUser} leadCount={leadCount}>
      {children}
    </AdminShell>
  );
}
