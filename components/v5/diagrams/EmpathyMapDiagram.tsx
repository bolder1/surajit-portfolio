import type { EmpathyMap } from "@/lib/processCases";

/**
 * EmpathyMapDiagram — classic four-quadrant Says / Thinks / Does / Feels,
 * styled as the site's printer's-mark card (corner ticks, mono eyebrow).
 */

const QUADRANTS: { key: keyof Pick<EmpathyMap, "says" | "thinks" | "does" | "feels">; label: string }[] = [
  { key: "says", label: "SAYS" },
  { key: "thinks", label: "THINKS" },
  { key: "does", label: "DOES" },
  { key: "feels", label: "FEELS" },
];

export function EmpathyMapDiagram({ map }: { map: EmpathyMap }) {
  return (
    <div className="v5-pc-diagram v5-emap">
      <p className="v5-pc-diagram-label">
        <span className="v5-pc-diagram-glyph" aria-hidden />
        EMPATHY MAP — {map.persona.toUpperCase()}
      </p>
      <div className="v5-emap-grid">
        {QUADRANTS.map((q) => (
          <div className="v5-emap-quad" key={q.key}>
            <span className="v5-emap-tick tl" aria-hidden />
            <span className="v5-emap-tick br" aria-hidden />
            <p className="v5-emap-quad-label">{q.label}</p>
            <ul className="v5-emap-list">
              {map[q.key].map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
