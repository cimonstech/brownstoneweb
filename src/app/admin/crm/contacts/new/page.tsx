import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import { AddContactForm } from "./AddContactForm";

export default async function AdminCrmContactsNewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  if (!roles.includes("admin") && !roles.includes("moderator")) {
    redirect("/admin/dashboard");
  }

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
        <h2 className="text-3xl font-bold text-slate-800">Add contact</h2>
        <p className="text-slate-500 mt-1">
          Create a new contact in the CRM database.
        </p>
      </div>

      <AddContactForm />
    </div>
  );
}
