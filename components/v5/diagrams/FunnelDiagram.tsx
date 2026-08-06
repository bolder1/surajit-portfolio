import type { FunnelStage } from "@/lib/processCases";

/**
 * FunnelDiagram — how the work turned into revenue.
 *
 * A stepped descent: each stage is a bar narrowing toward the close, so
 * the shape carries the argument (many looks, fewer buyers, one shipped
 * product) without inventing numbers we don't have. The final stage —
 * the revenue moment — is the only one in vermilion.
 *
 * Widths are a fixed ramp, not data-derived, and are labelled as a
 * sequence rather than a measurement.
 */

const ROW_H = 96;
const PAD = 8;

export function FunnelDiagram({ stages }: { stages: FunnelStage[] }) {
  const n = stages.length;
  const height = n * ROW_H + PAD;

  return (
    <figure className="v5-pcd v5-fun">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 04 — WHAT THE WORK EARNED
      </figcaption>

      <div className="v5-fun-rows" style={{ minHeight: height }}>
        {stages.map((s, i) => {
          // 100% -> ~46%, stepped evenly; the close is the narrowest bar.
          const w = 100 - (i * 54) / Math.max(1, n - 1);
          const last = i === n - 1;
          return (
            <div className="v5-fun-row" key={s.label}>
              <span className="v5-fun-n">{String(i + 1).padStart(2, "0")}</span>
              <div
                className={`v5-fun-bar ${last ? "is-close" : ""}`}
                style={{ width: `${w.toFixed(1)}%` }}
              >
                <span className="v5-fun-tick tl" aria-hidden />
                <p className="v5-fun-label">{s.label}</p>
                <p className="v5-fun-note">{s.note}</p>
              </div>
              {!last && <span className="v5-fun-drop" aria-hidden />}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
