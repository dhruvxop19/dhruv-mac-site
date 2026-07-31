import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/content";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();

  const noteUrls: MetadataRoute.Sitemap = notes.map((note) => ({
    url: absoluteUrl(`/notes/${note.slug}`),
    lastModified: new Date(note.frontmatter.updatedAt ?? note.frontmatter.date),
    changeFrequency: "monthly",
    priority: note.slug === "about-me" ? 1 : 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/notes"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/music"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/tv"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/about.md"),
      lastModified: new Date("2026-07-31T00:00:00+05:30"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/profile.json"),
      lastModified: new Date("2026-07-31T00:00:00+05:30"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/llms.txt"),
      lastModified: new Date("2026-07-31T00:00:00+05:30"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...noteUrls,
  ];
}
