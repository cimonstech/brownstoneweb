"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignRole, removeRole } from "./actions";

const ROLE_ORDER = ["admin", "moderator", "author"] as const;

type Props = {
  userId: string;
  currentRoles: string[];
  isMe: boolean;
  roleOptions: { id: string; name: string }[];
  canSeeAdminRole?: boolean;
};

export function UserRoleManager({
  userId,
  currentRoles,
  isMe,
  roleOptions,
  canSeeAdminRole = true,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const visibleRoles = canSeeAdminRole ? currentRoles : currentRoles.filter((r) => r !== "admin");
  const availableToAdd = roleOptions.filter((r) => !currentRoles.includes(r.name));

  async function handleAdd(roleName: string) {
    setError("");
    setBusy(true);
    const result = await assignRole(userId, roleName);
    setBusy(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function handleRemove(roleName: string) {
    setError("");
    setBusy(true);
    const result = await removeRole(userId, roleName);
    setBusy(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ROLE_ORDER.filter((r) => visibleRoles.includes(r)).map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium bg-earthy/10 text-earthy"
        >
          {name}
          {!(isMe && name === "admin") && (
            <button
              type="button"
              onClick={() => handleRemove(name)}
              disabled={busy}
              className="ml-1 text-grey hover:text-red-600 disabled:opacity-50"
              aria-label={`Remove ${name}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
      {visibleRoles.length === 0 && (
        <span className="text-grey text-sm">No role</span>
      )}
      {availableToAdd.length > 0 && !isMe && (
        <select
          value=""
          onChange={(e) => {
            const v = e.target.value;
            if (v) handleAdd(v);
            e.target.value = "";
          }}
          disabled={busy}
          className="text-sm border border-grey/20 rounded px-2 py-1 bg-white"
        >
          <option value="">+ Add role</option>
          {availableToAdd.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      )}
      {error && (
        <span className="text-red-600 text-xs block w-full">{error}</span>
      )}
    </div>
  );
}
