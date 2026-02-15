import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getUserRoles } from "@/lib/supabase/auth";
import { contentToHtml } from "@/lib/blog/render";
import Link from "next/link";

export default async function AdminPreviewPostPage({
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
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!post) notFound();

  const canView =
    post.author_id === user.id ||
    roles.includes("moderator") ||
    roles.includes("admin");
  if (!canView) redirect("/admin/dashboard");

  const html = contentToHtml(post.content);

  return (
    <div className="min-h-screen bg-white text-earthy">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/admin/posts/${id}/edit`} className="text-primary hover:underline">
            ← Back to edit
          </Link>
          <span className="text-sm text-amber-600 font-medium">Preview (draft)</span>
        </div>
        <article>
          <h1 className="text-4xl font-bold font-serif mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-grey mb-6">{post.excerpt}</p>}
          {post.cover_image && (
            <div className="aspect-video rounded-xl overflow-hidden mb-6">
              <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div
            className="prose-like max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </div>
  );
}
