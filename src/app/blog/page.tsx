import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function BlogListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/blog" />
      <main className="pt-20 pb-24">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-earthy font-serif mb-4">Blog</h1>
          <p className="text-grey mb-12">Updates and insights from Brownstone.</p>
          <ul className="space-y-8">
            {(posts ?? []).length === 0 ? (
              <li className="text-grey">No posts yet.</li>
            ) : (
              (posts ?? []).map((post) => (
                <li key={post.id} className="border-b border-grey/10 pb-8">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    {post.cover_image && (
                      <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-neutral-100">
                        <img
                          src={post.cover_image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-earthy font-serif group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.published_at && (
                      <time className="text-sm text-grey block mt-1">
                        {new Date(post.published_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    {post.excerpt && (
                      <p className="mt-2 text-grey">{post.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
