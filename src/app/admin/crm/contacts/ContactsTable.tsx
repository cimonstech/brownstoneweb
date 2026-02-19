"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { CONTACT_STATUS_LABELS } from "@/lib/crm/types";
import { ViewButton, EditButton, DeleteButton } from "@/components/admin/ActionIcons";
import type { Segment } from "./SegmentManager";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type SegmentMembership = Record<string, string[]>;

export function ContactsTable({
  contacts,
  statusOptions,
  currentStatus,
  currentSearch,
  currentTags,
  segments,
  onSegmentsChanged,
}: {
  contacts: Contact[];
  statusOptions: { value: string; label: string }[];
  currentStatus: string;
  currentSearch: string;
  currentTags: string;
  segments: Segment[];
  onSegmentsChanged?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [segMembership, setSegMembership] = useState<SegmentMembership>({});
  const [segFilter, setSegFilter] = useState("");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkSegId, setBulkSegId] = useState("");
  const [bulkApplying, setBulkApplying] = useState(false);

  useEffect(() => {
    if (contacts.length === 0) return;
    const ids = contacts.map((c) => c.id);
    Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/crm/contacts/${id}/segments`);
          if (res.ok) {
            const segIds: string[] = await res.json();
            return [id, segIds] as const;
          }
        } catch { /* ignore */ }
        return [id, []] as const;
      })
    ).then((pairs) => {
      const map: SegmentMembership = {};
      for (const [id, segIds] of pairs) map[id] = [...segIds];
      setSegMembership(map);
    });
  }, [contacts]);

  useEffect(() => {
    setSelected(new Set());
  }, [contacts, segFilter]);

  async function handleDeleteContact(contact: Contact) {
    if (!confirm(`Delete ${contact.email}? This will remove their activity and campaign links. This cannot be undone.`)) return;
    setDeletingId(contact.id);
    try {
      const res = await fetch(`/api/crm/contacts/${contact.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to delete contact");
      }
    } catch {
      alert("Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  }

  function updateFilters(updates: { status?: string; search?: string; tags?: string }) {
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

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filteredContacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredContacts.map((c) => c.id)));
    }
  }

  async function handleBulkAddToSegment() {
    if (!bulkSegId || selected.size === 0) return;
    setBulkApplying(true);
    try {
      const ids = [...selected];
      await Promise.all(
        ids.map(async (contactId) => {
          const current = segMembership[contactId] ?? [];
          if (current.includes(bulkSegId)) return;
          const next = [...current, bulkSegId];
          await fetch(`/api/crm/contacts/${contactId}/segments`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ segment_ids: next }),
          });
        })
      );
      setSegMembership((prev) => {
        const updated = { ...prev };
        for (const id of ids) {
          const current = updated[id] ?? [];
          if (!current.includes(bulkSegId)) {
            updated[id] = [...current, bulkSegId];
          }
        }
        return updated;
      });
      setSelected(new Set());
      setBulkSegId("");
      onSegmentsChanged?.();
    } catch {
      alert("Failed to add contacts to segment");
    } finally {
      setBulkApplying(false);
    }
  }

  async function handleBulkRemoveFromSegment() {
    if (!bulkSegId || selected.size === 0) return;
    setBulkApplying(true);
    try {
      const ids = [...selected];
      await Promise.all(
        ids.map(async (contactId) => {
          const current = segMembership[contactId] ?? [];
          if (!current.includes(bulkSegId)) return;
          const next = current.filter((s) => s !== bulkSegId);
          await fetch(`/api/crm/contacts/${contactId}/segments`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ segment_ids: next }),
          });
        })
      );
      setSegMembership((prev) => {
        const updated = { ...prev };
        for (const id of ids) {
          updated[id] = (updated[id] ?? []).filter((s) => s !== bulkSegId);
        }
        return updated;
      });
      setSelected(new Set());
      setBulkSegId("");
      onSegmentsChanged?.();
    } catch {
      alert("Failed to remove contacts from segment");
    } finally {
      setBulkApplying(false);
    }
  }

  const segMap = Object.fromEntries(segments.map((s) => [s.id, s]));

  const filteredContacts = segFilter
    ? contacts.filter((c) => (segMembership[c.id] ?? []).includes(segFilter))
    : contacts;

  const allSelected = filteredContacts.length > 0 && selected.size === filteredContacts.length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <form
        className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-slate-500 mb-1">
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
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        {segments.length > 0 && (
          <div>
            <label htmlFor="segment" className="block text-xs font-medium text-slate-500 mb-1">
              Segment
            </label>
            <select
              id="segment"
              value={segFilter}
              onChange={(e) => setSegFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            >
              <option value="">All segments</option>
              {segments.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1">
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
        {(currentStatus || currentSearch || currentTags || segFilter) && (
          <button
            type="button"
            onClick={() => {
              updateFilters({ status: "", search: "", tags: "" });
              setSegFilter("");
            }}
            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Clear filters
          </button>
        )}
      </form>

      {/* Bulk action bar */}
      {selected.size > 0 && segments.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-sm font-semibold text-primary">
            {selected.size} selected
          </span>
          <span className="text-slate-300">|</span>
          <select
            value={bulkSegId}
            onChange={(e) => setBulkSegId(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none bg-white"
          >
            <option value="">Choose segment...</option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleBulkAddToSegment}
            disabled={!bulkSegId || bulkApplying}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {bulkApplying ? "Applying..." : "Add to segment"}
          </button>
          <button
            type="button"
            onClick={handleBulkRemoveFromSegment}
            disabled={!bulkSegId || bulkApplying}
            className="px-4 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-all"
          >
            Remove from segment
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-slate-500 hover:text-slate-700"
          >
            Deselect all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="pl-5 pr-2 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    aria-label="Select all"
                  />
                </th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Segments</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const contactSegs = (segMembership[contact.id] ?? [])
                    .map((sid) => segMap[sid])
                    .filter(Boolean);
                  const isSelected = selected.has(contact.id);

                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-slate-50/80 transition-all group ${isSelected ? "bg-primary/[0.03]" : ""}`}
                    >
                      <td className="pl-5 pr-2 py-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(contact.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                          aria-label={`Select ${contact.email}`}
                        />
                      </td>
                      <td className="px-5 py-5">
                        <Link
                          href={`/admin/crm/contacts/${contact.id}`}
                          className="font-medium text-slate-800 hover:text-primary transition-colors text-[0.8rem]"
                        >
                          {contact.email}
                        </Link>
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-600">
                        {contact.name || "—"}
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-500">
                        {contact.company || "—"}
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {CONTACT_STATUS_LABELS[contact.status as keyof typeof CONTACT_STATUS_LABELS] ?? contact.status}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-1">
                          {contactSegs.length > 0
                            ? contactSegs.map((seg) => (
                                <span
                                  key={seg.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                                  style={{ backgroundColor: seg.color }}
                                >
                                  {seg.name}
                                </span>
                              ))
                            : <span className="text-slate-300 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-500">
                        {new Date(contact.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-1">
                          <ViewButton href={`/admin/crm/contacts/${contact.id}`} title="View contact" />
                          <EditButton href={`/admin/crm/contacts/${contact.id}/edit`} title="Edit contact" />
                          <DeleteButton
                            onClick={() => handleDeleteContact(contact)}
                            disabled={deletingId === contact.id}
                            loading={deletingId === contact.id}
                            title="Delete contact"
                            aria-label="Delete contact"
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredContacts.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {filteredContacts.length} contact{filteredContacts.length === 1 ? "" : "s"}
          {segFilter ? ` in segment "${segMap[segFilter]?.name ?? ""}"` : ""}.
        </p>
      )}
    </div>
  );
}
