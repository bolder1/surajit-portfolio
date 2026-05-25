"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Glitch } from "@/components/Glitch";

/**
 * HeroV2 — synapserstudio composition.
 *
 * Center: name in heavy display sans (stacked SURAJIT / DUTTA).
 * Around the center: ~18 italic-serif skill labels, each connected to
 * a specific letter on the name via a hand-drawn-feeling SVG line.
 *
 * Mouse responsiveness (crafted, not gimmicky):
 *   - The midpoint of each connector bends toward the cursor on a
 *     falloff curve. Lines close to the cursor bend more; lines far
 *     from it stay near their resting curve.
 *   - The label's opacity + scale lift as the cursor approaches.
 *   - All values are RAF-clamped — no React re-renders per frame; we
 *     write CSS variables directly on the SVG nodes.
 *   - Disabled on touch / reduced-motion.
 *
 * Name glitches on hover via the existing Glitch component (loud
 * intensity). The whole hero is built to look ALIVE without ever
 * feeling like a screensaver.
 */

/* ─────────── Data ─────────── */

interface Satellite {
  /** The label text — italic serif renders this. */
  text: string;
  /** Position in the hero, percent-of-container (0..100). */
  x: number;
  y: number;
  /** Which letter index on the centered name this connector attaches to.
      0..6 = "SURAJIT", 7..11 = "DUTTA" (with the space at 7).
      We treat both lines as a continuous 12-char string. */
  anchor: number;
  /** Optional override: which line the label sits on (above / below). */
  side?: "top" | "bottom" | "left" | "right";
  /** Small visual size variance for rhythm. */
  size?: "sm" | "md" | "lg";
}

/* Surajit's actual skills + traits + tools. The set is intentionally
   varied so the cloud reads as a person, not a taxonomy. */
const SATELLITES: Satellite[] = [
  // top arc
  { text: "iam",              x: 18, y: 18, anchor: 0,  side: "top",    size: "md" },
  { text: "design systems",   x: 38, y: 12, anchor: 2,  side: "top",    size: "lg" },
  { text: "pam",              x: 56, y: 14, anchor: 4,  side: "top",    size: "md" },
  { text: "ai workflow",      x: 76, y: 18, anchor: 6,  side: "top",    size: "lg" },
  { text: "research",         x: 88, y: 30, anchor: 8,  side: "top",    size: "md" },

  // left flank
  { text: "iga",              x: 6,  y: 36, anchor: 1,  side: "left",   size: "sm" },
  { text: "claude",           x: 10, y: 52, anchor: 1,  side: "left",   size: "md" },
  { text: "prototyping",      x: 4,  y: 68, anchor: 2,  side: "left",   size: "md" },
  { text: "craft",            x: 14, y: 80, anchor: 3,  side: "left",   size: "lg" },

  // right flank
  { text: "uem",              x: 94, y: 44, anchor: 6,  side: "right",  size: "sm" },
  { text: "figma",            x: 90, y: 60, anchor: 8,  side: "right",  size: "md" },
  { text: "enterprise",       x: 92, y: 72, anchor: 10, side: "right",  size: "lg" },
  { text: "vibe coding",      x: 84, y: 84, anchor: 11, side: "right",  size: "md" },

  // bottom arc
  { text: "five-day prototypes", x: 18, y: 84, anchor: 5,  side: "bottom", size: "lg" },
  { text: "saas",                x: 38, y: 88, anchor: 7,  side: "bottom", size: "sm" },
  { text: "precision",           x: 54, y: 92, anchor: 8,  side: "bottom", size: "md" },
  { text: "typography",          x: 70, y: 88, anchor: 10, side: "bottom", size: "md" },
  { text: "pune / ist",          x: 50, y: 82, anchor: 9,  side: "bottom", size: "sm" },
];

const SIZE_PX: Record<NonNullable<Satellite["size"]>, number> = {
  sm: 18,
  md: 22,
  lg: 28,
};

/* The display name. We compute attachment points per character. */
const LINE_1 = "SURAJIT";
const LINE_2 = "DUTTA";

/* For convenience: combined index → (line, charIndex).
   Indices 0..6 = SURAJIT, 7 = space, 8..12 = DUTTA. */
function letterLine(anchor: number): { line: 0 | 1; char: number } {
  if (anchor <= 6) return { line: 0, char: anchor };
  return { line: 1, char: anchor - 8 < 0 ? 0 : anchor - 8 };
}

/* ─────────── Component ─────────── */

export function HeroV2() {
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Per-line attachment cache — recomputed on resize. */
  const [attachments, setAttachments] = useState<{ x: number; y: number }[]>([]);

  /* Compute attachment positions: x,y in pixels relative to the stage. */
  const recompute = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const span1 = stage.querySelector<HTMLSpanElement>("[data-line='1']");
    const span2 = stage.querySelector<HTMLSpanElement>("[data-line='2']");
    if (!span1 || !span2) return;

    const pts: { x: number; y: number }[] = [];
    [span1, span2].forEach((span, lineIdx) => {
      const text = lineIdx === 0 ? LINE_1 : LINE_2;
      // Wrap each character in a span if we haven't already.
      // Simpler: use a hidden canvas to measure character widths.
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      const style = window.getComputedStyle(span);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const sRect = span.getBoundingClientRect();
      let cursor = sRect.left - rect.left;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const w = ctx.measureText(ch).width;
        pts.push({
          x: cursor + w / 2,
          y: sRect.top - rect.top + sRect.height / 2,
        });
        cursor += w;
      }
    });
    // Attachments now contain LINE_1.length + LINE_2.length entries.
    // Map anchor index from the satellites: 0..6 → LINE_1, 8..12 → LINE_2.
    // We need a flat lookup [0..6] + [7..11] so satellite.anchor maps directly.
    const flat: { x: number; y: number }[] = [];
    // SURAJIT — 7 chars at indices 0..6
    for (let i = 0; i < LINE_1.length; i++) flat[i] = pts[i];
    // Space anchor (7) — set midway between lines
    flat[7] = {
      x: (pts[LINE_1.length - 1].x + pts[LINE_1.length].x) / 2,
      y: (pts[LINE_1.length - 1].y + pts[LINE_1.length].y) / 2,
    };
    // DUTTA — 5 chars at indices 8..12
    for (let i = 0; i < LINE_2.length; i++) flat[8 + i] = pts[LINE_1.length + i];
    setAttachments(flat);
  }, []);

  useEffect(() => {
    recompute();
    const onResize = () => recompute();
    window.addEventListener("resize", onResize);
    // Recompute after fonts have loaded.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => recompute());
    }
    return () => window.removeEventListener("resize", onResize);
  }, [recompute]);

  /* Pointer tracking — RAF-clamped, writes inline transforms.
     We never re-render React on pointermove. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending = false;
    let mx = 0, my = 0;

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        // For each satellite, compute distance to label center.
        // Use distance to drive: connector bend, label opacity, label scale.
        SATELLITES.forEach((s, i) => {
          const label = labelRefs.current[i];
          const path = lineRefs.current[i];
          const att = attachments[s.anchor];
          if (!label || !path || !att) return;
          const lr = label.getBoundingClientRect();
          const lx = lr.left - rect.left + lr.width / 2;
          const ly = lr.top - rect.top + lr.height / 2;
          // distance from cursor to label center
          const dl = Math.hypot(mx - lx, my - ly);
          // Falloff — within 240px we lift; otherwise rest.
          const t = Math.max(0, 1 - dl / 280);
          label.style.setProperty("--prox", String(t));

          // Compute connector control point — midpoint shifted toward cursor.
          const midX = (lx + att.x) / 2;
          const midY = (ly + att.y) / 2;
          // Distance from cursor to midpoint controls bend strength.
          const dm = Math.hypot(mx - midX, my - midY);
          const bendT = Math.max(0, 1 - dm / 360);
          // Direction from midpoint to cursor.
          const cx = midX + (mx - midX) * bendT * 0.45;
          const cy = midY + (my - midY) * bendT * 0.45;
          path.setAttribute(
            "d",
            `M ${lx} ${ly} Q ${cx} ${cy} ${att.x} ${att.y}`
          );
          path.style.opacity = String(0.35 + bendT * 0.55);
        });
      });
    };
    const onLeave = () => {
      // Snap back to rest curves.
      SATELLITES.forEach((s, i) => {
        const label = labelRefs.current[i];
        const path = lineRefs.current[i];
        const att = attachments[s.anchor];
        if (!label || !path || !att) return;
        const lr = label.getBoundingClientRect();
        const rect = stage.getBoundingClientRect();
        const lx = lr.left - rect.left + lr.width / 2;
        const ly = lr.top - rect.top + lr.height / 2;
        label.style.setProperty("--prox", "0");
        const midX = (lx + att.x) / 2;
        const midY = (ly + att.y) / 2;
        path.setAttribute("d", `M ${lx} ${ly} Q ${midX} ${midY} ${att.x} ${att.y}`);
        path.style.opacity = "0.4";
      });
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [attachments]);

  /* Initial rest curves — paint once attachments are known. */
  const initialPaths = useMemo(() => {
    return SATELLITES.map((s) => {
      const att = attachments[s.anchor];
      if (!att) return "";
      // Approximate label center from x%/y% — exact pos comes from refs.
      // For SSR + initial paint, use percent-derived coords; will be
      // overwritten by the resize handler once mounted.
      return `M ${s.x}% ${s.y}% Q ${(s.x + 50) / 2}% ${(s.y + 50) / 2}% ${att.x} ${att.y}`;
    });
  }, [attachments]);

  return (
    <section
      ref={stageRef}
      className="v2-hero relative w-full h-screen overflow-hidden flex items-center justify-center"
      aria-label="Surajit Dutta — hero"
    >
      {/* SVG layer for connectors. Sits behind labels + name. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        {SATELLITES.map((s, i) => (
          <path
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            d={initialPaths[i]}
            stroke="var(--v2-ink-soft)"
            strokeWidth="0.6"
            fill="none"
            style={{ opacity: 0.4, transition: "opacity 280ms ease" }}
          />
        ))}
      </svg>

      {/* Satellite labels */}
      {SATELLITES.map((s, i) => (
        <span
          key={i}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="v2-satellite absolute"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${SIZE_PX[s.size ?? "md"]}px`,
              // CSS-var driven proximity highlight; 0 = rest, 1 = closest.
              "--prox": "0",
              transition: "color 280ms ease, transform 280ms ease",
              color:
                "color-mix(in oklab, var(--v2-ink-soft), var(--v2-ink) calc(var(--prox) * 100%))",
              transformOrigin: "center",
            } as CSSProperties
          }
        >
          {s.text}
        </span>
      ))}

      {/* Center name — stacked SURAJIT / DUTTA */}
      <div className="relative z-[1] flex flex-col items-center pointer-events-none">
        <span
          data-line="1"
          className="v2-display block leading-none pointer-events-auto"
          style={{
            fontSize: "clamp(72px, 14vw, 220px)",
          }}
        >
          <Glitch trigger="hover" intensity="loud">
            {LINE_1}
          </Glitch>
        </span>
        <span
          data-line="2"
          className="v2-display block leading-none -mt-1 pointer-events-auto"
          style={{
            fontSize: "clamp(72px, 14vw, 220px)",
          }}
        >
          <Glitch trigger="hover" intensity="loud">
            {LINE_2}
          </Glitch>
        </span>
      </div>

      {/* Bottom-center: small scroll affordance */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 v2-mono pointer-events-none">
        <span className="opacity-70">scroll to explore</span>
        <span className="block w-px h-8 bg-[var(--v2-ink-soft)]" aria-hidden />
      </div>

      <style jsx global>{`
        .v2-satellite {
          /* lift slightly toward the cursor */
          transform: translate(-50%, -50%) translateY(calc(var(--prox, 0) * -3px));
        }
      `}</style>
    </section>
  );
}
