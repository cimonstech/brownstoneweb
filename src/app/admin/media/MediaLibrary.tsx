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

export function MediaLibrary() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

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
            className="rounded-lg border border-grey/20 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
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
