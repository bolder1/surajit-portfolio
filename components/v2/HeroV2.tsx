"use client";

import { VelocityField } from "./VelocityField";

/**
 * §01 HeroV2 — the claim, stated once.
 *
 * The shader carries the atmosphere; the type carries the argument. The
 * headline's two lines animate on Archivo's width axis (62 → 106) rather than
 * sliding in, so the words physically expand into place.
 *
 * There used to be a three-line paragraph ABOVE the headline and three stat
 * blocks below it. Both are gone. The paragraph forced a read before the
 * reader had been given a reason to care, and the stats are the opening of
 * §02, which is the next thing they scroll to — stating them twice made the
 * hero feel like a summary of a page that had not started yet.
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

export function HeroV2() {
  return (
    <section id="v2-intro" className="v2-hero" aria-labelledby="v2-hero-h">
      <VelocityField className="v2-hero-canvas" />

      <div className="v2-hero-inner v2-wrap">
        <div className="v2-hero-top">
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

        {/* One line, under the headline where a standfirst belongs. */}
        <p className="v2-hero-claim">
          AI-native product designer for enterprise identity, security and
          compliance teams.
        </p>

        <div className="v2-strip">
          <ol className="v2-strip-row">
            {STRIP.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="v2-hero-foot">
          <div className="v2-hero-actions">
            <a href="#v2-numbers" className="v2-btn">
              See the numbers
              <span className="v2-btn-arrow" aria-hidden>
                →
              </span>
            </a>
            <a href="#v2-engage" className="v2-btn-ghost">
              Book a sprint
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
