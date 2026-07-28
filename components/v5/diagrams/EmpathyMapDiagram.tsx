import type { EmpathyMap } from "@/lib/processCases";

/**
 * EmpathyMapDiagram — says / thinks / does / feels, as a printer's-mark
 * card rather than a plain grid. Verbatim quotes (SAYS and THINKS) are
 * set in display italic so the person's voice reads differently from the
 * observed behaviour beneath it.
 */

const QUADRANTS = [
  { key: "says", label: "SAYS", quoted: true },
  { key: "thinks", label: "THINKS", quoted: true },
  { key: "does", label: "DOES", quoted: false },
  { key: "feels", label: "FEELS", quoted: false },
] as const;

export function EmpathyMapDiagram({ map }: { map: EmpathyMap }) {
  return (
    <figure className="v5-pcd v5-emap">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        WHO LIVED IN IT — {map.persona.toUpperCase()}
      </figcaption>

      <div className="v5-emap-grid">
        {QUADRANTS.map((q) => (
          <div className="v5-emap-quad" key={q.key}>
            <span className="v5-emap-tick tl" aria-hidden />
            <span className="v5-emap-tick br" aria-hidden />
            <p className="v5-emap-quad-label">{q.label}</p>
            <ul className="v5-emap-list">
              {map[q.key].map((line) => (
                <li key={line} className={q.quoted ? "is-quote" : undefined}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  );
}
