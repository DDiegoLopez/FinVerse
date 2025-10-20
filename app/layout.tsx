import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "FinVerse",
    template: "%s | FinVerse",
  },
  description: "FinVerse is a platform for tracking your stocks",
  keywords: [
    "stocks",
    "investing",
    "finance",
    "markets",
    "trading",
    "finverse",
  ],
  authors: [{ name: "FinVerse" }],
  creator: "FinVerse",
  applicationName: "FinVerse",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "FinVerse",
    description: "FinVerse is a platform for tracking your stocks",
    url: "/",
    siteName: "FinVerse",
    images: [
      {
        url: "/assets/images/finverse-main.webp",
        alt: "FinVerse preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinVerse",
    description: "FinVerse is a platform for tracking your stocks",
    images: ["/assets/images/finverse-main.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
