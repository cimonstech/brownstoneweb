"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/supabase/auth";

/**
 * Delete a post. Allowed if user is the author, or has moderator/admin role.
 * Removes post_categories links first, then the post.
 */
export async function deletePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const roles = await getUserRoles();
  const { data: post } = await supabase
    .from("posts")
    .select("id, author_id")
    .eq("id", postId)
    .single();

  if (!post) return { error: "Post not found" };

  const canDelete =
    post.author_id === user.id ||
    roles.includes("moderator") ||
    roles.includes("admin");
  if (!canDelete) return { error: "You don't have permission to delete this post" };

  const { error: linkError } = await supabase
    .from("post_categories")
    .delete()
    .eq("post_id", postId);
  if (linkError) return { error: linkError.message };

  const { error: postError } = await supabase.from("posts").delete().eq("id", postId);
  if (postError) return { error: postError.message };

  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/blog");
  return { ok: true };
}
