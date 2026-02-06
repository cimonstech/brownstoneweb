import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles, isAdmin } from "@/lib/supabase/auth";
import { CategoriesManager } from "./CategoriesManager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const roles = await getUserRoles();
  if (!isAdmin(roles)) redirect("/admin/dashboard");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, created_at")
    .order("name");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Categories</h2>
        <p className="text-slate-500 mt-1">
          Manage blog categories. Only admins can add or edit. Assign categories to posts when editing them.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
        <CategoriesManager categories={categories ?? []} />
      </div>
    </div>
  );
}
