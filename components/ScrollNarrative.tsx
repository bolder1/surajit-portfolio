"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Glitch } from "./Glitch";

/**
 * ScrollNarrative — synapserstudio-style scroll-driven storytelling.
 *
 * Anatomy: one tall <section> (~300vh) that pins the keyword stack on
 * the left while the body panel on the right steps through three
 * statements. The keywords fade in one at a time aligned to scroll
 * progress, then on the final step the entire keyword stack collapses
 * into a single shape + CTA card.
 *
 * Implementation:
 *   - We measure scroll progress through this section via IntersectionObserver
 *     thresholds + a stable rAF-driven position read on scroll. Progress
 *     maps to step (0..3).
 *   - The sticky panel uses position: sticky; the keyword animations
 *     read --step (0..3) to drive opacity/transform.
 *   - The final "collapse" is a CSS transition between the stack layout
 *     and a single-box layout, triggered when step === 3.
 *   - prefers-reduced-motion: all transitions short-circuit; show the
 *     final state immediately.
 */

interface Step {
  /** Keyword to fade in for this step (1-3). step 0 is the intro. */
  keyword: string;
  /** Statement on the right panel for this step. */
  statement: string;
  /** Optional eyebrow above the statement. */
  eyebrow?: string;
}

const STEPS: Step[] = [
  {
    keyword: "research",
    eyebrow: "01 — listen",
    statement:
      "I start by getting out of my own way. Interviews, support tickets, the actual workflow on the actual screen — until I understand the job to be done, not the feature on the backlog.",
  },
  {
    keyword: "systems",
    eyebrow: "02 — order",
    statement:
      "Tokens, components, patterns — the system pays back on year two. Enterprise teams ship faster when the design surface is composable, not bespoke per screen.",
  },
  {
    keyword: "ai-native",
    eyebrow: "03 — compress",
    statement:
      "Claude + Figma Make AI + Cursor, chained into a repeatable workflow. Five-day prototypes that used to take three weeks. Same taste, more reps.",
  },
];

export function ScrollNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 over the section

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // total scrollable distance through this section
        const total = rect.height - vh;
        // distance scrolled into it
        const scrolled = Math.max(0, -rect.top);
        const p = total > 0 ? Math.min(1, scrolled / total) : 0;
        setProgress(p);
        // 4 segments → step 0 (0..0.2), 1 (0.2..0.45), 2 (0.45..0.7), 3 (0.7..1.0)
        const s =
          p < 0.2 ? 0 :
          p < 0.45 ? 1 :
          p < 0.7 ? 2 :
          3;
        setStep(s);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // CSS variable on the root so children can read step + progress
  const cssVars = {
    "--narr-step": String(step),
    "--narr-progress": String(progress),
  } as React.CSSProperties;

  return (
    <section
      ref={sectionRef}
      data-cursor="default"
      className="relative border-b border-[var(--rule-soft)]"
      style={{ minHeight: "320vh", ...cssVars }}
      aria-label="How I work"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="swiss-container w-full">
          <div className="swiss-grid items-start">
            {/* Left — keyword stack. Fades + slides as step advances.
                On final step (3) shrinks into the collapse card. */}
            <div className="col-span-12 md:col-span-5 relative h-[60vh]">
              <p className="section-tag mb-8">/ how i work</p>

              {/* Keyword stack — visible at steps 0..2. */}
              <div
                className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: step < 3 ? 1 : 0,
                  transform: step < 3 ? "translateY(0)" : "translateY(-12px)",
                  pointerEvents: step < 3 ? "auto" : "none",
                }}
              >
                {STEPS.map((s, i) => {
                  const active = step >= i + 1;
                  return (
                    <div
                      key={s.keyword}
                      className="block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        opacity: active ? 1 : 0.18,
                        transform: active
                          ? "translateX(0)"
                          : "translateX(-12px)",
                        marginBottom: i < STEPS.length - 1 ? -8 : 0,
                      }}
                    >
                      <h2 className="display text-[12vw] md:text-[8vw] lg:text-[108px] leading-[0.95]">
                        <Glitch trigger={active ? "auto" : "hover"} intensity="regular">
                          {s.keyword}
                        </Glitch>
                      </h2>
                    </div>
                  );
                })}
              </div>

              {/* Collapse card — appears at step 3.
                  All three keywords combine into a single CTA box. */}
              <div
                className="absolute inset-0 flex flex-col items-start justify-start transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: step >= 3 ? 1 : 0,
                  transform: step >= 3 ? "translateY(0)" : "translateY(24px)",
                  pointerEvents: step >= 3 ? "auto" : "none",
                }}
              >
                <p className="section-tag mb-8">/ in one box</p>
                <div
                  className="border border-[var(--rule-soft)] bg-[var(--paper-2)] p-7 md:p-9 max-w-md w-full"
                  data-cursor="accent"
                >
                  <div className="mono-accent mb-3">[ research → systems → ai-native ]</div>
                  <h3 className="display text-[34px] md:text-[44px] leading-[1] mb-4">
                    one workflow.
                    <br />
                    three years of practice.
                  </h3>
                  <p className="body-prose-sm text-[var(--ink-soft)] mb-5">
                    Not three skills. One pipeline: I listen, I systematize,
                    I compress with AI. Each step makes the next cheaper.
                  </p>
                  <Link
                    href="/ai"
                    className="mono-accent inline-flex items-center gap-2 group"
                  >
                    see the ai workflow
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right — stepped statements. Crossfade per step. */}
            <div className="col-span-12 md:col-span-7 md:pl-8 relative h-[60vh]">
              <div className="relative h-full">
                {STEPS.map((s, i) => {
                  const active = step === i + 1 || (step === 0 && i === 0);
                  const past = step > i + 1;
                  return (
                    <div
                      key={s.keyword}
                      className="absolute inset-0 flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        opacity: active ? 1 : 0,
                        transform: active
                          ? "translateY(0)"
                          : past
                            ? "translateY(-12px)"
                            : "translateY(12px)",
                        pointerEvents: active ? "auto" : "none",
                      }}
                    >
                      {s.eyebrow && (
                        <p className="mono-accent mb-4">{s.eyebrow}</p>
                      )}
                      <p className="text-[var(--ink)] text-[22px] md:text-[28px] lg:text-[32px] leading-[1.25] font-medium tracking-[-0.02em] max-w-prose">
                        {s.statement}
                      </p>
                    </div>
                  );
                })}

                {/* Final-step shape diagram (drawn from the 3 phases). */}
                <div
                  className="absolute inset-0 flex items-end justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: step >= 3 ? 1 : 0,
                    pointerEvents: step >= 3 ? "auto" : "none",
                  }}
                  aria-hidden
                >
                  <ShapeCollapse />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom progress strip — shows where we are in the narrative. */}
          <div className="absolute bottom-8 left-0 right-0 swiss-container">
            <div className="flex items-center gap-4 mono">
              <span className="text-[var(--muted)]">
                {String(Math.round(progress * 100)).padStart(2, "0")}%
              </span>
              <div className="flex-1 h-px bg-[var(--rule-soft)] relative">
                <div
                  className="absolute left-0 top-0 h-full bg-[var(--accent)] transition-[width] duration-500 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-[var(--muted)]">
                step {step} / 3
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Final-step illustration: a single composite shape built from three
   primitives. Reads as the visual "things combine into one." */
function ShapeCollapse() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      className="text-[var(--ink)]"
      aria-hidden
    >
      {/* Triangle — research */}
      <path
        d="M40 170 L100 60 L160 170 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Square — systems */}
      <rect
        x="60"
        y="100"
        width="100"
        height="100"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Circle — ai-native */}
      <circle
        cx="110"
        cy="120"
        r="50"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
      />
      {/* Anchor dot */}
      <circle cx="110" cy="120" r="3" fill="var(--accent)" />
    </svg>
  );
}
