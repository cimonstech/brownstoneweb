import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: draftCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "draft");

  const { count: publishedCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  return (
    <div>
      <h1 className="text-2xl font-bold text-earthy mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-grey/10 p-6">
          <p className="text-sm text-grey">Draft posts</p>
          <p className="text-3xl font-bold text-earthy">{draftCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-grey/10 p-6">
          <p className="text-sm text-grey">Published posts</p>
          <p className="text-3xl font-bold text-earthy">{publishedCount ?? 0}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-grey/10 overflow-hidden">
        <div className="p-4 border-b border-grey/10 flex justify-between items-center">
          <h2 className="font-bold text-earthy">Recent posts</h2>
          <Link
            href="/admin/posts/new"
            className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            New post
          </Link>
        </div>
        <ul className="divide-y divide-grey/10">
          {(posts ?? []).length === 0 ? (
            <li className="p-4 text-grey text-sm">No posts yet.</li>
          ) : (
            (posts ?? []).map((post) => (
              <li key={post.id} className="p-4 flex justify-between items-center">
                <div>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="font-medium text-earthy hover:underline"
                  >
                    {post.title}
                  </Link>
                  <span className="ml-2 text-xs text-grey capitalize">{post.status}</span>
                </div>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
