import type { Metadata, Viewport } from "next";
import {
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Archivo,
  Geist,
  Geist_Mono,
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HUD } from "@/components/HUD";
import { PlaygroundFab } from "@/components/PlaygroundFab";
import { VersionToggle } from "@/components/VersionToggle";
import "./globals.css";
import "./v5.css";
import "./v5b.css";
import "./v5c.css";
import "./v5d.css";
import "./v2.css";
import "./v2b.css";
import "./v2c.css";

/*
  Root layout — Surajit Dutta portfolio.

  Two design systems live side by side so they can be compared:
    .v5-root  — V1, the shipped warm-dark editorial system.
    .v2-root  — V2, the "volt" system on /v2 (nested inside .v5-root,
                overriding every token it inherits).

  V1 faces: Inter · Instrument Serif · JetBrains Mono.
  V2 faces: Archivo (variable wght + wdth) · Geist · Geist Mono.
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

/* V2 — Archivo carries the display voice. The width axis is what makes the
   headlines move: compressed at rest, expanding as they settle. */
const v2Display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--v2-display",
  display: "swap",
});

const v2Sans = Geist({
  subsets: ["latin"],
  variable: "--v2-sans",
  display: "swap",
});

const v2Mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--v2-mono",
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
      className={`${sans.variable} ${serif.variable} ${mono.variable} ${v2Display.variable} ${v2Sans.variable} ${v2Mono.variable}`}
      suppressHydrationWarning
    >
      <body style={{ background: "#0a0a0a" }}>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll />
        <HUD />
        <PlaygroundFab />
        <VersionToggle />
        <div className="v5-root">{children}</div>
      </body>
    </html>
  );
}
