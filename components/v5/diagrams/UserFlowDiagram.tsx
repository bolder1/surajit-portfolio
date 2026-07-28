import type { UserFlow } from "@/lib/processCases";

/**
 * UserFlowDiagram — what the shipped product actually does.
 *
 * Real SVG with orthogonal connectors and a hollow decision diamond
 * (the site's diverge glyph, at scale). Drawn rather than assembled from
 * CSS boxes, so the branch geometry reads as a system rather than as a
 * list. Vermilion is spent on the gate and the terminal state.
 *
 * Fixed geometry, no measurement — SSR-safe.
 */

const BOX_W = 218;
const BOX_H = 78;
const ROW_Y = 58;
const GAP = 46;
const DIAMOND_R = 44;

/** Greedy wrap to <=3 lines that fit the box at 11px mono (~24 chars). */
function wrap(label: string): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > 24 && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function Box({
  x,
  y,
  label,
  hot,
}: {
  x: number;
  y: number;
  label: string;
  hot?: boolean;
}) {
  const lines = wrap(label);
  // vertically centre the stack inside the box
  const startY = y + BOX_H / 2 - ((lines.length - 1) * 16) / 2 + 4;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        className={hot ? "v5-uf-box is-hot" : "v5-uf-box"}
      />
      {lines.map((l, i) => (
        <text key={l} x={x + 15} y={startY + i * 16} className="v5-uf-label">
          {l}
        </text>
      ))}
    </g>
  );
}

export function UserFlowDiagram({ flow }: { flow: UserFlow }) {
  const steps = flow.before;
  const xs = steps.map((_, i) => 16 + i * (BOX_W + GAP));
  const gateX = 16 + steps.length * (BOX_W + GAP) + DIAMOND_R;
  const gateY = ROW_Y + BOX_H / 2;

  const branchX = gateX + DIAMOND_R + GAP;
  const yesY = 18;
  const noY = 138;
  const finalX = branchX + BOX_W + GAP;
  const finalY = ROW_Y + 110;
  const width = finalX + BOX_W + 24;

  return (
    <figure className="v5-pcd v5-uflow">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 03 — WHAT THE SHIPPED PRODUCT DOES
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox={`0 0 ${width} 300`}
          className="v5-uf-svg"
          role="img"
          aria-label={`Flow: ${steps.map((s) => s.label).join(", then ")}. Decision: ${flow.branch.question} — yes leads to ${flow.branch.yes}, no leads to ${flow.branch.no}. Both end at ${flow.after}.`}
        >
          {/* linear steps */}
          {steps.map((s, i) => (
            <g key={s.label}>
              <Box x={xs[i]} y={ROW_Y} label={s.label} />
              <line
                x1={xs[i] + BOX_W}
                y1={gateY}
                x2={xs[i] + BOX_W + GAP}
                y2={gateY}
                className="v5-uf-link"
              />
              <path
                d={`M ${xs[i] + BOX_W + GAP - 9} ${gateY - 4} L ${xs[i] + BOX_W + GAP} ${gateY} L ${xs[i] + BOX_W + GAP - 9} ${gateY + 4}`}
                className="v5-uf-arrow"
                fill="none"
              />
            </g>
          ))}

          {/* the gate */}
          <rect
            x={gateX - DIAMOND_R * 0.72}
            y={gateY - DIAMOND_R * 0.72}
            width={DIAMOND_R * 1.44}
            height={DIAMOND_R * 1.44}
            className="v5-uf-gate"
            transform={`rotate(45 ${gateX} ${gateY})`}
          />
          {/* label rides above everything — below the diamond it hits the NO
              branch, and just above it hits the YES run */}
          <text x={gateX} y={14} className="v5-uf-gate-label">
            {flow.branch.question}
          </text>

          {/* yes — up */}
          <path
            d={`M ${gateX} ${gateY - DIAMOND_R} L ${gateX} ${yesY + BOX_H / 2} L ${branchX} ${yesY + BOX_H / 2}`}
            className="v5-uf-link"
            fill="none"
          />
          <path
            d={`M ${branchX - 9} ${yesY + BOX_H / 2 - 4} L ${branchX} ${yesY + BOX_H / 2} L ${branchX - 9} ${yesY + BOX_H / 2 + 4}`}
            className="v5-uf-arrow"
            fill="none"
          />
          <text x={gateX + 32} y={yesY + BOX_H / 2 - 9} className="v5-uf-branch is-yes">
            YES
          </text>
          <Box x={branchX} y={yesY} label={flow.branch.yes} />

          {/* no — down */}
          <path
            d={`M ${gateX} ${gateY + DIAMOND_R} L ${gateX} ${noY + BOX_H / 2} L ${branchX} ${noY + BOX_H / 2}`}
            className="v5-uf-link"
            fill="none"
          />
          <path
            d={`M ${branchX - 9} ${noY + BOX_H / 2 - 4} L ${branchX} ${noY + BOX_H / 2} L ${branchX - 9} ${noY + BOX_H / 2 + 4}`}
            className="v5-uf-arrow"
            fill="none"
          />
          <text x={gateX + 32} y={noY + BOX_H / 2 + 18} className="v5-uf-branch">
            NO
          </text>
          <Box x={branchX} y={noY} label={flow.branch.no} />

          {/* rejoin */}
          <path
            d={`M ${branchX + BOX_W} ${yesY + BOX_H / 2} L ${finalX - GAP / 2} ${yesY + BOX_H / 2} L ${finalX - GAP / 2} ${finalY + BOX_H / 2} L ${finalX} ${finalY + BOX_H / 2}`}
            className="v5-uf-link"
            fill="none"
          />
          <path
            d={`M ${branchX + BOX_W} ${noY + BOX_H / 2} L ${finalX - GAP / 2} ${noY + BOX_H / 2} L ${finalX - GAP / 2} ${finalY + BOX_H / 2} L ${finalX} ${finalY + BOX_H / 2}`}
            className="v5-uf-link"
            fill="none"
          />
          <path
            d={`M ${finalX - 9} ${finalY + BOX_H / 2 - 4} L ${finalX} ${finalY + BOX_H / 2} L ${finalX - 9} ${finalY + BOX_H / 2 + 4}`}
            className="v5-uf-arrow"
            fill="none"
          />
          <Box x={finalX} y={finalY} label={flow.after} hot />
        </svg>
      </div>
    </figure>
  );
}
