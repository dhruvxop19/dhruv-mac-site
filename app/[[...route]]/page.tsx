import { DesktopShell } from "@/app/_components/desktop-shell";
import { getAllNotes, getNoteBySlug } from "@/lib/content";
import { buildNotesData } from "@/lib/mock-desktop-data";
import { absoluteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface DesktopPageProps {
  params: Promise<{ route?: string[] }>;
}

function pathFromRoute(route: string[] = []): string {
  return route.length === 0
    ? "/"
    : `/${route.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

const routeMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "About Dhruv Gadiya",
    description:
      "Meet Dhruv Gadiya, head of growth at Agnost AI, building infrastructure for self-improving agents.",
  },
  "/notes": {
    title: "Notes",
    description:
      "Personal notes from Dhruv Gadiya on growth, GTM, startups, agents, experiments, and internet lore.",
  },
  "/music": {
    title: "Music",
    description:
      "Dhruv Gadiya's macOS-style music shelf with favorite tracks from OneRepublic, Drake, Ed Sheeran, A$AP Rocky, and Phillip Phillips.",
  },
  "/tv": {
    title: "TV",
    description:
      "Dhruv Gadiya's curated TV and film shelf inside a playful macOS-style portfolio.",
  },
  "/finder": {
    title: "Finder",
    description:
      "A playful Finder view inside Dhruv Gadiya's macOS-style portfolio website.",
  },
  "/system-settings": {
    title: "System Settings",
    description:
      "A macOS-style Apple Account and settings profile for Dhruv Gadiya.",
  },
};

export async function generateMetadata({ params }: DesktopPageProps): Promise<Metadata> {
  const { route = [] } = await params;
  const pathname = pathFromRoute(route);
  const [appId, slug] = route;

  if (appId === "notes" && slug) {
    const note = getNoteBySlug(slug);
    if (note) {
      const isAbout = note.slug === "about-me";
      const title = isAbout
        ? "About Dhruv Gadiya - Head of Growth at Agnost AI"
        : note.frontmatter.title;
      const description = isAbout
        ? "Dhruv Gadiya is head of growth at Agnost AI, building infrastructure for self-improving agents backed by Y Combinator."
        : note.preview;
      const canonical = absoluteUrl(`/notes/${note.slug}`);

      return {
        title,
        description,
        alternates: { canonical },
        keywords: note.frontmatter.tags,
        openGraph: {
          type: "article",
          url: canonical,
          title,
          description,
          siteName: "Dhruv Gadiya",
          publishedTime: note.frontmatter.date,
          modifiedTime: note.frontmatter.updatedAt ?? note.frontmatter.date,
          authors: [absoluteUrl("/notes/about-me")],
          tags: note.frontmatter.tags,
          images: [
            {
              url: absoluteUrl("/og.png"),
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [absoluteUrl("/og.png")],
          creator: "@StackDhruv",
        },
      };
    }
  }

  const fallback = routeMetadata[pathname] ?? routeMetadata["/"];
  const canonical = pathname === "/" ? absoluteUrl("/notes/about-me") : absoluteUrl(pathname);

  return {
    title: fallback.title,
    description: fallback.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: fallback.title,
      description: fallback.description,
      siteName: "Dhruv Gadiya",
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: fallback.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fallback.title,
      description: fallback.description,
      images: [absoluteUrl("/og.png")],
      creator: "@StackDhruv",
    },
  };
}

export default async function DesktopPage({ params }: DesktopPageProps) {
  const { route = [] } = await params;
  const initialPathname = pathFromRoute(route);
  const [appId, slug] = route;

  // Load all MDX notes and serialize them server-side
  const noteEntries = getAllNotes();
  const serializedMap: Record<string, MDXRemoteSerializeResult> = {};

  await Promise.all(
    noteEntries.map(async (entry) => {
      serializedMap[entry.slug] = await serialize(entry.content) as MDXRemoteSerializeResult;
    }),
  );

  const notesData = buildNotesData(noteEntries, serializedMap);
  const selectedNote = appId === "notes" && slug
    ? noteEntries.find((note) => note.slug === slug) ?? null
    : noteEntries.find((note) => note.slug === "about-me") ?? null;
  const noteJsonLd = selectedNote
    ? {
        "@context": "https://schema.org",
        "@type": selectedNote.slug === "about-me" ? "ProfilePage" : "Article",
        "@id": absoluteUrl(`/notes/${selectedNote.slug}#content`),
        url: absoluteUrl(`/notes/${selectedNote.slug}`),
        headline:
          selectedNote.slug === "about-me"
            ? "About Dhruv Gadiya"
            : selectedNote.frontmatter.title,
        description: selectedNote.preview,
        datePublished: selectedNote.frontmatter.date,
        dateModified: selectedNote.frontmatter.updatedAt ?? selectedNote.frontmatter.date,
        image: absoluteUrl("/og.png"),
        author: { "@id": absoluteUrl("/#dhruv") },
        mainEntity: selectedNote.slug === "about-me" ? { "@id": absoluteUrl("/#dhruv") } : undefined,
      }
    : null;

  return (
    <>
      {noteJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(noteJsonLd) }}
        />
      )}
      <DesktopShell initialPathname={initialPathname} notesData={notesData} />
    </>
  );
}
