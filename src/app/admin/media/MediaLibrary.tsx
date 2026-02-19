"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type MediaItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ canDelete = false }: { canDelete?: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to load media");
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/media");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) setError(data.error || "Failed to load media");
          return;
        }
        const data = await res.json();
        if (!cancelled) setItems(data.items ?? []);
      } catch {
        if (!cancelled) setError("Failed to load media");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadError("");
      setUploading(true);
      try {
        const form = new FormData();
        form.set("file", file);
        const res = await fetch("/api/blog/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        await refetch();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [refetch]
  );

  const copyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = useCallback(
    async (key: string) => {
      setDeleting(key);
      try {
        const res = await fetch("/api/admin/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Delete failed");
        }
        setItems((prev) => prev.filter((i) => i.key !== key));
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Delete failed");
      } finally {
        setDeleting(null);
        setConfirmDelete(null);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="text-grey">Loading media…</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {uploadError && (
          <span className="text-sm text-amber-600">{uploadError}</span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-grey">
          No media yet. Use the Upload button above or add images from the post editor — they will appear here.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => {
        const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(item.key);
        return (
          <div
            key={item.key}
            className="rounded-lg border border-grey/20 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
          >
            {canDelete && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {confirmDelete === item.key ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.key)}
                      disabled={deleting === item.key}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting === item.key ? "…" : "Yes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="bg-white text-grey text-xs px-2 py-1 rounded shadow hover:bg-grey/10"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(item.key)}
                    className="bg-white/90 backdrop-blur text-red-500 hover:text-red-700 hover:bg-white p-1.5 rounded-lg shadow transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
              {isImage ? (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-grey">📎</span>
              )}
            </div>
            <div className="p-2 text-xs text-grey truncate" title={item.key}>
              {item.key.split("/").pop() ?? item.key}
            </div>
            <div className="px-2 pb-2 flex items-center justify-between gap-2">
              <span className="text-xs text-grey">{formatSize(item.size)}</span>
              <button
                type="button"
                onClick={() => copyUrl(item.url, item.key)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {copied === item.key ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>
        );
      })}
        </div>
      )}
    </div>
  );
}
