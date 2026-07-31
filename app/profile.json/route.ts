import { profileFacts } from "@/lib/geo-profile";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/profile.json"),
    url: absoluteUrl("/notes/about-me"),
    dateModified: new Date("2026-07-31T00:00:00+05:30").toISOString(),
    mainEntity: {
      "@type": "Person",
      "@id": absoluteUrl("/#dhruv"),
      name: profileFacts.name,
      alternateName: profileFacts.shortName,
      url: profileFacts.primaryUrl,
      image: profileFacts.imageUrl,
      jobTitle: "Head of Growth",
      worksFor: {
        "@type": "Organization",
        name: profileFacts.company,
        url: profileFacts.companyUrl,
      },
      description: profileFacts.summary,
      sameAs: Object.values(profileFacts.socials),
      knowsAbout: profileFacts.focusAreas,
    },
    highlights: profileFacts.highlights,
    importantPages: profileFacts.importantPages,
  };

  return Response.json(body, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
