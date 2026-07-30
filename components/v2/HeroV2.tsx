"use client";

import { VelocityField } from "./VelocityField";

/**
 * §01 HeroV2 — the claim, stated once, with the receipt underneath.
 *
 * The shader carries the atmosphere; the type carries the argument. The
 * headline's two lines animate on Archivo's width axis (62 → 106) rather than
 * sliding in, so the words physically expand into place.
 */

const STRIP = [
  "Requirements",
  "PRD",
  "Working prototype",
  "E2E test",
  "Figma push",
  "Dev handoff",
  "A/B variants",
];

const FIGURES = [
  { n: "5 days", l: "brief to a clickable, tested build" },
  { n: "1,296", l: "button variants, 22 mapped variables" },
  { n: "12+", l: "enterprise products shipped" },
];

export function HeroV2() {
  return (
    <section id="v2-intro" className="v2-hero" aria-labelledby="v2-hero-h">
      <VelocityField className="v2-hero-canvas" />

      <div className="v2-hero-inner v2-wrap">
        <div className="v2-hero-top">
          <p className="v2-hero-claim">
            Product designer for enterprise IT, identity and security teams.
            I work <b>AI-native</b>, which in practice means the prototype is
            real, tested and handed off before most teams finish scoping.
          </p>
          <p className="v2-status">
            <i aria-hidden />
            Open for Q3 sprints
          </p>
        </div>

        <h1 id="v2-hero-h" className="v2-hero-h1">
          <span>Brief on Monday.</span>
          <span>
            Product by <em>Friday.</em>
          </span>
        </h1>

        <div className="v2-strip">
          <ol className="v2-strip-row">
            {STRIP.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="v2-hero-foot">
          <div className="v2-hero-actions">
            <a href="#v2-process" className="v2-btn">
              See the process
              <span className="v2-btn-arrow" aria-hidden>
                →
              </span>
            </a>
            <a href="#v2-engage" className="v2-btn-ghost">
              Book a sprint
            </a>
            <a href="#v2-proof" className="v2-link">
              Read the receipts
            </a>
          </div>

          <div className="v2-hero-figures">
            {FIGURES.map((f) => (
              <div className="v2-fig" key={f.n}>
                <span className="n">{f.n}</span>
                <span className="l">{f.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
