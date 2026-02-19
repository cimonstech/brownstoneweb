"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/ActionIcons";
import { deleteUser } from "./actions";

type Props = {
  userId: string;
  userName: string;
};

export function DeleteUserButton({ userId, userName }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    if (!confirm(`Delete user "${userName}"? This cannot be undone and they will lose access.`)) return;
    setDeleting(true);
    const result = await deleteUser(userId);
    setDeleting(false);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <DeleteButton
      onClick={handleClick}
      disabled={deleting}
      loading={deleting}
      title="Delete user"
      aria-label="Delete user"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    />
  );
}
