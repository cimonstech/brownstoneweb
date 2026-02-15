import { createClient } from "@/lib/supabase/server";
import { EditButton, DeleteButton } from "@/components/admin/ActionIcons";
import { DeletePostButton } from "./DeletePostButton";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, created_at, author_id")
    .order("created_at", { ascending: false });

  const authorIds = [...new Set((posts ?? []).map((p) => p.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds);
  const authorNames: Record<string, string> = {};
  (profiles ?? []).forEach((p) => {
    authorNames[p.id] = (p.full_name as string) || "—";
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Posts</h2>
        <p className="text-slate-500 mt-1">Create and manage blog articles and insights.</p>
      </div>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/posts/new"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New post
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(posts ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-slate-500 text-center text-sm">
                    No posts yet.
                  </td>
                </tr>
              ) : (
                (posts ?? []).map((post) => (
                  <tr key={post.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-5">
                      <Link href={`/admin/posts/${post.id}/edit`} className="font-semibold text-slate-800 hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">{post.slug}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{authorNames[post.author_id] ?? "—"}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          post.status === "published" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center gap-1">
                        <EditButton href={`/admin/posts/${post.id}/edit`} title="Edit post" />
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
