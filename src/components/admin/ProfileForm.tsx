"use client";

import { useState } from "react";
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
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

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
        <label className="block text-sm font-medium text-earthy mb-1">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border border-grey/20 rounded-lg px-3 py-2"
          placeholder="https://..."
        />
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
