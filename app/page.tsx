import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";
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
        <HomeEducation />
        <HomeBeyondWork />
        <HomeContact />
      </main>
      <Folio pageNum="01" />
    </>
  );
}
