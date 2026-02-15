import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import { getCampaignById } from "@/lib/crm/campaigns";
import { getContacts } from "@/lib/crm/contacts";
import { CampaignDetailClient } from "./CampaignDetailClient";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  completed: "Completed",
};

export default async function AdminCrmCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

  const { id } = await params;
  const campaign = await getCampaignById(supabase, id);
  if (!campaign) notFound();

  const { data: campaignEmails } = await supabase
    .from("campaign_emails")
    .select("id, contact_id, status, sent_at")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false });

  const contactIds = [...new Set((campaignEmails ?? []).map((ce) => ce.contact_id))];
  const { data: campaignContacts } = await supabase
    .from("contacts")
    .select("id, email, name")
    .in("id", contactIds);
  const contactMap = new Map((campaignContacts ?? []).map((c) => [c.id, c]));

  const allContacts = await getContacts(supabase, {}, 500);
  const existingContactIds = new Set(contactIds);

  return (
    <div>
      <Link
        href="/admin/crm/campaigns"
        className="text-sm font-medium text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1 mb-4"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Back to campaigns
      </Link>
      <h2 className="text-3xl font-bold text-slate-800">{campaign.name}</h2>
      <p className="text-slate-500 mt-1">
        {STATUS_LABELS[campaign.status] ?? campaign.status}
      </p>

      <CampaignDetailClient
        campaign={campaign}
        campaignEmails={campaignEmails ?? []}
        contactMap={Object.fromEntries(contactMap)}
        allContacts={allContacts.map((c) => ({
          id: c.id,
          email: c.email,
          name: c.name ?? null,
          do_not_contact: c.do_not_contact,
          unsubscribed: c.unsubscribed,
        }))}
        existingContactIds={Array.from(existingContactIds)}
      />
    </div>
  );
}
