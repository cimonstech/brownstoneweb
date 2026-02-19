import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";

export default async function AdminRootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const roles = await getUserRoles();
  const isAuthorOnly =
    roles.includes("author") && !roles.includes("admin") && !roles.includes("moderator");
  redirect(isAuthorOnly ? "/admin/posts" : "/admin/dashboard");
}
