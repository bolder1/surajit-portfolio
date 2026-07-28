import Link from "next/link";

/**
 * /process — "Real-time" page.
 *
 * The engagement story told straight: requirements gathered from
 * stakeholders, own research folded into a PRD, a full Figma prototype,
 * then a working build orchestrated with Claude Code in days — demoed
 * live to prospects, handed to developers with generated code, shipped
 * for revenue. Proof section carries the five real engagements.
 */

const STAGES = [
  {
    n: "01",
    glyph: "hollow" as const,
    title: "Requirements, from the room",
    body: "It starts at events and client conversations — a new product has to exist, fast. I sit with the stakeholders, gather what the business actually needs, and take ownership of the brief instead of waiting for one.",
  },
  {
    n: "02",
    glyph: "hollow" as const,
    title: "Research → my own PRD",
    body: "On top of the stakeholder input I run my own research — competitors, compliance surface, user workflows — and write the PRD myself. Scope, personas, flows, edge cases: decided before a pixel exists.",
  },
  {
    n: "03",
    glyph: "filled" as const,
    title: "Prototype, with full Figma files",
    body: "The PRD becomes a clickable prototype backed by real Figma files — tokens, components, states. Not a mood board: the same file set a design team would hand over, produced at a pace teams don't expect.",
  },
  {
    n: "04",
    glyph: "filled" as const,
    title: "The two-day build, with Claude Code",
    body: "This is the conversion moment. What a developer roadmap scopes in weeks — sometimes months — I orchestrate into a working product in about two days with Claude Code. The whole process is showable: prompt to product, on the record.",
  },
  {
    n: "05",
    glyph: "filled" as const,
    title: "Demo that sells",
    body: "Prospects don't watch a deck — they click through the actual product. That demo is what turns interest into buyers; the same showcase runs at events and generates the next clients in the pipeline.",
  },
  {
    n: "06",
    glyph: "hollow" as const,
    title: "Onboard → handoff, with code",
    body: "When a client signs, the fast lane is already built: Figma files and specs land with their developers along with the generated code, so engineering starts from a running product instead of a blank repo.",
  },
  {
    n: "07",
    glyph: "filled" as const,
    title: "Real product, real revenue",
    body: "The build ships, the client's product reaches their market, and the engagement pays for itself — design operating as a revenue function, not a cost center.",
  },
];

const CASES = [
  {
    no: "C-01",
    tag: "SECURITY",
    name: "ITDR",
    slug: "itdr",
    line: "Identity threat detection & response — surfacing risky identities before they become incidents.",
    delivered: ["PRD", "FIGMA", "2-DAY BUILD", "DEMO"],
    outcome: "Event showcase → client conversations opened.",
  },
  {
    no: "C-02",
    tag: "PLATFORM",
    name: "CARE",
    slug: null,
    line: "Service & support platform concept, shaped from stakeholder requirements into a working flow.",
    delivered: ["PRD", "FIGMA", "BUILD"],
    outcome: "Prototype-to-product path proven internally.",
  },
  {
    no: "C-03",
    tag: "COMPLIANCE",
    name: "DPDP Compliance",
    slug: "dpdp-compliance",
    line: "India's DPDP Act, productized — consent, data mapping and audit trails made operable.",
    delivered: ["RESEARCH", "PRD", "FIGMA", "BUILD"],
    outcome: "Compliance story clients could actually click.",
  },
  {
    no: "C-04",
    tag: "AI · FINANCE",
    name: "Function OS",
    slug: "function-os",
    line: "AI-based finance product for internal operations — dashboards, workflows and automations in one OS.",
    delivered: ["PRD", "FIGMA", "CLAUDE CODE"],
    outcome: "Internal tool the team runs day-to-day.",
  },
  {
    no: "C-05",
    tag: "HEALTHCARE",
    name: "Doctor App",
    slug: null,
    line: "Healthcare application for practitioners — appointments, records and patient flows, end to end.",
    delivered: ["FIGMA", "BUILD", "DEMO"],
    outcome: "Full demonstration used in client pitches.",
  },
];

export function ProcessShowcaseV5() {
  return (
    <main className="v5-info v5-rt">
      <div className="v5-hero-abstract" aria-hidden>
        <span />
      </div>
      <div className="v5-info-scrim" aria-hidden />

      <header className="v5-info-header">
        <h1 className="v5-info-title">Real-time</h1>
        <Link href="/" className="v5-info-back">
          ← Back
        </Link>
      </header>

      {/* intro */}
      <section className="v5-rt-intro">
        <p className="v5-info-eyebrow">/ how I actually work</p>
        <h2 className="v5-rt-head">
          One designer. Seven stages.
          <br />
          <em>Days, not quarters.</em>
        </h2>
        <p className="v5-rt-lead">
          This is the engagement loop I run for real clients — from a
          requirement spoken in a room to a working product in their hands.
          The unusual part is the middle: with Claude Code in the chain, the
          prototype doesn&rsquo;t stop at Figma. It becomes a running build
          in about two days, and that build is what sells.
        </p>
      </section>

      {/* compression figure — line-work, one vermilion fill */}
      <section className="v5-rt-compress" aria-label="Timeline compression">
        <div className="v5-rt-compress-row">
          <span className="v5-rt-compress-label">TYPICAL DEV ROADMAP</span>
          <span className="v5-rt-bar v5-rt-bar-long">
            <i />
          </span>
          <span className="v5-rt-compress-val">WEEKS — MONTHS</span>
        </div>
        <div className="v5-rt-compress-row">
          <span className="v5-rt-compress-label">THIS PROCESS</span>
          <span className="v5-rt-bar v5-rt-bar-short">
            <i />
          </span>
          <span className="v5-rt-compress-val accent">≈ 2 DAYS</span>
        </div>
      </section>

      {/* timeline */}
      <section className="v5-rt-stages" aria-label="The seven stages">
        {STAGES.map((s) => (
          <article className="v5-rt-stage" key={s.n}>
            <div className="v5-rt-stage-rail">
              <span className="v5-rt-stage-n">{s.n}</span>
              <span
                className={`v5-rt-glyph ${s.glyph === "filled" ? "is-filled" : ""}`}
                aria-hidden
              />
            </div>
            <div className="v5-rt-stage-body">
              <h3 className="v5-rt-stage-title">{s.title}</h3>
              <p className="v5-rt-stage-text">{s.body}</p>
            </div>
          </article>
        ))}
      </section>

      {/* proof */}
      <section className="v5-rt-proof" aria-label="Real engagements">
        <p className="v5-info-eyebrow">/ proof, not promises</p>
        <h2 className="v5-rt-proof-head">
          Five products that went <em>through this loop.</em>
        </h2>

        <div className="v5-rt-cases">
          {CASES.map((c) => {
            const body = (
              <>
                <div className="v5-rt-case-meta">
                  <span className="v5-rt-case-no">{c.no}</span>
                  <span className="v5-rt-case-tag">{c.tag}</span>
                </div>
                <h3 className="v5-rt-case-name">{c.name}</h3>
                <p className="v5-rt-case-line">{c.line}</p>
                <p className="v5-rt-case-chips">
                  {c.delivered.map((d, i) => (
                    <span key={d}>
                      {i > 0 && <span className="v5-rt-chip-sep">→</span>}
                      <span className="v5-rt-chip">{d}</span>
                    </span>
                  ))}
                </p>
                <p className="v5-rt-case-outcome">{c.outcome}</p>
                {c.slug && (
                  <span className="v5-rt-case-full">
                    FULL CASE STUDY <span aria-hidden>↗</span>
                  </span>
                )}
              </>
            );
            return c.slug ? (
              <Link href={`/process/${c.slug}`} className="v5-rt-case is-linked" key={c.no}>
                {body}
              </Link>
            ) : (
              <article className="v5-rt-case" key={c.no}>
                {body}
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="v5-rt-cta">
        <p className="v5-rt-cta-line">
          Have a product that needs to exist <em>this quarter?</em>
        </p>
        <div className="v5-rt-cta-actions">
          <Link href="/contact" className="v5-btn-primary">
            START ONE&nbsp;↗
          </Link>
          <Link href="/work" className="v5-btn-outline">
            SEE THE WORK
          </Link>
        </div>
      </section>

      <footer className="v5-info-footer">
        <span>SURAJIT DUTTA</span>
        <span>REAL-TIME BUILDS</span>
      </footer>
    </main>
  );
}
