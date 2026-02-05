"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { OutputData } from "./Editor";
import { createClient } from "@/lib/supabase/client";
import { postSchema } from "@/lib/blog/validate";

const Editor = dynamic(
  () => import("./Editor").then((m) => ({ default: m.Editor })),
  { ssr: false }
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type PostFormProps = {
  postId?: string;
  initialTitle?: string;
  initialSlug?: string;
  initialExcerpt?: string | null;
  initialCoverImage?: string | null;
  initialContent?: OutputData | null;
  initialStatus?: "draft" | "published";
  userRoles: string[];
  authorId: string;
};

export function PostForm({
  postId,
  initialTitle = "",
  initialSlug = "",
  initialExcerpt = "",
  initialCoverImage = "",
  initialContent = null,
  initialStatus = "draft",
  userRoles,
  authorId,
}: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [excerpt, setExcerpt] = useState(initialExcerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialCoverImage ?? "");
  const [content, setContent] = useState<OutputData | null>(initialContent);
  const [status, setStatus] = useState<"draft" | "published">(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const canPublish = userRoles.includes("admin") || userRoles.includes("moderator");
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoSlug = !postId; // only auto-generate slug for new posts
  useEffect(() => {
    if (autoSlug && title) setSlug(slugify(title));
  }, [autoSlug, title]);

  const save = useCallback(
    async (newStatus: "draft" | "published") => {
      setError("");
      const finalSlug = slug.trim() || slugify(title) || "untitled";
      const parsed = postSchema.safeParse({
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim() || null,
        cover_image: coverImage.trim() || null,
        status: newStatus,
      });
      if (!parsed.success) {
        setError(parsed.error.errors.map((e) => e.message).join(". "));
        return;
      }
      setSaving(true);
      const supabase = createClient();
      const payload = {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        cover_image: parsed.data.cover_image || null,
        content: content ?? undefined,
        status: newStatus,
        ...(newStatus === "published" ? { published_at: new Date().toISOString() } : {}),
      };

      if (postId) {
        const { error: err } = await supabase.from("posts").update(payload).eq("id", postId);
        if (err) {
          setError(err.message);
          setSaving(false);
          return;
        }
      } else {
        const { error: err } = await supabase.from("posts").insert({
          ...payload,
          author_id: authorId,
        });
        if (err) {
          setError(err.message);
          setSaving(false);
          return;
        }
      }
      setDirty(false);
      setLastSaved(new Date());
      setSaving(false);
      if (!postId) router.push("/admin/posts");
      else router.refresh();
    },
    [postId, title, slug, excerpt, coverImage, content, authorId, router]
  );

  useEffect(() => {
    setDirty(true);
  }, [title, slug, excerpt, coverImage, content]);

  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => saveRef.current("draft"), 30000);
    autosaveTimerRef.current = t;
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [dirty]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const handlePublish = () => {
    if (canPublish && typeof window !== "undefined" && window.confirm("Publish this post? It will be visible on the blog.")) {
      save("published");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <Link href="/admin/posts" className="text-primary hover:underline">
          ← Back to posts
        </Link>
        {postId && (
          <Link
            href={`/admin/posts/${postId}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-grey hover:text-earthy"
          >
            Preview
          </Link>
        )}
      </div>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="Post title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="url-slug"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Excerpt (optional)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="Short summary for listings and SEO"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Cover image URL (optional)</label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Content</label>
        <Editor initialData={initialContent} onChange={setContent} />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => save("draft")}
          disabled={saving}
          className="bg-neutral-200 text-earthy font-medium px-4 py-2 rounded-lg hover:bg-neutral-300 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save draft"}
        </button>
        {canPublish && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        )}
        {dirty && <span className="text-sm text-amber-600">Unsaved changes</span>}
        {lastSaved && !dirty && (
          <span className="text-sm text-grey">Saved at {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
}
