"use client";

import { useState } from "react";

type Variant = "sidebar" | "cta";

export function NewsletterForm({ variant = "sidebar" }: { variant?: Variant }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("Thanks for subscribing!");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const isSidebar = variant === "sidebar";

  return (
    <div className={isSidebar ? undefined : "space-y-4"}>
      <form
        onSubmit={handleSubmit}
        className={isSidebar ? "space-y-3" : "flex flex-col md:flex-row gap-4"}
      >
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
        required
        className={
          isSidebar
            ? "w-full bg-white border border-earthy/10 rounded-lg text-sm px-4 py-3 focus:ring-primary focus:border-primary outline-none"
            : "flex-1 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-primary focus:border-primary px-6 py-4 outline-none placeholder:text-white/60 min-w-0"
        }
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={
          isSidebar
            ? "w-full bg-primary text-white font-bold py-3 rounded-lg text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-70"
            : "bg-primary text-white font-bold px-10 py-4 rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest text-sm disabled:opacity-70 shrink-0"
        }
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      </form>
      {message && (
        <p
          className={`text-sm ${
            status === "success" ? "text-green-400" : "text-red-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
