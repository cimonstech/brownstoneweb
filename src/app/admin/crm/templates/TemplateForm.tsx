"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_VARIABLES = ["first_name", "full_name", "email", "company", "phone"];

export function TemplateForm({
  template,
}: {
  template?: { id: string; name: string; subject: string; body_html: string; variables: string[] };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(template?.name ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [bodyHtml, setBodyHtml] = useState(template?.body_html ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = template
        ? `/api/crm/templates/${template.id}`
        : "/api/crm/templates";
      const method = template ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subject: subject.trim(),
          body_html: bodyHtml.trim(),
          variables: DEFAULT_VARIABLES,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save template");
        return;
      }
      router.push("/admin/crm/templates");
      router.refresh();
    } catch {
      setError("Failed to save template");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl"
    >
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="Intro email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
            placeholder="Hi {{first_name}}, interested in premium construction?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Body *
          </label>
          <textarea
            required
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={12}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none resize-y"
            placeholder={`Hi {{first_name}},\n\nI wanted to reach out from Brownstone — we're Ghana's luxury construction and real estate brand.\n\nWe'd love to give you a quick overview. Reply to this email or book a call.\n\nWarm regards,\nCandace Baker`}
          />
          <p className="text-xs text-slate-500 mt-1">
            Paste plain text and we'll format it as a proper email (paragraphs, line breaks). Or write HTML. Variables: {"{{first_name}}"}, {"{{full_name}}"}, {"{{email}}"}, {"{{company}}"}, {"{{phone}}"}
          </p>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-70"
        >
          {loading ? "Saving..." : template ? "Update" : "Create"} template
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:text-slate-800 border border-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
