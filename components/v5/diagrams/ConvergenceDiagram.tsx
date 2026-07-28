/**
 * ConvergenceDiagram — the ITDR hero artifact.
 *
 * Three source systems (IAM · EDR · SIEM) each emit events on their own
 * lane, out of order and out of context. They bend into a single rail
 * where the same events resolve into one ordered causal chain.
 *
 * The whole claim of the case — "one timeline instead of three tabs" —
 * argued visually. Line-work only; vermilion carries the merged chain,
 * because that's the one thing the eye should land on.
 *
 * All coordinates are literal (no trig, no randomness) so server and
 * client rasterize identically.
 */

const LANES = [
  { label: "IAM", y: 46, ticks: [96, 168, 300, 372] },
  { label: "EDR", y: 106, ticks: [132, 240, 336] },
  { label: "SIEM", y: 166, ticks: [72, 204, 264, 396] },
];

/** Merged rail: the same events, now sequenced. */
const CHAIN = [604, 646, 688, 730, 772, 814, 856, 898];

const LANE_X0 = 84;
const LANE_X1 = 396;
const BRACE_X = 424;
const MERGE_X = 556;
const RAIL_Y = 240;

export function ConvergenceDiagram() {
  return (
    <figure className="v5-pcd">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 01 — THREE SOURCES, ONE CHAIN
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox="0 0 980 300"
          className="v5-pcd-svg"
          role="img"
          aria-label="Events from IAM, EDR and SIEM converge from three separate lanes into a single ordered timeline."
        >
          {/* source lanes */}
          {LANES.map((lane) => (
            <g key={lane.label}>
              <text x={0} y={lane.y + 4} className="v5-pcd-lane-label">
                {lane.label}
              </text>
              <line
                x1={LANE_X0}
                y1={lane.y}
                x2={LANE_X1}
                y2={lane.y}
                className="v5-pcd-rail-quiet"
              />
              {lane.ticks.map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={lane.y - 7}
                  x2={x}
                  y2={lane.y + 7}
                  className="v5-pcd-tick-quiet"
                />
              ))}
            </g>
          ))}

          {/* brace across the three lane-ends: everything left of here is manual */}
          <path
            d={`M ${BRACE_X - 8} 40 L ${BRACE_X} 40 L ${BRACE_X} 172 L ${BRACE_X - 8} 172`}
            className="v5-pcd-seam"
            fill="none"
          />
          <text x={BRACE_X + 18} y={98} className="v5-pcd-note">
            RECONSTRUCTED BY HAND
          </text>
          <text x={BRACE_X + 18} y={118} className="v5-pcd-note-quiet">
            THREE TABS · ORDER GUESSED
          </text>
          <text x={BRACE_X + 18} y={136} className="v5-pcd-note-quiet">
            CAUSALITY LOST ON THE SWITCH
          </text>

          {/* convergence curves — staggered control points so they stay
              legible as three strands until the merge point */}
          {LANES.map((lane, i) => (
            <path
              key={`c-${lane.label}`}
              d={`M ${LANE_X1} ${lane.y} C ${LANE_X1 + 74 + i * 22} ${lane.y}, ${MERGE_X - 96 + i * 16} ${RAIL_Y}, ${MERGE_X} ${RAIL_Y}`}
              className="v5-pcd-curve"
              fill="none"
            />
          ))}
          <circle cx={MERGE_X} cy={RAIL_Y} r={4} className="v5-pcd-merge" />

          {/* merged rail — the payoff */}
          <line
            x1={MERGE_X}
            y1={RAIL_Y}
            x2={940}
            y2={RAIL_Y}
            className="v5-pcd-rail-hot"
          />
          {CHAIN.map((x, i) => (
            <g key={x}>
              <line
                x1={x}
                y1={RAIL_Y - 11}
                x2={x}
                y2={RAIL_Y + 11}
                className="v5-pcd-tick-hot"
              />
              {i === CHAIN.length - 1 && (
                <circle cx={x} cy={RAIL_Y} r={6} className="v5-pcd-terminal" />
              )}
            </g>
          ))}
          <text x={MERGE_X} y={RAIL_Y + 40} className="v5-pcd-note-hot">
            ONE TIMELINE · CAUSALITY PRESERVED
          </text>
          <text x={940} y={RAIL_Y - 24} className="v5-pcd-note-end">
            RESPONSE
          </text>
        </svg>
      </div>
    </figure>
  );
}
