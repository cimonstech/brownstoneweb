"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";
import { EditButton, DeleteButton } from "@/components/admin/ActionIcons";
import type { ContactStatus } from "@/lib/supabase/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Activity = Database["public"]["Tables"]["contact_activities"]["Row"];
type Segment = { id: string; name: string; color: string };

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
  const [deleting, setDeleting] = useState(false);

  const [allSegments, setAllSegments] = useState<Segment[]>([]);
  const [contactSegIds, setContactSegIds] = useState<string[]>([]);
  const [savingSegs, setSavingSegs] = useState(false);

  const loadSegments = useCallback(async () => {
    const [segsRes, memberRes] = await Promise.all([
      fetch("/api/crm/segments"),
      fetch(`/api/crm/contacts/${contact.id}/segments`),
    ]);
    if (segsRes.ok) setAllSegments(await segsRes.json());
    if (memberRes.ok) setContactSegIds(await memberRes.json());
  }, [contact.id]);

  useEffect(() => { loadSegments(); }, [loadSegments]);

  async function toggleSegment(segId: string) {
    const next = contactSegIds.includes(segId)
      ? contactSegIds.filter((s) => s !== segId)
      : [...contactSegIds, segId];
    setSavingSegs(true);
    try {
      const res = await fetch(`/api/crm/contacts/${contact.id}/segments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment_ids: next }),
      });
      if (res.ok) setContactSegIds(next);
    } finally {
      setSavingSegs(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${contact.email}? This will remove their activity and campaign links. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/crm/contacts/${contact.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/crm/contacts");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to delete contact");
      }
    } catch {
      alert("Failed to delete contact");
    } finally {
      setDeleting(false);
    }
  }

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
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-end gap-1">
          <EditButton
            href={`/admin/crm/contacts/${contact.id}/edit`}
            title="Edit contact"
            aria-label="Edit contact"
          />
          <DeleteButton
            onClick={handleDelete}
            disabled={deleting}
            loading={deleting}
            title="Delete contact"
            aria-label="Delete contact"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
        {/* Profile */}
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
                  className="text-primary hover:underline text-[0.8rem]"
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

        {/* Conversation timeline & activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Conversation & activity
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
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity yet.</p>
            ) : (
              [...activities]
                .sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
                .map((a) => (
                  <div
                    key={a.id}
                    className={`flex gap-4 py-3 px-4 rounded-xl border ${
                      a.type === "email_sent"
                        ? "bg-primary/5 border-primary/20"
                        : a.type === "email_received"
                          ? "bg-slate-50 border-slate-200"
                          : "border-slate-100"
                    }`}
                  >
                    <div className="shrink-0 w-28 text-xs text-slate-500">
                      {new Date(a.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        {a.type === "email_sent"
                          ? "You sent"
                          : a.type === "email_received"
                            ? "They replied"
                            : activityLabels[a.type] ?? a.type}
                      </span>
                      {a.type === "email_sent" &&
                        a.metadata &&
                        typeof a.metadata === "object" &&
                        "subject" in a.metadata && (
                          <p className="text-slate-800 text-sm mt-1 font-medium">
                            {(a.metadata as { subject?: string }).subject}
                          </p>
                        )}
                      {a.type === "email_received" &&
                        a.metadata &&
                        typeof a.metadata === "object" &&
                        "subject" in a.metadata && (
                          <p className="text-slate-700 text-sm mt-1">
                            {(a.metadata as { subject?: string }).subject}
                          </p>
                        )}
                      {a.type === "note" &&
                        a.metadata &&
                        typeof a.metadata === "object" &&
                        "content" in a.metadata && (
                          <p className="text-slate-700 text-sm mt-1 whitespace-pre-wrap">
                            {String((a.metadata as { content?: string }).content)}
                          </p>
                        )}
                      {(a.type === "form_submit" || a.type === "call" || a.type === "meeting") &&
                        a.metadata &&
                        typeof a.metadata === "object" &&
                        Object.keys(a.metadata as object).length > 0 && (
                          <p className="text-slate-600 text-sm mt-1">
                            {JSON.stringify(a.metadata)}
                          </p>
                        )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
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

          {/* Segments */}
          {allSegments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Segments
              </h4>
              <div className="flex flex-wrap gap-2">
                {allSegments.map((seg) => {
                  const active = contactSegIds.includes(seg.id);
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => toggleSegment(seg.id)}
                      disabled={savingSegs}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active
                          ? "border-transparent text-white"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                      style={active ? { backgroundColor: seg.color } : {}}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: active ? "#fff" : seg.color }}
                      />
                      {seg.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
