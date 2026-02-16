"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

/**
 * Page users land on after:
 * - Clicking the "Reset password" link (type=recovery in hash), or
 * - Clicking an invite link (type=invite in hash).
 * We show a form to set or create their password in both cases.
 */
export default function AdminUpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hashType, setHashType] = useState<"recovery" | "invite" | null>(null);
  const [hasCheckedHash, setHasCheckedHash] = useState(false);

  useEffect(() => {
    // Type can come from query (after /auth/callback redirect) or from hash (direct Supabase redirect)
    const fromQuery = searchParams.get("type");
    if (fromQuery === "invite" || fromQuery === "recovery") {
      setHashType(fromQuery);
      setHasCheckedHash(true);
      return;
    }
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.includes("type=invite")) setHashType("invite");
    else if (hash.includes("type=recovery")) setHashType("recovery");
    else setHashType(null);
    setHasCheckedHash(true);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/admin/dashboard"), 1500);
  }

  if (!hasCheckedHash) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 text-center text-slate-500">
          Loading…
        </div>
      </div>
    );
  }

  if (hashType !== "recovery" && hashType !== "invite") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-earthy mb-4">This page is for setting a new password after using the reset or invite link from your email.</p>
          <Link href="/admin/login" className="text-primary font-medium underline hover:no-underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  const isInvite = hashType === "invite";
  const title = isInvite ? "Create your password" : "Set new password";
  const buttonLabel = isInvite ? "Create password" : "Update password";
  const successMessage = isInvite ? "Password created. Redirecting to dashboard…" : "Password updated. Redirecting to dashboard…";

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-earthy font-medium text-green-700">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-earthy mb-6">{title}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-earthy">New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="border border-grey/30 rounded-lg px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-earthy">Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="border border-grey/30 rounded-lg px-3 py-2"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-bold py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (isInvite ? "Creating…" : "Updating…") : buttonLabel}
          </button>
        </form>
        <Link href="/admin/login" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
