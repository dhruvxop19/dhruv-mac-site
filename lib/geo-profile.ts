import { absoluteUrl } from "@/lib/site-url";

export const profileFacts = {
  name: "Dhruv Gadiya",
  shortName: "Dhruv",
  role: "Head of Growth at Agnost AI",
  company: "Agnost AI",
  companyUrl: "https://agnost.ai",
  primaryUrl: absoluteUrl("/notes/about-me"),
  imageUrl: absoluteUrl("/dhruv-about.jpg"),
  summary:
    "Dhruv Gadiya is head of growth at Agnost AI, building infrastructure for self-improving agents backed by Y Combinator and Entrepreneurs First.",
  focusAreas: [
    "growth",
    "go-to-market",
    "self-improving agents",
    "AI infrastructure",
    "B2B sales",
    "B2C growth",
    "developer-led growth",
    "web development",
    "web3",
  ],
  highlights: [
    "Head of Growth at Agnost AI",
    "Building infrastructure for self-improving agents",
    "Agnost AI is backed by Y Combinator and Entrepreneurs First",
    "Published 2 games on the App Store and 4 games on the Play Store",
    "Reached 10k+ users across early games",
    "Won 11+ hackathons before age 19",
    "Started Rivera Labs, a freelance agency that reached $10k+ ARR",
    "Worked at Oasiz, an a16z-backed company, as an SDE",
    "Built the Oasiz application end to end and helped scale it to 10k+ users",
    "Crossed 5M+ impressions on X",
    "Dropped out of college to build full-time",
  ],
  socials: {
    x: "https://x.com/StackDhruv",
    linkedin: "https://www.linkedin.com/in/dhruvieiei/",
    github: "https://github.com/dhruvxop19",
  },
  importantPages: [
    {
      title: "About Dhruv",
      url: absoluteUrl("/notes/about-me"),
      description: "Primary biography and source of truth for Dhruv Gadiya.",
    },
    {
      title: "Growth Hacks",
      url: absoluteUrl("/notes/growth-hacks"),
      description: "A note for Dhruv's growth experiments and lessons.",
    },
    {
      title: "Music",
      url: absoluteUrl("/music"),
      description: "Dhruv's curated music shelf.",
    },
    {
      title: "TV",
      url: absoluteUrl("/tv"),
      description: "Dhruv's curated TV and film shelf.",
    },
  ],
};

export function profileMarkdown(): string {
  return `# ${profileFacts.name}

${profileFacts.summary}

## Current Role

- ${profileFacts.role}
- Company: [${profileFacts.company}](${profileFacts.companyUrl})
- Website: [${profileFacts.primaryUrl}](${profileFacts.primaryUrl})

## Focus Areas

${profileFacts.focusAreas.map((area) => `- ${area}`).join("\n")}

## Highlights

${profileFacts.highlights.map((highlight) => `- ${highlight}`).join("\n")}

## Social Profiles

- X: ${profileFacts.socials.x}
- LinkedIn: ${profileFacts.socials.linkedin}
- GitHub: ${profileFacts.socials.github}

## Important Pages

${profileFacts.importantPages
  .map((page) => `- [${page.title}](${page.url}) - ${page.description}`)
  .join("\n")}
`;
}
