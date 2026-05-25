import { MastheadV2 } from "@/components/v2/MastheadV2";
import { HeroV2 } from "@/components/v2/HeroV2";

/**
 * /v2 — the new direction.
 *
 * Builds independently of the brutalist /. Olive paper, italic-serif
 * skill satellites radiating from the centered name, mouse-responsive
 * connectors, hover-glitch on the name.
 *
 * Only the Hero ships in this turn. Sections 2 (Manifesto scroll) and
 * 3 (Selected Work) follow next.
 */
export default function V2Page() {
  return (
    <>
      <MastheadV2 />
      <main id="main">
        <HeroV2 />

        {/* Placeholder for next sections — kept so the page has shape
            and the scroll affordance feels honest. Will replace with
            the scroll-narrative manifesto next turn. */}
        <section className="h-screen flex items-center justify-center border-t border-[color:var(--v2-rule-soft)]">
          <p className="v2-mono opacity-50">
            002 / manifesto — coming next
          </p>
        </section>
      </main>
    </>
  );
}
