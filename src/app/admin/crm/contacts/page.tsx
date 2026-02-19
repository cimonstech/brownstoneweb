import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { getContacts } from "@/lib/crm/contacts";
import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@/lib/crm/types";
import { ContactsPageClient } from "./ContactsPageClient";

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
    <ContactsPageClient
      contacts={contacts}
      statusOptions={statusOptions}
      currentStatus={status}
      currentSearch={search}
      currentTags={tagsParam}
    />
  );
}
