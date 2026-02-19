"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type EmailOtpType = "recovery" | "invite" | "email" | "signup";

/**
 * Auth callback for email links (password reset, invite).
 * Handles two flows:
 * 1. Query params: token_hash & type (when email template links here directly).
 *    We verify the OTP and redirect to set-password with type in query.
 * 2. Hash: type=recovery or type=invite (when Supabase redirects here with fragment).
 *    Session is set by Supabase client; we just redirect to set-password with type in query.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const typeParam = searchParams.get("type") as EmailOtpType | null;
    const redirectTo = searchParams.get("redirect_to") ?? "/admin/update-password";

    const validTypes: EmailOtpType[] = ["recovery", "invite"];
    const type = validTypes.includes(typeParam as EmailOtpType) ? typeParam : null;

    // Flow 1: token_hash and type in query (custom email template)
    if (tokenHash && type) {
      const supabase = createClient();
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type: type as "recovery" | "invite" })
        .then(({ error }) => {
          if (error) {
            setStatus("error");
            setErrorMessage(error.message);
            return;
          }
          const dest = redirectTo.startsWith("/") ? redirectTo : `/admin/update-password`;
          const url = dest.includes("?") ? `${dest}&type=${type}` : `${dest}?type=${type}`;
          router.replace(url);
        });
      return;
    }

    // Flow 2: type in hash (Supabase default redirect with fragment)
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      if (hash.includes("type=invite") || hash.includes("type=recovery")) {
        const hashType = hash.includes("type=invite") ? "invite" : "recovery";
        const dest = redirectTo.startsWith("/") ? redirectTo : "/admin/update-password";
        const url = dest.includes("?") ? `${dest}&type=${hashType}` : `${dest}?type=${hashType}`;
        router.replace(url);
        return;
      }
    }

    setStatus("error");
    setErrorMessage("Invalid or expired link. Request a new reset or invite link.");
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 text-center text-slate-500">
          Verifying link…
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-earthy font-medium text-red-600 mb-4">{errorMessage}</p>
          <Link href="/admin/login" className="text-primary font-medium underline hover:no-underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
