"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY = "brownstone_exit_intent_shown";

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown === "true") return;

    function handleMouseLeave(e: MouseEvent) {
      // Exit intent: cursor leaving through the top of the viewport (e.g. to close tab, back button)
      if (e.clientY <= 0) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setOpen(true);
      }
    }

    // Only enable on desktop (touch devices don't have reliable exit intent)
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    if (isTouch) return;

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
  }, [mounted]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setMessage("Please accept the terms to receive your details.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/lakehouse-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-earthy/80 backdrop-blur-sm transition-opacity duration-300 ease-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      aria-describedby="exit-intent-desc"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-earthy/15 bg-[#fdfcfb] shadow-2xl shadow-earthy/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent line */}
        <div className="h-0.5 w-full bg-primary" aria-hidden />

        <div className="p-8 sm:p-10">
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full text-earthy/50 hover:text-earthy hover:bg-earthy/5 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl leading-none font-light" aria-hidden>×</span>
          </button>

          <div className="pr-10">
            <p className="text-primary text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
              Before you go
            </p>
            <h2
              id="exit-intent-title"
              className="text-earthy text-2xl sm:text-3xl font-serif font-semibold leading-tight mb-2"
            >
              Discover the Townhouses at Celestia
            </h2>
            <p id="exit-intent-desc" className="text-earthy/70 text-sm sm:text-base leading-relaxed mb-6">
              Receive exclusive details and highlights — one email, no spam.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-xl bg-primary/5 border border-primary/10 px-5 py-4">
              <p className="text-earthy font-medium text-sm">We’ve sent it. Check your inbox — we think you’ll like what you see.</p>
              <button
                type="button"
                onClick={close}
                className="mt-3 text-primary text-sm font-semibold underline hover:no-underline"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={status === "loading"}
                className="w-full px-4 py-3.5 rounded-lg border border-earthy/20 bg-white text-earthy placeholder:text-earthy/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors disabled:opacity-70 text-sm"
              />
              <label className="flex items-start gap-3 cursor-pointer text-left">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={status === "loading"}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-earthy/30 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-earthy/80 text-xs leading-relaxed">
                  I’d like to hear from you about the townhouses and occasional updates. I can unsubscribe anytime.{" "}
                  <Link href="/privacy-policy" className="text-primary underline hover:no-underline" onClick={(e) => e.stopPropagation()}>
                    Privacy policy
                  </Link>
                </span>
              </label>
              {status === "error" && message && (
                <p className="text-red-600 text-sm">{message}</p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 py-3.5 rounded-lg bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {status === "loading" ? "Sending…" : "Send me the details"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-3.5 rounded-lg border border-earthy/20 text-earthy/70 text-sm font-semibold hover:bg-earthy/5 transition-colors"
                >
                  No thanks
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center">
            <Link
              href="/celestia/townhouses"
              className="text-earthy/60 text-xs hover:text-primary transition-colors underline"
              onClick={close}
            >
              Take a look at the townhouses →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
