"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@/lib/crm/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type Segment = { id: string; name: string; color: string };

export function EditContactForm({ contact }: { contact: Contact }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(contact.name ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [countryCode, setCountryCode] = useState(contact.country_code ?? "");
  const [company, setCompany] = useState(contact.company ?? "");
  const [source, setSource] = useState(contact.source ?? "");
  const [status, setStatus] = useState(contact.status);
  const [doNotContact, setDoNotContact] = useState(contact.do_not_contact);
  const [unsubscribed, setUnsubscribed] = useState(contact.unsubscribed);
  const [tagsStr, setTagsStr] = useState((contact.tags ?? []).join(", "));

  const [allSegments, setAllSegments] = useState<Segment[]>([]);
  const [contactSegIds, setContactSegIds] = useState<string[]>([]);

  const loadSegments = useCallback(async () => {
    const [segsRes, memberRes] = await Promise.all([
      fetch("/api/crm/segments"),
      fetch(`/api/crm/contacts/${contact.id}/segments`),
    ]);
    if (segsRes.ok) setAllSegments(await segsRes.json());
    if (memberRes.ok) setContactSegIds(await memberRes.json());
  }, [contact.id]);

  useEffect(() => { loadSegments(); }, [loadSegments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tags = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch(`/api/crm/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          phone: phone.trim() || null,
          country_code: countryCode.trim() || null,
          company: company.trim() || null,
          source: source.trim() || null,
          status,
          do_not_contact: doNotContact,
          unsubscribed,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update contact");
        return;
      }
      await fetch(`/api/crm/contacts/${contact.id}/segments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment_ids: contactSegIds }),
      });
      router.push(`/admin/crm/contacts/${contact.id}`);
      router.refresh();
    } catch {
      setError("Failed to update contact");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-xl"
    >
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="mb-6">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</span>
        <p className="text-slate-800 text-[0.8rem] mt-0.5">{contact.email}</p>
        <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="John Doe"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country_code" className="block text-sm font-medium text-slate-700 mb-2">
              Country code
            </label>
            <input
              id="country_code"
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
              placeholder="+233"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
              placeholder="24 402 8773"
            />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-slate-700 mb-2">
            Source
          </label>
          <input
            id="source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="newsletter, brochure, contact..."
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          >
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CONTACT_STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="investor, warm, residential"
          />
        </div>
        {allSegments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Segments</label>
            <div className="flex flex-wrap gap-2">
              {allSegments.map((seg) => {
                const active = contactSegIds.includes(seg.id);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() =>
                      setContactSegIds((prev) =>
                        active ? prev.filter((s) => s !== seg.id) : [...prev, seg.id]
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? "border-transparent text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                    style={active ? { backgroundColor: seg.color } : {}}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: active ? "#fff" : seg.color }}
                    />
                    {seg.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={doNotContact}
              onChange={(e) => setDoNotContact(e.target.checked)}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-slate-700">Do not contact</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unsubscribed}
              onChange={(e) => setUnsubscribed(e.target.checked)}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-slate-700">Unsubscribed</span>
          </label>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-70"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
        <Link
          href={`/admin/crm/contacts/${contact.id}`}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
