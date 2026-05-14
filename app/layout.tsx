import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://surajit.design"),
  title: {
    default: "Surajit Dutta — Folio",
    template: "%s · Surajit Dutta",
  },
  description:
    "A portfolio in the form of a newspaper. Surajit Dutta — product designer for enterprise software. IAM, UEM, PAM, design systems.",
  keywords: [
    "Product Designer",
    "Surajit Dutta",
    "Enterprise SaaS",
    "Design Systems",
    "IAM",
    "Security",
    "Pune",
  ],
  authors: [{ name: "Surajit Dutta" }],
  creator: "Surajit Dutta",
  openGraph: {
    type: "website",
    title: "Surajit Dutta — Folio",
    description:
      "A portfolio in the form of a newspaper. Enterprise SaaS, design systems, the workflows behind the product.",
    siteName: "Surajit Dutta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surajit Dutta — Folio",
    description:
      "A portfolio in the form of a newspaper. Enterprise SaaS, design systems, the workflows behind the product.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3ecde",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="relative antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--ink)] focus:text-white focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
