import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
import {
  HomeHero,
  HomeWhatIDo,
  HomeSelectedWork,
  HomeExperience,
  HomeHowIWork,
  HomeAIToolkit,
  HomeContact,
} from "@/components/HomeSections";

/**
 * Home — Brutalist + Electric.
 *
 * Concise IA per the new spec:
 *   Hero · What I do · Cases (3) · Work preview · Gallery preview ·
 *   AI preview · Contact.
 *
 * Education + Beyond Work moved to /about; full AI workflow moved
 * to /ai; full work archive to /work; gallery to /gallery.
 */
export default function HomePage() {
  return (
    <>
      <Masthead variant="large" />
      <main id="main">
        <HomeHero />
        <HomeWhatIDo />
        <HomeSelectedWork />
        <HomeExperience />
        <HomeHowIWork />
        <HomeAIToolkit />
        <HomeContact />
      </main>
      <Folio pageNum="01" />
    </>
  );
}
