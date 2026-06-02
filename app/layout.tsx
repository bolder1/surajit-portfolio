import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HUD } from "@/components/HUD";
import "./globals.css";
import "./v5.css";
import "./v5b.css";
import "./v5c.css";

/*
  Root layout — Surajit Dutta portfolio.
  Single design system, scoped via .v5-root.
  Inter (sans) · Instrument Serif (display italic) · JetBrains Mono (labels).
*/

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--v5-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--v5-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--v5-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://surajit-dutta.vercel.app"),
  title: {
    default: "Surajit Dutta — Product designer for enterprise software",
    template: "%s · Surajit Dutta",
  },
  description:
    "Surajit Dutta — product designer for enterprise IT, identity and security teams. IAM, PAM, IGA, UEM, design systems.",
  keywords: [
    "Product Designer",
    "Surajit Dutta",
    "Enterprise SaaS",
    "Design Systems",
    "IAM",
    "Security",
    "Kolkata",
  ],
  authors: [{ name: "Surajit Dutta" }],
  creator: "Surajit Dutta",
  openGraph: {
    type: "website",
    title: "Surajit Dutta — Product designer for enterprise software",
    description:
      "IAM, UEM, PAM, design systems. Enterprise workflows behind the product.",
    siteName: "Surajit Dutta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surajit Dutta — Product designer for enterprise software",
    description:
      "IAM, UEM, PAM, design systems. Enterprise workflows behind the product.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body style={{ background: "#0a0a0a" }}>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll />
        <HUD />
        <div className="v5-root">{children}</div>
      </body>
    </html>
  );
}
