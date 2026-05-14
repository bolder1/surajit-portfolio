import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Edition Two · After Dark — Surajit Dutta",
  description:
    "A parallel design edition of the Folio. Same portfolio, dark cinematic stage. Built to be compared head-to-head with the cream editorial Folio.",
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
};

/**
 * /edition-two layout. The chrome (Masthead + Folio footer) from the
 * cream editorial home does not apply here — Edition Two has its own
 * topbar baked into the component, scoped to its dark module CSS so
 * it never bleeds into v1.
 */
export default function EditionTwoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
