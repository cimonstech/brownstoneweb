"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { roleOptions: { id: string; name: string }[] };

export function InviteForm({ roleOptions }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roleOptions[0]?.name ?? "author");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErrorCode(null);
    setMessage("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error ?? "Invite failed";
        setError(typeof msg === "string" ? msg.replace(/\*\*/g, "") : msg);
        setErrorCode(data.code ?? null);
        return;
      }
      setMessage("Invitation sent. They can sign in with the link in the email.");
      setEmail("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl border border-grey/20 mb-6 flex flex-wrap items-end gap-4">
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="colleague@example.com"
          className="border border-grey/20 rounded-lg px-3 py-2 w-56"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-grey/20 rounded-lg px-3 py-2"
        >
          {roleOptions.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {busy ? "Sending…" : "Invite"}
      </button>
      {error && (
        <span className="text-red-600 text-sm block">
          {error}
          {errorCode === "already_exists" && (
            <span className="block mt-1 text-slate-600 font-normal">
              They can use the Reset password link on the <a href="/admin/login" className="text-primary underline">login page</a>.
            </span>
          )}
        </span>
      )}
      {message && <span className="text-green-700 text-sm">{message}</span>}
    </form>
  );
}
