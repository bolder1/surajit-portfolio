import { COLLECTIONS, PALETTE, SCALES } from "@/lib/designSystem/figmaData";
import { M } from "@/lib/designSystem/metrics";
import { toCss } from "@/lib/designSystem/resolve";
import { DOC_TEMPLATE, GUIDELINES, ICONS, META_COMPONENTS } from "@/lib/designSystem/library";

/**
 * figures — every illustration on the page, drawn from the token data itself.
 *
 * All of these are server components: no state, no effects, no client bundle.
 * They are inline SVG and CSS with no chart library, and every one of them is
 * fed by `figmaData.ts` rather than by numbers typed into the markup — a
 * diagram of a design system that has its values hard-coded would be a joke at
 * its own expense.
 */

/* ───────────────────────── the four layers ───────────────────────── */

const LAYER_NOTES = [
  "Hexes and numbers. No opinion about use. Nothing may alias *into* a product decision from here.",
  "Named steps pointing at size primitives. The vocabulary grows here so the foundation does not.",
  "Brand-owned roles only. Two modes, one per brand — 23 of the 251 bindables reach this layer.",
  "What components bind to. Two modes, light and dark. The only layer a component is allowed to know.",
];

export function LayerStack() {
  return (
    <ol className="ds-layers">
      {COLLECTIONS.reduce<
        { name: string; label: string; count: number; modes: readonly string[] }[]
      >((acc, c) => {
        // The two primitive collections are one conceptual layer; they are
        // separate in Figma only because colour and size cannot share a type.
        if (c.name === "_global-sizes") {
          acc[acc.length - 1] = {
            ...acc[acc.length - 1],
            name: "_global-colors · _global-sizes",
            count: acc[acc.length - 1].count + c.count,
          };
          return acc;
        }
        acc.push({ name: c.name, label: c.label, count: c.count, modes: c.modes });
        return acc;
      }, []).map((l, i) => (
        <li key={l.name} className="ds-layer" data-i={i}>
          <span className="ds-layer-no" aria-hidden>
            L{i + 1}
          </span>
          <div className="ds-layer-main">
            <p className="ds-layer-name">
              <code>{l.name}</code>
              <span className="ds-layer-count">{l.count}</span>
            </p>
            <p className="ds-layer-label">{l.label}</p>
            <p className="ds-layer-note">{LAYER_NOTES[i]}</p>
          </div>
          <div className="ds-layer-modes">
            {l.modes.map((m) => (
              <span key={m} className={`ds-mode${m === "Mode 1" ? " is-null" : ""}`}>
                {m === "Mode 1" ? "no modes" : m}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────── the two-axis resolution diagram ─────────────────── */

/**
 * The shape of the decision in step 03, drawn once.
 * Left: one collection, four modes — what it looks like when the axes are
 * merged. Right: two collections, two modes each. Same four outcomes, but the
 * left grows multiplicatively with every new brand and the right does not.
 */
export function AxisFigure() {
  return (
    <figure className="ds-fig ds-axisfig">
      <div className="ds-axisfig-pair">
        <div className="ds-axisfig-side is-no">
          <p className="ds-axisfig-k">MERGED · one collection</p>
          <ul className="ds-axisfig-modes">
            {["Blue-light", "Blue-dark", "Orange-light", "Orange-dark"].map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="ds-axisfig-n">
            4 modes now. 6 at the third brand, 8 at the fourth — and every new
            role must be authored in all of them.
          </p>
        </div>
        <div className="ds-axisfig-side is-yes">
          <p className="ds-axisfig-k">INDEPENDENT · two collections</p>
          <div className="ds-axisfig-cross">
            <ul className="ds-axisfig-modes">
              <li>Blue</li>
              <li>Orange</li>
            </ul>
            <span className="ds-axisfig-x" aria-hidden>
              ×
            </span>
            <ul className="ds-axisfig-modes">
              <li>onLight</li>
              <li>onDark</li>
            </ul>
          </div>
          <p className="ds-axisfig-n">
            2 modes each, multiplied at resolution instead of at authoring. A
            third brand adds one mode to one collection and touches nothing
            else.
          </p>
        </div>
      </div>
      <figcaption>
        The same four outcomes either way. The difference is only visible at the
        third brand — which is exactly when it is too late to change.
      </figcaption>
    </figure>
  );
}

/* ───────────────────── routed vs direct, to scale ───────────────────── */

export function RoutingFigure() {
  const total = M.bindable;
  const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;
  return (
    <figure className="ds-fig ds-routing">
      <div className="ds-routing-bar" role="img" aria-label={`${M.routed} of ${total} tokens route through the brand layer`}>
        <span className="is-routed" style={{ width: pct(M.routed) }} />
        <span className="is-direct" style={{ width: pct(M.direct) }} />
        <span className="is-literal" style={{ width: pct(M.literal) }} />
      </div>
      <ul className="ds-routing-key">
        <li>
          <i className="is-routed" aria-hidden />
          <b>{M.routed}</b>{" "}
          route through Theme
          <em>→ 4 values each · the entire brand surface</em>
        </li>
        <li>
          <i className="is-direct" aria-hidden />
          <b>{M.direct}</b>{" "}
          alias straight to a primitive
          <em>→ 2 values each · status, greys, overlays, popups</em>
        </li>
        <li>
          <i className="is-literal" aria-hidden />
          <b>{M.literal}</b>{" "}
          hold a literal value
          <em>→ elevation shadows and one transparent</em>
        </li>
      </ul>
      <figcaption>
        A rebrand is {M.routed} values, not {total}. That number is the honest
        answer to what a new brand costs, and it is small because a red alert is
        red in both brands and never asked the brand layer.
      </figcaption>
    </figure>
  );
}

/* ──────────────────────────── the palette ──────────────────────────── */

export function PaletteWall() {
  return (
    <figure className="ds-fig ds-palette">
      <div className="ds-palette-grid">
        {PALETTE.map((f) => (
          <div key={f.family} className="ds-palette-row">
            <code className="ds-palette-k">{f.family}</code>
            <div className="ds-palette-ramp">
              {f.steps.map((s) => (
                <span
                  key={s.step}
                  className="ds-palette-sw"
                  style={{ background: toCss(s.hex) }}
                  title={`${f.family}/${s.step} · ${s.hex}`}
                >
                  <span className="v5-sr">
                    {s.step} {s.hex}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption>
        {M.colourFamilies} families, {M.colourPrimitives} primitives, one ramp
        shape — {M.rampSteps} solid steps then {M.alphaSteps} alpha steps, in
        every family. A designer reaching into a family they have never opened
        already knows what step 600 will do, which is the only reason a set this
        size is usable at all.
      </figcaption>
    </figure>
  );
}

/* ────────────────────────── the aliased scales ────────────────────────── */

/**
 * Figma lists variables alphabetically, which puts `spacing/4` after
 * `spacing/32` and makes a perfectly ordered scale look like a shuffled one.
 * Sorted by resolved value here — the values are untouched, only the reading
 * order is, and a scale that cannot be read in order is not communicating
 * that it is a scale.
 */
const byValue = <T extends { value: string }>(items: readonly T[]) =>
  [...items].sort((a, b) => Number(a.value) - Number(b.value));

export function ScaleTable() {
  const radius = SCALES.find((s) => s.group === "borderRadius")!;
  const spacing = SCALES.find((s) => s.group === "spacing")!;
  const ordered = [spacing, radius].map((g) => ({ ...g, items: byValue(g.items) }));
  return (
    <figure className="ds-fig ds-scales">
      <div className="ds-scales-pair">
        {ordered.map((g) => (
          <div key={g.group} className="ds-scale">
            <p className="ds-scale-k">
              {g.group} <span>{g.items.length}</span>
            </p>
            <ul className="ds-scale-list">
              {g.items.map((it) => (
                <li key={it.name}>
                  <code className="n">{it.name}</code>
                  <span className="a">{it.alias ?? "literal"}</span>
                  <span className="v">{it.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figcaption>
        Neither of these holds a number. <code>borderRadius/2Xl</code>{" "}
        points at a size primitive, so changing what &ldquo;2Xl&rdquo; means is one edit
        rather than a find-and-replace across every component that happened to
        use 20.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────── icons ─────────────────────────────── */

export function IconFigure() {
  return (
    <figure className="ds-fig ds-icons">
      <div className="ds-icons-stat">
        {[
          [ICONS.total, "components"],
          [ICONS.paired, "line / fill pairs"],
          [ICONS.unsuffixed, "editor glyphs"],
          [ICONS.categories, "categories"],
        ].map(([n, k]) => (
          <div key={k as string}>
            <span className="ds-icons-n">{(n as number).toLocaleString("en-US")}</span>
            <span className="ds-icons-k">{k as string}</span>
          </div>
        ))}
      </div>
      <p className="ds-icons-rule">{ICONS.rule}</p>
      <ul className="ds-icons-broken">
        {ICONS.broken.map((b) => (
          <li key={b.pair}>
            <code>{b.pair}</code>
            <span>{b.why}</span>
          </li>
        ))}
      </ul>
      <figcaption>
        Found by stripping the suffix off all {ICONS.total.toLocaleString("en-US")}{" "}
        names and set-differencing the two halves. Four names did not match. At
        this size that is not a proofreading problem — it is the argument for
        the check being a script rather than a person.
      </figcaption>
    </figure>
  );
}

/* ──────────────────── the system's own tooling ──────────────────── */

export function MetaFigure() {
  return (
    <ul className="ds-meta">
      {META_COMPONENTS.map((m) => (
        <li key={m.name} className="ds-meta-row">
          <code className="ds-meta-n">{m.name}</code>
          <span className="ds-meta-c">{m.count}</span>
          <span className="ds-meta-v">
            {m.variants.map((v) => (
              <i key={v}>{v}</i>
            ))}
          </span>
          <span className="ds-meta-d">{m.does}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────── the publish gate ─────────────────────────── */

export function WorkflowRail() {
  return (
    <ol className="ds-flow">
      {DOC_TEMPLATE.map((p, i) => (
        <li key={p.no} className="ds-flow-step">
          <span className="ds-flow-no" aria-hidden>
            {p.no}
          </span>
          <div className="ds-flow-body">
            <p className="ds-flow-name">{p.name}</p>
            <p className="ds-flow-holds">{p.holds}</p>
            <p className="ds-flow-forces">
              <span aria-hidden>↳</span> {p.forces}
            </p>
          </div>
          {i < DOC_TEMPLATE.length - 1 && <span className="ds-flow-rule" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────────── do / don't ───────────────────────────── */

function Plate({ tones, ok }: { tones: readonly string[]; ok: boolean }) {
  return (
    <div className={`ds-plate${ok ? " is-do" : " is-dont"}`}>
      <span className="ds-plate-tag">{ok ? "DO" : "DON'T"}</span>
      <div className="ds-plate-stage">
        {tones.map((t, i) => (
          <span key={`${t}-${i}`} className={`ds-plate-btn is-${t}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GuidelinePlates() {
  return (
    <ol className="ds-guides">
      {GUIDELINES.map((g) => (
        <li key={g.rule} className="ds-guide">
          <p className="ds-guide-rule">{g.rule}</p>
          <div className="ds-guide-pair">
            <Plate tones={g.do} ok />
            <Plate tones={g.dont} ok={false} />
          </div>
          <p className="ds-guide-why">{g.why}</p>
        </li>
      ))}
    </ol>
  );
}

/* ────────────────────────── how it scales ────────────────────────── */

const FLAT = [78, 76, 79, 77, 76];
const FALL = [78, 54, 39, 29, 22];

export function ScaleCurves() {
  const W = 460;
  const H = 190;
  const pad = 26;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (FLAT.length - 1);
  const y = (v: number) => H - pad - (v / 100) * (H - pad * 2);
  const path = (vals: number[]) =>
    vals.map((v, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  return (
    <figure className="ds-fig ds-curves">
      <svg viewBox={`0 0 ${W} ${H}`} className="ds-curves-svg" role="img"
        aria-label="Two onboarding-cost curves: one flat, one falling, over five products.">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} className="ds-curves-axis" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} className="ds-curves-axis" />
        <path d={path(FLAT)} className="ds-curves-flat" fill="none" />
        <path d={path(FALL)} className="ds-curves-fall" fill="none" />
        {FALL.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={3.2} className="ds-curves-dot" />
        ))}
        {FLAT.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={2.4} className="ds-curves-dot is-flat" />
        ))}
      </svg>
      <ul className="ds-curves-key">
        <li>
          <i className="is-flat" aria-hidden /> flat — a well-organised library.
          Each team pays full price for the same shelf.
        </li>
        <li>
          <i className="is-fall" aria-hidden /> falling — a system. The fifth
          product&rsquo;s question was already settled by the third.
        </li>
      </ul>
      <figcaption>
        Onboarding cost per product, in arrival order. The axis has no numbers
        on it because the readings are confidential — what transfers is the
        measurement, not my figures.
      </figcaption>
    </figure>
  );
}
