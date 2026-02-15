"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { TiptapContent } from "./TiptapEditor";
import { createClient } from "@/lib/supabase/client";
import { postSchema } from "@/lib/blog/validate";
import { revalidateBlog } from "@/app/admin/posts/actions";

const TiptapEditor = dynamic(
  () => import("./TiptapEditor").then((m) => ({ default: m.TiptapEditor })),
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

type CategoryOption = { id: string; name: string; slug: string };

type PostFormProps = {
  postId?: string;
  initialTitle?: string;
  initialSlug?: string;
  initialExcerpt?: string | null;
  initialCoverImage?: string | null;
  initialContent?: TiptapContent | string | null;
  initialStatus?: "draft" | "published";
  initialCategoryIds?: string[];
  initialReadTimeMinutes?: number | null;
  initialFeatured?: boolean;
  categories: CategoryOption[];
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
  initialCategoryIds = [],
  initialReadTimeMinutes = null,
  initialFeatured = false,
  categories,
  userRoles,
  authorId,
}: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [excerpt, setExcerpt] = useState(initialExcerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialCoverImage ?? "");
  const [content, setContent] = useState<TiptapContent | null>(
    typeof initialContent === "object" && initialContent !== null ? initialContent : null
  );
  const [status, setStatus] = useState<"draft" | "published">(initialStatus);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const [readTimeMinutes, setReadTimeMinutes] = useState<number | null>(initialReadTimeMinutes);
  const [featured, setFeatured] = useState(initialFeatured);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const canPublish = userRoles.includes("admin") || userRoles.includes("moderator");
  const canSetFeatured = userRoles.includes("admin") || userRoles.includes("moderator");
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
        read_time_minutes: readTimeMinutes ?? undefined,
        featured,
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
        read_time_minutes: parsed.data.read_time_minutes ?? null,
        featured: parsed.data.featured ?? false,
        ...(newStatus === "published" ? { published_at: new Date().toISOString() } : {}),
      };

      let resolvedPostId = postId;
      if (postId) {
        const { error: err } = await supabase.from("posts").update(payload).eq("id", postId);
        if (err) {
          setError(err.message);
          setSaving(false);
          return;
        }
      } else {
        const { data: inserted, error: err } = await supabase
          .from("posts")
          .insert({ ...payload, author_id: authorId })
          .select("id")
          .single();
        if (err) {
          setError(err.message);
          setSaving(false);
          return;
        }
        resolvedPostId = inserted?.id;
      }

      if (resolvedPostId && categoryIds.length > 0) {
        await supabase.from("post_categories").delete().eq("post_id", resolvedPostId);
        await supabase.from("post_categories").insert(
          categoryIds.map((category_id) => ({ post_id: resolvedPostId!, category_id }))
        );
      } else if (resolvedPostId) {
        await supabase.from("post_categories").delete().eq("post_id", resolvedPostId);
      }

      setDirty(false);
      setLastSaved(new Date());
      setSaving(false);
      await revalidateBlog(finalSlug);
      if (!postId) router.push("/admin/posts");
      else router.refresh();
    },
    [postId, title, slug, excerpt, coverImage, content, authorId, router, categoryIds, readTimeMinutes, featured]
  );

  useEffect(() => {
    setDirty(true);
  }, [title, slug, excerpt, coverImage, content, categoryIds, readTimeMinutes, featured]);

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
        <label className="block text-sm font-medium text-earthy mb-1">Cover image (optional)</label>
        {coverImage && (
          <div className="mb-2 rounded-lg overflow-hidden border border-grey/20 max-w-md">
            <img src={coverImage} alt="Cover preview" className="w-full h-40 object-cover" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <label className="cursor-pointer bg-neutral-200 text-earthy font-medium px-4 py-2 rounded-lg hover:bg-neutral-300 text-sm">
            Upload from device
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setError("");
                try {
                  const form = new FormData();
                  form.set("file", file);
                  const res = await fetch("/api/blog/upload", {
                    method: "POST",
                    body: form,
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Upload failed");
                  if (data.file?.url) setCoverImage(data.file.url);
                  setDirty(true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload failed");
                }
                e.target.value = "";
              }}
            />
          </label>
          <span className="text-grey text-sm">or paste URL below</span>
        </div>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="https://..."
        />
      </div>
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-earthy mb-1">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(cat.id)}
                  onChange={(e) =>
                    setCategoryIds((prev) =>
                      e.target.checked ? [...prev, cat.id] : prev.filter((id) => id !== cat.id)
                    )
                  }
                  className="rounded border-grey/30"
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Read time (minutes)</label>
        <input
          type="number"
          min={1}
          max={120}
          value={readTimeMinutes ?? ""}
          onChange={(e) => setReadTimeMinutes(e.target.value ? parseInt(e.target.value, 10) : null)}
          className="w-24 border border-grey/20 rounded-lg px-3 py-2"
          placeholder="e.g. 5"
        />
        <p className="text-xs text-grey mt-1">Shown as &quot;5 min read&quot; on the article.</p>
      </div>
      {canSetFeatured && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-grey/30"
          />
          <label htmlFor="featured" className="text-sm font-medium text-earthy">
            Featured post (show at top of blog)
          </label>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Content</label>
        <TiptapEditor initialContent={initialContent} onChange={setContent} />
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
