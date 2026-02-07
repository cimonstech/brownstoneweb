import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BlogListClient } from "./BlogListClient";

export const revalidate = 60;

type CategoryObj = { id: string; name: string; slug: string };
type PostWithCategories = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
  featured: boolean;
  post_categories: Array<{ categories: CategoryObj | null }>;
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const supabase = await createClient();

  const [categoriesResult, featuredResult, postsResult] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name"),
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, published_at, read_time_minutes")
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, cover_image, published_at, read_time_minutes, featured, post_categories(categories(id, name, slug))"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  const categories = categoriesResult.data ?? [];
  const featuredPost = featuredResult.data;
  const rawPosts = postsResult.data ?? [];
  const allPosts: PostWithCategories[] = rawPosts.map((p: Record<string, unknown>) => {
    const pc = (p.post_categories as Array<{ categories?: CategoryObj | CategoryObj[] | null }> | undefined) ?? [];
    return {
      ...p,
      post_categories: pc.map((item) => {
        const c = item.categories;
        const cat = Array.isArray(c) ? c[0] ?? null : c ?? null;
        return { categories: cat };
      }),
    };
  }) as PostWithCategories[];

  let nowSelling: Array<{ position: number; image_url: string | null; property_name: string | null; project_link: string | null }> = [];
  try {
    const { data } = await supabase.from("now_selling").select("position, image_url, property_name, project_link").order("position");
    nowSelling = data ?? [];
  } catch {
    nowSelling = [];
  }

  const featuredId = featuredPost?.id;
  const postsForGrid = allPosts.filter((p) => p.id !== featuredId);
  const getCatSlug = (pc: { categories: CategoryObj | null }) => pc.categories?.slug ?? "";
  const postsFiltered =
    categorySlug && categorySlug !== "all"
      ? postsForGrid.filter((p) =>
          p.post_categories?.some((pc) => getCatSlug(pc) === categorySlug)
        )
      : postsForGrid;

  const categoryCounts = postsForGrid.reduce<Record<string, number>>((acc, p) => {
    p.post_categories?.forEach((pc) => {
      const slug = getCatSlug(pc);
      if (slug) acc[slug] = (acc[slug] ?? 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/blog" />
      <main className="pt-20 pb-24 w-full max-w-[1440px] mx-auto px-6 md:px-20">
        <BlogListClient
          categories={categories}
          categoryCounts={categoryCounts}
          featuredPost={featuredPost}
          posts={postsFiltered}
          selectedCategorySlug={categorySlug ?? null}
          nowSelling={nowSelling}
        />
      </main>
      <Footer />
    </div>
  );
}
