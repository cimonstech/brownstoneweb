"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Column = {
  status: string;
  label: string;
  contacts: { id: string; email: string; name: string | null; company: string | null; status: string; created_at: string }[];
};

export function PipelineKanban({ columns }: { columns: Column[] }) {
  const router = useRouter();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<string | null>(null);

  async function handleDrop(contactId: string, newStatus: string) {
    setDraggedId(null);
    setTargetStatus(null);
    try {
      const res = await fetch(`/api/crm/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
      {columns.map((col) => (
        <div
          key={col.status}
          className={`flex-shrink-0 w-72 rounded-xl border-2 transition-colors ${
            targetStatus === col.status
              ? "border-primary bg-primary/5"
              : "border-slate-200 bg-slate-50/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setTargetStatus(col.status);
          }}
          onDragLeave={() => setTargetStatus(null)}
          onDrop={(e) => {
            e.preventDefault();
            setTargetStatus(null);
            const id = e.dataTransfer.getData("contact-id");
            if (id) handleDrop(id, col.status);
          }}
        >
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">{col.label}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {col.contacts.length} contact{col.contacts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="p-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
            {col.contacts.map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("contact-id", c.id);
                  setDraggedId(c.id);
                }}
                onDragEnd={() => setDraggedId(null)}
                className={`p-3 rounded-lg bg-white border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing ${
                  draggedId === c.id ? "opacity-50" : ""
                }`}
              >
                <Link
                  href={`/admin/crm/contacts/${c.id}`}
                  className="font-medium text-slate-800 hover:text-primary text-sm block truncate"
                >
                  {c.name || c.email}
                </Link>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {c.company || c.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
