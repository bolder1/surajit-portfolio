import { MastheadHeroV5 } from "@/components/v5/MastheadHeroV5";
import { KineticV5 } from "@/components/v5/KineticV5";
import { AboutPortraitV5 } from "@/components/v5/AboutPortraitV5";
import { CapabilitiesBentoV5 } from "@/components/v5/CapabilitiesBentoV5";
import { ProcessV5 } from "@/components/v5/ProcessV5";
import { RealtimeBannerV5 } from "@/components/v5/RealtimeBannerV5";
import { FeaturedSystemV5 } from "@/components/v5/FeaturedSystemV5";
import { DeskShowcaseV5 } from "@/components/v5/DeskShowcaseV5";
import { CaseListV5 } from "@/components/v5/CaseListV5";
import { GalleryV5 } from "@/components/v5/GalleryV5";
import { AIWorkflowV5 } from "@/components/v5/AIWorkflowV5";
import { KineticOutroV5 } from "@/components/v5/KineticOutroV5";
import { FooterV5 } from "@/components/v5/FooterV5";

/**
 * Home — Surajit Dutta.
 *
 * Hero → Kinetic → About → Capabilities bento → Process →
 * Real-time builds (→ /process) → Featured case (→ /system) → Case list →
 * Gallery (3D ring → /gallery) → AI orchestration → More about me →
 * Contact → Footer.
 */
export default function HomePage() {
  return (
    <main id="main">
      <MastheadHeroV5 />
      <KineticV5 />
      <AboutPortraitV5 />
      <CapabilitiesBentoV5 />
      <ProcessV5 />
      <RealtimeBannerV5 />
      <FeaturedSystemV5 />
      <DeskShowcaseV5 />
      <CaseListV5 />
      <GalleryV5 />
      <AIWorkflowV5 />
      <KineticOutroV5 />
      <FooterV5 />
    </main>
  );
}
