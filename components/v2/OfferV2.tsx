"use client";

import { RevealV2 } from "./RevealV2";

/**
 * §07 OfferV2 — the process, packaged. Three ways to buy it.
 *
 * Laid out as a spec sheet rather than three pricing towers: the recommended
 * engagement is marked with the accent and a plain line of text, not extra
 * height. Every column's deliverable list starts at the same Y and every CTA
 * sits on the same baseline, so the three read as one table.
 *
 * No prices. They are scoped per engagement and inventing a number here would
 * be the least honest thing on the page.
 */

type Engagement = {
  n: string;
  name: string;
  duration: string;
  gets: string[];
  replaces: string;
  featured?: boolean;
};

/* Each card used to carry a lead sentence, a "who it is for" definition
   list, and five deliverables. Three columns of that is a page of reading
   at the exact moment someone is deciding whether to email you. What is
   left is the shape of the deal: how long, what lands, what it replaces. */
const ENGAGEMENTS: Engagement[] = [
  {
    n: "01",
    name: "Prototype sprint",
    duration: "5 days",
    gets: [
      "Requirements session",
      "My own PRD",
      "A working multi-frame build",
      "End-to-end test pass",
      "The fix list, and the fixes",
    ],
    replaces: "A three-week discovery phase that ends in a deck.",
    featured: true,
  },
  {
    n: "02",
    name: "Design system build",
    duration: "3 weeks",
    gets: [
      "Token architecture, modes and all",
      "Multi-mapped variable components",
      "The full variant matrix, published",
      "Documentation your team reads",
      "Hand-off engineering can use as-is",
    ],
    replaces: "A year of we-will-clean-it-up-later.",
  },
  {
    n: "03",
    name: "AI workflow install",
    duration: "2 weeks",
    gets: [
      "The chain, research to Figma push",
      "Tooling set up on your stack",
      "Two live runs on your product",
      "The audit and A/B loop, wired",
      "A playbook you own after I leave",
    ],
    replaces: "Hiring for output when the gap was judgement.",
  },
];

const START = [
  { k: "One call", d: "Thirty minutes." },
  { k: "A written scope", d: "One page, dated." },
  { k: "Day one", d: "No onboarding month." },
];

export function OfferV2() {
  return (
    <section id="v2-engage" className="v2-offer" aria-labelledby="v2-offer-h">
      <div className="v2-wrap">
        <div className="v2-offer-head">
          <div>
            <p className="v2-eyebrow">
              <b>08</b> Work with the process
            </p>
            <h2 id="v2-offer-h" className="v2-offer-title">
              Three ways to <em>buy the speed.</em>
            </h2>
          </div>
          <p className="v2-prose">
            Sprints, not retainers. Rates quoted per scope.
          </p>
        </div>

        <div className="v2-offer-grid">
          {ENGAGEMENTS.map((e, i) => (
            <RevealV2
              as="article"
              key={e.n}
              delay={i * 90}
              className={`v2-eng ${e.featured ? "is-featured" : ""}`}
            >
              <div className="v2-eng-top">
                <span className="v2-eng-n">{e.n}</span>
                {e.featured && <span className="v2-eng-flag">most asked for</span>}
              </div>

              <h3 className="v2-eng-name">{e.name}</h3>
              <p className="v2-eng-dur">{e.duration}</p>

              <p className="v2-eng-gets-lbl">What you get</p>
              <ul className="v2-eng-gets">
                {e.gets.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>

              <p className="v2-eng-replaces">
                <span>Replaces</span>
                {e.replaces}
              </p>

              <a
                className={e.featured ? "v2-btn v2-eng-cta" : "v2-btn-ghost v2-eng-cta"}
                href={`mailto:surajit3255@gmail.com?subject=${encodeURIComponent(
                  `${e.name} (${e.duration})`
                )}&body=${encodeURIComponent(
                  `Hi Surajit,\n\nWe'd like to talk about a ${e.name.toLowerCase()}.\n\nWhat we're trying to ship:\n\nWhen we need it by:\n`
                )}`}
              >
                Start this
                <span className="v2-btn-arrow" aria-hidden>
                  →
                </span>
              </a>
            </RevealV2>
          ))}
        </div>

        <ol className="v2-offer-start">
          {START.map((s, i) => (
            <li key={s.k}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <span className="k">{s.k}</span>
              <span className="d">{s.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
