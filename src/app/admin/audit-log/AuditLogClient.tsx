"use client";

import { useState, useEffect, useCallback, Fragment } from "react";

type AuditEntry = {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  description: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  bulk_delete: "bg-red-100 text-red-700",
  import: "bg-purple-100 text-purple-700",
  send: "bg-amber-100 text-amber-700",
  assign_role: "bg-indigo-100 text-indigo-700",
  remove_role: "bg-orange-100 text-orange-700",
  invite: "bg-teal-100 text-teal-700",
  upload: "bg-cyan-100 text-cyan-700",
  login: "bg-slate-100 text-slate-700",
};

const ALL_ACTIONS = [
  "create", "update", "delete", "bulk_delete", "import",
  "send", "assign_role", "remove_role", "invite", "upload",
];

const ALL_RESOURCE_TYPES = [
  "contact", "lead", "post", "category", "campaign", "template",
  "segment", "user", "role", "media", "now_selling", "note",
];

function parseBrowser(ua: string | null): string {
  if (!ua) return "—";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Other";
}

export function AuditLogClient() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "50");
      if (filterAction) params.set("action", filterAction);
      if (filterResource) params.set("resource_type", filterResource);
      if (filterSearch.trim()) params.set("search", filterSearch.trim());

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, filterAction, filterResource, filterSearch]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(1);
  }, [filterAction, filterResource, filterSearch]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div>
          <label htmlFor="action" className="block text-xs font-medium text-slate-500 mb-1">
            Action
          </label>
          <select
            id="action"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          >
            <option value="">All actions</option>
            {ALL_ACTIONS.map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="resource" className="block text-xs font-medium text-slate-500 mb-1">
            Resource
          </label>
          <select
            id="resource"
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
          >
            <option value="">All resources</option>
            {ALL_RESOURCE_TYPES.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Description, email..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none min-w-[200px]"
          />
        </div>
        {(filterAction || filterResource || filterSearch) && (
          <button
            type="button"
            onClick={() => {
              setFilterAction("");
              setFilterResource("");
              setFilterSearch("");
            }}
            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-5 py-4">When</th>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Action</th>
                <th className="px-5 py-4">Resource</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">IP</th>
                <th className="px-5 py-4">Browser</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No audit log entries found.
                  </td>
                </tr>
              ) : (
                logs.map((entry) => (
                  <Fragment key={entry.id}>
                    <tr
                      className="hover:bg-slate-50/80 transition-all text-sm cursor-pointer"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">
                        {new Date(entry.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        <span className="text-slate-400">
                          {new Date(entry.created_at).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-700 font-medium">
                          {entry.user_email?.split("@")[0] ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ACTION_COLORS[entry.action] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {entry.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 capitalize">
                        {entry.resource_type.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-700 max-w-[300px] truncate">
                        {entry.description}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                        {entry.ip_address ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {parseBrowser(entry.user_agent)}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedId === entry.id ? "rotate-180" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </td>
                    </tr>
                    {expandedId === entry.id && (
                      <tr key={`${entry.id}-detail`} className="bg-slate-50">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Full email
                              </span>
                              <span className="text-slate-700">{entry.user_email ?? "—"}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Resource ID
                              </span>
                              <span className="text-slate-700 font-mono text-[10px] break-all">
                                {entry.resource_id ?? "—"}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                IP address
                              </span>
                              <span className="text-slate-700 font-mono">{entry.ip_address ?? "—"}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Timestamp
                              </span>
                              <span className="text-slate-700">
                                {new Date(entry.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="col-span-2 md:col-span-4">
                              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                User agent
                              </span>
                              <span className="text-slate-600 text-[10px] break-all">
                                {entry.user_agent ?? "—"}
                              </span>
                            </div>
                            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                              <div className="col-span-2 md:col-span-4">
                                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                  Metadata
                                </span>
                                <pre className="text-[10px] text-slate-600 bg-white rounded-lg p-3 border border-slate-200 overflow-x-auto">
                                  {JSON.stringify(entry.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {total} total entries{totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
