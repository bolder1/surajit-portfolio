import type { Metadata } from "next";
import { EB_Garamond, Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./v2.css";

/*
  V2 layout — fully separate from the brutalist /
  No AppShell, no HUD, no cursor inheritance. Olive paper background,
  EB Garamond italic for satellite labels, Archivo Black for the
  centered name moment, JetBrains Mono for HUD/meta.
*/

const serif = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--v2-serif",
  display: "swap",
});

const display = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--v2-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--v2-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surajit Dutta — v2",
  description: "v2 of the portfolio. Olive paper. Skills radiating from the name.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${display.variable} ${mono.variable} v2-root`}>
      {children}
    </div>
  );
}
