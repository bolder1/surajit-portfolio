import type { Metadata } from "next";
import { InfoPageV5 } from "@/components/v5/InfoPageV5";

export const metadata: Metadata = {
  title: "Info — Surajit Dutta",
  description:
    "About Surajit Dutta — product designer for enterprise IT, identity and security teams.",
};

/**
 * /info — the dedicated About / Info page.
 * Inherits the v5 layout (fonts + .v5-root tokens) from app/v5/layout.tsx.
 */
export default function V5InfoPage() {
  return <InfoPageV5 />;
}
