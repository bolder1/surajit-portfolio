/**
 * CompressionFigure — the central claim, drawn to scale instead of asserted.
 *
 * Both paths are measured against the SAME working-week ruler, so the
 * ratio is something the reader sees rather than something they're told.
 * The conventional bar runs the width of the sheet; this process is the
 * short vermilion stub at the origin.
 *
 * The scale is the site's established framing (weeks–months vs ≈2 days),
 * plotted honestly against a 40-working-day ruler — no invented metrics.
 */

const X0 = 96;
const X1 = 930;
const WEEKS = 8;
const SPAN = X1 - X0;
const WEEK_W = SPAN / WEEKS;
/** 2 working days out of 8 weeks (40 working days). */
const MINE_W = Number(((2 / (WEEKS * 5)) * SPAN).toFixed(2));

const RULER_Y = 58;
const BAR_A_Y = 92;
const BAR_B_Y = 152;
const BAR_H = 30;

export function CompressionFigure({
  theirs,
  mine,
  note,
}: {
  theirs: string;
  mine: string;
  note: string;
}) {
  return (
    <figure className="v5-pcd v5-comp">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 05 — THE SAME RULER, BOTH PATHS
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox="0 0 980 236"
          className="v5-comp-svg"
          role="img"
          aria-label={`Measured against the same eight-week ruler: a conventional path runs ${theirs}; this process takes ${mine}.`}
        >
          {/* ruler */}
          <line x1={X0} y1={RULER_Y} x2={X1} y2={RULER_Y} className="v5-comp-ruler" />
          {Array.from({ length: WEEKS + 1 }, (_, i) => {
            const x = Number((X0 + i * WEEK_W).toFixed(2));
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={RULER_Y - 7}
                  x2={x}
                  y2={RULER_Y + 7}
                  className="v5-comp-tick"
                />
                {i > 0 && (
                  <text
                    x={Number((x - WEEK_W / 2).toFixed(2))}
                    y={RULER_Y - 15}
                    className="v5-comp-week"
                  >
                    W{i}
                  </text>
                )}
              </g>
            );
          })}
          <text x={0} y={RULER_Y + 4} className="v5-comp-axis">
            WORKING WEEKS
          </text>

          {/* conventional path */}
          <rect
            x={X0}
            y={BAR_A_Y}
            width={SPAN}
            height={BAR_H}
            className="v5-comp-bar-quiet"
          />
          <text x={0} y={BAR_A_Y + 20} className="v5-comp-label">
            A TEAM SCOPES
          </text>
          <text x={X0 + 16} y={BAR_A_Y + 20} className="v5-comp-inbar">
            DISCOVERY → SPEC → BUILD → DEMO
          </text>
          <text x={X1} y={BAR_A_Y - 8} className="v5-comp-value-quiet">
            {theirs}
          </text>

          {/* this process */}
          <rect
            x={X0}
            y={BAR_B_Y}
            width={MINE_W}
            height={BAR_H}
            className="v5-comp-bar-hot"
          />
          <text x={0} y={BAR_B_Y + 20} className="v5-comp-label">
            THIS PROCESS
          </text>
          {/* leader out to a legible label — the stub is too small to letter */}
          <line
            x1={X0 + MINE_W}
            y1={BAR_B_Y + BAR_H / 2}
            x2={X0 + MINE_W + 54}
            y2={BAR_B_Y + BAR_H / 2}
            className="v5-comp-leader"
          />
          <text x={X0 + MINE_W + 64} y={BAR_B_Y + 20} className="v5-comp-value-hot">
            {mine}
          </text>

          {/* the delta, bracketed */}
          <path
            d={`M ${X0 + MINE_W} ${BAR_B_Y + BAR_H + 14} L ${X0 + MINE_W} ${BAR_B_Y + BAR_H + 22} L ${X1} ${BAR_B_Y + BAR_H + 22} L ${X1} ${BAR_B_Y + BAR_H + 14}`}
            className="v5-comp-brace"
            fill="none"
          />
          <text
            x={Number(((X0 + MINE_W + X1) / 2).toFixed(2))}
            y={BAR_B_Y + BAR_H + 42}
            className="v5-comp-delta"
          >
            THE DIFFERENCE THE PROCESS BUYS BACK
          </text>
        </svg>
      </div>

      <p className="v5-comp-note">{note}</p>
    </figure>
  );
}
