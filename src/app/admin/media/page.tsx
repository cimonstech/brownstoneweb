import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { MediaLibrary } from "./MediaLibrary";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  const canDelete = roles.includes("admin") || roles.includes("moderator");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Media</h2>
        <p className="text-slate-500 mt-1">
          All files uploaded to R2 (cover images and inline editor images). Use &quot;Copy URL&quot; to paste into the cover image field or elsewhere.
        </p>
      </div>
      <MediaLibrary canDelete={canDelete} />
    </div>
  );
}
