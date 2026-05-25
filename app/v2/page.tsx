import { MastheadV2 } from "@/components/v2/MastheadV2";
import { HeroV2 } from "@/components/v2/HeroV2";
import { ManifestoScroll } from "@/components/v2/ManifestoScroll";
import { SelectedWorkV2 } from "@/components/v2/SelectedWorkV2";
import { FooterV2 } from "@/components/v2/FooterV2";

/**
 * /v2 — complete V2 home.
 *
 * Composition:
 *   001  Hero            — center name + radiating skill connectors
 *   002  Manifesto       — five-phase scroll narrative
 *   003  Selected Work   — three case studies, ozgur list pattern
 *   004  Footer          — work-with-me + channels + CV
 */
export default function V2Page() {
  return (
    <>
      <MastheadV2 activeHref="/v2" />
      <main id="main">
        <HeroV2 />
        <ManifestoScroll />
        <SelectedWorkV2 />
        <FooterV2 />
      </main>
    </>
  );
}
