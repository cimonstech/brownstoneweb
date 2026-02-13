import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import { ContactsTable } from "./ContactsTable";
import { getContacts } from "@/lib/crm/contacts";
import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@/lib/crm/types";

export default async function AdminCrmContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; tags?: string }>;
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
  const status = params.status ?? "";
  const search = params.search ?? "";
  const tagsParam = params.tags ?? "";
  const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;

  const contacts = await getContacts(supabase, {
    status: status || undefined,
    search: search || undefined,
    tags: tags?.length ? tags : undefined,
  });

  const statusOptions = CONTACT_STATUSES.map((s) => ({
    value: s,
    label: CONTACT_STATUS_LABELS[s],
  }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Contacts</h2>
          <p className="text-slate-500 mt-1">
            CRM contact database. Manage pipeline status, tags, and activity.
          </p>
        </div>
        <Link
          href="/admin/crm/contacts/new"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add contact
        </Link>
      </div>

      <ContactsTable
        contacts={contacts}
        statusOptions={statusOptions}
        currentStatus={status}
        currentSearch={search}
        currentTags={tagsParam}
      />
    </div>
  );
}
