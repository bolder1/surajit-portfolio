"use client";

import { useEffect, useRef } from "react";

/**
 * KineticOutroV5 — the final pinned beat of the page. The section sticks
 * to the viewport across a tall scroll runway; scroll progress reveals the
 * closing statement word-by-word (dim → light). Only once the full line is
 * read does the pin release and the footer comes up.
 */

const WORDS = [
  "You’ve", "seen", "the", "work,", "the", "process,", "the", "way", "I", "think.",
  "What", "you", "can’t", "see", "yet", "is", "what", "we’d", "build", "together.",
];
const ACCENT = new Set(["together."]);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function KineticOutroV5() {
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
      const runway = rect.height - vh;
      const p = runway > 0 ? clamp01(-rect.top / runway) : 0;
      // Reveal across nearly the whole runway; a short 8% settle holds the
      // finished line fully-lit before the pin releases to the footer.
      const rp = clamp01(p / 0.92);
      const n = WORDS.length;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const lit = clamp01(rp * (n + 1) - i);
        el.style.opacity = (0.14 + 0.86 * lit).toFixed(3);
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
    <section className="v5-kinetic-outro" ref={sectionRef} aria-label="Closing statement">
      <div className="v5-outro-pin">
        <div className="v5-outro-wrap">
          <p className="v5-kinetic-eyebrow">/ that&rsquo;s a wrap</p>
          <h2 className="v5-kinetic-statement" aria-label={WORDS.join(" ")}>
            {WORDS.map((w, i) => (
              <span
                className={`v5-kin-word ${ACCENT.has(w) ? "accent" : ""}`}
                key={i}
                ref={(el) => { wordRefs.current[i] = el; }}
              >
                {w}
              </span>
            ))}
          </h2>
          <p className="v5-outro-signoff">
            <a href="#contact">Say hi&nbsp;↓</a>
          </p>
        </div>
      </div>
    </section>
  );
}
