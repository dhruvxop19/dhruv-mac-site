import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/app/_components/convex-provider";
import { getToken } from "@/lib/auth-server";
import { SITE_URL } from "@/lib/site-url";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dhruv",
    template: "%s | Dhruv",
  },
  description:
    "Dhruv — head of growth at Agnost AI, building infra for self-improving agents. Personal website as a macOS desktop.",
  keywords: ["Dhruv", "Agnost AI", "growth", "developer", "personal website"],
  authors: [{ name: "Dhruv", url: SITE_URL }],
  creator: "Dhruv",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Dhruv",
    title: "Dhruv",
    description:
      "Dhruv — head of growth at Agnost AI, building infra for self-improving agents.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Dhruv",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv",
    description:
      "Dhruv — head of growth at Agnost AI, building infra for self-improving agents.",
    images: ["/og.png"],
    creator: "@StackDhruv",
  },
  alternates: {
    canonical: SITE_URL,
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
