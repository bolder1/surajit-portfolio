"use client";

import { useEffect, useRef } from "react";

/**
 * §03 TSectionV2 — the T, drawn by scroll.
 *
 * The T-shaped-skills diagram, built literally. Scroll progress across the
 * section drives one construction sequence:
 *
 *   p 0.00 → 0.26   the crossbar draws left to right
 *   p 0.08 → 0.46   crossbar cells stagger up into it (range: everything AI
 *                   put back in reach)
 *   p 0.34 → 0.62   the stem drops from the crossbar's centre
 *   p 0.46 → 0.94   the two depth blocks connect to the stem and their
 *                   mastery meters fill (depth: product + design systems)
 *
 * A volt token rides the whole path, crossbar then stem, so the figure reads
 * as being drawn rather than faded in. Everything is a CSS custom property
 * written once per frame; no element is animated from JS directly.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** The crossbar: range. Breadth that used to need a second hire.
 *  Each cell is a list, not a sentence — the crossbar's job is to show HOW
 *  MANY things sit on it, and seven sentences fight that. */
const RANGE = [
  { k: "Brand systems", d: "Identity, logo, usage rules" },
  { k: "Data sheets", d: "One-pagers, spec sheets" },
  { k: "Decks", d: "Pitch and launch narrative" },
  { k: "Event branding", d: "Backdrops, standees, signage" },
  { k: "Print", d: "Brochures, folders, pre-flighted" },
  { k: "Merch", d: "Goodies, apparel, vendor files" },
  { k: "Motion", d: "Lottie loops, UI motion specs" },
];

/** The stem: depth. The two things everything else hangs off. */
const DEPTH = [
  {
    n: "01",
    side: "left" as const,
    title: "Product design",
    lead: "Enterprise workflows where being wrong is expensive.",
    points: [
      "IAM, PAM, IGA, UEM, ITDR, compliance",
      "Stakeholder interviews to PRD",
      "Flows, states, edge cases, audit trail",
    ],
    meter: 0.94,
    meterLabel: "12+ products in production",
  },
  {
    n: "02",
    side: "right" as const,
    title: "Design systems",
    lead: "Multi-mapped variable components, not a page of styles.",
    points: [
      "One button set, 1,296 mapped variants",
      "Tokens, modes, semantic layers",
      "Hand-off engineering can use as-is",
    ],
    meter: 0.97,
    meterLabel: "4 systems, 3 of them still in use",
  },
];

export function TSectionV2() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const stage = scene.querySelector<HTMLElement>(".v2-t");
    if (!stage) return;
    const cells = Array.from(scene.querySelectorAll<HTMLElement>(".v2-t-cell"));
    const depths = Array.from(scene.querySelectorAll<HTMLElement>(".v2-t-depth"));
    let frame = 0;

    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const p = runway > 0 ? clamp01(-rect.top / runway) : 0;

      const bar = easeOut(seg(p, 0, 0.26));
      const stem = easeOut(seg(p, 0.34, 0.62));

      stage.style.setProperty("--bar", bar.toFixed(4));
      stage.style.setProperty("--stem", stem.toFixed(4));

      // The token rides the crossbar first, then turns down the stem.
      stage.style.setProperty("--tokx", bar.toFixed(4));
      stage.style.setProperty("--toky", stem.toFixed(4));
      stage.style.setProperty("--tokon", bar > 0.02 && stem < 0.995 ? "1" : "0");

      cells.forEach((c, i) => {
        const a = 0.08 + i * 0.045;
        c.style.setProperty("--r", easeOut(seg(p, a, a + 0.17)).toFixed(4));
      });

      depths.forEach((d, i) => {
        const a = 0.46 + i * 0.14;
        const r = easeOut(seg(p, a, a + 0.2));
        d.style.setProperty("--r", r.toFixed(4));
        d.style.setProperty("--m", easeOut(seg(p, a + 0.08, a + 0.34)).toFixed(4));
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sceneRef} id="v2-range" className="v2-tscene" aria-labelledby="v2-t-h">
      <div className="v2-t-head v2-wrap">
        <p className="v2-eyebrow">
          <b>04</b> The shape of it
        </p>
        <h2 id="v2-t-h" className="v2-t-title">
          Deep on two things.
          <br />
          <em>Dangerous</em> across the rest.
        </h2>
        <p className="v2-prose v2-t-note">
          The crossbar is work I used to hand to a specialist. I ship it
          myself now, at the standard they set.
        </p>
      </div>

      <div className="v2-t">
        {/* ── crossbar: range ─────────────────────────── */}
        <div className="v2-t-bar">
          <p className="v2-t-axis-lbl is-across">
            <span>Range</span> across
          </p>
          <div className="v2-t-rule" aria-hidden />
          <ul className="v2-t-cells">
            {RANGE.map((r) => (
              <li className="v2-t-cell" key={r.k}>
                <span className="v2-t-cell-tick" aria-hidden />
                <span className="v2-t-cell-k">{r.k}</span>
                <span className="v2-t-cell-d">{r.d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── stem: depth ─────────────────────────────── */}
        <div className="v2-t-stem">
          <div className="v2-t-stem-rule" aria-hidden>
            <i className="v2-t-stem-fill" />
            <span className="v2-t-token" />
          </div>
          <div className="v2-t-aside">
            <p className="v2-t-axis-lbl is-down">
              <span>Depth</span> down
            </p>
            <p className="v2-t-aside-note">
              AI put the crossbar back within reach. The stem is the part it
              cannot do for you: knowing which screen the operator needs.
            </p>
          </div>

          {DEPTH.map((d) => (
            <article className={`v2-t-depth is-${d.side}`} key={d.n}>
              <span className="v2-t-connect" aria-hidden />
              <header>
                <span className="v2-t-depth-n">{d.n}</span>
                <h3 className="v2-t-depth-title">{d.title}</h3>
              </header>
              <p className="v2-t-depth-lead">{d.lead}</p>
              <ul className="v2-t-depth-points">
                {d.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div
                className="v2-t-depth-meter"
                style={{ "--full": d.meter } as React.CSSProperties}
                role="img"
                aria-label={`${d.title}: ${d.meterLabel}`}
              >
                <i />
              </div>
              <p className="v2-t-depth-mlbl">{d.meterLabel}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
