"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/ActionIcons";

export function DeleteCampaignButton({
  campaignId,
  campaignName,
  variant = "link",
}: {
  campaignId: string;
  campaignName: string;
  variant?: "link" | "button";
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete campaign "${campaignName}"? This will remove all recipient records and cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/crm/campaigns/${campaignId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/crm/campaigns");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to delete campaign");
      }
    } catch {
      alert("Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DeleteButton
      onClick={handleDelete}
      disabled={deleting}
      loading={deleting}
      title={variant === "button" ? "Delete campaign" : "Delete"}
      aria-label={variant === "button" ? "Delete campaign" : "Delete"}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    />
  );
}
