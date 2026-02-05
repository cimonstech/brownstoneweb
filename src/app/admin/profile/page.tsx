import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const roles = await getUserRoles();

  return (
    <div>
      <h1 className="text-2xl font-bold text-earthy mb-6">Profile</h1>
      <ProfileForm
        userId={user.id}
        email={user.email ?? ""}
        initialFullName={profile?.full_name ?? ""}
        initialBio={profile?.bio ?? ""}
        initialAvatarUrl={profile?.avatar_url ?? ""}
        roles={roles}
      />
    </div>
  );
}
