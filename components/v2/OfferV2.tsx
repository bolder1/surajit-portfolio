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
  lead: string;
  who: string;
  gets: string[];
  replaces: string;
  featured?: boolean;
};

const ENGAGEMENTS: Engagement[] = [
  {
    n: "01",
    name: "Prototype sprint",
    duration: "5 days",
    lead: "A scope walks in on Monday. A working, tested product walks out on Friday.",
    who: "Teams with a decision to make and no calendar to make it in.",
    gets: [
      "Requirements session with your stakeholders",
      "My own PRD, written before anything is drawn",
      "A real multi-frame prototype, not a comp",
      "End-to-end test pass with the broken paths logged",
      "The fix list, and the fixes",
    ],
    replaces: "A three-week discovery phase that ends in a deck.",
    featured: true,
  },
  {
    n: "02",
    name: "Design system build",
    duration: "3 weeks",
    lead: "Tokens, mapped variable components, and a matrix that generates instead of being drawn.",
    who: "Product teams whose UI has quietly drifted into forty button styles.",
    gets: [
      "Token architecture with modes and semantic layers",
      "Multi-mapped variable components, axis by axis",
      "The full variant matrix, published",
      "A documentation surface your team can actually read",
      "Handoff files engineering does not have to re-derive",
    ],
    replaces: "A year of we-will-clean-it-up-later.",
  },
  {
    n: "03",
    name: "AI workflow install",
    duration: "2 weeks",
    lead: "The chain itself, set up inside your team, run twice on your own product while I watch.",
    who: "Design teams who want this speed in-house rather than rented.",
    gets: [
      "The full chain, research through Figma push",
      "Skill and tooling setup on your stack",
      "Two live runs on your real product",
      "The audit and A/B loop, wired up",
      "A playbook your team owns after I leave",
    ],
    replaces: "Hiring for output when the gap was judgement.",
  },
];

const START = [
  { k: "One call", d: "Thirty minutes. You describe the problem, I tell you if I am the wrong person for it." },
  { k: "A written scope", d: "One page: what ships, what does not, which day each thing lands." },
  { k: "Day one", d: "No onboarding month. The first working artefact exists inside the first week." },
];

export function OfferV2() {
  return (
    <section id="v2-engage" className="v2-offer" aria-labelledby="v2-offer-h">
      <div className="v2-wrap">
        <div className="v2-offer-head">
          <div>
            <p className="v2-eyebrow">
              <b>07</b> Work with the process
            </p>
            <h2 id="v2-offer-h" className="v2-offer-title">
              Three ways to <em>buy the speed.</em>
            </h2>
          </div>
          <p className="v2-prose">
            Scoped as sprints, not retainers, because the whole argument is that
            the calendar is negotiable. Rates are quoted per engagement once the
            scope is on one page.
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
              <p className="v2-eng-lead">{e.lead}</p>

              <dl className="v2-eng-meta">
                <dt>Who it is for</dt>
                <dd>{e.who}</dd>
              </dl>

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
