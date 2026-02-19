"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Segment = { id: string; name: string; color: string };

export function AddContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("");
  const [allSegments, setAllSegments] = useState<Segment[]>([]);
  const [selectedSegIds, setSelectedSegIds] = useState<string[]>([]);

  const loadSegments = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/segments");
      if (res.ok) setAllSegments(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadSegments(); }, [loadSegments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/crm/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
          source: source.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create contact");
        return;
      }
      if (selectedSegIds.length > 0 && data.id) {
        await fetch(`/api/crm/contacts/${data.id}/segments`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ segment_ids: selectedSegIds }),
        });
      }
      router.push(`/admin/crm/contacts/${data.id}`);
      router.refresh();
    } catch {
      setError("Failed to create contact");
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
      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
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
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="+233 24 402 8773"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
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
          <label
            htmlFor="source"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Source
          </label>
          <input
            id="source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="website_form, cold_outreach, referral..."
          />
        </div>
        {allSegments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Segments</label>
            <div className="flex flex-wrap gap-2">
              {allSegments.map((seg) => {
                const active = selectedSegIds.includes(seg.id);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() =>
                      setSelectedSegIds((prev) =>
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
      </div>
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create contact"}
        </button>
        <Link
          href="/admin/crm/contacts"
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
