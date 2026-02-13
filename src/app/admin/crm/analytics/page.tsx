import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@/lib/crm/types";
import { AnalyticsCharts } from "./AnalyticsCharts";

export default async function AdminCrmAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const fromDate = thirtyDaysAgo.toISOString();

  const { count: contactsCount } = await supabase
    .from("contacts")
    .select("id", { count: "exact", head: true });

  const { data: contactsData } = await supabase
    .from("contacts")
    .select("status, source, created_at");

  const statusCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const dateCounts: Record<string, number> = {};

  (contactsData ?? []).forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
    const src = r.source?.trim() || "unknown";
    sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
    if (r.created_at >= fromDate) {
      const date = r.created_at.slice(0, 10);
      dateCounts[date] = (dateCounts[date] ?? 0) + 1;
    }
  });

  const pipelineData = CONTACT_STATUSES.map((status) => ({
    status,
    label: CONTACT_STATUS_LABELS[status],
    count: statusCounts[status] ?? 0,
  }));

  const leadsOverTime: { date: string; contacts: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    leadsOverTime.push({
      date: dateStr,
      contacts: dateCounts[dateStr] ?? 0,
    });
  }

  const sourceData = Object.entries(sourceCounts)
    .filter(([k]) => k !== "unknown")
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  if (Object.keys(sourceCounts).includes("unknown") && sourceCounts.unknown > 0) {
    sourceData.push({ source: "unknown", count: sourceCounts.unknown });
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">CRM Analytics</h2>
        <p className="text-slate-500 mt-1">
          Lead metrics and pipeline overview.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Total contacts</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">
            {contactsCount ?? 0}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">New leads</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">
            {statusCounts?.new_lead ?? 0}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Converted</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">
            {statusCounts?.converted ?? 0}
          </h3>
        </div>
      </div>

      <AnalyticsCharts
        pipelineData={pipelineData}
        leadsOverTime={leadsOverTime}
        sourceData={sourceData}
      />
    </div>
  );
}
