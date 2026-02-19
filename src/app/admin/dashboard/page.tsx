import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRoles } from "@/lib/supabase/auth";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const roles = await getUserRoles();
  const isAuthorOnly =
    roles.includes("author") && !roles.includes("admin") && !roles.includes("moderator");

  const supabase = await createClient();
  const contentPromises: [
    ReturnType<typeof supabase.from>,
    ReturnType<typeof supabase.from>,
    ReturnType<typeof supabase.from>,
    ReturnType<typeof supabase.from>,
  ] = [
    supabase
      .from("posts")
      .select("id, title, status, created_at, author_id")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }),
  ];
  const crmPromises = isAuthorOnly
    ? []
    : [
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase.from("campaigns").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ];

  const [postsResult, draftResult, publishedResult, totalResult, ...crmResults] = await Promise.all([
    ...contentPromises,
    ...crmPromises,
  ]);
  const { data: posts } = postsResult as {
    data: Array<{ id: string; title: string; status: string; created_at: string; author_id: string }>;
  };
  const draftCount = (draftResult as { count: number | null }).count ?? 0;
  const publishedCount = (publishedResult as { count: number | null }).count ?? 0;
  const totalCount = (totalResult as { count: number | null }).count ?? 0;

  let contacts = 0;
  let campaigns = 0;
  let leads = 0;
  let users = 0;

  if (!isAuthorOnly && crmResults.length >= 4) {
    const contactsCount = (crmResults[0] as { count: number | null }).count ?? 0;
    const campaignsCount = (crmResults[1] as { count: number | null }).count ?? 0;
    const leadsCount = (crmResults[2] as { count: number | null }).count ?? 0;
    const totalProfiles = (crmResults[3] as { count: number | null }).count ?? 0;
    const admin = createAdminClient();
    const { data: adminRoleData } = await admin.from("roles").select("id").ilike("name", "admin").maybeSingle();
    const adminRole = adminRoleData as { id: string } | null;
    const adminUserCount = adminRole
      ? (await admin.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role_id", adminRole.id)).count ?? 0
      : 0;
    contacts = contactsCount;
    campaigns = campaignsCount;
    leads = leadsCount;
    users = Math.max(0, totalProfiles - adminUserCount);
  }

  const authorIds = [...new Set((posts ?? []).map((p) => p.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds);
  const authorNames: Record<string, string> = {};
  (profiles ?? []).forEach((p) => {
    authorNames[p.id] = (p.full_name as string) || "—";
  });

  const total = totalCount;
  const drafts = draftCount;
  const published = publishedCount;

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Executive Overview</h2>
        <p className="text-slate-500 mt-1">Welcome back. Here&apos;s what&apos;s happening at Brownstone today.</p>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-3">Content</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Drafts</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Draft posts</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{drafts}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Live</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Published insights</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{published}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">All posts</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{total}</h3>
        </div>
      </div>

      {!isAuthorOnly && (
        <>
      <h3 className="text-lg font-bold text-slate-800 mb-3">CRM & Team</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link
          href="/admin/crm/contacts"
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Contacts</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{contacts}</h3>
          <p className="text-xs text-slate-400 mt-2">CRM</p>
        </Link>
        <Link
          href="/admin/crm/campaigns"
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Campaigns</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{campaigns}</h3>
          <p className="text-xs text-slate-400 mt-2">Email campaigns</p>
        </Link>
        <Link
          href="/admin/leads"
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Leads</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{leads}</h3>
          <p className="text-xs text-slate-400 mt-2">Form submissions</p>
        </Link>
        <Link
          href="/admin/users"
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Users</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{users}</h3>
          <p className="text-xs text-slate-400 mt-2">Team & roles</p>
        </Link>
      </div>
        </>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent posts</h3>
          <Link
            href="/admin/posts/new"
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            New post
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">
                <th className="px-6 py-4">Post title</th>
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
                    No posts yet. Create one with &quot;New post&quot; above.
                  </td>
                </tr>
              ) : (
                (posts ?? []).map((post) => (
                  <tr key={post.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors">
                            <Link href={`/admin/posts/${post.id}/edit`}>{post.title}</Link>
                          </p>
                          <p className="text-xs text-slate-400">Blog article</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {(authorNames[post.author_id] || "—").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-600">{authorNames[post.author_id] || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          post.status === "published"
                            ? "bg-primary/10 text-primary"
                            : post.status === "draft"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-500">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="inline-flex text-slate-400 hover:text-primary transition-colors p-2"
                        aria-label="Edit"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {(posts ?? []).length > 0 && (
          <div className="p-4 border-t border-slate-100 flex justify-center">
            <Link
              href="/admin/posts"
              className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              View all posts <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
