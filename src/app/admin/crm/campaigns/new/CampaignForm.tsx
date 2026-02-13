"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Template = { id: string; name: string; subject: string };
type Contact = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  do_not_contact?: boolean;
  unsubscribed?: boolean;
};

export function CampaignForm({
  templates,
  contacts,
}: {
  templates: Template[];
  contacts: Contact[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleContact(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/crm/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type: "cold",
          template_id: templateId || null,
          contact_ids: Array.from(selectedIds),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create campaign");
        return;
      }
      router.push(`/admin/crm/campaigns/${data.id}`);
      router.refresh();
    } catch {
      setError("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  }

  const eligibleContacts = contacts.filter(
    (c) => !c.do_not_contact && !c.unsubscribed
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl"
    >
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Campaign name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="Q1 Cold Outreach"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email template *
          </label>
          <select
            required
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          >
            <option value="">Select a template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.subject}
              </option>
            ))}
          </select>
          {templates.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              Create a template first in Email Templates.
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contacts ({selectedIds.size} selected)
          </label>
          <div className="border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === contacts.length && contacts.length > 0}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Select all</span>
              </label>
            </div>
            <div className="divide-y divide-slate-100">
              {eligibleContacts.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 text-center">
                  No contacts. Add contacts in the Contacts section.
                </div>
              ) : (
                eligibleContacts.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleContact(c.id)}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-slate-800 truncate">
                      {c.name || c.email}
                    </span>
                    <span className="text-xs text-slate-500 truncate flex-1">
                      {c.email}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading || templates.length === 0}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create campaign"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:text-slate-800 border border-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
