import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getWikiEntries } from "@/lib/wiki";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/wiki", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const wikiRoutes = getWikiEntries().map((entry) => ({
    url: `${siteConfig.url}/wiki/${entry.slug}`,
    lastModified: entry.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...wikiRoutes];
}
