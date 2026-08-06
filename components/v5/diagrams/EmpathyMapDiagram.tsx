import type { EmpathyMap } from "@/lib/processCases";

/**
 * EmpathyMapDiagram — the operator's testimony, as a ledger.
 *
 * Deliberately NOT a 2x2: four equal cells is the identical-card-grid
 * pattern the design system bans, and it flattens the most important
 * material (what the person actually said) into the same weight as
 * everything else.
 *
 * Instead: verbatim statements are promoted to a full-width testimony
 * block in display italic with hanging punctuation, and the observed
 * material (thinks / does / feels) runs beneath as unequal ledger rows.
 */

const OBSERVED = [
  { key: "thinks", label: "THINKS" },
  { key: "does", label: "DOES" },
  { key: "feels", label: "FEELS" },
] as const;

export function EmpathyMapDiagram({ map }: { map: EmpathyMap }) {
  return (
    <figure className="v5-pcd v5-emap">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 02 — TESTIMONY
      </figcaption>

      <div className="v5-emap-sheet">
        <span className="v5-emap-reg tl" aria-hidden />
        <span className="v5-emap-reg tr" aria-hidden />
        <span className="v5-emap-reg bl" aria-hidden />
        <span className="v5-emap-reg br" aria-hidden />

        <p className="v5-emap-who">{map.persona}</p>

        <div className="v5-emap-said">
          {map.says.map((line, i) => (
            <blockquote key={line}>
              <span className="v5-emap-stmt">
                STATEMENT {String(i + 1).padStart(2, "0")}
              </span>
              {line}
            </blockquote>
          ))}
        </div>

        <dl className="v5-emap-observed">
          {OBSERVED.map((o) => (
            <div key={o.key}>
              <dt>{o.label}</dt>
              <dd>
                {map[o.key].map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  );
}
