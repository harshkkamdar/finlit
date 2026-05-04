import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Auth-only pages waste crawl budget and surface noise in search.
        // /api and /admin must never be indexed.
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/chapter/",
          "/lesson/",
          "/simulation/",
          "/profile",
          "/profile/",
          "/progress",
          "/progress/",
          "/leaderboard",
          "/leaderboard/",
          "/daily-challenge",
          "/daily-challenge/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
