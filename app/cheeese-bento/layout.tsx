import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CHEEEESE — Bento Brand System",
  description:
    "Four flavours, four bento layouts. Same brand DNA, distinct mood per SKU. Sized for social — drop into a 4×5 carousel, 1×1 grid post, or full-bleed billboard.",
};

/**
 * /cheeese-bento layout — pulls in the four brand fonts the bento
 * system depends on (Bagel Fat One · Archivo · Archivo Black ·
 * Inter Tight · JetBrains Mono). Loaded only on this route so the
 * editorial Folio site itself stays on Instrument Serif + Geist.
 */
export default function CheeseseBentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Archivo+Black&family=Archivo:wght@400;500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
