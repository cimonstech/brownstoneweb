import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import { getCampaigns } from "@/lib/crm/campaigns";
import { ViewButton, DeleteButton } from "@/components/admin/ActionIcons";
import { DeleteCampaignButton } from "./DeleteCampaignButton";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  completed: "Completed",
};

export default async function AdminCrmCampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

  const campaigns = await getCampaigns(supabase);

  const campaignsWithStats = await Promise.all(
    campaigns.map(async (c) => {
      const { count: total } = await supabase
        .from("campaign_emails")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", c.id);
      const { count: sent } = await supabase
        .from("campaign_emails")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", c.id)
        .eq("status", "sent");
      return {
        ...c,
        total: total ?? 0,
        sent: sent ?? 0,
      };
    })
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Campaigns</h2>
          <p className="text-slate-500 mt-1">
            Cold email campaigns. Select contacts, choose a template, and send.
          </p>
        </div>
        <Link
          href="/admin/crm/campaigns/new"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New campaign
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaignsWithStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No campaigns yet. Create one to send cold emails.
                  </td>
                </tr>
              ) : (
                campaignsWithStats.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-5 font-medium text-slate-800">
                      {c.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 capitalize">
                      {c.type}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : c.status === "sending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {STATUS_LABELS[c.status] ?? c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {c.sent} / {c.total}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(c.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1">
                        <ViewButton href={`/admin/crm/campaigns/${c.id}`} title="View campaign" />
                        <DeleteCampaignButton campaignId={c.id} campaignName={c.name} />
                      </span>
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
