import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { PostForm } from "@/components/admin/PostForm";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const roles = await getUserRoles();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (!post) notFound();

  const canEdit =
    post.author_id === user.id ||
    roles.includes("moderator") ||
    roles.includes("admin");

  if (!canEdit) redirect("/admin/dashboard");

  const { data: categoryLinks } = await supabase
    .from("post_categories")
    .select("category_id")
    .eq("post_id", id);
  const initialCategoryIds = (categoryLinks ?? []).map((r) => r.category_id);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-earthy mb-6">Edit post</h1>
      <PostForm
        postId={post.id}
        initialTitle={post.title}
        initialSlug={post.slug}
        initialExcerpt={post.excerpt}
        initialCoverImage={post.cover_image}
        initialContent={post.content as import("@/components/admin/Editor").OutputData | null}
        initialStatus={post.status}
        initialCategoryIds={initialCategoryIds}
        initialReadTimeMinutes={(post as { read_time_minutes?: number | null }).read_time_minutes ?? null}
        initialFeatured={(post as { featured?: boolean }).featured ?? false}
        categories={(categories ?? []).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        userRoles={roles}
        authorId={post.author_id}
      />
    </div>
  );
}
