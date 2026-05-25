import type { Metadata } from "next";
import Link from "next/link";
import { MastheadV3 } from "@/components/v3/MastheadV3";
import { FooterV3 } from "@/components/v3/FooterV3";

export const metadata: Metadata = {
  title: "About — Surajit Dutta",
  description:
    "Product designer focused on enterprise software. Three years at miniOrange across IAM, PAM, IGA, UEM, and design systems.",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Make complex feel calm.",
    body: "Right thing on screen, leave everything else off. Enterprise UI fails when it asks the user to hold the system in their head.",
  },
  {
    n: "02",
    title: "Systems, then surfaces.",
    body: "Tokens, components, patterns first. Screens get cheap; the design effort moves to workflow logic and accuracy.",
  },
  {
    n: "03",
    title: "AI as leverage, not as identity.",
    body: "Use AI to spin variants, write edge cases, compress the path from insight to artifact. Reserve human time for the calls that need taste.",
  },
];

/**
 * /v3/about — slimmed. Three blocks only:
 *   1. One-paragraph bio
 *   2. Three principles
 *   3. Path + skills moved to /v3/resume (link below)
 */
export default function V3AboutPage() {
  return (
    <>
      <MastheadV3 />
      <main id="main">
        {/* Bio */}
        <section className="border-b border-[color:var(--v3-rule-soft)]">
          <div className="v3-container py-16 md:py-24 max-w-4xl">
            <p className="v3-eyebrow mb-6">/ About</p>
            <h1
              className="v3-display mb-8"
              style={{ fontSize: "clamp(40px, 5.6vw, 76px)", maxWidth: "16ch" }}
            >
              <span className="v3-serif-italic">Calm</span> systems for
              high-stakes software.
            </h1>
            <p className="v3-prose-lg" style={{ color: "var(--v3-ink-soft)" }}>
              I'm a product designer focused on enterprise software. Three
              years at miniOrange shipping for IT and security teams across
              IAM, PAM, IGA, and UEM. Currently in Pune, working IST and
              async US hours.
            </p>
            <p
              className="v3-prose mt-5"
              style={{ color: "var(--v3-ink-muted)" }}
            >
              I came up through smaller teams where the same designer owns
              discovery, IA, interaction, and engineering handoff. That made
              me comfortable working across the full lifecycle and made AI
              feel like a natural force multiplier — it lets me move faster
              between framing and a shippable artifact without losing
              judgment.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section
          className="border-b border-[color:var(--v3-rule-soft)]"
          aria-label="Principles"
        >
          <div className="v3-container py-16 md:py-20">
            <p className="v3-eyebrow mb-8">/ How I work</p>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {PRINCIPLES.map((p) => (
                <li
                  key={p.n}
                  className="border-t border-[color:var(--v3-ink)] pt-5"
                >
                  <p
                    className="v3-mono"
                    style={{ color: "var(--v3-accent)", marginBottom: 12 }}
                  >
                    / {p.n}
                  </p>
                  <h2
                    className="v3-display"
                    style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}
                  >
                    {p.title}
                  </h2>
                  <p
                    style={{ color: "var(--v3-ink-soft)", fontSize: 15, lineHeight: 1.55 }}
                  >
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pointer to resume + contact */}
        <section>
          <div className="v3-container py-16 md:py-20 flex flex-wrap items-baseline justify-between gap-6">
            <div>
              <p
                className="v3-prose-lg"
                style={{ color: "var(--v3-ink-soft)", maxWidth: "44ch" }}
              >
                Looking for the path, the timeline, the tools, or the role
                history?
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/v3/resume" className="v3-btn v3-btn-primary">
                View resume
              </Link>
              <Link href="/v3/contact" className="v3-btn v3-btn-outlined">
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
