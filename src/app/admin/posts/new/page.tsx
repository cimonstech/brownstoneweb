import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { PostForm } from "@/components/admin/PostForm";

export default async function AdminNewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  const canCreate = roles.includes("author") || roles.includes("moderator") || roles.includes("admin");
  if (!canCreate) redirect("/admin/dashboard");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-earthy mb-6">New post</h1>
      <PostForm
        categories={(categories ?? []).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        userRoles={roles}
        authorId={user.id}
      />
    </div>
  );
}
