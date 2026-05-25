"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

/**
 * ManifestoScroll — synapserstudio-style five-phase scroll narrative.
 *
 * Single tall section (~500vh) with a sticky inner panel. Scroll
 * progress drives a single `t` ∈ [0,1] from rAF; we derive five
 * overlapping opacity curves and one canvas-scale curve from `t`.
 *
 * Phase map (overlaps deliberately so transitions never snap):
 *   0.00 - 0.22  → paragraph at full
 *   0.18 - 0.42  → paragraph fading, keyword-only block fading in
 *   0.38 - 0.62  → keywords compacting into 5 boxes
 *   0.58 - 0.78  → 5 boxes collapsing into a single center box
 *   0.74 - 1.00  → center box expanding into a canvas of project tiles
 *
 * Everything is opacity + transform on already-rendered layers (no
 * IntersectionObserver, no DOM thrash). Reduced-motion safe: layers
 * snap to their final state.
 */

const PARA_TEXT =
  "I design product flows for IT and security teams from Pune — where identity becomes interface, where privileged access learns restraint, and where compliance earns trust. Three years inside enterprise SaaS, four platforms shipped, an AI-native workflow that compresses weeks of design into days. From IAM consoles to PAM dashboards to UEM rollouts, building tools with rigor and the patience to keep the surface calm. Working alongside engineers, founders, and security architects, shipping screens where every pixel has purpose.";

/* Keywords get pulled out of the paragraph and laid out independently
   for phase 1+. Order matters — we group them later into boxes by index. */
const KEYWORDS = [
  "identity",          // 0
  "interface",         // 1
  "privileged",        // 2
  "access",            // 3
  "restraint",         // 4
  "compliance",        // 5
  "trust",             // 6
  "enterprise",        // 7
  "SaaS",              // 8
  "AI-native",         // 9
  "workflow",          // 10
  "IAM",               // 11
  "PAM",               // 12
  "UEM",               // 13
  "rigor",             // 14
  "calm",              // 15
  "pixel",             // 16
  "purpose",           // 17
];

/* Each box collects ~4 keywords. Five boxes total — one per theme. */
const BOXES: { title: string; keys: number[] }[] = [
  { title: "Identity",      keys: [0, 1, 2, 3] },
  { title: "Discipline",    keys: [4, 5, 6, 14] },
  { title: "Enterprise",    keys: [7, 8, 11, 12, 13] },
  { title: "AI Workflow",   keys: [9, 10] },
  { title: "Craft",         keys: [15, 16, 17] },
];

/* Linear map → clamped 0..1 over an arbitrary input range. */
function band(t: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (t - start) / (end - start)));
}

interface BoxLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

/* Predetermined box positions in the "compact" phase (phase 2).
   Coordinates are percent of the viewport. */
const COMPACT_LAYOUT: BoxLayout[] = [
  { x: 14, y: 22, w: 26, h: 22 },
  { x: 62, y: 18, w: 24, h: 22 },
  { x: 10, y: 62, w: 26, h: 26 },
  { x: 70, y: 60, w: 22, h: 22 },
  { x: 40, y: 44, w: 22, h: 24 },
];
const CENTER_LAYOUT: BoxLayout = { x: 38, y: 40, w: 24, h: 22 };

export function ManifestoScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);

  const projects = useMemo(
    () => getAllProjects().filter((p) => p.hoverColor).slice(0, 9),
    []
  );

  /* rAF-clamped scroll handler — single source of truth. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = Math.max(0, -rect.top);
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;
      setT(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Derived opacities — overlapping fade curves */
  const paraOut    = band(t, 0.18, 0.32); // paragraph fades out
  const keysIn     = band(t, 0.22, 0.40); // keyword layer fades in
  const keysOut    = band(t, 0.42, 0.55); // keyword layer fades out (boxes take over)
  const boxesIn    = band(t, 0.42, 0.58); // 5 boxes fade in
  const boxesMerge = band(t, 0.58, 0.78); // 5 boxes ease toward center
  const finalIn    = band(t, 0.74, 0.88); // single center box pops
  const canvasIn   = band(t, 0.82, 0.98); // tiles fly out from box

  /* Phase 1: keyword layer opacity */
  const keyOpacity = keysIn * (1 - keysOut);
  /* Phase 0: paragraph opacity (fades) */
  const paraOpacity = Math.max(0.08, 1 - paraOut);

  /* Compute interpolated box layouts — between COMPACT and CENTER. */
  const boxLayouts = COMPACT_LAYOUT.map((c) => ({
    x: c.x + (CENTER_LAYOUT.x - c.x) * boxesMerge,
    y: c.y + (CENTER_LAYOUT.y - c.y) * boxesMerge,
    w: c.w + (CENTER_LAYOUT.w - c.w) * boxesMerge,
    h: c.h + (CENTER_LAYOUT.h - c.h) * boxesMerge,
  }));

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      data-cursor="default"
      className="relative border-t border-[color:var(--v2-rule-soft)]"
      style={{ minHeight: "500vh" }}
      aria-label="Manifesto"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* HUD — phase indicator + section number */}
        <div className="absolute top-6 left-6 v2-mono z-[5] pointer-events-none select-none">
          <p className="text-[color:var(--v2-ink-soft)]">/ 002</p>
          <p className="text-[color:var(--v2-ink)] mt-0.5">manifesto</p>
        </div>
        <div className="absolute top-6 right-6 v2-mono z-[5] pointer-events-none select-none text-right">
          <p className="text-[color:var(--v2-ink-soft)]">
            scroll · {String(Math.round(t * 100)).padStart(2, "0")}%
          </p>
        </div>

        {/* Phase 0 — full paragraph */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 md:px-12 lg:px-24"
          style={{
            opacity: paraOpacity,
            pointerEvents: paraOpacity < 0.5 ? "none" : "auto",
            transition: "opacity 200ms linear",
          }}
        >
          <p
            className="v2-display text-center max-w-5xl"
            style={{
              fontSize: "clamp(20px, 2.6vw, 36px)",
              fontFamily: "var(--v2-display), system-ui, sans-serif",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
              textTransform: "uppercase",
            }}
          >
            {/* Inline keywords with a slightly different tone so the
                reader's eye registers them before the next phase
                isolates them. */}
            {tokenizeParagraph(PARA_TEXT, KEYWORDS)}
          </p>
        </div>

        {/* Phase 1 — keyword cloud */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: keyOpacity,
            pointerEvents: keyOpacity > 0.5 ? "auto" : "none",
            transition: "opacity 200ms linear",
          }}
        >
          <KeywordCloud keywords={KEYWORDS} progress={keysIn} />
        </div>

        {/* Phase 2/3 — 5 boxes + their merge */}
        {BOXES.map((box, i) => {
          const layout = boxLayouts[i];
          const collapsedToCenter = boxesMerge > 0.95;
          return (
            <div
              key={i}
              className="absolute"
              style={
                {
                  left: `${layout.x}%`,
                  top: `${layout.y}%`,
                  width: `${layout.w}%`,
                  height: `${layout.h}%`,
                  opacity:
                    boxesIn * (1 - (collapsedToCenter && i !== 0 ? 1 : finalIn * 0.85)),
                  background: "var(--v2-paper-2)",
                  border: "1px solid var(--v2-rule-soft)",
                  transition: "opacity 200ms linear",
                  pointerEvents: "none",
                } as CSSProperties
              }
            >
              <div className="h-full w-full p-3 md:p-4 flex flex-col justify-between">
                <p className="v2-mono text-[color:var(--v2-ink-soft)]">
                  / {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <p
                    className="v2-display leading-[0.95]"
                    style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
                  >
                    {box.title.toUpperCase()}
                  </p>
                  <p className="v2-mono mt-1 text-[color:var(--v2-ink-soft)] leading-snug">
                    {box.keys
                      .map((k) => KEYWORDS[k])
                      .join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Phase 4 — single center box + expanding canvas of project tiles */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: finalIn,
            pointerEvents: finalIn > 0.5 ? "auto" : "none",
          }}
        >
          <CenterCard
            scale={1 + canvasIn * 0.25}
            tilesOpen={canvasIn}
            projects={projects}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────── Helpers ─────────── */

/** Splits paragraph into spans; words in `keywords` get an `is-key` class
    so we could style them differently in phase 0 (subtle italic tint). */
function tokenizeParagraph(text: string, keywords: string[]) {
  const set = new Set(keywords.map((k) => k.toLowerCase()));
  return text.split(/(\s+)/).map((word, i) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, "");
    if (set.has(clean)) {
      return (
        <span
          key={i}
          style={{
            color: "var(--v2-ink)",
            fontStyle: "italic",
            fontFamily: "var(--v2-serif), Georgia, serif",
            textTransform: "lowercase",
            fontWeight: 500,
            letterSpacing: "0",
            padding: "0 0.05em",
          }}
        >
          {word}
        </span>
      );
    }
    return (
      <span key={i} style={{ color: "var(--v2-ink-soft)" }}>
        {word}
      </span>
    );
  });
}

/** Phase-1 keyword-only block. Keywords scatter in a soft cloud. */
function KeywordCloud({
  keywords,
  progress,
}: {
  keywords: string[];
  progress: number;
}) {
  return (
    <div
      className="w-full max-w-5xl mx-auto px-8 flex flex-wrap items-center justify-center"
      style={{
        gap: "clamp(12px, 1.4vw, 22px)",
      }}
    >
      {keywords.map((k, i) => {
        // Slight per-word stagger as the cloud comes in.
        const delay = i * 0.04;
        const localProgress = Math.max(0, Math.min(1, progress - delay));
        return (
          <span
            key={k}
            style={{
              fontFamily: "var(--v2-serif), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--v2-ink)",
              fontSize: "clamp(22px, 3.2vw, 46px)",
              opacity: localProgress,
              transform: `translateY(${(1 - localProgress) * 14}px)`,
              transition: "opacity 220ms linear, transform 220ms linear",
              display: "inline-block",
              lineHeight: 1.05,
            }}
          >
            {k}
          </span>
        );
      })}
    </div>
  );
}

/** Phase-4 center card with project tiles spilling out around it. */
function CenterCard({
  scale,
  tilesOpen,
  projects,
}: {
  scale: number;
  tilesOpen: number;
  projects: ReturnType<typeof getAllProjects>;
}) {
  // 9 tiles fly out in 8 cardinal directions + one stays under the card.
  const DIRS: Array<[number, number]> = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0], [0,  0], [1,  0],
    [-1,  1], [0,  1], [1,  1],
  ];
  return (
    <div
      className="relative"
      style={{
        width: "min(520px, 60vw)",
        aspectRatio: "5 / 4",
        transform: `scale(${scale})`,
        transition: "transform 200ms linear",
      }}
    >
      {/* Tiles — translate outward as tilesOpen → 1 */}
      {DIRS.map(([dx, dy], i) => {
        const p = projects[i];
        if (!p) return null;
        const radius = tilesOpen * 220;
        return (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            data-cursor="image"
            className="absolute left-1/2 top-1/2 border border-[color:var(--v2-rule-soft)]"
            style={{
              width: 100,
              height: 80,
              marginLeft: -50,
              marginTop: -40,
              transform: `translate(${dx * radius}px, ${dy * radius}px) rotate(${(i - 4) * 1.5}deg)`,
              opacity: tilesOpen,
              transition: "transform 240ms cubic-bezier(0.16,1,0.3,1), opacity 200ms linear",
              background: p.hoverColor ?? "#1c1c1c",
              color: p.hoverInk ?? "#f0eee8",
              zIndex: i === 4 ? 1 : 2,
              pointerEvents: tilesOpen > 0.5 ? "auto" : "none",
            }}
            aria-label={p.title}
          >
            <span className="absolute inset-0 flex items-center justify-center v2-display text-[16px] leading-none">
              {(p.hoverIllustration ?? p.slug.slice(0, 2)).toString().toLowerCase()}
            </span>
          </Link>
        );
      })}

      {/* The center card — visible across phases 3 and 4 */}
      <div
        className="absolute inset-0 border border-[color:var(--v2-rule)] bg-[color:var(--v2-paper-2)] flex flex-col justify-between p-5 md:p-6 z-[3]"
        style={{
          boxShadow: "0 18px 48px rgba(20,20,18,0.25)",
        }}
      >
        <div className="flex items-baseline justify-between v2-mono text-[color:var(--v2-ink-soft)]">
          <span>/ 002 / single box</span>
          <span>{Math.round(tilesOpen * 100)}%</span>
        </div>
        <div>
          <p
            className="v2-display leading-[0.95]"
            style={{ fontSize: "clamp(28px, 3.4vw, 48px)" }}
          >
            FIVE THEMES.
            <br />
            ONE PRACTICE.
          </p>
          <p
            className="mt-3 v2-mono text-[color:var(--v2-ink-soft)]"
            style={{ opacity: 1 - tilesOpen * 0.6 }}
          >
            scroll → the canvas opens
          </p>
          <p
            className="mt-2 v2-satellite"
            style={{
              fontSize: 18,
              opacity: tilesOpen,
            }}
          >
            every piece →{" "}
            <Link href="/v2/archive" className="underline underline-offset-4 hover:text-[color:var(--v2-accent)] transition-colors" data-cursor="accent">
              archive
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
