"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRole, updateRole, deleteRole } from "./actions";
import { IconEdit, IconDelete } from "@/components/admin/ActionIcons";

const BUILT_IN = ["admin", "moderator", "author"];

type Role = { id: string; name: string; description: string | null; created_at: string };

export function RolesManager({ roles: initialRoles }: { roles: Role[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createRole(formData);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await updateRole(id, formData);
    if (result.error) setError(result.error);
    else {
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete role "${name}"? Users with this role will lose it.`)) return;
    setError("");
    const result = await deleteRole(id);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-xl border border-grey/20">
        <div>
          <label className="block text-sm font-medium text-earthy mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. editor"
            className="border border-grey/20 rounded-lg px-3 py-2 w-40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earthy mb-1">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Optional"
            className="border border-grey/20 rounded-lg px-3 py-2 w-64"
          />
        </div>
        <button type="submit" className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90">
          Add role
        </button>
      </form>

      <ul className="divide-y divide-grey/20 bg-white rounded-xl border border-grey/20 overflow-hidden">
        {initialRoles.map((role) => (
          <li key={role.id} className="p-4 flex items-center justify-between gap-4">
            {editingId === role.id ? (
              <form
                onSubmit={(e) => handleUpdate(e, role.id)}
                className="flex flex-wrap items-center gap-3 flex-1"
              >
                <input
                  type="text"
                  name="name"
                  defaultValue={role.name}
                  className="border border-grey/20 rounded-lg px-3 py-2 w-32"
                />
                <input
                  type="text"
                  name="description"
                  defaultValue={role.description ?? ""}
                  className="border border-grey/20 rounded-lg px-3 py-2 w-64"
                  placeholder="Description"
                />
                <button type="submit" className="text-sm text-primary font-medium">Save</button>
                <button type="button" onClick={() => setEditingId(null)} className="text-sm text-grey">Cancel</button>
              </form>
            ) : (
              <>
                <div>
                  <span className="font-medium text-earthy">{role.name}</span>
                  {BUILT_IN.includes(role.name) && (
                    <span className="ml-2 text-xs text-grey">(built-in)</span>
                  )}
                  {role.description && (
                    <span className="text-grey text-sm block mt-0.5">{role.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(role.id)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Edit"
                    aria-label="Edit"
                  >
                    <IconEdit />
                  </button>
                  {!BUILT_IN.includes(role.name) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(role.id, role.name)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <IconDelete />
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
