import { MetadataRoute } from "next";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://themodestmcevents.co.ke";
  const now = new Date();

  const categoryUrls: MetadataRoute.Sitemap = GALLERY_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/gallery/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...categoryUrls,
    {
      url: `${baseUrl}/#services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#packages`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/#book`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
