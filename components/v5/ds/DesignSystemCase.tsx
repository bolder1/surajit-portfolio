import Link from "next/link";
import { CHAPTERS, INTERACTIVE_COUNT, READ_MINUTES } from "@/lib/designSystem/chapters";
import { FINDINGS, HONEST, MASTHEAD, PROBLEM, ROSTER, SCALE, STEPS, type Step } from "@/lib/designSystem/case";
import { M } from "@/lib/designSystem/metrics";
import { THEME_LEAK_ROWS } from "@/lib/designSystem/metrics";
import { CaseRail } from "./CaseRail";
import { Ticks } from "./Ticks";
import { TokenResolver } from "./TokenResolver";
import { VariantMatrix } from "./VariantMatrix";
import {
  AxisFigure,
  GuidelinePlates,
  IconFigure,
  LayerStack,
  MetaFigure,
  PaletteWall,
  RoutingFigure,
  ScaleCurves,
  ScaleTable,
  WorkflowRail,
} from "./figures";

/**
 * DesignSystemCase — the miniOrange Central Design System, end to end.
 *
 * Structured as eight chapters rather than a scroll story with hidden length:
 * the rail shows how much argument is left, every chapter is reachable by
 * anchor, and nothing is gated behind an animation. Two chapters are
 * interactive because two of the claims — "one binding, four values" and
 * "1,470 of a possible 1,792" — are checkable, and a checkable claim should be
 * checked rather than asserted.
 *
 * Almost all of this file is a server component. The only client code is the
 * rail, the token resolver and the variant matrix, which is the entire reason
 * a page this dense stays cheap.
 */

const FIGMA_FILES = [
  {
    name: "Tokens",
    note: `${M.colourPrimitives + M.sizePrimitives} primitives · ${M.aliasedScales} aliased steps`,
    href: "https://www.figma.com/design/V2qdpU2nsj5VnWIN2EJXkH/Tokens---Product-Design-System--Copy-?node-id=80-1065",
  },
  {
    name: "Components",
    note: `Button ${M.buttonPublished.toLocaleString("en-US")} variants · ${M.icons.toLocaleString("en-US")} icons`,
    href: "https://www.figma.com/design/AUdlDvbPYr1eMPM6SM7IPT/Component---Product-design-system--Copy-?node-id=129-1052",
  },
  {
    name: "IDP · 1 Foundations",
    note: "Foundation variables",
    href: "https://www.figma.com/design/e9Y6cM1w7sQKrUifpOrPVZ/IDP-%C2%B7-1-Foundations?node-id=0-1",
  },
  {
    name: "IDP · 2 Core",
    note: "The six-page documentation spec",
    href: "https://www.figma.com/design/nJkQ5zrJD6srYJLBnnfnIg/IDP-%C2%B7-2-Core?node-id=294-10222",
  },
];

/** A build step with its reasoning kept visibly separate from its description. */
function StepBlock({ step }: { step: Step }) {
  return (
    <article className="ds-step">
      <p className="ds-step-no" aria-hidden>
        {step.no}
      </p>
      <div className="ds-step-main">
        <h3 className="ds-step-title">{step.title}</h3>
        <p className="ds-step-body">
          <Ticks>{step.body}</Ticks>
        </p>
        <aside className="ds-why">
          <p className="ds-why-k">WHY THIS, NOT THE OBVIOUS ONE</p>
          <p className="ds-why-v">
            <Ticks>{step.explainer}</Ticks>
          </p>
        </aside>
        <p className="ds-step-out">
          <span aria-hidden>↳</span> {step.output}
        </p>
      </div>
    </article>
  );
}

function ChapterHead({ id }: { id: string }) {
  const c = CHAPTERS.find((x) => x.id === id)!;
  return (
    <header className="ds-ch-head">
      <p className="ds-ch-no">
        <span className="ds-dot" aria-hidden /> CHAPTER {c.no}
        {c.interactive && <b className="ds-ch-int">INTERACTIVE</b>}
      </p>
      <h2 className="ds-ch-title">{c.name}</h2>
      <p className="ds-ch-blurb">{c.blurb}</p>
    </header>
  );
}

export function DesignSystemCase() {
  const step = (no: string) => STEPS.find((s) => s.no === no)!;

  return (
    <div className="ds-root">
      <CaseRail />

      <main id="main" className="ds-main">
        {/* ── masthead ─────────────────────────────────────────── */}
        <header className="ds-mast">
          <p className="ds-mast-eyebrow">{MASTHEAD.eyebrow}</p>
          <h1 className="ds-mast-title">{MASTHEAD.title}</h1>
          <p className="ds-mast-stand">{MASTHEAD.standfirst}</p>

          <dl className="ds-mast-meta">
            <div>
              <dt>ROLE</dt>
              <dd>{MASTHEAD.role}</dd>
            </div>
            <div>
              <dt>YEARS</dt>
              <dd>{MASTHEAD.year}</dd>
            </div>
            <div>
              <dt>CHAPTERS</dt>
              <dd>
                {CHAPTERS.length} · {READ_MINUTES} MIN · {INTERACTIVE_COUNT} INTERACTIVE
              </dd>
            </div>
          </dl>

          <ul className="ds-mast-scope">
            {MASTHEAD.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          {/* The four numbers the whole case rests on, stated before the
              argument rather than saved for a reveal at the end. */}
          <ul className="ds-headline">
            {[
              [M.totalVariables.toLocaleString("en-US"), "variables", "across five collections"],
              [M.valuesPerRoutedBinding, "values", "per routed binding"],
              [M.rebrandCost, "tokens", "is what a new brand costs"],
              [M.buttonPublished.toLocaleString("en-US"), "variants", `of a possible ${M.buttonCrossProduct.toLocaleString("en-US")}`],
            ].map(([n, k, sub]) => (
              <li key={k as string}>
                <span className="n">{n}</span>
                <span className="k">{k}</span>
                <span className="s">{sub}</span>
              </li>
            ))}
          </ul>
        </header>

        {/* ── 01 the audit ─────────────────────────────────────── */}
        <section id="audit" className="ds-ch">
          <ChapterHead id="audit" />

          <h3 className="ds-h3">{PROBLEM.headline}</h3>
          <p className="ds-lede">{PROBLEM.body}</p>

          <div className="ds-found">
            <h4 className="ds-found-h">{PROBLEM.howFound.headline}</h4>
            <p className="ds-found-b">{PROBLEM.howFound.body}</p>
            <aside className="ds-why is-wide">
              <p className="ds-why-k">WHY START HERE</p>
              <p className="ds-why-v">{PROBLEM.howFound.explainer}</p>
            </aside>
          </div>

          <ol className="ds-constraints">
            {PROBLEM.constraints.map((c, i) => (
              <li key={c.title}>
                <span className="ds-constraints-n" aria-hidden>
                  0{i + 1}
                </span>
                <p className="ds-constraints-t">{c.title}</p>
                <p className="ds-constraints-b">{c.body}</p>
              </li>
            ))}
          </ol>

          <p className="ds-fig-k">WHAT THE AUDIT LEFT — FIG. 01</p>
          <PaletteWall />
        </section>

        {/* ── 02 the roster ────────────────────────────────────── */}
        <section id="roster" className="ds-ch">
          <ChapterHead id="roster" />
          <p className="ds-lede">
            Rendered as unequal rows rather than a card grid on purpose. Five
            equal cards would claim these people are interchangeable, which is
            the opposite of the argument — two of them want the system to move
            and three want it to stay still, and the system has to survive both.
          </p>

          <ol className="ds-roster">
            {ROSTER.map((p, i) => (
              <li key={p.who} className="ds-roster-row" data-pull={p.pull}>
                <span className="ds-roster-n" aria-hidden>
                  0{i + 1}
                </span>
                <div className="ds-roster-main">
                  <p className="ds-roster-who">{p.who}</p>
                  <p className="ds-roster-wants">{p.wants}</p>
                  <p className="ds-roster-breaks">
                    <span aria-hidden>↳</span> {p.breaks}
                  </p>
                </div>
                <span className="ds-roster-pull">{p.pull === "move" ? "WANTS MOVEMENT" : "WANTS STILLNESS"}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 03 the architecture ──────────────────────────────── */}
        <section id="architecture" className="ds-ch">
          <ChapterHead id="architecture" />
          <p className="ds-lede">
            Four layers, built bottom-up. The order is not a preference — each
            layer had to be stable before the one above could alias into it, and
            nothing is ever allowed to reference a layer that does not exist
            yet.
          </p>

          <LayerStack />

          <div className="ds-steps">
            <StepBlock step={step("01")} />
            <StepBlock step={step("02")} />
          </div>

          <p className="ds-fig-k">NAMED STEPS, NOT NUMBERS — FIG. 02</p>
          <ScaleTable />

          <div className="ds-steps">
            <StepBlock step={step("03")} />
          </div>

          <p className="ds-fig-k">THE DECISION THE SYSTEM RESTS ON — FIG. 03</p>
          <AxisFigure />

          <div className="ds-steps">
            <StepBlock step={step("04")} />
          </div>

          <p className="ds-fig-k">WHAT THE BRAND ACTUALLY OWNS — FIG. 04</p>
          <RoutingFigure />
        </section>

        {/* ── 04 the mapping ───────────────────────────────────── */}
        <section id="mapping" className="ds-ch">
          <ChapterHead id="mapping" />
          <div className="ds-steps">
            <StepBlock step={step("05")} />
          </div>

          <p className="ds-fig-k">RESOLVE IT YOURSELF — FIG. 05</p>
          <TokenResolver />
        </section>

        {/* ── 05 the component ─────────────────────────────────── */}
        <section id="component" className="ds-ch">
          <ChapterHead id="component" />
          <div className="ds-steps">
            <StepBlock step={step("06")} />
          </div>

          <p className="ds-fig-k">THE MATRIX, AND ITS HOLES — FIG. 06</p>
          <VariantMatrix />

          <p className="ds-note">
            Had brand and appearance been variant axes instead of variable
            modes, the same coverage would have been{" "}
            {M.buttonIfModesWereVariants.toLocaleString("en-US")} variants —
            four times the file, four times the review, and a rebrand would have
            meant touching every one of them.
          </p>
        </section>

        {/* ── 06 the library ───────────────────────────────────── */}
        <section id="library" className="ds-ch">
          <ChapterHead id="library" />
          <p className="ds-fig-k">THE ICON SET — FIG. 07</p>
          <IconFigure />

          <h3 className="ds-h3">Components that exist to document components</h3>
          <p className="ds-lede">
            The governance model is not a document, it is five components. A
            lifecycle badge sits on the artefact, so a deprecation is visible in
            the place someone is about to copy from rather than in a tracker
            they will not open.
          </p>
          <MetaFigure />
        </section>

        {/* ── 07 the workflow ──────────────────────────────────── */}
        <section id="workflow" className="ds-ch">
          <ChapterHead id="workflow" />
          <div className="ds-steps">
            <StepBlock step={step("07")} />
          </div>

          <p className="ds-fig-k">THE PUBLISH GATE — FIG. 08</p>
          <WorkflowRail />

          <h3 className="ds-h3">Guidelines are drawn, not written</h3>
          <p className="ds-lede">
            Each pair below differs only in which button tones are placed. That
            is the whole point: the mistake is never a badly drawn button, it is
            three of them next to each other, and a sentence describing that is
            far less convincing than the picture of it.
          </p>
          <GuidelinePlates />

          <div className="ds-steps">
            <StepBlock step={step("08")} />
          </div>
        </section>

        {/* ── 08 the reckoning ─────────────────────────────────── */}
        <section id="reckoning" className="ds-ch">
          <ChapterHead id="reckoning" />
          <p className="ds-lede">
            Everything above was extracted from the published files by script
            rather than written from memory. Doing that to your own system finds
            things. These four are real, they are current, and they are here
            because a case study that only reports the parts that went well is
            marketing.
          </p>

          <ol className="ds-findings">
            {FINDINGS.map((f) => (
              <li key={f.id} className="ds-finding" data-sev={f.severity}>
                <span className="ds-finding-sev">{f.severity}</span>
                <h3 className="ds-finding-h">{f.headline}</h3>
                <p className="ds-finding-d">
                  <Ticks>{f.detail}</Ticks>
                </p>
                <p className="ds-finding-m">
                  <span aria-hidden>↳</span> <b>How it was found.</b> <Ticks>{f.method}</Ticks>
                </p>
              </li>
            ))}
          </ol>

          <p className="ds-fig-k">THE LEAK, ROW BY ROW — FIG. 09</p>
          <div className="ds-leak">
            <table className="ds-leak-table">
              <caption className="v5-sr">
                Theme rows whose Orange mode still resolves to a Blue primitive
              </caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Blue mode</th>
                  <th scope="col">Orange mode</th>
                </tr>
              </thead>
              <tbody>
                {THEME_LEAK_ROWS.map((r) => (
                  <tr key={r.token}>
                    <th scope="row">
                      <code>{r.token}</code>
                    </th>
                    <td>
                      <code>{r.Blue.alias}</code>
                    </td>
                    <td className="is-bad">
                      <code>{r.Orange.alias}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ds-leak-note">
              {M.themeLeak} of {M.themeRoles}. All eight are in the{" "}
              <code>surface</code> group and none are in{" "}
              <code>interactive</code>, which is the signature of a layer that
              was mapped once for the first brand and not re-walked for the
              second.
            </p>
          </div>

          <h3 className="ds-h3">{SCALE.wrongQuestion}</h3>
          <p className="ds-lede">{SCALE.wrongWhy}</p>
          <h3 className="ds-h3 is-hot">{SCALE.rightQuestion}</h3>
          <p className="ds-lede">{SCALE.rightWhy}</p>

          <p className="ds-fig-k">THE ONLY MEASUREMENT THAT SETTLES IT — FIG. 10</p>
          <ScaleCurves />
          <p className="ds-note">{SCALE.readings}</p>

          <div className="ds-honest">
            <h3 className="ds-honest-h">{HONEST.headline}</h3>
            <ul>
              {HONEST.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── colophon ─────────────────────────────────────────── */}
        <footer className="ds-foot">
          <div className="ds-foot-files">
            <p className="ds-foot-k">THE FILES</p>
            <ul>
              {FIGMA_FILES.map((f) => (
                <li key={f.name}>
                  <a href={f.href} target="_blank" rel="noopener noreferrer">
                    <span className="n">{f.name}</span>
                    <span className="d">{f.note}</span>
                    <span className="a" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="ds-foot-note">
              Files are access-controlled; the counts on this page were read
              from them with the Figma API and reduced by a checked-in script,
              so they can be re-read rather than re-typed.
            </p>
          </div>

          <nav className="ds-foot-next" aria-label="More case studies">
            <p className="ds-foot-k">NEXT</p>
            <ul>
              <li>
                <Link href="/process/itdr">Identity threat detection ↗</Link>
              </li>
              <li>
                <Link href="/process/dpdp-compliance">DPDP compliance ↗</Link>
              </li>
              <li>
                <Link href="/process/function-os">Function OS ↗</Link>
              </li>
              <li>
                <Link href="/">Back to the index ↗</Link>
              </li>
            </ul>
          </nav>
        </footer>
      </main>
    </div>
  );
}
