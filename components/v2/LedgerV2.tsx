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
  body: string;
  typical: string;
  actual: string;
  /** how much of the typical timeline was left on the table, 0..1 */
  saved: number;
  savedLabel: string;
  href: string;
};

const RUNS: Run[] = [
  {
    n: "01",
    kind: "Identity · AD tooling",
    name: "Active Directory console",
    body: "A stakeholder walked in with a scope, not a spec. Five days later they clicked through the real multi-frame flow, not a deck about it.",
    typical: "3 weeks",
    actual: "5 days",
    saved: 0.76,
    savedLabel: "76% of the calendar back",
    href: "/cases/ad-tools",
  },
  {
    n: "02",
    kind: "Security · analyst console",
    name: "ITDR investigation",
    body: "Built the triage queue and investigation timeline against representative multi-source signal, so the prototype had to solve the real ordering problem. Demoed live to analysts at a security event.",
    typical: "6 weeks",
    actual: "9 days",
    saved: 0.79,
    savedLabel: "79% of the calendar back",
    href: "/process/itdr",
  },
  {
    n: "03",
    kind: "Compliance · DPDP Act",
    name: "Deadline-first compliance",
    body: "Read the Act's timelines directly, wrote my own PRD, then shipped a working consent ledger and audit trail privacy officers could watch update in real time.",
    typical: "5 weeks",
    actual: "8 days",
    saved: 0.77,
    savedLabel: "77% of the calendar back",
    href: "/process/dpdp-compliance",
  },
  {
    n: "04",
    kind: "Internal · finance ops",
    name: "Function OS",
    body: "One surface for dashboards, workflows and automations, orchestrated with Claude Code. It shipped as a tool the finance team actually runs on, not a pitch for one.",
    typical: "11 weeks",
    actual: "17 days",
    saved: 0.78,
    savedLabel: "78% of the calendar back",
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
                <b>02</b> The velocity ledger
              </p>
              <h2 id="v2-ledger-h" className="v2-ledger-title">
                How fast, <em>exactly.</em>
              </h2>
            </div>
            <p className="v2-ledger-note">
              Four real runs. Left column is what the same scope is normally
              quoted at. Right column is what it took. Nothing here was a
              mockup at the end of it.
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
              <p className="v2-run-body">{r.body}</p>

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

          <article className="v2-run is-sum">
            <div className="v2-run-top">
              <span className="v2-run-idx">SUMMARY</span>
              <span className="v2-run-kind">Why it holds up</span>
            </div>
            <h3 className="v2-run-name">
              Speed is the
              <br />
              by-product.
            </h3>
            <p className="v2-run-body">
              The compression does not come from working longer hours or
              skipping research. It comes from one thing: the prototype is the
              artefact everything else is derived from. Research feeds it,
              tests run against it, Figma is generated from it, and engineering
              gets it as a reference implementation.
            </p>
            <a href="#v2-process" className="v2-run-sum-cta">
              See how the process runs
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
