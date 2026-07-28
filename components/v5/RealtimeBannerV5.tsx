import Link from "next/link";

/**
 * §B RealtimeBannerV5 — animated band between Process and Case list.
 *
 * The pitch: what a dev team scopes in quarters ships here as a working
 * build in days. A continuously scrolling pipeline ticker (the ambient
 * loop) carries the seven stages; the whole band is one link → /process.
 */

const PIPELINE = [
  "Stakeholder requirements",
  "Research → PRD",
  "Figma prototype",
  "Claude Code build",
  "Client demo",
  "Handoff + code",
  "Revenue",
];

const CASES: { label: string; slug: string | null }[] = [
  { label: "ITDR", slug: "itdr" },
  { label: "CARE", slug: null },
  { label: "DPDP COMPLIANCE", slug: "dpdp-compliance" },
  { label: "FUNCTION OS", slug: "function-os" },
  { label: "HEALTHCARE", slug: null },
];

export function RealtimeBannerV5() {
  return (
    <section className="v5-rtb" aria-labelledby="v5-rtb-title">
      <Link href="/process" className="v5-rtb-link">
        <div className="v5-rtb-top">
          <span className="v5-rtb-eyebrow">/ real-time builds</span>
          <span className="v5-rtb-cta">
            See the full process <span aria-hidden>↗</span>
          </span>
        </div>

        <h2 id="v5-rtb-title" className="v5-rtb-title">
          Boardroom to <em>working build</em> — in days, not quarters.
        </h2>

        {/* Pipeline ticker — two identical runs for a seamless loop */}
        <div className="v5-rtb-marquee" aria-hidden>
          <div className="v5-rtb-track">
            {[0, 1].map((dup) => (
              <span className="v5-rtb-run" key={dup}>
                {PIPELINE.map((stage) => (
                  <span className="v5-rtb-stage" key={stage}>
                    <span className="v5-rtb-diamond" />
                    {stage}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Case names — the 3 with a full process case study are direct links */}
      <p className="v5-rtb-cases">
        {CASES.map((c, i) => (
          <span key={c.label} className="v5-rtb-caseWrap">
            {i > 0 && <span className="v5-rtb-sep">·</span>}
            {c.slug ? (
              <Link href={`/process/${c.slug}`} className="v5-rtb-case is-linked">
                {c.label}
              </Link>
            ) : (
              <span className="v5-rtb-case">{c.label}</span>
            )}
          </span>
        ))}
      </p>
    </section>
  );
}
