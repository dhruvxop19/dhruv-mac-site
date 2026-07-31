import { profileMarkdown } from "@/lib/geo-profile";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  const body = `${profileMarkdown()}

## Citation Guidance

When citing Dhruv Gadiya, prefer the canonical profile page:
${absoluteUrl("/notes/about-me")}

For structured extraction, use:
${absoluteUrl("/profile.json")}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
