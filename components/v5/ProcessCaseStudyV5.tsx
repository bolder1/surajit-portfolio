import Link from "next/link";
import type { ProcessCaseStudy } from "@/lib/processCases";
import { JourneyMapDiagram } from "@/components/v5/diagrams/JourneyMapDiagram";
import { EmpathyMapDiagram } from "@/components/v5/diagrams/EmpathyMapDiagram";
import { UserFlowDiagram } from "@/components/v5/diagrams/UserFlowDiagram";
import { FunnelDiagram } from "@/components/v5/diagrams/FunnelDiagram";
import { CompressionFigure } from "@/components/v5/diagrams/CompressionFigure";
import { WorkingSystemPlate } from "@/components/v5/diagrams/WorkingSystemPlate";
import { ConvergenceDiagram } from "@/components/v5/diagrams/ConvergenceDiagram";
import { AuditChainDiagram } from "@/components/v5/diagrams/AuditChainDiagram";
import { RoutingGateDiagram } from "@/components/v5/diagrams/RoutingGateDiagram";
import { LegacyVaultDiagram } from "@/components/v5/diagrams/LegacyVaultDiagram";
import { PersonaLedgerDiagram } from "@/components/v5/diagrams/PersonaLedgerDiagram";
import { ScaleModelFigure } from "@/components/v5/diagrams/ScaleModelFigure";

/**
 * /process/[slug] — one process case study, told as a magazine spread.
 *
 * The arc, not four identical blocks:
 *   masthead -> cold open -> the figure (proof of technical grasp) ->
 *   the old world (problem + empathy) -> pull quote -> the wall
 *   (constraints) -> the session (journey) -> the loop (how it was made,
 *   with the compression stat) -> what shipped (flow) -> what it earned
 *   (funnel) -> next cases.
 *
 * Layout alternates deliberately — full-bleed figures, a 7/5 asymmetric
 * split, a three-up numeral grid, a sticky-rail section — so the page has
 * rhythm and never leaves half the screen empty.
 */

/** Each case opens on its own bespoke technical figure — never a template. */
const HERO_FIGURE: Record<string, () => React.JSX.Element> = {
  itdr: ConvergenceDiagram,
  "dpdp-compliance": AuditChainDiagram,
  "function-os": RoutingGateDiagram,
  "design-system": LegacyVaultDiagram,
};

export function ProcessCaseStudyV5({
  study,
  others,
}: {
  study: ProcessCaseStudy;
  others: ProcessCaseStudy[];
}) {
  const Figure = HERO_FIGURE[study.slug];

  // Folios run in reading order, so a case carrying the optional system
  // sections renumbers the spine instead of interleaving 02a / 02b.
  const spine = [
    "THE OLD WORLD",
    ...(study.personas ? ["THE ROSTER"] : []),
    "THE WALL",
    ...(study.vault ? ["THE VAULT"] : []),
    "THE LOOP",
    ...(study.scaleModel ? ["HOW IT SCALES"] : []),
    "WHAT IT EARNED",
  ];
  const folio = (label: string) =>
    `${String(spine.indexOf(label) + 1).padStart(2, "0")} — ${label}`;

  return (
    <main className="v5-cs">
      <div className="v5-hero-abstract" aria-hidden>
        <span />
      </div>

      {/* ── masthead ─────────────────────────────────────────── */}
      <header className="v5-cs-masthead">
        <div className="v5-cs-mast-top">
          <span className="v5-cs-kicker">
            <span className="v5-cs-diamond" aria-hidden />
            PROCESS CASE STUDY · {study.no}
          </span>
          <Link href="/process" className="v5-cs-back">
            ← ALL CASES
          </Link>
        </div>

        <h1 className="v5-cs-title">{study.name}</h1>
        <p className="v5-cs-standfirst">{study.oneLiner}</p>

        <dl className="v5-cs-dateline">
          {[
            ["DOMAIN", study.domain],
            ["YEAR", study.year],
            ["ROLE", study.role],
            ["FIELD", study.tag],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ── cold open ────────────────────────────────────────── */}
      <section className="v5-cs-hook">
        <p className="v5-cs-hook-text">{study.hook}</p>
      </section>

      {/* ── the figure: technical grasp, up front ────────────── */}
      {Figure && (
        <section className="v5-cs-bleed">
          <Figure />
        </section>
      )}

      {/* ── the old world: problem + who lived in it ─────────── */}
      <section className="v5-cs-split">
        <div className="v5-cs-split-main">
          <p className="v5-cs-folio">{folio("THE OLD WORLD")}</p>
          <h2 className="v5-cs-h2">{study.problem.headline}</h2>
          <p className="v5-cs-lede">{study.problem.body}</p>
        </div>
        <aside className="v5-cs-split-side">
          <EmpathyMapDiagram map={study.empathyMap} />
        </aside>
      </section>

      {/* ── the roster: several audiences, in tension ────────── */}
      {study.personas && (
        <section className="v5-cs-roster">
          <div className="v5-cs-roster-head">
            <p className="v5-cs-folio">{folio("THE ROSTER")}</p>
            <h2 className="v5-cs-h2">{study.personas.headline}</h2>
            <p className="v5-cs-lede">{study.personas.body}</p>
          </div>
          <PersonaLedgerDiagram people={study.personas.people} />
        </section>
      )}

      {/* ── pull quote: the thesis ───────────────────────────── */}
      <section className="v5-cs-quote">
        <blockquote>
          <span className="v5-cs-quote-mark" aria-hidden>
            &ldquo;
          </span>
          {study.pullQuote}
        </blockquote>
        <p className="v5-cs-quote-attr">
          <span className="v5-cs-diamond" aria-hidden /> WHY THIS IS NOT JUST A
          FIGMA FILE
        </p>
      </section>

      {/* The plate argues comp-vs-working-prototype, which is the product
          cases' differentiator. A system case argues something else and
          swaps it for the vault below. */}
      {!study.vault && (
        <section className="v5-cs-bleed">
          <WorkingSystemPlate />
        </section>
      )}

      {/* ── the wall: what made it hard ──────────────────────── */}
      <section className="v5-cs-wall">
        <div className="v5-cs-wall-head">
          <p className="v5-cs-folio">{folio("THE WALL")}</p>
          <h2 className="v5-cs-h2">{study.constraint.headline}</h2>
          <p className="v5-cs-lede">{study.constraint.body}</p>
        </div>
        <ol className="v5-cs-wall-grid">
          {study.constraint.points.map((point, i) => (
            <li key={point}>
              <span className="v5-cs-wall-n">{String(i + 1).padStart(2, "0")}</span>
              <p>{point}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── the vault: what is held fixed so the rest can move ─ */}
      {study.vault && (
        <section className="v5-cs-vault">
          <div className="v5-cs-vault-head">
            <p className="v5-cs-folio">{folio("THE VAULT")}</p>
            <h2 className="v5-cs-h2">{study.vault.headline}</h2>
            <p className="v5-cs-lede">{study.vault.body}</p>
          </div>

          <ol className="v5-cs-vault-list">
            {study.vault.layers.map((l, i) => (
              <li key={l.name}>
                <span className="v5-cs-vault-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{l.name}</h3>
                <dl>
                  <div>
                    <dt>HOLDS FIXED</dt>
                    <dd>{l.preserves}</dd>
                  </div>
                  <div>
                    <dt>FREES UP</dt>
                    <dd>{l.frees}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>

          <p className="v5-cs-vault-cost">
            <span className="v5-cs-vault-cost-k">WHAT PRESERVATION COSTS</span>
            {study.vault.cost}
          </p>
        </section>
      )}

      {/* ── the session ──────────────────────────────────────── */}
      <section className="v5-cs-bleed">
        <JourneyMapDiagram
          persona={study.journeyMap.persona}
          stages={study.journeyMap.stages}
        />
      </section>

      {/* ── the loop: how it actually got made ───────────────── */}
      <section className="v5-cs-loop">
        <div className="v5-cs-loop-rail">
          <p className="v5-cs-folio">{folio("THE LOOP")}</p>
          <h2 className="v5-cs-h2">{study.decision.headline}</h2>
          <p className="v5-cs-lede">{study.decision.body}</p>

          <p className="v5-cs-rail-note">
            {study.compression.note}
            <span className="v5-cs-rail-ref">
              {study.scaleModel
                ? "STAGE 03 IS THE ONE THAT UNLOCKS THE REST"
                : "STAGE 03 IS WHAT BUYS THE TIME — SEE FIG. 05"}
            </span>
          </p>
        </div>

        {/* Stage 03 is the prototype in every case — the point where this
            process stops resembling a design hand-off. It breaks the rhythm
            deliberately; the other five keep it. */}
        <ol className="v5-cs-stages">
          {study.decision.stages.map((s, i) => {
            const isPivot = i === 2;
            return (
              <li
                className={`v5-cs-stage${isPivot ? " is-pivot" : ""}`}
                key={s.title}
              >
                <span className="v5-cs-stage-n">
                  {String(i + 1).padStart(2, "0")}
                  <i
                    className={`v5-cs-node${isPivot ? " is-filled" : ""}`}
                    aria-hidden
                  />
                </span>
                <div>
                  {isPivot && <p className="v5-cs-pivot-tab">THE PIVOT</p>}
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── the compression ──────────────────────────────────────
          A product case compressed a timeline, so it is drawn to scale on a
          working-week ruler. A system case compressed a dependency, which
          has no ruler — it gets the instrument set instead. */}
      {study.scaleModel ? (
        <section className="v5-cs-scale">
          <div className="v5-cs-scale-head">
            <p className="v5-cs-folio">{folio("HOW IT SCALES")}</p>
            <h2 className="v5-cs-h2">{study.scaleModel.headline}</h2>
            <p className="v5-cs-lede">{study.scaleModel.body}</p>
          </div>
          <ScaleModelFigure
            metrics={study.scaleModel.metrics}
            curve={study.scaleModel.curve}
          />
        </section>
      ) : (
        <section className="v5-cs-bleed">
          <CompressionFigure
            theirs={study.compression.theirs}
            mine={study.compression.mine}
            note={study.compression.note}
          />
        </section>
      )}

      {/* ── what shipped ─────────────────────────────────────── */}
      <section className="v5-cs-bleed">
        <UserFlowDiagram flow={study.userFlow} />
      </section>

      {/* ── what it earned ───────────────────────────────────── */}
      <section className="v5-cs-split is-reverse">
        <div className="v5-cs-split-main">
          <p className="v5-cs-folio">{folio("WHAT IT EARNED")}</p>
          <h2 className="v5-cs-h2">{study.outcome.headline}</h2>
          <p className="v5-cs-lede">{study.outcome.body}</p>

          <dl className="v5-cs-metrics">
            {study.outcome.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <p className="v5-cs-delivered">
            {study.deliverables.map((d, i) => (
              <span key={d}>
                {i > 0 && <span className="v5-cs-arrow">→</span>}
                {d}
              </span>
            ))}
          </p>
        </div>
        <aside className="v5-cs-split-side">
          <FunnelDiagram stages={study.outcome.funnel} />
        </aside>
      </section>

      {/* ── next ─────────────────────────────────────────────── */}
      {others.length > 0 && (
        <section className="v5-cs-next">
          <p className="v5-cs-folio">NEXT CASE</p>
          <div className="v5-cs-next-grid">
            {others.map((o) => (
              <Link href={`/process/${o.slug}`} className="v5-cs-next-card" key={o.slug}>
                <span className="v5-cs-next-tag">{o.tag}</span>
                <h3>{o.name}</h3>
                <p>{o.oneLiner}</p>
                <span className="v5-cs-next-go">
                  READ <span aria-hidden>↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="v5-cs-cta">
        <p className="v5-cs-cta-line">
          Have a product that needs to exist <em>this quarter?</em>
        </p>
        <div className="v5-cs-cta-actions">
          <Link href="/contact" className="v5-btn-primary">
            START ONE&nbsp;↗
          </Link>
          <Link href="/process" className="v5-btn-outline">
            SEE THE FULL PROCESS
          </Link>
        </div>
      </section>

      <footer className="v5-cs-foot">
        <span>SURAJIT DUTTA</span>
        <span>{study.no} · {study.name.toUpperCase()}</span>
        <span>REAL-TIME BUILDS</span>
      </footer>
    </main>
  );
}
