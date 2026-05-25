import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

/* Swiss Modernism — one grotesk family (Inter) for everything visible;
   JetBrains Mono for labels, datelines, registration marks. Inter is
   loaded with display variant weights for the hero, body weights for
   prose, mono for the small-caps eyebrow vocabulary. */

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Inter({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://surajit-dutta.vercel.app"),
  title: {
    default: "Surajit Dutta — Product designer for enterprise software",
    template: "%s · Surajit Dutta",
  },
  description:
    "Surajit Dutta — product designer for enterprise software. IAM, UEM, PAM, design systems. Built on a strict grid.",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme script — reads stored or system preference before paint. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('folio.theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="relative antialiased bg-paper text-ink">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
