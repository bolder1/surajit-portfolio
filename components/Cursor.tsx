"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor — matveyan-style custom cursor with per-section flavors.
 *
 * Implementation:
 *   - Two layers: an inner 6px dot (snaps to pointer) and an outer 32px ring
 *     (lerps toward pointer, giving the soft trailing feel).
 *   - Both layers use `transform` for paint-fast updates.
 *   - The default cursor is hidden via [data-cursor-active] on <html>.
 *   - Flavors are read from the closest ancestor with [data-cursor=…]:
 *       default     — small dot + outline ring
 *       accent      — fills with accent on links / interactive
 *       work        — square block (echoes work tiles)
 *       gallery     — crosshair (echoes the panning plane)
 *       hidden      — fully hidden (e.g. inputs)
 *   - Disabled entirely on touch / coarse-pointer devices.
 *   - prefers-reduced-motion: kills the lerp; ring snaps to dot.
 *
 * Note: the cursor only mounts on pointer:fine to avoid touch-tap delay
 * and to keep the default cursor behavior on mobile/tablet.
 */

type Flavor = "default" | "accent" | "work" | "gallery" | "hidden";

const RING_LERP = 0.18; // 0..1; lower = softer trail

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const flavor = useRef<Flavor>("default");
  const flavorEl = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);

  /* Probe pointer:fine + reduced motion + enable when usable. */
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.setAttribute("data-cursor-active", "true");
    return () => {
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, []);

  /* Pointer + flavor wiring. */
  useEffect(() => {
    if (!enabled) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (reduced) {
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
      }
      // Detect flavor from the topmost element under the pointer.
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const host = el?.closest<HTMLElement>("[data-cursor]") ?? null;
      const f = (host?.getAttribute("data-cursor") as Flavor | null) ?? "default";
      if (f !== flavor.current) {
        flavor.current = f;
        flavorEl.current?.setAttribute("data-flavor", f);
      }
    };

    const onDown = () => flavorEl.current?.setAttribute("data-pressed", "true");
    const onUp = () => flavorEl.current?.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const tick = () => {
      // Dot snaps instantly.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      // Ring lerps toward target.
      if (ringRef.current) {
        if (!reduced) {
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
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={flavorEl}
      data-flavor="default"
      aria-hidden
      className="cursor-overlay pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        // The wrapper itself sits at (0,0); the inner ring + dot translate.
        contain: "layout style paint size",
      }}
    >
      {/* Ring — outer, lerps */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          border: "1px solid currentColor",
          borderRadius: 9999,
          color: "var(--ink)",
          mixBlendMode: "difference",
          transition: "width 200ms ease, height 200ms ease, margin 200ms ease, border-radius 200ms ease, background-color 200ms ease, border-color 200ms ease, opacity 200ms ease",
          willChange: "transform",
        }}
      />
      {/* Dot — inner, snaps */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          background: "var(--accent)",
          borderRadius: 9999,
          willChange: "transform",
        }}
      />

      {/* Flavor-specific overrides via global styles below.
         These keep the cursor file self-contained. */}
      <style jsx global>{`
        [data-cursor-active="true"] {
          cursor: none;
        }
        [data-cursor-active="true"] * {
          cursor: none !important;
        }

        /* Default — nothing extra; the React inline style covers it. */

        /* Accent — fills the ring with accent + ink-on-accent dot */
        .cursor-overlay[data-flavor="accent"] .cursor-ring {
          background: var(--accent);
          border-color: var(--accent);
          mix-blend-mode: normal;
          width: 44px;
          height: 44px;
          margin-left: -22px;
          margin-top: -22px;
        }
        .cursor-overlay[data-flavor="accent"] .cursor-dot {
          background: var(--paper);
          width: 4px;
          height: 4px;
          margin-left: -2px;
          margin-top: -2px;
        }

        /* Work — square block, echoes work tiles */
        .cursor-overlay[data-flavor="work"] .cursor-ring {
          border-radius: 0;
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          background: transparent;
          border-color: var(--ink);
          mix-blend-mode: difference;
        }
        .cursor-overlay[data-flavor="work"] .cursor-dot {
          opacity: 0;
        }

        /* Gallery — crosshair (two thin lines) */
        .cursor-overlay[data-flavor="gallery"] .cursor-ring {
          border-radius: 0;
          width: 56px;
          height: 56px;
          margin-left: -28px;
          margin-top: -28px;
          border: none;
          background:
            linear-gradient(var(--ink), var(--ink)) center / 1px 100% no-repeat,
            linear-gradient(var(--ink), var(--ink)) center / 100% 1px no-repeat;
          mix-blend-mode: difference;
        }
        .cursor-overlay[data-flavor="gallery"] .cursor-dot {
          width: 4px;
          height: 4px;
          margin-left: -2px;
          margin-top: -2px;
          background: var(--accent);
        }

        /* Hidden — hide both layers */
        .cursor-overlay[data-flavor="hidden"] .cursor-ring,
        .cursor-overlay[data-flavor="hidden"] .cursor-dot {
          opacity: 0;
        }

        /* Pressed — squeeze the ring */
        .cursor-overlay[data-pressed="true"] .cursor-ring {
          transform-origin: center;
          width: 22px;
          height: 22px;
          margin-left: -11px;
          margin-top: -11px;
        }

        @media (pointer: coarse) {
          [data-cursor-active="true"],
          [data-cursor-active="true"] * {
            cursor: auto !important;
          }
          .cursor-overlay { display: none; }
        }
      `}</style>
    </div>
  );
}
