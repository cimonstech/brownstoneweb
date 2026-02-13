"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { CONTACT_STATUS_LABELS } from "@/lib/crm/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

export function ContactsTable({
  contacts,
  statusOptions,
  currentStatus,
  currentSearch,
  currentTags,
}: {
  contacts: Contact[];
  statusOptions: { value: string; label: string }[];
  currentStatus: string;
  currentSearch: string;
  currentTags: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilters(updates: {
    status?: string;
    search?: string;
    tags?: string;
  }) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (updates.status !== undefined) {
      if (updates.status) params.set("status", updates.status);
      else params.delete("status");
    }
    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search);
      else params.delete("search");
    }
    if (updates.tags !== undefined) {
      if (updates.tags) params.set("tags", updates.tags);
      else params.delete("tags");
    }
    router.push(`/admin/crm/contacts?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label
            htmlFor="status"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={currentStatus}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="search"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Email, name, company..."
            value={currentSearch}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none min-w-[200px]"
          />
        </div>
        {(currentStatus || currentSearch || currentTags) && (
          <button
            type="button"
            onClick={() =>
              updateFilters({ status: "", search: "", tags: "" })
            }
            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Clear filters
          </button>
        )}
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No contacts found. Add one to get started.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/crm/contacts/${contact.id}`}
                        className="font-medium text-slate-800 hover:text-primary transition-colors"
                      >
                        {contact.email}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {contact.name || "—"}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {contact.company || "—"}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {CONTACT_STATUS_LABELS[contact.status as keyof typeof CONTACT_STATUS_LABELS] ?? contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags?.length
                          ? contact.tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
                              >
                                {t}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(contact.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/crm/contacts/${contact.id}`}
                        className="text-slate-400 hover:text-primary transition-colors text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {contacts.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {contacts.length} contact{contacts.length === 1 ? "" : "s"}.
        </p>
      )}
    </div>
  );
}
