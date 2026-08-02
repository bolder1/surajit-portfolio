import type { Persona } from "@/lib/processCases";

/**
 * PersonaLedgerDiagram — several audiences, deliberately NOT a card grid.
 *
 * Five equal cards would say these people are interchangeable, which is the
 * opposite of the argument: they want contradictory things, and the system's
 * shape is the compromise. So each person is a ledger row — quote promoted to
 * display italic, needs/gets as a two-column reading, and a hanging `risk`
 * line naming what breaks if you serve only them. The risk line is the one
 * most persona work leaves out and the only one that carries an argument.
 */
export function PersonaLedgerDiagram({ people }: { people: Persona[] }) {
  return (
    <figure className="v5-pcd v5-plg">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 02 — THE ROSTER, AND WHAT EACH ONE WOULD BREAK
      </figcaption>

      <ol className="v5-plg-list">
        {people.map((p, i) => (
          <li className="v5-plg-row" key={p.role}>
            <span className="v5-plg-n">{String(i + 1).padStart(2, "0")}</span>

            <div className="v5-plg-body">
              <h4 className="v5-plg-role">{p.role}</h4>
              <p className="v5-plg-ctx">{p.context}</p>

              <blockquote className="v5-plg-says">{p.says}</blockquote>

              <dl className="v5-plg-pair">
                <div>
                  <dt>NEEDS</dt>
                  <dd>{p.needs}</dd>
                </div>
                <div>
                  <dt>GETS</dt>
                  <dd>{p.gets}</dd>
                </div>
              </dl>

              <p className="v5-plg-risk">{p.risk}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
