import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ai-memory.dev";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/architecture`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/parzival`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
