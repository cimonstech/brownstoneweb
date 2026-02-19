import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/posts");
  }
  return <>{children}</>;
}
