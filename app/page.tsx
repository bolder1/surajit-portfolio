import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
import { EditionSwitcher } from "@/components/edition-two/EditionSwitcher";
import {
  HomeHero,
  HomeWhatIDo,
  HomeSelectedWork,
  HomeExperience,
  HomeHowIWork,
  HomeAIToolkit,
  HomeEducation,
  HomeBeyondWork,
  HomeContact,
} from "@/components/HomeSections";

/**
 * Job-hunting-first home page, fact-checked against the CV.
 * Single-scroll narrative, recruiter-readable, no chooser modal,
 * no /visualize detour. Resume-style hierarchy with the editorial
 * Folio brand kept on top. EditionSwitcher pill links over to the
 * dark Edition Two for a side-by-side compare.
 */
export default function HomePage() {
  return (
    <>
      <EditionSwitcher />
      <Masthead variant="large" />
      <main id="main">
        <HomeHero />
        <HomeWhatIDo />
        <HomeSelectedWork />
        <HomeExperience />
        <HomeHowIWork />
        <HomeAIToolkit />
        <HomeEducation />
        <HomeBeyondWork />
        <HomeContact />
      </main>
      <Folio pageNum="01" />
    </>
  );
}
