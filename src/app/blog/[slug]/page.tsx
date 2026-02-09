import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { renderEditorJsToHtml } from "@/lib/blog/render";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { NowSellingSidebar } from "@/components/blog/NowSellingSidebar";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | Brownstone Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, title, excerpt, cover_image, content, published_at, read_time_minutes, author_id, post_categories(categories(id, name, slug))"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  type Pc = { categories: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null };
  const categoryList = ((post.post_categories ?? []) as Pc[])
    .flatMap((pc) => (Array.isArray(pc.categories) ? pc.categories : pc.categories ? [pc.categories] : []))
    .filter(Boolean) as { id: string; name: string; slug: string }[];
  const categoryIds = categoryList.map((c) => c.id);
  const firstCategory = categoryList[0];

  const { data: author } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, bio")
    .eq("id", post.author_id)
    .single();

  const { data: relatedRows } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, published_at, read_time_minutes, post_categories(categories(name, slug))")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(10);

  type RelPc = { categories: { name: string; slug: string } | { name: string; slug: string }[] | null };
  const related = (relatedRows ?? []).map((p) => {
    const pc = (p.post_categories as RelPc[] | undefined)?.[0];
    const cat = pc?.categories;
    const first = Array.isArray(cat) ? cat[0] : cat;
    return { ...p, firstCategory: first ?? null };
  }).slice(0, 3);

  let nowSelling: Array<{ position: number; image_url: string | null; property_name: string | null; project_link: string | null }> = [];
  try {
    const { data } = await supabase.from("now_selling").select("position, image_url, property_name, project_link").order("position");
    nowSelling = data ?? [];
  } catch {
    nowSelling = [];
  }

  const html = renderEditorJsToHtml(post.content);

  const dateStr =
    post.published_at &&
    new Date(post.published_at).toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const readTimeStr =
    post.read_time_minutes != null && post.read_time_minutes > 0
      ? `${post.read_time_minutes} Min Read`
      : null;
  const byline = [dateStr, readTimeStr].filter(Boolean).join(" • ");

  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <ReadingProgressBar />
      <Nav activePath="/blog" />
      <main className="w-full">
        {/* Hero */}
        <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-end">
          <div className="absolute inset-0 z-0">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-earthy/80 to-earthy" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-earthy via-earthy/40 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pb-12 sm:pb-16 md:pb-20 w-full">
            <div className="flex flex-col gap-6 max-w-4xl">
              <div className="flex gap-4 items-center flex-wrap">
                {firstCategory && (
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded">
                    {firstCategory.name}
                  </span>
                )}
                {byline && (
                  <span className="text-white/80 text-sm tracking-wide">
                    {byline}
                  </span>
                )}
              </div>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight font-serif italic">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-white/90 text-xl md:text-2xl font-light max-w-2xl border-l-4 border-primary pl-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content + Sidebar */}
        <section className="max-w-7xl mx-auto px-6 md:px-20 py-20 flex flex-col lg:flex-row gap-20">
          <article className="flex-1">
            <div
              className="prose prose-base sm:prose-lg prose-earthy max-w-none prose-headings:font-serif prose-img:rounded-xl prose-p:mb-6 sm:prose-p:mb-8 prose-p:text-base sm:prose-p:text-lg prose-p:leading-[1.75] prose-headings:mt-10 prose-headings:mb-4 first:prose-headings:mt-0 prose-ul:my-6 prose-ol:my-6 prose-li:my-1 prose-blockquote:my-8 prose-figure:my-8 editorial-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>

          <aside className="w-full lg:w-80 flex flex-col gap-8 shrink-0">
            {/* About the Author - always visible */}
            <div className="p-6 bg-white rounded-xl border border-earthy/10 shadow-sm">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-4">
                About the Author
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="size-14 rounded-full bg-cover bg-center bg-neutral-200 shrink-0"
                  style={{
                    backgroundImage: author?.avatar_url
                      ? `url(${author.avatar_url})`
                      : undefined,
                  }}
                />
                <div>
                  <p className="font-bold text-lg leading-tight text-earthy">
                    {author?.full_name ?? "Author"}
                  </p>
                </div>
              </div>
              {author?.bio ? (
                <p className="text-sm text-earthy/80 leading-relaxed">
                  {author.bio}
                </p>
              ) : (
                <p className="text-sm text-earthy/70 leading-relaxed">
                  The author of this post.
                </p>
              )}
            </div>

            {/* Share this post - always visible */}
            <div className="p-6 bg-white rounded-xl border border-earthy/10 shadow-sm">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-4">
                Share this post
              </h4>
              <ShareButtons
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/blog/${slug}`}
              />
            </div>

            {/* Related Insights - always visible */}
            <div className="p-6 bg-white rounded-xl border border-earthy/10 shadow-sm">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-6">
                Related Insights
              </h4>
              {related.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {related.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="group block">
                      <div className="aspect-video w-full rounded-lg overflow-hidden mb-2 bg-neutral-200">
                        {r.cover_image ? (
                          <img
                            src={r.cover_image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-300" />
                        )}
                      </div>
                      <h5 className="font-bold text-base leading-snug text-earthy group-hover:text-primary transition-colors">
                        {r.title}
                      </h5>
                      <p className="text-sm text-earthy/70 mt-1">
                        {r.firstCategory?.name ?? "Blog"} •{" "}
                        {(r.read_time_minutes ?? 0) > 0
                          ? `${r.read_time_minutes} min read`
                          : "—"}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-earthy/70">
                  No other posts yet.
                </p>
              )}
            </div>

            {/* Signature Listings */}
            <NowSellingSidebar items={nowSelling} />
          </aside>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-earthy py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-white text-4xl font-bold mb-6 font-serif italic">
              Stay informed on the future of construction.
            </h3>
            <p className="text-white/60 mb-10 text-lg">
              Join industry leaders receiving our monthly editorial on sustainable
              development and luxury trends.
            </p>
            <form className="flex flex-col md:flex-row gap-4" action="#">
              <input
                type="email"
                placeholder="Your professional email"
                className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-primary focus:border-primary px-6 py-4 outline-none placeholder:text-white/60"
              />
              <button
                type="submit"
                className="bg-primary text-white font-bold px-10 py-4 rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
