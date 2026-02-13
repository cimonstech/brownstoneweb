"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";
import type { ContactStatus } from "@/lib/supabase/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Activity = Database["public"]["Tables"]["contact_activities"]["Row"];

const STATUS_OPTIONS: ContactStatus[] = [
  "new_lead",
  "contacted",
  "engaged",
  "qualified",
  "negotiation",
  "converted",
  "dormant",
];

export function ContactDetailClient({
  contact,
  activities,
  statusLabels,
  activityLabels,
}: {
  contact: Contact;
  activities: Activity[];
  statusLabels: Record<string, string>;
  activityLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(contact.status);
  const [note, setNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/crm/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/crm/contacts/${contact.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim() }),
      });
      if (res.ok) {
        setNote("");
        router.refresh();
      }
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Profile</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </dt>
              <dd className="text-slate-800">{contact.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phone
              </dt>
              <dd>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.country_code ?? ""}${contact.phone}`}
                    className="text-primary hover:underline"
                  >
                    {contact.country_code ? `${contact.country_code} ` : ""}
                    {contact.phone}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Company
              </dt>
              <dd className="text-slate-800">{contact.company || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Source
              </dt>
              <dd className="text-slate-800">{contact.source || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </dt>
              <dd>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={savingStatus}
                  className="block border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s] ?? s}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
            {contact.do_not_contact && (
              <div className="sm:col-span-2">
                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                  Do not contact
                </span>
              </div>
            )}
            {contact.unsubscribed && (
              <div className="sm:col-span-2">
                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
                  Unsubscribed
                </span>
              </div>
            )}
            {contact.tags?.length ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Tags
                </dt>
                <dd className="flex flex-wrap gap-1">
                  {contact.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Activity & Notes
          </h3>
          <form onSubmit={handleAddNote} className="mb-6">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              disabled={savingNote}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none resize-none"
            />
            <button
              type="submit"
              disabled={savingNote || !note.trim()}
              className="mt-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {savingNote ? "Adding..." : "Add note"}
            </button>
          </form>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity yet.</p>
            ) : (
              activities.map((a) => (
                <div
                  key={a.id}
                  className="flex gap-4 py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="shrink-0 w-24 text-xs text-slate-500">
                    {new Date(a.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {activityLabels[a.type] ?? a.type}
                    </span>
                    {a.type === "note" &&
                    a.metadata &&
                    typeof a.metadata === "object" &&
                    "content" in a.metadata ? (
                      <p className="text-slate-700 text-sm mt-1 whitespace-pre-wrap">
                        {String((a.metadata as { content?: string }).content)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick info</h3>
          <p className="text-sm text-slate-500">
            Created{" "}
            {new Date(contact.created_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Last updated{" "}
            {new Date(contact.updated_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
