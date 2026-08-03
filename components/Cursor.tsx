"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor — an accent layer around the real pointer.
 *
 * **The OS arrow is never hidden.** An earlier version set `cursor: none`
 * site-wide and drew a dot in its place, which trades a pointer the system
 * always draws correctly for one that disappears whenever a frame is late,
 * an overlay mis-stacks, or JS has not hydrated yet. Everything here is
 * additive: take it all away and the visitor still has a working cursor.
 *
 * Visual stack:
 *   1. Ring   — 1.5px stroke trailing the pointer on a lerp, over a dark
 *      halo so it survives bright imagery as well as the near-black paper.
 *   2. Label  — a chip trailing further back, naming the action under the
 *      pointer, filled from [data-cursor-label].
 *   3. Ripple — one thin accent ring per pointerdown, out and gone.
 *
 * The ring used to carry a rotating conic rainbow. Taken out: an iridescent
 * shimmer belongs to no palette on this site and reads as decoration applied
 * to a cursor rather than as a cursor. The accent now comes from
 * --cursor-accent, which each design system sets for itself.
 *
 * Per-section flavors (data-cursor on the closest ancestor):
 *   default — ring
 *   accent  — ring fills with the accent and grows
 *   image   — ring becomes a rounded square frame (for tiles)
 *   text    — ring collapses into a 2 × 24 I-beam (for prose)
 *   drag    — ring shows a cross icon (panning surfaces)
 *   hidden  — fades fully
 *
 * Auto-detection — interactive elements without a data-cursor get the
 * "accent" flavor automatically, so links and buttons light up with no
 * per-element wiring.
 *
 * Touch / coarse pointer: never mounts.
 * prefers-reduced-motion: lerp and ripple short-circuit.
 */

type Flavor = "default" | "accent" | "image" | "text" | "drag" | "hidden";

const RING_LERP = 0.22;
const RIPPLE_DURATION = 480; // ms — keep in sync with @keyframes ripple
const RIPPLE_LIMIT = 6;       // max concurrent ripple elements

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const flavorEl = useRef<HTMLDivElement>(null);
  const rippleHostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const flavor = useRef<Flavor>("default");
  const label = useRef<string | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const follow = useRef({ x: -100, y: -100 });
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

      // Follow label — the verb for whatever is under the pointer. Read from
      // the DOM rather than held in React state so a pointermove never causes
      // a render; the label element is written to directly, like the ring.
      const tagged = el?.closest<HTMLElement>("[data-cursor-label]");
      const next = tagged?.getAttribute("data-cursor-label") ?? null;
      if (next !== label.current) {
        label.current = next;
        const node = labelRef.current;
        if (node) {
          if (next) node.textContent = next;
          node.classList.toggle("is-on", Boolean(next));
        }
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
      if (ringRef.current) {
        if (!reducedMotion.current) {
          ring.current.x += (target.current.x - ring.current.x) * RING_LERP;
          ring.current.y += (target.current.y - ring.current.y) * RING_LERP;
        }
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      if (labelRef.current) {
        // Trails further behind than the ring, so the label reads as being
        // dragged along rather than pinned to the pointer.
        if (reducedMotion.current) {
          follow.current.x = target.current.x;
          follow.current.y = target.current.y;
        } else {
          follow.current.x += (target.current.x - follow.current.x) * 0.13;
          follow.current.y += (target.current.y - follow.current.y) * 0.13;
        }
        labelRef.current.style.transform = `translate3d(${
          follow.current.x + 20
        }px, ${follow.current.y + 20}px, 0)`;
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
      {/* Ripple host — click ripples are appended here */}
      <div ref={rippleHostRef} className="cursor-ripple-host" />
      {/* Follow label — filled from [data-cursor-label] on hover */}
      <div ref={labelRef} className="v5-cursor-follow" />

      <style jsx global>{`
        /* The OS cursor stays. An earlier version set \`cursor: none\` and drew
           a dot in its place — which means when anything about the overlay is
           wrong, or a frame is late, the visitor has no pointer at all. The
           ring is decoration; the arrow is the thing you steer with, and the
           system draws it better than a div can. */

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
          /* Stroke plus a dark halo behind it — that pairing is what keeps
             the ring legible on both the near-black paper and any bright
             imagery it crosses, with no palette of its own. */
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.4),
            0 0 14px rgba(0, 0, 0, 0.25);
          background: transparent;
        }


        /* ─── Flavor: accent (links, buttons, anything interactive) ─── */
        .cursor-overlay[data-flavor="accent"] .cursor-ring {
          width: 52px;
          height: 52px;
          margin-left: -26px;
          margin-top: -26px;
          background: color-mix(in srgb, var(--cursor-accent, #d9472f) 16%, transparent);
          border-color: var(--cursor-accent, #d9472f);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.4),
            0 0 26px color-mix(in srgb, var(--cursor-accent, #d9472f) 40%, transparent);
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

        /* ─── Flavor: drag (pannable surfaces — gallery stage) ─── */
        .cursor-overlay[data-flavor="drag"] .cursor-ring {
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          background:
            linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)) center / 16px 1.5px no-repeat,
            linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)) center / 1.5px 16px no-repeat;
        }

        /* ─── Flavor: hidden ─── */
        .cursor-overlay[data-flavor="hidden"] .cursor-ring,

        /* ─── Pressed state — universal squeeze ─── */
        .cursor-overlay[data-pressed="true"] .cursor-ring {
          transform-origin: center;
          filter: brightness(1.15);
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
          border: 1.5px solid var(--cursor-accent, #d9472f);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
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
          .cursor-ripple { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
