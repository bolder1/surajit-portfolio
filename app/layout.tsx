import type { Metadata, Viewport } from "next";
import {
  Space_Grotesk,
  Fraunces,
  Martian_Mono,
  Archivo,
  Geist,
  Geist_Mono,
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { PageTransition } from "@/components/PageTransition";
import { HUD } from "@/components/HUD";
import { PlaygroundFab } from "@/components/PlaygroundFab";
import { VersionToggle } from "@/components/VersionToggle";
import "./globals.css";
import "./v5.css";
import "./v5b.css";
import "./v5c.css";
import "./v5d.css";
import "./v5e.css";
import "./v5f.css";
import "./v2.css";
import "./v2b.css";
import "./v2c.css";
import "./ds.css";

/*
  Root layout — Surajit Dutta portfolio.

  Two design systems live side by side so they can be compared:
    .v5-root  — V1, the shipped warm-dark editorial system.
    .v2-root  — V2, the "volt" system on /v2 (nested inside .v5-root,
                overriding every token it inherits).

  V1 faces: Space Grotesk · Fraunces (variable) · Martian Mono (variable).
  V2 faces: Archivo (variable wght + wdth) · Geist · Geist Mono.
*/

/* Space Grotesk replaces Inter. Inter is the default of every AI-built
   portfolio and has no opinion; this is drawn from a monospace skeleton, so
   it keeps a machined edge at UI sizes while staying readable in paragraphs
   — which a true display face like Orbitron would not. */
const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--v5-sans",
  display: "swap",
});

/* Fraunces carries the V1 display voice. Instrument Serif was a single
   400 weight, so headings could never actually be bold — this is variable
   across 400–800 with a true italic, and its optical-size axis keeps the
   big masthead settings from looking like blown-up body type. */
const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  // No explicit weight list: next/font serves the full variable range
  // (wght included by default), which is what makes real bold possible.
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--v5-serif",
  display: "swap",
});

/* Martian Mono is the robotic voice — wide, squared, engineered-looking, and
   variable on both width and weight. Every label, eyebrow and figure on the
   site is set in it, and the width axis is what the hover animation moves. */
const mono = Martian_Mono({
  subsets: ["latin"],
  // No weight list: the full variable range, so wdth/wght can be animated.
  axes: ["wdth"],
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
      <head>
        {/*
          Marks the document before first paint if the intro has already been
          seen this session, so a returning visitor never sees it flash up and
          disappear. CSS keyed on the attribute does the hiding; React would
          only get the chance a frame too late.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('bh-intro')==='seen')document.documentElement.setAttribute('data-intro','seen')}catch(e){}",
          }}
        />
      </head>
      <body style={{ background: "#0a0a0a" }}>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll />
        <Cursor />
        <HUD />
        <PlaygroundFab />
        <VersionToggle />
        <div className="v5-root">
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}
