"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/ActionIcons";
import { deletePost } from "./actions";

type Props = {
  postId: string;
  postTitle: string;
  variant?: "link" | "button";
  className?: string;
};

export function DeletePostButton({ postId, postTitle, variant = "link", className }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    if (!confirm(`Delete "${postTitle}"? This cannot be undone.`)) return;
    setDeleting(true);
    const result = await deletePost(postId);
    if (result.error) {
      alert(result.error);
      setDeleting(false);
      return;
    }
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <DeleteButton
      onClick={handleClick}
      disabled={deleting}
      loading={deleting}
      title={variant === "button" ? "Delete post" : "Delete"}
      aria-label={variant === "button" ? "Delete post" : "Delete"}
      className={className ?? "text-red-600 hover:text-red-700 hover:bg-red-50"}
    />
  );
}
