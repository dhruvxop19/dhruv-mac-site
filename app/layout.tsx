import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/app/_components/convex-provider";
import { getToken } from "@/lib/auth-server";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import Script from "next/script";

const siteDescription =
  "Dhruv Gadiya is head of growth at Agnost AI, building infrastructure for self-improving agents backed by Y Combinator.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Dhruv's macOS Portfolio",
  title: {
    default: "Dhruv Gadiya - Head of Growth at Agnost AI",
    template: "%s | Dhruv Gadiya",
  },
  description: siteDescription,
  keywords: [
    "Dhruv Gadiya",
    "Dhruv",
    "Agnost AI",
    "head of growth",
    "growth engineer",
    "GTM",
    "self-improving agents",
    "YC S26",
    "personal website",
    "macOS portfolio",
  ],
  authors: [{ name: "Dhruv Gadiya", url: absoluteUrl("/notes/about-me") }],
  creator: "Dhruv Gadiya",
  publisher: "Dhruv Gadiya",
  category: "Personal website",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/notes/about-me"),
    siteName: "Dhruv Gadiya",
    title: "Dhruv Gadiya - Head of Growth at Agnost AI",
    description: siteDescription,
    images: [
      {
        url: absoluteUrl("/og.png"),
        width: 1200,
        height: 630,
        alt: "Dhruv Gadiya - Head of Growth at Agnost AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv Gadiya - Head of Growth at Agnost AI",
    description: siteDescription,
    images: [absoluteUrl("/og.png")],
    creator: "@StackDhruv",
  },
  alternates: {
    canonical: absoluteUrl("/notes/about-me"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#dhruv"),
    name: "Dhruv Gadiya",
    alternateName: "Dhruv",
    url: absoluteUrl("/notes/about-me"),
    image: absoluteUrl("/dhruv-about.jpg"),
    jobTitle: "Head of Growth",
    worksFor: {
      "@type": "Organization",
      name: "Agnost AI",
      url: "https://agnost.ai",
    },
    sameAs: [
      "https://x.com/StackDhruv",
      "https://www.linkedin.com/in/dhruvieiei/",
      "https://github.com/dhruvxop19",
    ],
    knowsAbout: [
      "Growth",
      "Go-to-market",
      "Self-improving agents",
      "AI infrastructure",
      "Web development",
      "Web3",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: "Dhruv's macOS Portfolio",
    url: SITE_URL,
    inLanguage: "en",
    author: { "@id": absoluteUrl("/#dhruv") },
    description: siteDescription,
  },
];

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script 
          src="https://cdn.visitors.now/v.js" 
          data-token="d502ca42-8a2f-41a4-8a35-56450cb6af1a"
        />
      </head>
      <body className={inter.variable}>
        <ConvexClientProvider initialToken={token}>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
