"use server";

import { revalidatePath } from "next/cache";

/** Call after publishing or updating a post so the blog list and post page show fresh data. */
export async function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}
