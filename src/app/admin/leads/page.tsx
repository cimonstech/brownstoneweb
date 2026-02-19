import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { LeadsTable } from "./LeadsTable";
import { MarkLeadsViewed } from "./MarkLeadsViewed";

const SOURCES = [
  { value: "", label: "All sources" },
  { value: "contact", label: "Contact" },
  { value: "brochure", label: "Brochure" },
  { value: "lakehouse", label: "Lakehouse" },
  { value: "exit_intent", label: "Exit intent" },
  { value: "newsletter", label: "Newsletter" },
] as const;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; from?: string; to?: string }>;
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

  const params = await searchParams;
  const source = params.source ?? "";
  const from = params.from ?? "";
  const to = params.to ?? "";

  let query = supabase
    .from("leads")
    .select("id, email, phone, country_code, name, message, source, project, consent, contact_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (source && SOURCES.some((s) => s.value === source)) {
    query = query.eq("source", source);
  }
  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }
  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: leads, error } = await query;

  if (error) {
    console.error("Leads fetch error:", error);
  }

  const leadList = leads ?? [];
  const emails = [...new Set(leadList.map((l) => l.email?.trim().toLowerCase()).filter(Boolean))];
  let existingContactIdByEmail: Record<string, string> = {};
  if (emails.length > 0) {
    const { data: contacts } = await supabase
      .from("contacts")
      .select("id, email")
      .in("email", emails);
    if (contacts) {
      existingContactIdByEmail = Object.fromEntries(
        contacts.map((c) => [c.email.toLowerCase(), c.id])
      );
    }
  }

  return (
    <div>
      <MarkLeadsViewed />
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Leads</h2>
        <p className="text-slate-500 mt-1">
          All form submissions from contact, brochure, lakehouse, exit intent, and newsletter.
        </p>
      </div>

      <LeadsTable
        leads={leadList}
        sources={SOURCES}
        currentSource={source}
        currentFrom={from}
        currentTo={to}
        existingContactIdByEmail={existingContactIdByEmail}
      />
    </div>
  );
}
