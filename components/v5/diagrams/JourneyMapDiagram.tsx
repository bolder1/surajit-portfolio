import type { JourneyStage } from "@/lib/processCases";

/**
 * JourneyMapDiagram — emotion-over-time line chart.
 *
 * SVG polyline across fixed stage columns; only the peak point fills
 * vermilion (the one thing the eye should land on), everything else
 * stays mono line-work. No trig, all linear interpolation — SSR-safe.
 */

const W = 160; // px per stage column
const H = 120;
const MARGIN = 16;

function yFor(emotion: JourneyStage["emotion"]): number {
  const t = (emotion + 2) / 4; // 0..1
  return Number((H - MARGIN - t * (H - MARGIN * 2)).toFixed(2));
}

export function JourneyMapDiagram({
  persona,
  stages,
}: {
  persona: string;
  stages: JourneyStage[];
}) {
  const width = (stages.length - 1) * W + MARGIN * 2;
  const points = stages.map((s, i) => ({
    x: Number((MARGIN + i * W).toFixed(2)),
    y: yFor(s.emotion),
    stage: s,
  }));
  const peakIndex = points.reduce(
    (best, p, i) => (p.y < points[best].y ? i : best),
    0
  );
  const path = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="v5-pc-diagram v5-jmap">
      <p className="v5-pc-diagram-label">
        <span className="v5-pc-diagram-glyph" aria-hidden />
        JOURNEY MAP — {persona.toUpperCase()}
      </p>
      <div className="v5-jmap-scroll">
        <svg
          viewBox={`0 0 ${width} ${H}`}
          width={width}
          height={H}
          className="v5-jmap-svg"
          role="img"
          aria-label={`Emotional journey for ${persona}, from ${stages[0].stage} to ${stages[stages.length - 1].stage}`}
        >
          <line
            x1={MARGIN}
            y1={H / 2}
            x2={width - MARGIN}
            y2={H / 2}
            className="v5-jmap-baseline"
          />
          <polyline points={path} className="v5-jmap-line" fill="none" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === peakIndex ? 5.5 : 3.5}
              className={i === peakIndex ? "v5-jmap-dot is-peak" : "v5-jmap-dot"}
            />
          ))}
        </svg>
        <div className="v5-jmap-labels" style={{ width }}>
          {stages.map((s, i) => (
            <div className="v5-jmap-col" key={s.stage} style={{ width: W }}>
              <p className="v5-jmap-stage">
                {String(i + 1).padStart(2, "0")} / {s.stage}
              </p>
              <p className="v5-jmap-note">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
