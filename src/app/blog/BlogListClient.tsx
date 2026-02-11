"use client";

import Link from "next/link";
import { useState } from "react";
import { NowSellingSidebar } from "@/components/blog/NowSellingSidebar";
import { assetUrl } from "@/lib/assets";

type Category = { id: string; name: string; slug: string };
type NowSellingItem = { position: number; image_url: string | null; property_name: string | null; project_link: string | null };
type FeaturedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
} | null;
type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
  post_categories: Array<{
    categories: { id: string; name: string; slug: string } | null;
  }>;
};

const INITIAL_GRID = 8;

export function BlogListClient({
  categories,
  categoryCounts,
  featuredPost,
  posts,
  selectedCategorySlug,
  nowSelling = [],
}: {
  categories: Category[];
  categoryCounts: Record<string, number>;
  featuredPost: FeaturedPost;
  posts: Post[];
  selectedCategorySlug: string | null;
  nowSelling?: NowSellingItem[];
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? posts : posts.slice(0, INITIAL_GRID);
  const hasMore = posts.length > INITIAL_GRID && !showAll;

  const firstCategory = (p: Post) =>
    p.post_categories?.[0]?.categories ?? null;

  const BLOG_HEADER_IMAGE =
    assetUrl("blogIMG_0350.webp");

  return (
    <>
      {/* Blog header with image */}
      <section className="relative mb-12 sm:mb-16 overflow-hidden rounded-xl">
        <div
          className="h-[240px] sm:h-[320px] md:h-[400px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${BLOG_HEADER_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-earthy/40 flex items-center justify-center rounded-xl">
          <div className="text-center px-6">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif italic drop-shadow-lg">
              Insights & News
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl mt-3 font-serif max-w-xl mx-auto px-2">
              Stories on sustainable development and luxury construction.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <section className="relative mb-16 sm:mb-24 group">
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center bg-white dark:bg-[#2d1e16] rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
              <div className="lg:col-span-7 h-[320px] sm:h-[400px] lg:h-[500px] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: featuredPost.cover_image
                      ? `url(${featuredPost.cover_image})`
                      : "linear-gradient(135deg, #f8f6f6 0%, #e6dfdb 100%)",
                  }}
                />
              </div>
              <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
                  Featured Post
                </span>
                <h1 className="text-earthy dark:text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 font-serif italic">
                  {featuredPost.title}
                </h1>
                <p className="text-grey dark:text-[#a5948a] text-lg leading-relaxed mb-8 font-serif line-clamp-3">
                  {featuredPost.excerpt ?? ""}
                </p>
                <div className="flex items-center gap-4">
                  <span className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-widest inline-flex items-center gap-2">
                    Read Story →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Main content */}
        <div className="flex-1">
          {/* Category tabs */}
          <div className="flex items-center justify-between mb-12 border-b border-earthy/10 pb-6">
            <div className="flex gap-10 overflow-x-auto no-scrollbar">
              <Link
                href="/blog"
                className={`text-sm font-bold tracking-widest uppercase whitespace-nowrap pb-6 -mb-[26px] ${
                  !selectedCategorySlug || selectedCategorySlug === "all"
                    ? "border-b-2 border-primary text-primary"
                    : "text-grey hover:text-primary transition-colors border-b-2 border-transparent"
                }`}
              >
                All Articles
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                  className={`text-sm font-bold tracking-widest uppercase whitespace-nowrap pb-6 -mb-[26px] ${
                    selectedCategorySlug === cat.slug
                      ? "border-b-2 border-primary text-primary"
                      : "text-grey hover:text-primary transition-colors border-b-2 border-transparent"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {displayed.map((post) => {
              const cat = firstCategory(post);
              return (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-neutral-200">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: post.cover_image
                            ? `url(${post.cover_image})`
                            : "linear-gradient(135deg, #eee 0%, #e0e0e0 100%)",
                        }}
                      />
                    </div>
                    {cat && (
                      <span className="text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-3 block">
                        {cat.name}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold font-serif leading-tight mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-grey text-sm leading-relaxed mb-4 line-clamp-2 italic">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-[10px] font-bold text-grey uppercase tracking-widest gap-4">
                      {post.published_at && (
                        <span>
                          {new Date(post.published_at).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </span>
                      )}
                      {post.published_at && (post.read_time_minutes ?? 0) > 0 && (
                        <span className="w-1 h-1 bg-grey rounded-full" />
                      )}
                      {(post.read_time_minutes ?? 0) > 0 && (
                        <span>{post.read_time_minutes} min read</span>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {displayed.length === 0 && (
            <p className="text-grey py-12">No posts in this category yet.</p>
          )}

          {hasMore && (
            <div className="mt-20 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="border border-earthy/20 px-12 py-4 rounded-lg font-bold text-sm tracking-widest hover:bg-white dark:hover:bg-[#2d1e16] transition-all"
              >
                LOAD MORE INSIGHTS
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <div className="sticky top-32 space-y-16">
            {/* Newsletter */}
            <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
              <h4 className="text-xl font-bold font-serif italic mb-3 leading-tight">
                Join the Inner Circle
              </h4>
              <p className="text-sm text-grey mb-6">
                Exclusive construction insights and luxury trends delivered
                monthly.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white border border-earthy/10 rounded-lg text-sm px-4 py-3 focus:ring-primary focus:border-primary outline-none"
                />
                <button
                  type="button"
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                >
                  SUBSCRIBE
                </button>
              </div>
            </div>

            {/* Popular topics */}
            {categories.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-earthy/10">
                  Popular Topics
                </h4>
                <div className="flex flex-col gap-5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                      className="group flex items-center justify-between"
                    >
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-xs text-grey font-mono">
                        ({categoryCounts[cat.slug] ?? 0})
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Signature Listings */}
            <NowSellingSidebar items={nowSelling} />
          </div>
        </aside>
      </div>
    </>
  );
}
