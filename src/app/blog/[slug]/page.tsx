import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { renderEditorJsToHtml } from "@/lib/blog/render";

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
    .select("id, title, excerpt, cover_image, content, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const html = renderEditorJsToHtml(post.content as import("@/components/admin/Editor").OutputData);

  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/blog" />
      <main className="pt-20 pb-24">
        <article className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/blog" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Blog
          </Link>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-earthy font-serif mb-4">{post.title}</h1>
            {post.published_at && (
              <time className="text-grey text-sm">
                {new Date(post.published_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            {post.cover_image && (
              <div className="mt-6 aspect-video rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src={post.cover_image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>
          {post.excerpt && (
            <p className="text-lg text-grey mb-8 font-light">{post.excerpt}</p>
          )}
          <div
            className="prose prose-earthy max-w-none prose-headings:font-serif prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
