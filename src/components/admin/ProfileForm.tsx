"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type ProfileFormProps = {
  userId: string;
  email: string;
  initialFullName: string;
  initialBio: string;
  initialAvatarUrl: string;
  roles: string[];
};

export function ProfileForm({
  userId,
  email,
  initialFullName,
  initialBio,
  initialAvatarUrl,
  roles,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [bio, setBio] = useState(initialBio);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setAvatarUrl(data.file.url);
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const BIO_MAX = 300;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const trimmedBio = bio.trim();
    if (!trimmedBio) {
      setMessage({ type: "err", text: "Bio is required." });
      return;
    }
    if (trimmedBio.length > BIO_MAX) {
      setMessage({ type: "err", text: `Bio must be ${BIO_MAX} characters or fewer.` });
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: userId, full_name: fullName, bio: trimmedBio, avatar_url: avatarUrl || null },
        { onConflict: "id" }
      );
    if (profileError) {
      setMessage({ type: "err", text: profileError.message });
      setSaving(false);
      return;
    }
    if (password.trim()) {
      const { error: pwError } = await supabase.auth.updateUser({ password: password.trim() });
      if (pwError) {
        setMessage({ type: "err", text: pwError.message });
        setSaving(false);
        return;
      }
      setPassword("");
    }
    setMessage({ type: "ok", text: "Profile saved." });
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Email</label>
        <p className="text-grey">{email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Bio (required, max 300 characters)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
          maxLength={BIO_MAX}
          rows={4}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="Short bio shown on your articles."
        />
        <p className="text-xs text-grey mt-1">{bio.length}/{BIO_MAX}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Avatar</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="relative group shrink-0"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-grey/20 group-hover:border-primary/50 transition-colors"
              />
            ) : (
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-grey/10 border-2 border-dashed border-grey/30 group-hover:border-primary/50 transition-colors text-grey/50 text-2xl font-bold">
                {fullName ? fullName.slice(0, 2).toUpperCase() : "?"}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <svg className="w-6 h-6 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <div className="flex-1 space-y-1">
            <p className="text-sm text-grey">Click the avatar to upload an image</p>
            <p className="text-xs text-grey/60">JPEG, PNG, WebP, or GIF &middot; Max 6 MB</p>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Remove avatar
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">Roles</label>
        <p className="text-grey capitalize">{roles.join(", ") || "—"}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-earthy mb-1">New password (leave blank to keep)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="••••••••"
        />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-green-600" : "text-red-600"}>{message.text}</p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
