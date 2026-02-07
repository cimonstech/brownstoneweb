"use client";

import { useState } from "react";

export default function JettyLeadForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !consent) {
      setStatus("error");
      setMessage("Please enter your email and agree to receive updates.");
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
      setMessage("Check your inbox for exclusive details.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-white/30 bg-white/5 px-8 py-6 backdrop-blur-sm">
        <p className="text-white font-medium">{message}</p>
        <p className="text-white/70 text-sm mt-1">We have sent the details to your email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          disabled={status === "loading"}
          className="w-full px-5 py-4 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/60 focus:ring-0 focus:outline-none transition-colors disabled:opacity-70"
          suppressHydrationWarning
        />
      </div>
      <label className="flex items-start gap-3 cursor-pointer text-left">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={status === "loading"}
          className="mt-1 rounded border-white/30 bg-white/10 text-primary focus:ring-primary"
          suppressHydrationWarning
        />
        <span className="text-white/90 text-sm">
          Receive updates about Lakehouse at Celestia.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full border border-white/40 text-white px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-earthy transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Access Exclusive Details"}
      </button>
      {(status === "error" && message) && (
        <p className="text-red-200 text-sm">{message}</p>
      )}
    </form>
  );
}
