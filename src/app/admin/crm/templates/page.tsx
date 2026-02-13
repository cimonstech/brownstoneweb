import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import { getTemplates } from "@/lib/crm/templates";

export default async function AdminCrmTemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

  const templates = await getTemplates(supabase);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Email Templates</h2>
          <p className="text-slate-500 mt-1">
            Reusable templates with variables: {"{{first_name}}"}, {"{{company}}"}, {"{{email}}"}.
          </p>
        </div>
        <Link
          href="/admin/crm/templates/new"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New template
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Variables</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No templates yet. Create one to use in campaigns.
                  </td>
                </tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-5 font-medium text-slate-800">
                      {t.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 truncate max-w-[200px]">
                      {t.subject}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {t.variables?.length
                          ? t.variables.map((v) => (
                              <span
                                key={v}
                                className="inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600"
                              >
                                {`{{${v}}}`}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(t.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/crm/templates/${t.id}/edit`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
