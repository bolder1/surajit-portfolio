"use client";

import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────
   PROCESS STORY — V4's 8-step design narrative, told inside
   the V5 magazine layout. Each step is a magazine spread
   with a section number, italic headline, body prose, and a
   side-margin tagged with the diamond glyph (◇ diverge / ◆
   converge) so the reader can feel the cadence.

   The narrative is the spine that ties V1's content into a
   designer's voice — without the v4 sound effects or scroll
   theatrics. The print-magazine restraint does the work.
   ─────────────────────────────────────────────────────── */

type Shape = "open" | "close" | "start" | "end";

interface Step {
  num: string;
  title: string;
  italic: string;
  shape: Shape;
  duration: string;
  body: string;
  asideLabel: string;
  asideBody: string;
  artifact: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "The desk.",
    italic: "Where it all starts.",
    shape: "start",
    duration: "Ongoing",
    body:
      "Two monitors, a notebook that's mostly diagrams, three open Figma files, and a Slack thread asking why a button moved. Most days the work isn't designing — it's deciding what's actually worth designing this week.",
    asideLabel: "On the desk",
    asideBody:
      "Figma · FigJam · Linear · a beat-up A5 sketchbook · the kettle.",
    artifact: "The week's three open questions, written down where I can see them.",
  },
  {
    num: "02",
    title: "Fieldwork.",
    italic: "Listening before drawing.",
    shape: "open",
    duration: "2 — 4 weeks",
    body:
      "Sit with the people who actually use the thing. IT admins on a Wednesday afternoon. Security analysts at quarter-end. Reviewers who'd rather rubber-stamp than miss dinner. The interesting answer is almost never the one in the brief.",
    asideLabel: "Field notes",
    asideBody:
      "12 reviewer interviews. 4 shadowing sessions. One quote that re-frames the entire problem.",
    artifact: "A reviewer behaviour taxonomy and a map of the audit pain.",
  },
  {
    num: "03",
    title: "Synthesis.",
    italic: "Many voices, one brief.",
    shape: "close",
    duration: "1 — 2 weeks",
    body:
      "All the post-its converge. JTBD frames, archetypes, an operating principle the team can repeat from memory. The brief is short on purpose — if it doesn't fit on a page, no one will read it twice.",
    asideLabel: "On the wall",
    asideBody:
      "3 archetypes. Job stories. A design-principles doc the PM can quote.",
    artifact: "A one-page brief: who, what, why, and how we'll know.",
  },
  {
    num: "04",
    title: "First draft.",
    italic: "Cheap, fast, throw-away.",
    shape: "open",
    duration: "1 week",
    body:
      "Low-fi sketches, paper-thin prototypes, ugly Figma frames. The point is to be wrong on cheap material. AI helps now — I can spin five versions of the same flow in an afternoon and bring the survivors to the team.",
    asideLabel: "On the page",
    asideBody:
      "Five concept sketches. Three killed by Friday. Two carried into next week.",
    artifact: "A click-through prototype that's good enough to argue with.",
  },
  {
    num: "05",
    title: "Dressed up.",
    italic: "From sketch to system.",
    shape: "close",
    duration: "2 — 4 weeks",
    body:
      "The surviving direction gets fitted to the design system. Components, tokens, states, edge cases, the boring stuff. New patterns get pulled back into MODS so the next team gets a head start.",
    asideLabel: "In the system",
    asideBody:
      "Risk-signal pattern. Reasoning-capture micro-pattern. Bulk-action gating spec.",
    artifact: "Hi-fi flows that another designer could pick up and continue.",
  },
  {
    num: "06",
    title: "In motion.",
    italic: "Make it feel like it works.",
    shape: "open",
    duration: "1 — 2 weeks",
    body:
      "Animation, micro-interactions, the moments between states. Not for delight — for legibility. A 200ms transition is the difference between 'something happened' and 'I broke it.'",
    asideLabel: "In Jitter",
    asideBody:
      "The skeleton-to-data fade. The bulk-confirm slide. The four-frame error toast.",
    artifact: "A motion spec engineering can implement without translation.",
  },
  {
    num: "07",
    title: "Hand-off.",
    italic: "Designer-to-engineer, no rosetta stone.",
    shape: "close",
    duration: "Ongoing",
    body:
      "Tokens, specs, edge cases, tests. The handoff is half writing, half pairing. The best engineers don't want a Figma — they want the reasoning, so they can make smart calls when reality breaks the spec.",
    asideLabel: "In the doc",
    asideBody:
      "Spec page · token table · animation timing · accessibility notes · open questions.",
    artifact: "A spec that survives contact with the sprint.",
  },
  {
    num: "08",
    title: "Talk.",
    italic: "What we learned, out loud.",
    shape: "end",
    duration: "After every release",
    body:
      "Telemetry, support tickets, the things users do that we didn't expect. We write up what shipped, what didn't work, what we'd do differently. The next cycle starts with that page on the wall.",
    asideLabel: "On the wall",
    asideBody:
      "Pilot telemetry. Bi-weekly iteration loop. The 'what we'd change' note.",
    artifact: "A retro the next project starts from.",
  },
];

export function ProcessStory() {
  const [activeNum, setActiveNum] = useState("01");

  /* Track which step is in view via querySelector — cleaner
     than refs for a static, ordered list. */
  useEffect(() => {
    const nodes = STEPS.map((s) =>
      document.getElementById(`step-${s.num}`)
    ).filter((n): n is HTMLElement => n != null);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (!top) return;
        const num = (top.target as HTMLElement).dataset.stepNum;
        if (num) setActiveNum(num);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const activeIdx = STEPS.findIndex((s) => s.num === activeNum);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-b border-[var(--rule)] scroll-mt-20"
    >
      {/* Section masthead */}
      <div className="max-w-page mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10 md:pb-14 border-b border-[var(--rule)]">
        <div className="flex items-end justify-between gap-6 mb-6">
          <span className="section-tag">▸ THE PROCESS &middot; § 02</span>
          <span className="mono hidden md:inline">VIII PHASES &middot; ONE LOOP</span>
        </div>
        <h2
          id="process-heading"
          className="display text-[12vw] md:text-[8vw] lg:text-[112px] tracking-tightest leading-[0.9] max-w-5xl"
        >
          How a project moves{" "}
          <span className="display-italic text-[var(--accent)]">
            from desk to ship
          </span>
          .
        </h2>
        <p className="body-prose mt-8 max-w-2xl drop-cap">
          Eight phases, told the way they actually happen. Not a process diagram
          — a working sequence, with the loops back to fieldwork and the dead
          ends drawn in. The diamonds in the margin mark when the work opens
          (◇ diverge) and when it closes (◆ converge).
        </p>
      </div>

      {/* The story — each step is a 12-col magazine spread.
          Sticky spine on the left tracks the active step. */}
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-8 md:gap-12 py-12 md:py-16">
        {/* Sticky spine */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="sticky top-24">
            <div className="mono mb-4 text-[var(--accent)]">▸ THE SPINE</div>
            <ol className="space-y-3">
              {STEPS.map((s, i) => {
                const isActive = i === activeIdx;
                const isPast = i < activeIdx;
                const filled = s.shape === "close" || s.shape === "end";
                return (
                  <li key={s.num}>
                    <a
                      href={`#step-${s.num}`}
                      className={`group flex items-center gap-3 mono text-[10px] transition-colors ${
                        isActive
                          ? "text-[var(--accent)]"
                          : isPast
                            ? "text-[var(--ink-soft)]"
                            : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`shrink-0 ${isActive ? "spine-pulse" : ""}`}
                        style={{
                          width: 9,
                          height: 9,
                          transform: "rotate(45deg)",
                          background: filled
                            ? isActive || isPast
                              ? "var(--accent)"
                              : "var(--muted)"
                            : "transparent",
                          border: `1.5px solid ${
                            isActive || isPast ? "var(--accent)" : "var(--muted)"
                          }`,
                          opacity: isActive || isPast ? 1 : 0.55,
                        }}
                      />
                      <span className="opacity-60 mr-1">{s.num}</span>
                      <span className="truncate">{s.title.replace(".", "")}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 pt-4 border-t border-[var(--rule-soft)] mono text-[9px] flex flex-col gap-1.5">
              <span className="flex items-center gap-2">
                <span className="diamond-open" /> diverge
              </span>
              <span className="flex items-center gap-2">
                <span className="diamond" /> converge
              </span>
            </div>
          </div>
        </aside>

        {/* The chapters */}
        <div className="md:col-span-9 space-y-16 md:space-y-24">
          {STEPS.map((s) => (
            <Step key={s.num} step={s} />
          ))}

          {/* Loop-back marker — visual nod to the v4 narrative
              that the process is not a straight line. */}
          <div
            aria-hidden
            className="flex items-center gap-4 pt-8 border-t border-dashed border-[var(--rule)]"
          >
            <span className="diamond-open" />
            <p className="mono">
              ↺ The loop &mdash; most steps return to fieldwork at least once.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   One step = one magazine spread.
   ─────────────────────────────────────────────────────── */
function Step({ step }: { step: Step }) {
  const filled = step.shape === "close" || step.shape === "end";
  return (
    <article
      id={`step-${step.num}`}
      data-step-num={step.num}
      className="scroll-mt-24 border-t border-[var(--rule)] pt-10 md:pt-14"
    >
      {/* Phase header strip */}
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={filled ? "diamond" : "diamond-open"}
          />
          <span className="section-tag">PHASE {step.num}</span>
        </div>
        <span className="mono">{step.duration}</span>
      </div>

      {/* Headline */}
      <h3 className="display text-[10vw] md:text-[6vw] lg:text-[88px] tracking-tightest leading-[0.92]">
        {step.title}{" "}
        <span className="display-italic text-[var(--accent)]">
          {step.italic}
        </span>
      </h3>

      {/* Body + aside in a 7/4 grid — magazine spread */}
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 mt-8 md:mt-10">
        <div className="md:col-span-7">
          <p className="body-prose drop-cap">{step.body}</p>
          <p className="mono mt-8 pt-4 border-t border-[var(--rule-soft)]">
            ARTIFACT &middot;{" "}
            <span
              className="text-[var(--ink-soft)] text-[15px] normal-case"
              style={{
                letterSpacing: 0,
                fontFamily: "var(--font-display)",
              }}
            >
              {step.artifact}
            </span>
          </p>
        </div>
        <aside className="md:col-span-4 md:col-start-9 border-l-2 border-[var(--rule)] pl-6">
          <div className="mono mb-3 text-[var(--accent)]">
            ▸ {step.asideLabel}
          </div>
          <p className="body-prose-sm">{step.asideBody}</p>
        </aside>
      </div>
    </article>
  );
}
