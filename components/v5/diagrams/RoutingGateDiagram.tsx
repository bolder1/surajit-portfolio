/**
 * RoutingGateDiagram — the Function OS hero artifact.
 *
 * Finance data lands from several source systems, gets normalised, and
 * hits the only decision that matters in a financially sensitive tool:
 * is the automation confident enough to act alone? Confident work
 * executes; everything else is routed to a human. Both paths rejoin in
 * the same audit-ready ledger — which is why "looks right" was never
 * good enough here.
 *
 * Vermilion is spent once, on the gate.
 */

const SOURCES = ["LEDGER", "PAYROLL", "INVOICES", "BANK FEED"];

const SRC_X = 30;
const NORM_X = 258;
const GATE_X = 468;
const OUT_X = 656;
const LEDGER_X = 848;
const MID_Y = 150;

export function RoutingGateDiagram() {
  return (
    <figure className="v5-pcd">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 01 — THE ONLY DECISION THAT MATTERS
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox="0 0 940 300"
          className="v5-pcd-svg"
          role="img"
          aria-label="Finance data from four sources is normalised, then passes a confidence gate: confident work auto-executes, the rest routes to human review, and both rejoin one audit-ready ledger."
        >
          {/* sources */}
          {SOURCES.map((s, i) => {
            const y = 54 + i * 64;
            return (
              <g key={s}>
                <text x={SRC_X} y={y + 4} className="v5-pcd-lane-label">
                  {s}
                </text>
                <path
                  d={`M ${SRC_X + 96} ${y} C ${SRC_X + 150} ${y}, ${NORM_X - 54} ${MID_Y}, ${NORM_X} ${MID_Y}`}
                  className="v5-pcd-curve"
                  fill="none"
                />
              </g>
            );
          })}

          {/* normalise */}
          <rect x={NORM_X} y={MID_Y - 30} width={128} height={60} className="v5-pcd-block" />
          <text x={NORM_X + 16} y={MID_Y - 4} className="v5-pcd-block-label">
            NORMALISE
          </text>
          <text x={NORM_X + 16} y={MID_Y + 16} className="v5-pcd-block-meta">
            ONE SHAPE
          </text>
          <line
            x1={NORM_X + 128}
            y1={MID_Y}
            x2={GATE_X - 44}
            y2={MID_Y}
            className="v5-pcd-rail-quiet"
          />

          {/* the gate — hollow diamond, the site's diverge glyph, at scale */}
          <g>
            <rect
              x={GATE_X - 30}
              y={MID_Y - 30}
              width={60}
              height={60}
              className="v5-pcd-gate"
              transform={`rotate(45 ${GATE_X} ${MID_Y})`}
            />
            <text x={GATE_X} y={MID_Y + 62} className="v5-pcd-note-hot" textAnchor="middle">
              CONFIDENT?
            </text>
          </g>

          {/* yes — auto execute */}
          <path
            d={`M ${GATE_X + 40} ${MID_Y - 10} C ${GATE_X + 96} ${MID_Y - 10}, ${OUT_X - 46} ${74}, ${OUT_X} ${74}`}
            className="v5-pcd-curve"
            fill="none"
          />
          <rect x={OUT_X} y={44} width={150} height={60} className="v5-pcd-block" />
          <text x={OUT_X + 16} y={70} className="v5-pcd-block-label">
            AUTO-EXECUTE
          </text>
          <text x={OUT_X + 16} y={90} className="v5-pcd-block-meta">
            DASHBOARD LIVE
          </text>
          <text x={GATE_X + 54} y={MID_Y - 34} className="v5-pcd-note-quiet">
            YES
          </text>

          {/* no — human review */}
          <path
            d={`M ${GATE_X + 40} ${MID_Y + 10} C ${GATE_X + 96} ${MID_Y + 10}, ${OUT_X - 46} ${226}, ${OUT_X} ${226}`}
            className="v5-pcd-curve"
            fill="none"
          />
          <rect x={OUT_X} y={196} width={150} height={60} className="v5-pcd-block" />
          <text x={OUT_X + 16} y={222} className="v5-pcd-block-label">
            HUMAN REVIEW
          </text>
          <text x={OUT_X + 16} y={242} className="v5-pcd-block-meta">
            ROUTED, NOT DROPPED
          </text>
          <text x={GATE_X + 54} y={MID_Y + 44} className="v5-pcd-note-quiet">
            NO
          </text>

          {/* rejoin */}
          <path
            d={`M ${OUT_X + 150} 74 C ${OUT_X + 186} 74, ${LEDGER_X - 20} ${MID_Y}, ${LEDGER_X} ${MID_Y}`}
            className="v5-pcd-curve"
            fill="none"
          />
          <path
            d={`M ${OUT_X + 150} 226 C ${OUT_X + 186} 226, ${LEDGER_X - 20} ${MID_Y}, ${LEDGER_X} ${MID_Y}`}
            className="v5-pcd-curve"
            fill="none"
          />
          <line x1={LEDGER_X} y1={MID_Y} x2={926} y2={MID_Y} className="v5-pcd-rail-quiet" />
          <circle cx={926} cy={MID_Y} r={6} className="v5-pcd-terminal" />
          <text x={LEDGER_X - 6} y={MID_Y - 22} className="v5-pcd-note">
            ONE LEDGER
          </text>
          <text x={LEDGER_X - 6} y={MID_Y + 32} className="v5-pcd-note-quiet">
            AUDIT-READY
          </text>
        </svg>
      </div>
    </figure>
  );
}
