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
  if (user) {
    const roles = await getUserRoles();
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
  return <AdminShell currentUser={currentUser}>{children}</AdminShell>;
}
