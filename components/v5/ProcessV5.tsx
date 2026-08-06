"use client";

import { useEffect, useRef } from "react";

/**
 * §A ProcessV5 — "Pixora"-style pinned process section.
 *
 * Video + heading pin to the viewport while step cards slide up from below
 * and pile on top of one another on the right — each new card lands in
 * front, the earlier ones peek out behind via their alternating rotation.
 * Driven by scroll-progress 0→1 over a runway of (steps + 1) × 100vh.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const STEPS = [
  { n: "01", t1: "Discover", t2: "& frame", body: "Stakeholder interviews, JTBD, and the constraints that actually bind — before a single pixel.", color: "#6a1518" },
  { n: "02", t1: "Research", t2: "& test", body: "User interviews, usability testing, journey mapping — evidence over opinion, the whole way through.", color: "#0e504a" },
  { n: "03", t1: "Define", t2: "the system", body: "Flows, IA, and the primitives. Decide what to ship and, harder, what not to.", color: "#26336e" },
  { n: "04", t1: "Orchestrate", t2: "with AI", body: "Claude + Figma Make AI chained into a repeatable workflow — variants in hours, the taste stays human.", color: "#4a2370" },
  { n: "05", t1: "Design", t2: "& refine", body: "High-fidelity, production-ready screens — tokens, states, edge cases, the audit trail.", color: "#8f3d12" },
  { n: "06", t1: "Deliver", t2: "& support", body: "Spec that survives implementation, handoff that holds, iteration once it meets real use.", color: "#14543a" },
];

export function ProcessV5() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stack = stackRef.current;
    if (!section || !pin || !stack) return;

    const cards = Array.from(stack.children) as HTMLElement[];
    const n = cards.length;
    let frame = 0;

    const compute = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const runway = rect.height - vh;
      const p = runway > 0 ? clamp(-rect.top / runway, 0, 1) : 0;

      const railH = pin.clientHeight;
      const cardH = cards[0] ? cards[0].offsetHeight : 0;
      const start = railH * 0.92 + cardH; // fully below the rail

      cards.forEach((c, i) => {
        const prog = easeOut(clamp(p * n - i, 0, 1)); // card i slides in over segment i
        const ty = (1 - prog) * start;
        c.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      });
    };

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(compute); };
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
    <section
      className="v5-pxstep"
      ref={sectionRef}
      aria-labelledby="v5-pxstep-title"
      style={{ ["--steps"]: STEPS.length } as React.CSSProperties}
    >
      <div className="v5-pxstep-pin" ref={pinRef}>
        <div className="v5-pxstep-intro">
          <p className="v5-pxstep-eyebrow">/ how I work</p>
          <h2 id="v5-pxstep-title" className="v5-pxstep-title">
            Six steps. <em>None of them optional.</em>
          </h2>
          <p className="v5-pxstep-lead">Research-led, decision-first, AI-native.</p>
        </div>

        <div className="v5-pxstep-rail">
          <div className="v5-pxstep-stack" ref={stackRef}>
            {STEPS.map((s, i) => (
              <article
                className="v5-pxstep-card"
                key={s.n}
                style={{
                  ["--rot"]: i % 2 === 0 ? "-5deg" : "5deg",
                  background: s.color,
                  zIndex: i + 1,
                } as React.CSSProperties}
              >
                <div className="top">
                  <span className="badge"><span>Step</span></span>
                  <div className="rightcol">
                    <span className="num">{s.n}</span>
                    <p className="decs">{s.body}</p>
                  </div>
                </div>
                <h4 className="title">{s.t1}<br />{s.t2}</h4>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
