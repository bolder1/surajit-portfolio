"use client";

import { useEffect, useRef, useState } from "react";

/**
 * §03 MetricsV2 — the numbers, drawn.
 *
 * This section exists because the page was asking people to READ its
 * argument. Nobody reads a portfolio; they scroll, look, and decide. So
 * every claim that used to be a sentence is a mark here: a filled waffle,
 * a pair of bars, a stack of dots.
 *
 * Colour rules, strictly:
 *   filled / measured   white
 *   remainder / ground  #2b2b2b
 *   green               ONLY on hover, and only on the card you are
 *                       pointing at. At rest the whole section is
 *                       black-and-white, which is also why it survives
 *                       being screenshotted into a deck.
 *
 * Every figure here is one already stated elsewhere on the page, so there
 * is nothing to reconcile and nothing invented.
 */

/** 100 cells; `pct` of them read as filled. Deterministic, SSR-safe. */
const WAFFLE = Array.from({ length: 100 }, (_, i) => i);

type Card = {
  id: string;
  value: string;
  unit?: string;
  label: string;
  sub: string;
  figure: "matrix" | "bars" | "stack" | "ring";
};

const CARDS: Card[] = [
  {
    id: "variants",
    value: "1,296",
    label: "Button variants",
    sub: "from 22 mapped values, five axes",
    figure: "matrix",
  },
  {
    id: "days",
    value: "5",
    unit: "days",
    label: "Brief to clickable build",
    sub: "against three weeks quoted",
    figure: "bars",
  },
  {
    id: "shipped",
    value: "12",
    unit: "+",
    label: "Enterprise products shipped",
    sub: "identity, security, compliance, finance",
    figure: "stack",
  },
  {
    id: "stations",
    value: "8",
    label: "Stations in the loop",
    sub: "three are judgement, five are execution",
    figure: "ring",
  },
];

/* ── figures ───────────────────────────────────────────── */

/* Every figure runs the FULL width of its card. Tucked into a corner at
   80px they read as decorative marks rather than charts, which defeats the
   point of putting a chart there. */

function MatrixFig() {
  // 26 x 5 = 130 cells standing in for the variant grid.
  return (
    <div className="v2-mx-fig v2-mx-matrix" aria-hidden>
      {Array.from({ length: 130 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

function BarsFig() {
  // Quoted against actual, to scale: 21 days versus 5. Horizontal, because
  // a duration is a length and reads faster drawn as one.
  return (
    <div className="v2-mx-fig v2-mx-bars" aria-hidden>
      <span style={{ "--w": "100%" } as React.CSSProperties} data-ghost="1" />
      <span style={{ "--w": "24%" } as React.CSSProperties} />
    </div>
  );
}

function StackFig() {
  // Twelve dots, all filled — the figure is "12+", so the row is the count.
  return (
    <div className="v2-mx-fig v2-mx-stack" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} />
      ))}
      <b />
    </div>
  );
}

function RingFig() {
  // Eight segments on a track. The first three are judgement (solid), the
  // remaining five are model execution (hollow). Drawn as a bar rather than
  // a ring: at this size a ring's ticks collapse into an asterisk.
  return (
    <div className="v2-mx-fig v2-mx-seg" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <i key={i} data-on={i < 3 ? "1" : "0"} />
      ))}
    </div>
  );
}

const FIGURES = {
  matrix: MatrixFig,
  bars: BarsFig,
  stack: StackFig,
  ring: RingFig,
};

/* ── section ───────────────────────────────────────────── */

export function MetricsV2() {
  const waffleRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  // The waffle fills once, when it arrives. It counts up rather than
  // appearing, because the count IS the point being made.
  useEffect(() => {
    const el = waffleRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(78);
      return;
    }

    let frame = 0;
    let start = 0;
    const run = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / 900);
      // ease-out cubic
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(e * 78));
      if (p < 1) frame = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          frame = requestAnimationFrame(run);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="v2-numbers" className="v2-mx" aria-labelledby="v2-mx-h">
      <div className="v2-wrap">
        <header className="v2-mx-head">
          <p className="v2-eyebrow">
            <b>02</b> The numbers
          </p>
          <h2 id="v2-mx-h" className="v2-mx-title v2-dsp v2-dsp-tight">
            What the speed <em>actually buys.</em>
          </h2>
        </header>

        <div className="v2-mx-grid">
          {/* ── the lead figure ── */}
          <figure className="v2-mx-lead" ref={waffleRef}>
            <figcaption>
              <p className="v2-mx-lead-n v2-num">
                {shown}
                <span>%</span>
              </p>
              <p className="v2-mx-lead-lbl">
                of the quoted calendar
                <b>handed back</b>
              </p>
              <p className="v2-mx-lead-sub">
                Median across four runs. Each was quoted in weeks and
                delivered in days, as a working build.
              </p>
            </figcaption>

            <div
              className="v2-mx-waffle"
              role="img"
              aria-label="78 of 100 cells filled: 78 percent of the quoted calendar handed back"
            >
              {WAFFLE.map((i) => (
                <i key={i} data-on={i < shown ? "1" : "0"} />
              ))}
            </div>
          </figure>

          {/* ── the abstract cards ── */}
          {CARDS.map((c) => {
            const Fig = FIGURES[c.figure];
            return (
              <article className="v2-mx-card" key={c.id}>
                <p className="v2-mx-card-n v2-num">
                  {c.value}
                  {c.unit && <span>{c.unit}</span>}
                </p>
                <Fig />
                <div className="v2-mx-card-foot">
                  <p className="v2-mx-card-lbl">{c.label}</p>
                  <p className="v2-mx-card-sub">{c.sub}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
