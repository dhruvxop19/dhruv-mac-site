export const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://example.convex.cloud";

export const convexSiteUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? "https://example.convex.site";

export const isConvexConfigured =
  Boolean(process.env.NEXT_PUBLIC_CONVEX_URL) &&
  Boolean(process.env.NEXT_PUBLIC_CONVEX_SITE_URL) &&
  !convexUrl.includes("example.convex") &&
  !convexSiteUrl.includes("example.convex");
