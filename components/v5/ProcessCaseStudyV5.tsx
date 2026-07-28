import Link from "next/link";
import type { ProcessCaseStudy } from "@/lib/processCases";
import { JourneyMapDiagram } from "@/components/v5/diagrams/JourneyMapDiagram";
import { EmpathyMapDiagram } from "@/components/v5/diagrams/EmpathyMapDiagram";
import { UserFlowDiagram } from "@/components/v5/diagrams/UserFlowDiagram";

/**
 * /process/[slug] — one full process case study.
 *
 * Sanitized, no screenshots. Structure is deliberately process-first:
 * problem → constraint → decision (the actual engagement loop) →
 * outcome (the lead → client → revenue funnel), with the differentiator
 * — a working prototype, not a picture of one — called out right under
 * the header, before anything else.
 */
export function ProcessCaseStudyV5({
  study,
  others,
}: {
  study: ProcessCaseStudy;
  others: ProcessCaseStudy[];
}) {
  return (
    <main className="v5-info v5-rt v5-pc">
      <div className="v5-hero-abstract" aria-hidden>
        <span />
      </div>
      <div className="v5-info-scrim" aria-hidden />

      <header className="v5-info-header">
        <h1 className="v5-info-title">{study.name}</h1>
        <Link href="/process" className="v5-info-back">
          ← Real-time
        </Link>
      </header>

      {/* meta strip */}
      <section className="v5-pc-meta">
        <span className="v5-pc-meta-item">{study.no}</span>
        <span className="v5-pc-meta-item accent">{study.tag}</span>
        <span className="v5-pc-meta-item">{study.domain}</span>
        <span className="v5-pc-meta-item">{study.year}</span>
        <span className="v5-pc-meta-item">{study.role}</span>
      </section>

      <section className="v5-pc-hero">
        <p className="v5-info-eyebrow">/ process case study</p>
        <h2 className="v5-pc-oneliner">{study.oneLiner}</h2>
      </section>

      {/* the differentiator — right up front */}
      <section className="v5-pc-differentiator">
        <span className="v5-pc-diff-glyph" aria-hidden />
        <p>
          <b>Why this isn&rsquo;t just a Figma file:</b> {study.differentiator}
        </p>
      </section>

      {/* problem */}
      <section className="v5-pc-block">
        <p className="v5-pc-block-tag">01 / PROBLEM</p>
        <h3 className="v5-pc-block-head">{study.problem.headline}</h3>
        <p className="v5-pc-block-body">{study.problem.body}</p>
      </section>

      {/* constraint */}
      <section className="v5-pc-block">
        <p className="v5-pc-block-tag">02 / CONSTRAINT</p>
        <h3 className="v5-pc-block-head">{study.constraint.headline}</h3>
        <p className="v5-pc-block-body">{study.constraint.body}</p>
        <ul className="v5-pc-points">
          {study.constraint.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      {/* empathy map + journey map — grounding artifacts before the decision */}
      <section className="v5-pc-artifacts">
        <EmpathyMapDiagram map={study.empathyMap} />
        <JourneyMapDiagram persona={study.journeyMap.persona} stages={study.journeyMap.stages} />
      </section>

      {/* decision — the engagement loop itself */}
      <section className="v5-pc-block">
        <p className="v5-pc-block-tag">03 / DECISION</p>
        <h3 className="v5-pc-block-head">{study.decision.headline}</h3>
        <p className="v5-pc-block-body">{study.decision.body}</p>
        <ol className="v5-pc-stages">
          {study.decision.stages.map((s, i) => (
            <li className="v5-pc-stage" key={s.title}>
              <span className="v5-pc-stage-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* the product's own flow, once the decisions are made */}
      <section className="v5-pc-artifacts single">
        <UserFlowDiagram flow={study.userFlow} />
      </section>

      {/* outcome */}
      <section className="v5-pc-block">
        <p className="v5-pc-block-tag">04 / OUTCOME</p>
        <h3 className="v5-pc-block-head">{study.outcome.headline}</h3>
        <p className="v5-pc-block-body">{study.outcome.body}</p>

        <div className="v5-pc-funnel">
          {study.outcome.funnel.map((stage, i) => (
            <div className="v5-pc-funnel-stage" key={stage.label}>
              {i > 0 && <span className="v5-pc-funnel-arrow" aria-hidden>→</span>}
              <div className="v5-pc-funnel-box">
                <span className="v5-pc-funnel-n">{i + 1}</span>
                <p className="v5-pc-funnel-label">{stage.label}</p>
                <p className="v5-pc-funnel-note">{stage.note}</p>
              </div>
            </div>
          ))}
        </div>

        <dl className="v5-pc-metrics">
          {study.outcome.metrics.map((m) => (
            <div className="v5-pc-metric" key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>

        <p className="v5-pc-chips">
          {study.deliverables.map((d, i) => (
            <span key={d}>
              {i > 0 && <span className="v5-rt-chip-sep">→</span>}
              <span className="v5-rt-chip">{d}</span>
            </span>
          ))}
        </p>
      </section>

      {/* other cases */}
      {others.length > 0 && (
        <section className="v5-pc-others">
          <p className="v5-info-eyebrow">/ other process case studies</p>
          <div className="v5-pc-others-grid">
            {others.map((o) => (
              <Link href={`/process/${o.slug}`} className="v5-pc-others-card" key={o.slug}>
                <span className="v5-pc-meta-item accent">{o.tag}</span>
                <h4>{o.name}</h4>
                <p>{o.oneLiner}</p>
                <span className="v5-pc-others-arrow" aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="v5-rt-cta">
        <p className="v5-rt-cta-line">
          Have a product that needs to exist <em>this quarter?</em>
        </p>
        <div className="v5-rt-cta-actions">
          <Link href="/contact" className="v5-btn-primary">
            START ONE&nbsp;↗
          </Link>
          <Link href="/process" className="v5-btn-outline">
            SEE THE FULL PROCESS
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
