"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor — holographic, always-visible custom cursor.
 *
 * Rewritten from the mix-blend-mode: difference version which was
 * invisible on warm / mid-tone backgrounds (e.g. the v2 olive paper).
 *
 * Visual stack:
 *   1. Outer "halo" ring  — 1px translucent dark stroke for contrast
 *      on light backgrounds.
 *   2. Holographic ring   — 1.5px white stroke with a slow-rotating
 *      conic-gradient inset that creates the iridescent shimmer.
 *      Sits between the halo and the dot.
 *   3. Inner dot          — 5px laser-red core with a thin white
 *      outline. Always at full opacity for "you are here" clarity.
 *   4. Click ripple       — spawned on every pointerdown, a 56px
 *      white ring eases out and fades to zero over 480ms.
 *
 * Layering with both a dark halo + white ring + holographic shimmer
 * means the cursor is legible on:
 *   - bright olive (v2 paper)
 *   - near-black (brutalist paper)
 *   - any imagery in between
 *
 * Per-section flavors (data-cursor on the closest ancestor):
 *   default — ring + dot
 *   accent  — ring fills with accent + scales 1.6x ; dot inverts white
 *   image   — ring becomes a 64px rounded square frame (for tiles)
 *   text    — ring collapses into a 2 × 24 I-beam (for prose)
 *   drag    — ring shows a four-arrow cross icon (panning surfaces)
 *   hidden  — both fade fully
 *
 * Auto-detection — interactive elements without a data-cursor get
 * the "accent" flavor automatically. So buttons + links light up
 * without per-element wiring.
 *
 * Touch / coarse pointer: cursor never mounts; OS default takes over.
 * prefers-reduced-motion: lerp + ripple animations short-circuit.
 */

type Flavor = "default" | "accent" | "image" | "text" | "drag" | "hidden";

const RING_LERP = 0.22;
const RIPPLE_DURATION = 480; // ms — keep in sync with @keyframes ripple
const RIPPLE_LIMIT = 6;       // max concurrent ripple elements

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const flavorEl = useRef<HTMLDivElement>(null);
  const rippleHostRef = useRef<HTMLDivElement>(null);

  const flavor = useRef<Flavor>("default");
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  /* Mount gate — pointer:fine only */
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.setAttribute("data-cursor-active", "true");
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => {
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, []);

  /* Pointer tracking + flavor detection */
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (reducedMotion.current) {
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
      }
      // Detect flavor via the topmost element under the pointer.
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      let f: Flavor = "default";
      const host = el?.closest<HTMLElement>("[data-cursor]");
      if (host) {
        f = (host.getAttribute("data-cursor") as Flavor) ?? "default";
      } else if (el) {
        // Auto: anchor/button → accent; img/canvas/[role=img] → image; editable → text.
        const tag = el.tagName;
        if (
          el.closest("a, button, [role='button'], [type='submit'], [type='button']")
        ) {
          f = "accent";
        } else if (
          tag === "IMG" ||
          tag === "VIDEO" ||
          tag === "CANVAS" ||
          el.closest("[role='img']")
        ) {
          f = "image";
        } else if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          el.isContentEditable
        ) {
          f = "text";
        }
      }
      if (f !== flavor.current) {
        flavor.current = f;
        flavorEl.current?.setAttribute("data-flavor", f);
      }
    };

    const onDown = (e: PointerEvent) => {
      flavorEl.current?.setAttribute("data-pressed", "true");
      spawnRipple(e.clientX, e.clientY);
    };
    const onUp = () => flavorEl.current?.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      if (ringRef.current) {
        if (!reducedMotion.current) {
          ring.current.x += (target.current.x - ring.current.x) * RING_LERP;
          ring.current.y += (target.current.y - ring.current.y) * RING_LERP;
        }
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };

    /* Ripple emitter — appends DOM nodes, removes after animation. */
    function spawnRipple(x: number, y: number) {
      const host = rippleHostRef.current;
      if (!host || reducedMotion.current) return;
      if (host.children.length >= RIPPLE_LIMIT) {
        host.removeChild(host.firstChild!);
      }
      const node = document.createElement("span");
      node.className = "cursor-ripple";
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      host.appendChild(node);
      window.setTimeout(() => {
        node.remove();
      }, RIPPLE_DURATION + 50);
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={flavorEl}
      data-flavor="default"
      aria-hidden
      className="cursor-overlay pointer-events-none fixed top-0 left-0 z-[9999]"
    >
      {/* Outer ring — holographic shimmer */}
      <div ref={ringRef} className="cursor-ring" />
      {/* Inner dot */}
      <div ref={dotRef} className="cursor-dot" />
      {/* Ripple host — click ripples are appended here */}
      <div ref={rippleHostRef} className="cursor-ripple-host" />

      <style jsx global>{`
        /* Hide the OS cursor while we draw our own. */
        [data-cursor-active="true"],
        [data-cursor-active="true"] *:not(input):not(textarea) {
          cursor: none !important;
        }
        /* Inputs keep their native I-beam so users know where they're typing. */
        [data-cursor-active="true"] input,
        [data-cursor-active="true"] textarea {
          cursor: text !important;
        }

        .cursor-overlay {
          /* Container at (0, 0). Inner elements translate. */
          contain: layout style paint;
        }

        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          margin-left: -15px;
          margin-top: -15px;
          border-radius: 9999px;
          will-change: transform, width, height, border-radius;
          transition:
            width 220ms cubic-bezier(0.2, 0, 0, 1),
            height 220ms cubic-bezier(0.2, 0, 0, 1),
            margin 220ms cubic-bezier(0.2, 0, 0, 1),
            border-radius 220ms cubic-bezier(0.2, 0, 0, 1),
            background-color 220ms ease,
            opacity 220ms ease;
          /* Holographic stack:
             - 1.5px white stroke for primary visibility
             - 1px dark halo behind it (box-shadow) for contrast on light bg
             - conic-gradient hue rotation for iridescent shimmer */
          border: 1.5px solid rgba(255, 255, 255, 0.94);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.35),
            0 0 12px rgba(120, 200, 255, 0.18);
          background: conic-gradient(
            from 0deg,
            rgba(255, 0, 122, 0.18),
            rgba(0, 229, 255, 0.18),
            rgba(120, 255, 180, 0.18),
            rgba(255, 200, 0, 0.18),
            rgba(255, 0, 122, 0.18)
          );
          animation: cursor-shimmer 4.5s linear infinite;
        }

        @keyframes cursor-shimmer {
          to { transform-origin: center; filter: hue-rotate(360deg); }
        }

        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          margin-top: -3px;
          background: #ff2d20;
          border-radius: 9999px;
          box-shadow:
            0 0 0 1.5px rgba(255, 255, 255, 0.92),
            0 0 0 2.5px rgba(0, 0, 0, 0.45);
          will-change: transform;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        /* ─── Flavor: accent (links, buttons, anything interactive) ─── */
        .cursor-overlay[data-flavor="accent"] .cursor-ring {
          width: 56px;
          height: 56px;
          margin-left: -28px;
          margin-top: -28px;
          background: rgba(255, 45, 32, 0.18);
          border-color: rgba(255, 255, 255, 0.96);
          box-shadow:
            0 0 0 1px #ff2d20,
            0 0 24px rgba(255, 45, 32, 0.45);
        }
        .cursor-overlay[data-flavor="accent"] .cursor-dot {
          width: 4px;
          height: 4px;
          margin-left: -2px;
          margin-top: -2px;
          background: #ffffff;
          box-shadow:
            0 0 0 1.5px rgba(0, 0, 0, 0.4);
        }

        /* ─── Flavor: image (gallery tiles, work tiles, covers) ─── */
        .cursor-overlay[data-flavor="image"] .cursor-ring {
          width: 64px;
          height: 64px;
          margin-left: -32px;
          margin-top: -32px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.94);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.45),
            0 0 32px rgba(255, 255, 255, 0.18);
        }
        .cursor-overlay[data-flavor="image"] .cursor-dot {
          opacity: 0;
        }

        /* ─── Flavor: text (paragraphs, prose) — I-beam ─── */
        .cursor-overlay[data-flavor="text"] .cursor-ring {
          width: 2px;
          height: 24px;
          margin-left: -1px;
          margin-top: -12px;
          border-radius: 0;
          background: rgba(255, 255, 255, 0.94);
          box-shadow:
            0 0 0 0.5px rgba(0, 0, 0, 0.5),
            0 0 8px rgba(0, 0, 0, 0.18);
          animation: none;
          border: none;
        }
        .cursor-overlay[data-flavor="text"] .cursor-dot {
          opacity: 0;
        }

        /* ─── Flavor: drag (pannable surfaces — gallery stage) ─── */
        .cursor-overlay[data-flavor="drag"] .cursor-ring {
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          background:
            linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)) center / 16px 1.5px no-repeat,
            linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)) center / 1.5px 16px no-repeat,
            conic-gradient(
              from 0deg,
              rgba(255, 0, 122, 0.18),
              rgba(0, 229, 255, 0.18),
              rgba(120, 255, 180, 0.18),
              rgba(255, 200, 0, 0.18),
              rgba(255, 0, 122, 0.18)
            );
        }
        .cursor-overlay[data-flavor="drag"] .cursor-dot {
          opacity: 0;
        }

        /* ─── Flavor: hidden ─── */
        .cursor-overlay[data-flavor="hidden"] .cursor-ring,
        .cursor-overlay[data-flavor="hidden"] .cursor-dot {
          opacity: 0;
        }

        /* ─── Pressed state — universal squeeze ─── */
        .cursor-overlay[data-pressed="true"] .cursor-ring {
          transform-origin: center;
          filter: brightness(1.15);
        }
        .cursor-overlay[data-pressed="true"] .cursor-dot {
          transform-origin: center;
        }

        /* ─── Ripple ─── */
        .cursor-ripple-host {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .cursor-ripple {
          position: fixed;
          width: 12px;
          height: 12px;
          margin-left: -6px;
          margin-top: -6px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 255, 255, 0.94);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.4),
            0 0 16px rgba(255, 45, 32, 0.3);
          pointer-events: none;
          animation: cursor-ripple ${RIPPLE_DURATION}ms cubic-bezier(0.2, 0, 0, 1) forwards;
        }
        @keyframes cursor-ripple {
          0% {
            opacity: 0.9;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(6.5);
          }
        }

        /* ─── Touch + reduced motion ─── */
        @media (pointer: coarse) {
          [data-cursor-active="true"],
          [data-cursor-active="true"] * {
            cursor: auto !important;
          }
          .cursor-overlay { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cursor-ring { animation: none; }
          .cursor-ripple { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
