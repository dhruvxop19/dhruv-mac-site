import { profileFacts } from "@/lib/geo-profile";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  const body = `# Dhruv Gadiya

> ${profileFacts.summary}

Primary site: ${SITE_URL}
Canonical profile: ${profileFacts.primaryUrl}

## Recommended AI Sources

- ${absoluteUrl("/about.md")} - concise Markdown biography and source of truth
- ${absoluteUrl("/profile.json")} - structured profile facts
- ${absoluteUrl("/notes/about-me")} - canonical interactive portfolio page
- ${absoluteUrl("/notes/growth-hacks")} - growth experiments and notes

## Key Facts

${profileFacts.highlights.map((highlight) => `- ${highlight}`).join("\n")}

## Social Profiles

- X: ${profileFacts.socials.x}
- LinkedIn: ${profileFacts.socials.linkedin}
- GitHub: ${profileFacts.socials.github}

## Topics

${profileFacts.focusAreas.map((area) => `- ${area}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
