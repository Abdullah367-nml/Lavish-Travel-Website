import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * robots.txt
 *
 * Allow the crawl, keep private areas out, and point at the sitemap.
 *
 * `/api/` is disallowed because there is nothing there for a crawler and the
 * enquiry endpoint is rate-limited — no reason to spend that budget on bots.
 * `/account` and `/admin` will exist in Phases 2 and 3 and are listed now so
 * they are never crawled even briefly.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/admin", "/api/", "/my-bookings", "/book"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
