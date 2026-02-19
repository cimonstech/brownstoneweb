"use client";

import { useState, useEffect, useCallback } from "react";

export type Segment = {
  id: string;
  name: string;
  color: string;
  contact_count: number;
  created_at: string;
};

const PRESET_COLORS = [
  "#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1",
];

export function useSegments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSegments = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/segments");
      if (res.ok) {
        const data = await res.json();
        setSegments(data);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  return { segments, loading, refresh: fetchSegments };
}

export function SegmentManager({
  segments,
  onRefresh,
}: {
  segments: Segment[];
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#6B7280");
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), color: newColor }),
      });
      if (res.ok) {
        setNewName("");
        setNewColor("#6B7280");
        onRefresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to create segment");
      }
    } catch {
      setError("Failed to create segment");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/crm/segments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), color: editColor }),
      });
      if (res.ok) {
        setEditId(null);
        onRefresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to update");
      }
    } catch {
      setError("Failed to update segment");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete segment "${name}"? Contacts in this segment won't be deleted, just unlinked.`)) return;
    try {
      const res = await fetch(`/api/crm/segments/${id}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Segments ({segments.length})
        </h3>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Create new segment */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New segment name..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="relative">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
              />
            </div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {creating ? "..." : "Add"}
            </button>
          </div>

          {/* Quick color presets */}
          <div className="flex gap-1 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${newColor === c ? "border-slate-800 scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Existing segments */}
          <div className="space-y-2 mt-2">
            {segments.map((seg) =>
              editId === seg.id ? (
                <div key={seg.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate(seg.id);
                      if (e.key === "Escape") setEditId(null);
                    }}
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate(seg.id)}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  key={seg.id}
                  className="flex items-center justify-between py-1.5 group"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-sm text-slate-800 font-medium">{seg.name}</span>
                    <span className="text-xs text-slate-400">
                      {seg.contact_count}
                    </span>
                  </span>
                  <span className="hidden group-hover:inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(seg.id);
                        setEditName(seg.name);
                        setEditColor(seg.color);
                      }}
                      className="text-xs text-slate-400 hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(seg.id, seg.name)}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              )
            )}
            {segments.length === 0 && (
              <p className="text-xs text-slate-400">No segments yet. Create one above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SegmentBadge({ segment }: { segment: { name: string; color: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
      style={{ backgroundColor: segment.color }}
    >
      {segment.name}
    </span>
  );
}
