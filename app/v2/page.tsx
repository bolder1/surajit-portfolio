import type { Metadata } from "next";
import { ChromeV2 } from "@/components/v2/ChromeV2";
import { HeroV2 } from "@/components/v2/HeroV2";
import { MetricsV2 } from "@/components/v2/MetricsV2";
import { PosterV2 } from "@/components/v2/PosterV2";
import { LedgerV2 } from "@/components/v2/LedgerV2";
import { TSectionV2 } from "@/components/v2/TSectionV2";
import { EngineV2 } from "@/components/v2/EngineV2";
import { PipelineV2 } from "@/components/v2/PipelineV2";
import { ReceiptsV2 } from "@/components/v2/ReceiptsV2";
import { OfferV2 } from "@/components/v2/OfferV2";
import { OutroV2 } from "@/components/v2/OutroV2";

export const metadata: Metadata = {
  title: "Brief on Monday, product by Friday",
  description:
    "Surajit Dutta, AI-native product designer. Requirements to a working, tested, hand-off-ready build in days. Design systems that generate rather than get drawn.",
  openGraph: {
    type: "website",
    title: "Surajit Dutta — brief on Monday, product by Friday",
    description:
      "AI-native product and experience designer. Enterprise product at prototype speed, plus the design systems and process behind it.",
    siteName: "Surajit Dutta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surajit Dutta — brief on Monday, product by Friday",
    description:
      "AI-native product and experience designer. Enterprise product at prototype speed.",
  },
  alternates: { canonical: "/v2" },
};

/**
 * Home, concept 02 — "Velocity".
 *
 * The argument, told mostly in pictures: the claim (hero), the numbers
 * (metrics), the evidence (ledger), the shape of the skill set (the T), the
 * systems proof (engine), the method (pipeline), the deployed work
 * (receipts), how to buy it (offer), and the close.
 *
 * Two posters break the run of data sections. Eight dense sections in a row
 * all arrive at the same volume and the reader stops registering any of
 * them; the posters are the rests between the bars. Each is one sentence
 * and one object, and each lands on the objection the previous section
 * just raised — "who actually does all of this?" after the numbers, and
 * "then what do I get?" after the engine.
 *
 * Concept 01 stays at `/`; the toggle in the layout switches between them.
 */
export default function V2HomePage() {
  return (
    <div className="v2-root">
      <ChromeV2 />
      <main id="main">
        <HeroV2 />
        <MetricsV2 />

        <PosterV2
          id="v2-poster-ctrl"
          eyebrow="No hand-off gap"
          lead="Everything is under"
          emphasis="Ctrl."
          cap="Ctrl"
          note="Research, PRD, prototype, test, Figma, hand-off. One person holds the whole chain, so nothing is lost translating between the links."
        />

        <LedgerV2 />
        <TSectionV2 />
        <EngineV2 />

        <PosterV2
          id="v2-poster-ship"
          eyebrow="What you actually receive"
          lead="The deck is not the"
          emphasis="product."
          cap="⏎"
          note="You get a URL your team can open, break, and build against — not a picture of one."
        />

        <PipelineV2 />
        <ReceiptsV2 />
        <OfferV2 />
        <OutroV2 />
      </main>
    </div>
  );
}
