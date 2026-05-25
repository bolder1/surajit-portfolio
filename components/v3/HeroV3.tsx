import Link from "next/link";

/**
 * HeroV3 — single-screen recruiter hero.
 *
 * One headline (Technical variant from the research report), one
 * subhead, two CTAs. Domain chips appear once below the CTAs as a
 * compact signal — not as a separate stats band.
 *
 * Above-the-fold rules per the audit:
 *   - No duplicate "open to roles" strips
 *   - No second "Lead" section
 *   - No stats band before work
 *   - No AI workflow inventory
 */
export function HeroV3() {
  return (
    <section
      id="hero"
      className="border-b border-[color:var(--v3-rule-soft)]"
      aria-labelledby="hero-heading"
    >
      <div className="v3-container py-16 md:py-24 lg:py-32">
        <p className="v3-eyebrow mb-6">/ Product designer · enterprise software</p>

        <h1
          id="hero-heading"
          className="v3-display max-w-[18ch]"
          style={{ fontSize: "clamp(40px, 6.4vw, 88px)", lineHeight: 1.02 }}
        >
          Product Designer building enterprise UX systems for scale.
        </h1>

        <p
          className="v3-prose-lg mt-6"
          style={{ maxWidth: "60ch" }}
        >
          Experience spanning IAM, PAM, IGA, UEM, and design systems. I work
          across discovery, flows, UI systems, and AI-augmented prototyping
          to cut iteration time while preserving product judgment.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/v3/work" className="v3-btn v3-btn-primary">
            View case studies
            <span aria-hidden style={{ marginLeft: 2 }}>→</span>
          </Link>
          <Link href="/v3/resume" className="v3-btn v3-btn-outlined">
            View resume
          </Link>
        </div>

        <p
          className="v3-mono mt-10"
          style={{ color: "var(--v3-ink-muted)" }}
        >
          miniOrange · IAM · PAM · IGA · UEM · Design systems · 3+ yrs
        </p>
      </div>
    </section>
  );
}
