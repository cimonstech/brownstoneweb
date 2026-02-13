import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { PipelineKanban } from "./PipelineKanban";
import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@/lib/crm/types";

export default async function AdminCrmPipelinePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, email, name, company, status, created_at")
    .order("created_at", { ascending: false });

  const columns = CONTACT_STATUSES.map((status) => ({
    status,
    label: CONTACT_STATUS_LABELS[status],
    contacts: (contacts ?? []).filter((c) => c.status === status),
  }));

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Pipeline</h2>
        <p className="text-slate-500 mt-1">
          Drag contacts between stages to update their status.
        </p>
      </div>
      <PipelineKanban columns={columns} />
    </div>
  );
}
