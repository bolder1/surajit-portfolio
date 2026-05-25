import { MastheadV3 } from "@/components/v3/MastheadV3";
import { HeroV3 } from "@/components/v3/HeroV3";
import { SelectedFlagships } from "@/components/v3/SelectedFlagships";
import { ShortAbout } from "@/components/v3/ShortAbout";
import { FinalCTA } from "@/components/v3/FinalCTA";
import { FooterV3 } from "@/components/v3/FooterV3";

/**
 * /v3 — recruiter-first home.
 *
 * Four sections in scroll order: Hero → Selected work (3 flagships)
 * → Short About → Final CTA. Footer is compact.
 *
 * Mobile target: home fits in ≤2 viewport scrolls before the first
 * flagship row appears.
 */
export default function V3HomePage() {
  return (
    <>
      <MastheadV3 />
      <main id="main">
        <HeroV3 />
        <SelectedFlagships />
        <ShortAbout />
        <FinalCTA />
      </main>
      <FooterV3 />
    </>
  );
}
