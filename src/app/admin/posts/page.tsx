import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-earthy">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90"
        >
          New post
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-grey/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-grey/10">
            <tr>
              <th className="text-left p-4 font-medium text-earthy">Title</th>
              <th className="text-left p-4 font-medium text-earthy">Slug</th>
              <th className="text-left p-4 font-medium text-earthy">Status</th>
              <th className="text-left p-4 font-medium text-earthy">Created</th>
              <th className="w-20" />
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-grey text-sm">
                  No posts yet. Create one from Dashboard or New post.
                </td>
              </tr>
            ) : (
              (posts ?? []).map((post) => (
                <tr key={post.id} className="border-t border-grey/5 hover:bg-neutral-50/50">
                  <td className="p-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-earthy hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-4 text-grey text-sm">{post.slug}</td>
                  <td className="p-4">
                    <span className="capitalize text-sm">{post.status}</span>
                  </td>
                  <td className="p-4 text-grey text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
