import fs from "node:fs";
import path from "node:path";

/**
 * Which referenced images actually exist in /public.
 *
 * The demo dataset references photography that has not been supplied yet
 * (`/images/tours/kruger-1.jpg` and friends). Rather than ship broken
 * <img> tags or hard-code placeholders into the data, this checks the
 * filesystem once per path and caches the answer.
 *
 * Because every page using it is prerendered as static HTML, the check
 * runs at BUILD time and costs nothing at runtime — and there is no
 * client-side JavaScript involved, so no layout shift and no flash of a
 * broken image.
 *
 * The practical upshot: drop a real photo at `public/images/tours/kruger-1.jpg`
 * and it appears on the next build with no code change at all.
 */
const cache = new Map<string, boolean>();

export function publicImageExists(src: string | null | undefined): boolean {
  if (!src) return false;
  // Only ever resolve paths inside /public, never arbitrary filesystem reads.
  if (!src.startsWith("/")) return false;
  if (src.includes("..")) return false;

  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  let exists = false;
  try {
    exists = fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    exists = false;
  }
  cache.set(src, exists);
  return exists;
}
