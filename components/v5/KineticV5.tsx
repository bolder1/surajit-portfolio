"use client";

import { useEffect, useRef } from "react";

/**
 * §1.5 KineticV5 — scroll-driven typographic reveal.
 *
 * A bold statement whose words fill from dim → white left-to-right as the
 * section scrolls through the viewport. No clay; the interaction IS the
 * type lighting up as you move. Per-word opacity is computed in JS (a
 * nested clamp() calc proved unreliable across engines).
 */

const WORDS = ["I", "make", "complex", "software", "feel", "simple."];
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function KineticV5() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.9;
      const end = vh * 0.35;
      const mid = rect.top + rect.height / 2;
      const kp = clamp01((start - mid) / (start - end));
      const n = WORDS.length;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const lit = clamp01(kp * (n + 1) - i);
        el.style.opacity = (0.16 + 0.84 * lit).toFixed(3);
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
    <section className="v5-kinetic" ref={sectionRef} aria-label="What I make">
      <div className="v5-kinetic-inner">
        <p className="v5-kinetic-eyebrow">/ what I actually do</p>
        <h2 className="v5-kinetic-statement" aria-label={WORDS.join(" ")}>
          {WORDS.map((w, i) => (
            <span
              className="v5-kin-word"
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
            >
              {w}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
