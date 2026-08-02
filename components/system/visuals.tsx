"use client";

import { CURVE_FALLING, CURVE_FLAT, DRIFT_PRODUCTS, STACK_LAYERS } from "@/lib/systemStory";

/**
 * The scroll-driven visuals for /system.
 *
 * Each one is handed the active step and is responsible for demonstrating
 * that step rather than illustrating it. All geometry is fixed and
 * deterministic — no Math.random, no Date.now — so the server and client
 * agree on the first paint.
 */

/* ══ 01 · the drift ═══════════════════════════════════════════════
   Five identical products pull apart one defensible decision at a time.
   The divergence is real: radius, tone and offset all move per card, so
   by the last beat nothing matches and no single step looked wrong. */

/** Per-card drift applied once `active` reaches the card's threshold. */
const DRIFT = [
  { at: 1, r: 10, dy: 0, tone: 0.62 },
  { at: 1, r: 2, dy: 6, tone: 0.9 },
  { at: 2, r: 16, dy: -5, tone: 0.44 },
  { at: 2, r: 4, dy: 9, tone: 0.75 },
  { at: 3, r: 999, dy: 3, tone: 0.55 },
];

export function DriftVisual({ active }: { active: number }) {
  return (
    <div className="sys-drift" aria-hidden>
      <div className="sys-drift-row">
        {DRIFT_PRODUCTS.map((p, i) => {
          const d = DRIFT[i];
          const drifted = active >= d.at && i !== 0;
          return (
            <div
              className={`sys-drift-card${drifted ? " is-drifted" : ""}`}
              key={p}
              style={
                drifted
                  ? {
                      borderRadius: `${d.r}px`,
                      transform: `translateY(${d.dy}px)`,
                      opacity: d.tone,
                    }
                  : undefined
              }
            >
              <span className="sys-drift-bar" />
              <span className="sys-drift-bar is-short" />
              <span className="sys-drift-tag">{p}</span>
            </div>
          );
        })}
      </div>
      <p className={`sys-drift-verdict${active >= 3 ? " is-on" : ""}`}>
        FIVE DEFENSIBLE DECISIONS · ONE UNCHOSEN RESULT
      </p>
    </div>
  );
}

/* ══ 02 · the roster ══════════════════════════════════════════════
   The five audiences, each lit in turn. On the final beat they are shown
   together with their pull direction, because the conflict is the point. */

const ROSTER = [
  { who: "PRODUCT DESIGNER", want: "let me extend it now", pull: "fast" },
  { who: "FRONTEND ENGINEER", want: "just tell me which one", pull: "fast" },
  { who: "PRODUCT MANAGER", want: "make them match", pull: "still" },
  { who: "ADMINISTRATOR", want: "don't move anything", pull: "still" },
  { who: "NEXT MAINTAINER", want: "tell me why", pull: "still" },
] as const;

export function RosterVisual({ active }: { active: number }) {
  const all = active >= ROSTER.length;
  return (
    <div className="sys-roster" aria-hidden>
      {ROSTER.map((r, i) => (
        <div
          className={`sys-roster-row${!all && i === active ? " is-on" : ""}${all ? " is-all" : ""}`}
          key={r.who}
          data-pull={r.pull}
        >
          <span className="sys-roster-n">{String(i + 1).padStart(2, "0")}</span>
          <span className="sys-roster-who">{r.who}</span>
          <span className="sys-roster-want">&ldquo;{r.want}&rdquo;</span>
          <span className="sys-roster-pull">{all ? (r.pull === "fast" ? "MOVE →" : "← HOLD") : ""}</span>
        </div>
      ))}
      <p className={`sys-roster-verdict${all ? " is-on" : ""}`}>
        TWO PULL ONE WAY · THREE PULL THE OTHER
      </p>
    </div>
  );
}

/* ══ 03 · the stack ═══════════════════════════════════════════════
   Drawn bottom-up because that is the dependency order: nothing may
   reference a layer that does not exist yet. */

export function StackVisual({ active }: { active: number }) {
  return (
    <div className="sys-stack" aria-hidden>
      {[...STACK_LAYERS].reverse().map((l, revIdx) => {
        const i = STACK_LAYERS.length - 1 - revIdx;
        const built = active >= i;
        return (
          <div
            className={`sys-stack-l${built ? " is-built" : ""}${active === i ? " is-on" : ""}`}
            key={l.name}
          >
            <span className="sys-stack-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="sys-stack-name">{l.name}</span>
            <span className="sys-stack-holds">{l.holds}</span>
          </div>
        );
      })}
      <p className="sys-stack-dir">RESOLVES DOWN ↓</p>
    </div>
  );
}

/* ══ 06 · how it scales ═══════════════════════════════════════════
   Both curves on one axis so the comparison is honest. The bars are
   percentages of the first product's onboarding cost, which is the only
   framing that needs no absolute figure. */

const BAR_W = 46;
const BAR_GAP = 26;
const CHART_H = 190;

function Curve({ data, on, cls }: { data: number[]; on: boolean; cls: string }) {
  return (
    <g className={cls} opacity={on ? 1 : 0}>
      {data.map((v, i) => {
        const x = i * (BAR_W + BAR_GAP);
        const h = (v / 100) * CHART_H;
        return (
          <g key={i}>
            <rect x={x} y={CHART_H - h} width={BAR_W} height={h} className="sys-sc-bar" />
            <text x={x + BAR_W / 2} y={CHART_H - h - 10} className="sys-sc-val">
              {v}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function ScaleVisual({ active }: { active: number }) {
  const showFlat = active >= 2;
  const showFalling = active >= 3;
  const width = 5 * BAR_W + 4 * BAR_GAP;

  return (
    <div className="sys-sc" aria-hidden>
      <svg viewBox={`0 0 ${width} ${CHART_H + 46}`} className="sys-sc-svg">
        {/* baseline + the question, before either answer lands */}
        <line x1={0} y1={CHART_H} x2={width} y2={CHART_H} className="sys-sc-axis" />
        <g opacity={active < 2 ? 1 : 0}>
          <text x={width / 2} y={CHART_H / 2} className="sys-sc-q">
            ?
          </text>
        </g>

        <Curve data={CURVE_FLAT} on={showFlat && !showFalling} cls="is-flat" />
        <Curve data={CURVE_FALLING} on={showFalling} cls="is-falling" />

        {[1, 2, 3, 4, 5].map((n, i) => (
          <text
            key={n}
            x={i * (BAR_W + BAR_GAP) + BAR_W / 2}
            y={CHART_H + 24}
            className="sys-sc-x"
          >
            P{n}
          </text>
        ))}
        <text x={0} y={CHART_H + 42} className="sys-sc-cap">
          ONBOARDING COST, % OF THE FIRST PRODUCT
        </text>
      </svg>
      <p className={`sys-sc-verdict${showFalling ? " is-on" : showFlat ? " is-warn" : ""}`}>
        {showFalling ? "A SYSTEM" : showFlat ? "A LIBRARY" : "UNMEASURED"}
      </p>
    </div>
  );
}
