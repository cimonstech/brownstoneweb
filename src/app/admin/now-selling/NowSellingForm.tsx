"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveNowSelling } from "./actions";

type Slot = {
  position: number;
  image_url: string | null;
  property_name: string | null;
  project_link: string | null;
};

type MediaItem = { key: string; url: string };

export function NowSellingForm({ initialSlots }: { initialSlots: Slot[] }) {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>(() => {
    const base = [1, 2, 3, 4].map((p) => ({
      position: p,
      image_url: null as string | null,
      property_name: null as string | null,
      project_link: null as string | null,
    }));
    const sorted = [...initialSlots].sort((a, b) => a.position - b.position);
    sorted.forEach((s) => {
      const i = base.findIndex((b) => b.position === s.position);
      if (i >= 0) base[i] = { ...s };
    });
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  const loadMedia = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    if (!res.ok) return;
    const data = await res.json();
    setMediaItems(data.items ?? []);
  }, []);

  useEffect(() => {
    if (pickerFor !== null) loadMedia();
  }, [pickerFor, loadMedia]);

  const updateSlot = (position: number, field: keyof Slot, value: string | null) => {
    setSlots((prev) =>
      prev.map((s) => (s.position === position ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const result = await saveNowSelling(slots);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  const handleUpload = async (position: number, file: File) => {
    setUploadingFor(position);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (data.file?.url) updateSlot(position, "image_url", data.file.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingFor(null);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {error && (
        <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">{error}</p>
      )}
      {[1, 2, 3, 4].map((pos) => {
        const slot = slots.find((s) => s.position === pos) ?? {
          position: pos,
          image_url: null,
          property_name: null,
          project_link: null,
        };
        return (
          <div
            key={pos}
            className="p-6 bg-white rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-6"
          >
            <div className="w-full sm:w-40 shrink-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Slot {pos} — Image (portrait)
              </p>
              <div className="aspect-[2/3] rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                {slot.image_url ? (
                  <img
                    src={slot.image_url}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPickerFor(pos)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Choose from media
                </button>
                <label className="text-xs font-medium text-primary hover:underline cursor-pointer">
                  Upload from PC
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(pos, f);
                      e.target.value = "";
                    }}
                    disabled={uploadingFor !== null}
                  />
                </label>
              </div>
              {uploadingFor === pos && (
                <p className="text-xs text-slate-500 mt-1">Uploading…</p>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Property name
                </label>
                <input
                  type="text"
                  value={slot.property_name ?? ""}
                  onChange={(e) => updateSlot(pos, "property_name", e.target.value || null)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. East Legon Residence"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Project link
                </label>
                <input
                  type="url"
                  value={slot.project_link ?? ""}
                  onChange={(e) => updateSlot(pos, "project_link", e.target.value || null)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Signature Listings"}
      </button>

      {/* Media picker modal */}
      {pickerFor !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setPickerFor(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Choose image from media</h3>
              <button
                type="button"
                onClick={() => setPickerFor(null)}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-3">
                {mediaItems.map((item) => {
                  const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        updateSlot(pickerFor, "image_url", item.url);
                        setPickerFor(null);
                      }}
                      className="aspect-[2/3] rounded-lg overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none"
                    >
                      {isImage ? (
                        <img
                          src={item.url}
                          alt=""
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          File
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {mediaItems.length === 0 && (
                <p className="text-sm text-slate-500">No media yet. Upload from Media page or use &quot;Upload from PC&quot; above.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
