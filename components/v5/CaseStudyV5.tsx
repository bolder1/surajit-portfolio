import Link from "next/link";
import type { Project } from "@/lib/types";
import { getCaseProjects } from "@/lib/projects";
import { RevealOnScrollV5 } from "./RevealOnScrollV5";

/**
 * CaseStudyV5 — long-form case study template (Alinma-Pay-style IA),
 * styled in the v5 system. Renders only the sections present in the
 * project data, so sparse projects degrade gracefully.
 *
 * IA: hero → overview/at-a-glance → process → research → approach
 * (decisions) → principles (UX laws) → visual direction → UI grid
 * (placeholders) → outcome → up next.
 */

const PLACEHOLDER_GRAD: Record<string, string> = {
  dashboard: "linear-gradient(155deg,#2a2440,#0d0c14)",
  form: "linear-gradient(155deg,#10303a,#0a1418)",
  list: "linear-gradient(155deg,#2a1a14,#120c0a)",
  mobile: "linear-gradient(155deg,#241a30,#0e0b14)",
  flow: "linear-gradient(155deg,#16302a,#0a1612)",
  journey: "linear-gradient(155deg,#302414,#140f0a)",
  chart: "linear-gradient(155deg,#1a2a40,#0a1018)",
  modal: "linear-gradient(155deg,#301a28,#140a10)",
  default: "linear-gradient(155deg,#1d1d22,#0d0d0f)",
};

function ScreenBlock({
  span,
  kind,
  caption,
  note,
  figmaUrl,
}: {
  span?: 1 | 2;
  kind?: string;
  caption: string;
  note?: string;
  figmaUrl?: string;
}) {
  return (
    <figure className={`cs-screen ${span === 2 ? "wide" : ""}`}>
      <div className="cs-screen-canvas" style={{ background: PLACEHOLDER_GRAD[kind ?? "default"] }}>
        <span className="cs-screen-kind">{kind ?? "screen"}</span>
        {figmaUrl && (
          <a className="cs-screen-figma" href={figmaUrl} target="_blank" rel="noopener">
            Open in Figma ↗
          </a>
        )}
      </div>
      <figcaption>
        <span className="cap">{caption}</span>
        {note && <span className="note">{note}</span>}
      </figcaption>
    </figure>
  );
}

export function CaseStudyV5({ project: p }: { project: Project }) {
  const cases = getCaseProjects();
  const idx = cases.findIndex((c) => c.slug === p.slug);
  const next = idx >= 0 ? cases[(idx + 1) % cases.length] : cases[0];

  const screens = p.screens ?? [];

  return (
    <main id="main" className="cs">
      {/* Top bar */}
      <div className="cs-topbar">
        <span className="cs-eyebrow">/ case study</span>
        <Link href="/" className="cs-back">← Back</Link>
      </div>

      {/* Hero */}
      <header className="cs-hero">
        <p className="cs-cat">
          {p.category} · {p.year}
          {p.confidential && <span className="cs-nda">NDA · outcomes on request</span>}
        </p>
        <h1 className="cs-title">{p.title}</h1>
        <p className="cs-sub">{p.subtitle}</p>
        <dl className="cs-meta">
          <div><dt>Role</dt><dd>{p.role}</dd></div>
          {p.team && <div><dt>Team</dt><dd>{p.team}</dd></div>}
          <div><dt>Year</dt><dd>{p.year}</dd></div>
          {p.readingTime && <div><dt>Read</dt><dd>{p.readingTime}</dd></div>}
        </dl>
      </header>

      {/* Cover */}
      <div className="cs-cover" style={{ background: PLACEHOLDER_GRAD[screens[0]?.placeholder ?? "default"] }}>
        <span className="cs-cover-mark">{p.title.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}</span>
      </div>

      {/* Overview */}
      {(p.summary || p.problem) && (
        <section className="cs-section cs-overview">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">01</span>
            <h2>Overview</h2>
          </RevealOnScrollV5>
          <div className="cs-overview-grid">
            <div className="cs-overview-main">
              {p.summary && <p className="cs-lead">{p.summary}</p>}
              {p.problem && (
                <>
                  <h3 className="cs-subhead">The problem</h3>
                  <p className="cs-body">{p.problem}</p>
                </>
              )}
            </div>
            {p.tags?.length > 0 && (
              <aside className="cs-tags">
                <span className="cs-tags-head">Tagged</span>
                {p.tags.map((t) => <span className="cs-tag" key={t}>{t}</span>)}
              </aside>
            )}
          </div>
        </section>
      )}

      {/* Process narrative */}
      {p.publicSections && p.publicSections.length > 0 && (
        <section className="cs-section">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">02</span>
            <h2>Process</h2>
          </RevealOnScrollV5>
          <div className="cs-narrative">
            {p.publicSections.map((s) => (
              <RevealOnScrollV5 as="div" className="cs-narrative-row" key={s.heading}>
                <h3 className="cs-subhead">{s.heading}</h3>
                <p className="cs-body">{s.body}</p>
              </RevealOnScrollV5>
            ))}
          </div>
        </section>
      )}

      {/* Research */}
      {p.research && p.research.length > 0 && (
        <section className="cs-section">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">03</span>
            <h2>Research</h2>
          </RevealOnScrollV5>
          <div className="cs-cards">
            {p.research.map((r) => (
              <div className="cs-card" key={r.method}>
                <span className="cs-card-kicker">{r.method}</span>
                <span className="cs-card-sample">{r.sample}</span>
                <p className="cs-card-body">{r.finding}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Approach — decisions as challenge → solution */}
      {p.designDecisions && p.designDecisions.length > 0 && (
        <section className="cs-section">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">04</span>
            <h2>Key decisions</h2>
          </RevealOnScrollV5>
          <div className="cs-decisions">
            {p.designDecisions.map((d) => (
              <RevealOnScrollV5 as="div" className="cs-decision" key={d.decision}>
                <h3 className="cs-decision-title">{d.decision}</h3>
                <p className="cs-body">{d.rationale}</p>
                {d.tradeoff && (
                  <p className="cs-tradeoff"><span>Trade-off</span> {d.tradeoff}</p>
                )}
              </RevealOnScrollV5>
            ))}
          </div>
        </section>
      )}

      {/* Principles — UX laws */}
      {p.uxLaws && p.uxLaws.length > 0 && (
        <section className="cs-section">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">05</span>
            <h2>Principles applied</h2>
          </RevealOnScrollV5>
          <div className="cs-cards three">
            {p.uxLaws.map((l) => (
              <div className="cs-card" key={l.law}>
                <span className="cs-card-kicker">{l.law}</span>
                <p className="cs-card-principle">{l.principle}</p>
                <p className="cs-card-body">{l.applied}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visual direction */}
      {p.visualDecisions && p.visualDecisions.length > 0 && (
        <section className="cs-section">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">06</span>
            <h2>Visual direction</h2>
          </RevealOnScrollV5>
          <div className="cs-decisions">
            {p.visualDecisions.map((d) => (
              <RevealOnScrollV5 as="div" className="cs-decision" key={d.decision}>
                <h3 className="cs-decision-title">{d.decision}</h3>
                <p className="cs-body">{d.rationale}</p>
                {d.tradeoff && (
                  <p className="cs-tradeoff"><span>Trade-off</span> {d.tradeoff}</p>
                )}
              </RevealOnScrollV5>
            ))}
          </div>
        </section>
      )}

      {/* UI grid — screens (placeholders) */}
      {screens.length > 0 && (
        <section className="cs-section">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">07</span>
            <h2>The work</h2>
          </RevealOnScrollV5>
          <div className="cs-grid">
            {screens.map((s) => (
              <ScreenBlock
                key={s.caption}
                span={s.span}
                kind={s.placeholder}
                caption={s.caption}
                note={s.note}
                figmaUrl={s.figmaUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Outcome */}
      {p.outcomes && p.outcomes.length > 0 && (
        <section className="cs-section cs-outcome">
          <RevealOnScrollV5 as="div" className="cs-section-head">
            <span className="cs-num">08</span>
            <h2>Outcome</h2>
          </RevealOnScrollV5>
          <div className="cs-metrics">
            {p.outcomes.map((m) => (
              <div className="cs-metric" key={m.label}>
                <span className="num">{m.value}</span>
                <span className="lbl">{m.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Up next */}
      <section className="cs-next">
        <span className="cs-eyebrow">Up next</span>
        <Link href={`/cases/${next.slug}`} className="cs-next-link">
          <span className="t">{next.title}</span>
          <span className="a" aria-hidden>→</span>
        </Link>
        <Link href="/" className="cs-next-home">← All work</Link>
      </section>
    </main>
  );
}
