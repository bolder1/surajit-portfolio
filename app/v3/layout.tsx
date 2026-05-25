import type { Metadata } from "next";
import { Inter, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./v3.css";

/*
  V3 layout — recruiter-first, restrained register.
  Opts out of HUD + Cursor + brutalist tokens. Inherits the Cursor +
  VersionToggle from the root layout (those live above this layout)
  but disables the V2-style cursor flavors via .v3-root scoping.
*/

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--v3-sans",
  display: "swap",
});

const serif = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--v3-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--v3-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Surajit Dutta — Product Designer for enterprise software",
    template: "%s · Surajit Dutta",
  },
  description:
    "Product Designer building enterprise UX systems for scale. IAM, PAM, IGA, UEM, design systems, AI-augmented prototyping.",
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${sans.variable} ${serif.variable} ${mono.variable} v3-root`}>
      {children}
    </div>
  );
}
