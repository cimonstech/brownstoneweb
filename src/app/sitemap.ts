import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://brownstoneltd.com";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/celestia",
  "/celestia/chalets",
  "/celestia/lakehouse",
  "/celestia/townhouses",
  "/contact",
  "/portfolio",
  "/privacy-policy",
  "/services",
  "/terms-of-use",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : ("monthly" as const),
    priority: path === "" ? 1 : 0.8,
  }));

  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");
    if (posts?.length) {
      blogUrls = posts.map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Skip blog URLs if DB unavailable at build
  }

  return [...staticUrls, ...blogUrls];
}
