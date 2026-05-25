import Link from "next/link";

/**
 * ShortAbout — one paragraph + "More about me" link.
 *
 * Replaces the V1 home's About/Approach/Off-the-clock blocks. Full
 * biography lives at /v3/about; full path + skills at /v3/resume.
 */
export function ShortAbout() {
  return (
    <section
      id="about-short"
      className="border-b border-[color:var(--v3-rule-soft)]"
      aria-labelledby="about-short-heading"
    >
      <div className="v3-container py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-span-4">
            <p className="v3-eyebrow mb-5">/ 02 — About</p>
            <h2
              id="about-short-heading"
              className="v3-display"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
            >
              <span className="v3-serif-italic">Short</span> version.
            </h2>
          </div>
          <div className="md:col-span-8">
            <p
              className="v3-prose-lg"
              style={{ color: "var(--v3-ink-soft)" }}
            >
              I'm a product designer focused on enterprise software — admin
              consoles, identity and security workflows, design systems, and
              AI-augmented prototyping. Three years at miniOrange shipping
              for IT and security teams across IAM, PAM, IGA, and UEM.
              Currently based in Pune, working IST and async US hours.
            </p>
            <p
              className="v3-prose mt-4"
              style={{ color: "var(--v3-ink-muted)" }}
            >
              Calm systems thinking, fast iteration, and judgment about when
              not to ship. I treat AI as a force multiplier behind outcomes,
              not as a feature on its own.
            </p>
            <p className="mt-6">
              <Link
                href="/v3/about"
                className="v3-btn v3-btn-ghost underline-offset-4 hover:underline"
                style={{ paddingLeft: 0, color: "var(--v3-ink)", borderColor: "transparent" }}
              >
                More about me  →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
