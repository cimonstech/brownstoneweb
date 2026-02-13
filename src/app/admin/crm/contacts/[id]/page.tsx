import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import {
  getContactById,
  getContactActivities,
} from "@/lib/crm/contacts";
import { CONTACT_STATUS_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/crm/types";
import { ContactDetailClient } from "./ContactDetailClient";

export default async function AdminCrmContactDetailPage({
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
  const contact = await getContactById(supabase, id);
  if (!contact) notFound();

  const activities = await getContactActivities(supabase, id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/crm/contacts"
          className="text-sm font-medium text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to contacts
        </Link>
        <h2 className="text-3xl font-bold text-slate-800">
          {contact.name || contact.email}
        </h2>
        <p className="text-slate-500 mt-1">{contact.email}</p>
      </div>

      <ContactDetailClient
        contact={contact}
        activities={activities}
        statusLabels={CONTACT_STATUS_LABELS}
        activityLabels={ACTIVITY_TYPE_LABELS}
      />
    </div>
  );
}
