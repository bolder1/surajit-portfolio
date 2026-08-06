import type { JourneyStage } from "@/lib/processCases";

/**
 * JourneyMapDiagram — emotion over the course of one working session.
 *
 * Editorial chart, not a default line plot: banded gridlines, a shaded
 * area under the curve, a vermilion seam marking the turn (the moment
 * the product enters the story), and leader-line callouts on the trough
 * and the peak. Everything left of the seam is the old world.
 *
 * Fixed column width so the SVG and the HTML label row below stay in
 * lockstep. All coordinates literal — SSR-safe.
 */

const COL = 165;
const H = 200;
const PAD_X = 26;

/** emotion -2..2 -> y. Headroom above the top band so the peak callout
    still has somewhere to sit. */
const yFor = (e: JourneyStage["emotion"]) => 118 - e * 38;

const BANDS = [
  { e: 2, label: "IN CONTROL" },
  { e: 0, label: "COPING" },
  { e: -2, label: "LOSING IT" },
] as const;

export function JourneyMapDiagram({
  persona,
  stages,
}: {
  persona: string;
  stages: JourneyStage[];
}) {
  const width = stages.length * COL;
  const pts = stages.map((s, i) => ({
    x: PAD_X + i * COL,
    y: yFor(s.emotion),
    s,
    i,
  }));

  // The turn: first stage where the product has actually changed the day.
  const turnIdx = stages.findIndex((s) => s.emotion >= 0);
  const seamX =
    turnIdx > 0 ? PAD_X + (turnIdx - 0.5) * COL : PAD_X - COL / 2;

  const trough = pts.reduce((w, p) => (p.y > w.y ? p : w), pts[0]);
  const peak = pts.reduce((b, p) => (p.y < b.y ? p : b), pts[0]);

  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${PAD_X},${H} ${line} ${pts[pts.length - 1].x},${H}`;

  return (
    <figure className="v5-pcd v5-jmap">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 02 — ONE SESSION, {persona.toUpperCase()}
      </figcaption>

      <div className="v5-pcd-frame">
        <div className="v5-jmap-scroll">
          <svg
            viewBox={`0 0 ${width} ${H + 34}`}
            width={width}
            height={H + 34}
            className="v5-jmap-svg"
            role="img"
            aria-label={`Emotional journey for ${persona}: from ${stages[0].stage} down to ${trough.s.stage}, turning at ${stages[turnIdx]?.stage ?? ""} and rising to ${peak.s.stage}.`}
          >
            {/* bands */}
            {BANDS.map((b) => (
              <g key={b.label}>
                <line
                  x1={0}
                  y1={yFor(b.e)}
                  x2={width}
                  y2={yFor(b.e)}
                  className="v5-jmap-grid"
                />
                <text x={0} y={yFor(b.e) - 8} className="v5-jmap-band">
                  {b.label}
                </text>
              </g>
            ))}

            {/* the turn */}
            <line x1={seamX} y1={4} x2={seamX} y2={H} className="v5-jmap-seam" />
            <text x={seamX - 10} y={H + 16} className="v5-jmap-before">
              BEFORE
            </text>
            <text x={seamX + 10} y={H + 16} className="v5-jmap-after">
              AFTER — THE PRODUCT ENTERS
            </text>

            <polygon points={area} className="v5-jmap-area" />
            <polyline points={line} className="v5-jmap-line" fill="none" />

            {/* callouts */}
            <line
              x1={trough.x}
              y1={trough.y + 10}
              x2={trough.x}
              y2={trough.y + 26}
              className="v5-jmap-leader"
            />
            <text x={trough.x - 6} y={trough.y + 38} className="v5-jmap-callout">
              LOWEST POINT
            </text>
            <line
              x1={peak.x}
              y1={peak.y - 10}
              x2={peak.x}
              y2={peak.y - 24}
              className="v5-jmap-leader-hot"
            />
            <text x={peak.x - 6} y={peak.y - 32} className="v5-jmap-callout-hot">
              THE PAYOFF
            </text>

            {pts.map((p) => (
              <circle
                key={p.i}
                cx={p.x}
                cy={p.y}
                r={p.i === peak.i ? 6 : 4}
                className={p.i === peak.i ? "v5-jmap-dot is-peak" : "v5-jmap-dot"}
              />
            ))}
          </svg>

          <div className="v5-jmap-labels" style={{ width }}>
            {stages.map((s, i) => (
              <div
                className={`v5-jmap-col ${i === turnIdx ? "is-turn" : ""}`}
                key={s.stage}
                style={{ width: COL }}
              >
                <p className="v5-jmap-stage">
                  {String(i + 1).padStart(2, "0")} / {s.stage}
                </p>
                <p className="v5-jmap-note">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
