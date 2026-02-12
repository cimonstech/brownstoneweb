"use client";

import { useState } from "react";

export type BrochureProject = "celestia" | "townhouse" | "lakehouse";

type Props = {
  project?: BrochureProject;
  /** Optional class for the wrapper */
  className?: string;
  /** Success message override */
  successMessage?: string;
  /** Compact layout (e.g. inline on Celestia CTA) */
  variant?: "default" | "compact";
};

export default function BrochureForm({
  project = "celestia",
  className = "",
  successMessage = "Thank you for taking the time to explore our website. We've sent the brochure to your email.",
  variant = "default",
}: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setMessage(
        project === "townhouse"
          ? "Please accept the terms to receive the Celestia Townhouses Brochure."
          : "Please accept the terms to receive the brochure."
      );
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          project,
          consent: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(successMessage);
      setEmail("");
      setConsent(false);

      // Auto-download PDF if URL returned
      if (data.brochurePdfUrl && typeof data.brochurePdfUrl === "string") {
        const a = document.createElement("a");
        a.href = data.brochurePdfUrl;
        a.download = data.brochurePdfUrl.split("/").pop()?.split("?")[0] ?? "brochure.pdf";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={
          variant === "compact"
            ? "rounded-lg border border-primary/30 bg-primary/5 px-6 py-5"
            : "rounded-xl border border-earthy/20 bg-white/80 px-8 py-8 shadow-lg"
        }
      >
        <p className="font-medium text-earthy">{message}</p>
        <p className="mt-1 text-sm text-earthy/70">Check your inbox (and spam folder).</p>
      </div>
    );
  }

  const formClass =
    variant === "compact"
      ? "flex flex-col sm:flex-row gap-4 sm:flex-wrap sm:items-center"
      : "flex flex-col gap-4 max-w-md mx-auto";

  return (
    <form onSubmit={handleSubmit} className={`${formClass} ${className}`}>
      <div className={variant === "compact" ? "w-full sm:w-auto sm:flex-1 sm:min-w-[220px]" : ""}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={status === "loading"}
          className="w-full px-5 py-4 rounded-lg border-2 border-[#f8f6f6] focus:border-primary focus:ring-0 focus:outline-none transition-all text-earthy placeholder:text-earthy/50 disabled:opacity-70"
          suppressHydrationWarning
        />
      </div>
      <label
        className={
          variant === "compact"
            ? "flex items-start gap-3 cursor-pointer text-left text-sm text-earthy/80 order-last sm:order-none"
            : "flex items-start gap-3 cursor-pointer text-left text-sm text-earthy/80"
        }
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={status === "loading"}
          className="mt-1 h-4 w-4 shrink-0 rounded border-earthy/40 accent-primary"
          suppressHydrationWarning
        />
        <span>
          I agree to receive the brochure and occasional updates from Brownstone.{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy policy
          </a>
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
      >
        {status === "loading"
          ? "Sending…"
          : project === "townhouse"
            ? "Get the Celestia Townhouses Brochure"
            : "Get the Brochure"}
      </button>
      {status === "error" && message && (
        <p className="text-red-600 text-sm">{message}</p>
      )}
    </form>
  );
}
