import Link from "next/link";
import { RevealOnScrollV5 } from "./RevealOnScrollV5";
import { SiriOrbCycle } from "./SiriOrb";
import { ScrambleText, ScrambleCycle } from "./ScrambleText";

/**
 * §07 AIWorkflowV5 — "I orchestrate. Models execute." as a bento.
 *
 * Lead headline card + a stat card + three tool cards (the daily/weekly
 * stack) + a maroon CTA card. Mirrors the About bento's card language,
 * recolored to the v5 brand palette.
 */

/** What the loop actually does, in the order it does it. */
const ORCHESTRATION = [
  "Reading the existing system",
  "Naming the constraint",
  "Drafting three directions",
  "Killing two of them",
  "Wiring the tokens",
  "Shipping to a real URL",
];

const TOOLS = [
  { cadence: "DAILY", title: "Claude Code", body: "Engineering pair. Built this portfolio end-to-end — refactors, audits, CI workflows." },
  { cadence: "DAILY", title: "Figma Make AI", body: "Production prototypes — the 5-day AD console. Multi-frame flows ready for handoff." },
  { cadence: "WEEKLY", title: "Cowork + Skills", body: "Skill orchestration — brand-voice, impeccable, design-taste run as workflows." },
];

export function AIWorkflowV5() {
  return (
    <section className="v5-aibento" aria-labelledby="v5-aibento-heading">
      <div className="v5-aibento-wrap">
        <div className="v5-aibento-head">
          <span className="eyebrow">( AI orchestration )</span>
          <span className="arrow" aria-hidden>→</span>
        </div>

        <div className="v5-aibento-grid">
          {/* Lead */}
          <RevealOnScrollV5 as="div" className="v5-aibento-card area-lead" delay={0}>
            <h2 id="v5-aibento-heading" className="v5-aibento-lead-title">
              <ScrambleText text="I orchestrate." />{" "}
              <em>
                <ScrambleText text="Models execute." />
              </em>
            </h2>
            <p className="v5-aibento-lead-sub">
              Claude + Figma Make AI + Cursor — chained into a repeatable
              workflow. Five-day prototypes that used to take three weeks.
            </p>

            {/* The orb walks listening → thinking → streaming → done, and the
                line under it names the step. It is a portrait of the loop, not
                a live readout — there is no model attached to this page, and
                dressing it up as one would be a lie told in pixels. */}
            <div className="v5-aibento-orb">
              <SiriOrbCycle size="86px" />
              <p className="v5-aibento-orb-line">
                <ScrambleCycle phrases={ORCHESTRATION} interval={2400} />
              </p>
            </div>
          </RevealOnScrollV5>

          {/* Stats */}
          <RevealOnScrollV5 as="div" className="v5-aibento-card area-stat" delay={80}>
            <div className="v5-aibento-stat">
              <span className="num">~70%</span>
              <span className="lbl">Cycle time compressed, research → prototype</span>
            </div>
            <div className="v5-aibento-stat">
              <span className="num">5 days</span>
              <span className="lbl">What used to take three weeks</span>
            </div>
          </RevealOnScrollV5>

          {/* Tools */}
          {TOOLS.map((t, i) => (
            <RevealOnScrollV5
              as="div"
              key={t.title}
              className={`v5-aibento-card area-tool${i + 1}`}
              delay={140 + i * 80}
            >
              <span className="v5-aibento-cadence">{t.cadence}</span>
              <span className="v5-aibento-tool-title">{t.title}</span>
              <span className="v5-aibento-tool-body">{t.body}</span>
            </RevealOnScrollV5>
          ))}

          {/* CTA */}
          <RevealOnScrollV5 as="div" className="v5-aibento-card area-cta" delay={380}>
            <Link href="/ai" className="v5-aibento-cta-link">
              <span className="t">Full AI orchestration</span>
              <span className="a" aria-hidden>→</span>
            </Link>
          </RevealOnScrollV5>
        </div>
      </div>
    </section>
  );
}
