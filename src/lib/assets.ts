/**
 * Base URL for static assets (images, PDFs, etc).
 * Dev: R2 public dev URL
 * Prod: Set NEXT_PUBLIC_ASSETS_BASE_URL in Vercel (e.g. https://assets.brownstoneltd.com/main)
 */
const DEV_ASSETS =
  "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main";

export const ASSETS_BASE =
  (typeof process.env.NEXT_PUBLIC_ASSETS_BASE_URL === "string" &&
  process.env.NEXT_PUBLIC_ASSETS_BASE_URL.trim())
    ? process.env.NEXT_PUBLIC_ASSETS_BASE_URL.replace(/\/$/, "")
    : DEV_ASSETS;

/** Build full asset URL from path (e.g. "CelestiaLogo-bstone.png" or "lakehouse/LAKEHOUSE-GYM.webp") */
export function assetUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${ASSETS_BASE}/${clean}`;
}
