"use client";

import { useState } from "react";
import { BUTTON } from "@/lib/designSystem/library";
import { M } from "@/lib/designSystem/metrics";

/**
 * VariantMatrix — Button's 1,470 variants, laid out so the shape of the
 * decision is visible.
 *
 * The grid is Intent × Semantics. Every cell would hold the same 64 variants
 * (4 states × 4 types × 4 sizes), so an empty cell is not a gap in coverage,
 * it is a decision — and the two cells that are *almost* full are the two real
 * holes the audit turned up. Publishing the difference between "not drawn" and
 * "not wanted" is the only thing that stops the next person filling it in.
 */

const CELL = 64; // states × types × sizes, per Intent × Semantics cell

const INTENTS = BUTTON.axes[1].values;
const SEMANTICS = BUTTON.axes[2].values;

/** Which cells were removed by decision. Mirrors BUTTON.removed.rule. */
const REMOVED_SEMANTICS = new Set(["Warning", "Success", "Error", "Netural", "Info"]);
const isRemoved = (intent: string, semantic: string) =>
  intent === "Tercery" && REMOVED_SEMANTICS.has(semantic);

/** The two genuine holes, from BUTTON.gaps. */
const GAPS: Record<string, number> = {
  "Tercery|Default": 1,
  "Tercery|White": 1,
};

type Cell = {
  intent: string;
  semantic: string;
  present: number;
  state: "full" | "removed" | "holed";
};

const CELLS: Cell[] = INTENTS.flatMap((intent) =>
  SEMANTICS.map((semantic) => {
    if (isRemoved(intent, semantic))
      return { intent, semantic, present: 0, state: "removed" as const };
    const missing = GAPS[`${intent}|${semantic}`] ?? 0;
    return {
      intent,
      semantic,
      present: CELL - missing,
      state: missing ? ("holed" as const) : ("full" as const),
    };
  })
);

export function VariantMatrix() {
  const [sel, setSel] = useState<Cell | null>(null);
  const shown = sel ?? CELLS.find((c) => c.state === "holed")!;

  return (
    <div className="ds-matrix">
      <div className="ds-matrix-axes">
        {BUTTON.axes.map((a) => (
          <div key={a.name} className="ds-axis">
            <span className="ds-axis-k">{a.name}</span>
            <span className="ds-axis-v">
              {a.values.map((v) => (
                <i key={v}>{v}</i>
              ))}
            </span>
            <span className="ds-axis-n">{a.values.length}</span>
          </div>
        ))}
        <div className="ds-axis is-not">
          <span className="ds-axis-k">Brand · Appearance</span>
          <span className="ds-axis-v">
            <i className="is-off">not a variant</i>
          </span>
          <span className="ds-axis-n">0</span>
        </div>
      </div>

      <p className="ds-matrix-caption">
        {BUTTON.notAnAxis.why}
      </p>

      <div className="ds-matrix-grid-wrap">
        <table className="ds-matrix-grid">
          <caption className="v5-sr">
            Button variants published, by intent and semantics. Each cell holds
            up to {CELL} variants.
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="v5-sr">Intent</span>
              </th>
              {SEMANTICS.map((s) => (
                <th key={s} scope="col">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INTENTS.map((intent) => (
              <tr key={intent}>
                <th scope="row">{intent}</th>
                {SEMANTICS.map((semantic) => {
                  const c = CELLS.find(
                    (x) => x.intent === intent && x.semantic === semantic
                  )!;
                  const on = shown.intent === intent && shown.semantic === semantic;
                  return (
                    <td key={semantic}>
                      <button
                        type="button"
                        className={`ds-cell is-${c.state}${on ? " is-on" : ""}`}
                        onMouseEnter={() => setSel(c)}
                        onFocus={() => setSel(c)}
                        onClick={() => setSel(c)}
                        aria-pressed={on}
                      >
                        <span className="v5-sr">
                          {intent} {semantic}:{" "}
                        </span>
                        {c.state === "removed" ? "—" : c.present}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ds-matrix-read" aria-live="polite">
        <p className="ds-matrix-read-k">
          {shown.intent} · {shown.semantic}
        </p>
        <p className="ds-matrix-read-v">
          {shown.state === "removed" ? (
            <>
              <b>Removed by decision.</b> {BUTTON.removed.why}
            </>
          ) : shown.state === "holed" ? (
            <>
              <b>
                {shown.present} of {CELL} — one missing.
              </b>{" "}
              A real hole, not a decision. Both of the library&rsquo;s two gaps
              land on <code>Disabled · Tercery · Sm</code>, which is what a
              missed pass through one size looks like.
            </>
          ) : (
            <>
              <b>
                {shown.present} of {CELL}.
              </b>{" "}
              Complete: four interaction
              states × four types × four sizes, every one of which resolves
              across both brands and both appearances without a further
              variant.
            </>
          )}
        </p>
      </div>

      <ul className="ds-matrix-legend">
        <li>
          <i className="ds-sw is-full" aria-hidden /> published · {M.buttonPublished}
        </li>
        <li>
          <i className="ds-sw is-removed" aria-hidden /> removed by decision ·{" "}
          {M.buttonRemoved}
        </li>
        <li>
          <i className="ds-sw is-holed" aria-hidden /> genuine gap · {M.buttonGaps}
        </li>
        <li className="ds-matrix-legend-sum">
          {M.buttonPublished} + {M.buttonRemoved} + {M.buttonGaps} ={" "}
          {M.buttonCrossProduct}
        </li>
      </ul>
    </div>
  );
}
