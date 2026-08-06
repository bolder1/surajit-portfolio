"use client";

import { useState } from "react";

/**
 * PosterV2 — the interstitial. One statement, one object, nothing else.
 *
 * These sit BETWEEN the dense sections. Their job is pacing: after a grid
 * of numbers you get a full stop, a held breath, and a single sentence you
 * cannot help but read because there is nothing else on the screen. Without
 * them the page is eight data sections in a row and every one of them
 * arrives at the same volume.
 *
 * The object is a real keycap, not a picture of one: extruded in CSS, lit
 * from the top-left like everything else on the page, and pressable. It is
 * the one place the brand green is allowed to take a whole surface, because
 * it only does so while your finger is down — which is exactly what an
 * interaction colour is for.
 */

export function PosterV2({
  id,
  eyebrow,
  lead,
  emphasis,
  cap,
  note,
}: {
  id: string;
  eyebrow: string;
  /** the quiet half — set in grey */
  lead: string;
  /** the loud half — set in white, and what the object refers to */
  emphasis: string;
  /** legend on the keycap */
  cap: string;
  note: string;
}) {
  const [down, setDown] = useState(false);

  return (
    <section className="v2-poster" id={id} aria-labelledby={`${id}-h`}>
      <div className="v2-wrap">
        <p className="v2-poster-eyebrow v2-mono">{eyebrow}</p>

        <h2 id={`${id}-h`} className="v2-poster-h v2-dsp v2-dsp-tight">
          {lead} <em>{emphasis}</em>
        </h2>

        <div
          className={`v2-cap${down ? " is-down" : ""}`}
          onPointerDown={() => setDown(true)}
          onPointerUp={() => setDown(false)}
          onPointerLeave={() => setDown(false)}
          aria-hidden
        >
          <span className="v2-cap-side" />
          <span className="v2-cap-top">{cap}</span>
        </div>

        <p className="v2-poster-note">{note}</p>
      </div>
    </section>
  );
}
