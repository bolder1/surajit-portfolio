"use client";

import { useEffect, useRef } from "react";

/**
 * §02 LedgerV2 — "how fast, exactly?" as a pinned sideways scroll.
 *
 * The section is a 340vh runway; the stage inside it sticks for the whole
 * runway and the surplus scroll is converted into horizontal travel on the
 * card track. Cards also drift vertically at three different rates, so the
 * row has depth instead of sliding as one rigid strip.
 *
 * Below 700px wide (or on a short viewport) the pin is dropped entirely and
 * the track becomes a native snap-scroller. Hijacked scroll on a phone is a
 * worse experience than the effect is worth.
 */

type Run = {
  n: string;
  kind: string;
  name: string;
  /** what the prototype had to survive — one line, not a paragraph */
  hard: string;
  typical: string;
  actual: string;
  /** how much of the typical timeline was left on the table, 0..1 */
  saved: number;
  savedLabel: string;
  href: string;
};

/* Each card used to carry a paragraph nobody was going to read at speed.
   What survives is the only thing that differentiates the run: the hard
   part the prototype had to actually solve. Everything else is numbers. */
const RUNS: Run[] = [
  {
    n: "01",
    kind: "Identity · AD tooling",
    name: "Active Directory console",
    hard: "A scope, not a spec.",
    typical: "3 weeks",
    actual: "5 days",
    saved: 0.76,
    savedLabel: "76% back",
    href: "/cases/ad-tools",
  },
  {
    n: "02",
    kind: "Security · analyst console",
    name: "ITDR investigation",
    hard: "Three signal sources, out of order.",
    typical: "6 weeks",
    actual: "9 days",
    saved: 0.79,
    savedLabel: "79% back",
    href: "/process/itdr",
  },
  {
    n: "03",
    kind: "Compliance · DPDP Act",
    name: "Deadline-first compliance",
    hard: "A statutory clock, and an audit trail.",
    typical: "5 weeks",
    actual: "8 days",
    saved: 0.77,
    savedLabel: "77% back",
    href: "/process/dpdp-compliance",
  },
  {
    n: "04",
    kind: "Internal · finance ops",
    name: "Function OS",
    hard: "Money. It has to be right.",
    typical: "11 weeks",
    actual: "17 days",
    saved: 0.78,
    savedLabel: "78% back",
    href: "/process/function-os",
  },
];

export function LedgerV2() {
  const sceneRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!scene || !pin || !track || !bar) return;

    const cards = Array.from(track.children) as HTMLElement[];
    let frame = 0;

    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const p = runway > 0 ? Math.min(1, Math.max(0, -rect.top / runway)) : 0;

      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.setProperty("--lx", `${(-p * travel).toFixed(1)}px`);
      bar.style.setProperty("--lp", p.toFixed(4));

      // Three depth lanes: 0, -1, +1 drift, so the row breathes.
      cards.forEach((c, i) => {
        const lane = i % 3;
        const amp = lane === 0 ? 0 : lane === 1 ? -26 : 18;
        c.style.setProperty("--py", (amp * (0.35 + p * 0.65)).toFixed(1));
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

  // Spotlight border: each card tracks the pointer inside its own box.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".v2-run");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    track.addEventListener("pointermove", onMove, { passive: true });
    return () => track.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section ref={sceneRef} id="v2-speed" className="v2-ledger" aria-labelledby="v2-ledger-h">
      <div className="v2-ledger-pin" ref={pinRef}>
        <div className="v2-wrap">
          <div className="v2-ledger-head">
            <div>
              <p className="v2-eyebrow">
                <b>03</b> The runs
              </p>
              {/* "How fast, exactly." was a question, not a claim — it made
                  the reader do the work of finding the answer further down.
                  The headline now IS the answer. */}
              <h2 id="v2-ledger-h" className="v2-ledger-title">
                Quoted in weeks. <em>Shipped in days.</em>
              </h2>
            </div>
            <p className="v2-ledger-note">
              Four real runs. Quoted against actual.
            </p>
          </div>
          <div className="v2-ledger-bar" ref={barRef}>
            <i aria-hidden />
          </div>
        </div>

        <div className="v2-ledger-track" ref={trackRef}>
          {RUNS.map((r) => (
            <article className="v2-run" key={r.n}>
              <div className="v2-run-top">
                <span className="v2-run-idx">RUN {r.n}</span>
                <span className="v2-run-kind">{r.kind}</span>
              </div>
              <h3 className="v2-run-name">{r.name}</h3>
              <p className="v2-run-hard">{r.hard}</p>

              <div className="v2-run-clock">
                <div>
                  <span className="k">Typically quoted</span>
                  <span className="v">{r.typical}</span>
                </div>
                <div className="is-actual">
                  <span className="k">Actual</span>
                  <span className="v">{r.actual}</span>
                </div>
              </div>

              <div
                className="v2-run-meter"
                role="img"
                aria-label={`${r.savedLabel} versus the typical timeline`}
              >
                <i style={{ "--w": `${Math.round(r.saved * 100)}%` } as React.CSSProperties} />
              </div>
              <p className="v2-run-meter-lbl">
                <b>{r.savedLabel}</b>
              </p>
            </article>
          ))}

          {/* The old summary card held a five-line explanation of WHY the
              compression happens. That belongs on a poster where it is the
              only thing on screen, not as a wall of text at the end of a
              sideways scroll. What is left is the one sentence and the door. */}
          <article className="v2-run is-sum">
            <div className="v2-run-top">
              <span className="v2-run-idx">SUMMARY</span>
            </div>
            <h3 className="v2-run-name">
              Speed is the
              <br />
              by-product.
            </h3>
            <p className="v2-run-hard">
              The prototype is the artefact everything else is derived from.
            </p>
            <a href="#v2-process" className="v2-run-sum-cta">
              See the loop
              <span aria-hidden>→</span>
            </a>
          </article>
        </div>

        <p className="v2-ledger-hint">
          <i aria-hidden />
          scroll sideways
        </p>
      </div>
    </section>
  );
}
