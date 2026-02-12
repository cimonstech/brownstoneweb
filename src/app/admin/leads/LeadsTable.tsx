"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

function getSourceLabel(lead: Lead): string {
  if (lead.source === "brochure" && lead.project === "townhouse") {
    return "Celestia Townhouses Brochure";
  }
  if (lead.source === "brochure" && lead.project === "celestia") {
    return "Celestia Brochure";
  }
  if (lead.source === "brochure" && lead.project === "lakehouse") {
    return "Celestia Brochure (Lakehouse)";
  }
  const labels: Record<string, string> = {
    contact: "Contact",
    brochure: "Brochure",
    lakehouse: "Lakehouse",
    exit_intent: "Exit intent",
    newsletter: "Newsletter",
  };
  return labels[lead.source] ?? lead.source;
}

export function LeadsTable({
  leads,
  sources,
  currentSource,
  currentFrom,
  currentTo,
}: {
  leads: Lead[];
  sources: readonly { value: string; label: string }[];
  currentSource: string;
  currentFrom: string;
  currentTo: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilters(updates: { source?: string; from?: string; to?: string }) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (updates.source !== undefined) {
      if (updates.source) params.set("source", updates.source);
      else params.delete("source");
    }
    if (updates.from !== undefined) {
      if (updates.from) params.set("from", updates.from);
      else params.delete("from");
    }
    if (updates.to !== undefined) {
      if (updates.to) params.set("to", updates.to);
      else params.delete("to");
    }
    router.push(`/admin/leads?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="source" className="block text-xs font-medium text-slate-500 mb-1">
            Source
          </label>
          <select
            id="source"
            value={currentSource}
            onChange={(e) => updateFilters({ source: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          >
            {sources.map((s) => (
              <option key={s.value || "all"} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="from" className="block text-xs font-medium text-slate-500 mb-1">
            From date
          </label>
          <input
            id="from"
            type="date"
            value={currentFrom}
            onChange={(e) => updateFilters({ from: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-xs font-medium text-slate-500 mb-1">
            To date
          </label>
          <input
            id="to"
            type="date"
            value={currentTo}
            onChange={(e) => updateFilters({ to: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          />
        </div>
        {(currentSource || currentFrom || currentTo) && (
          <button
            type="button"
            onClick={() => updateFilters({ source: "", from: "", to: "" })}
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
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-5">
                      <a
                        href={`mailto:${lead.email}`}
                        className="font-medium text-slate-800 hover:text-primary transition-colors"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {lead.phone ? (
                        <a href={`tel:${lead.country_code ?? ""}${lead.phone}`} className="hover:text-primary">
                          {lead.country_code ? `${lead.country_code} ` : ""}
                          {lead.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{lead.name || "—"}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {getSourceLabel(lead)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">{lead.project || "—"}</td>
                    <td className="px-6 py-5 text-sm text-slate-500 max-w-[200px] truncate" title={lead.message ?? undefined}>
                      {lead.message || "—"}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {leads.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {leads.length} lead{leads.length === 1 ? "" : "s"} (max 200).
        </p>
      )}
    </div>
  );
}
