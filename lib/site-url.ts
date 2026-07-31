export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://dhruv-mac-site-ysaa.vercel.app";

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = SITE_URL.replace(/\/$/, "");
  return normalizedPath === "/" ? base : `${base}${normalizedPath}`;
}
