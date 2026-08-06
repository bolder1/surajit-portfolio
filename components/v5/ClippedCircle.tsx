"use client";

import { useEffect, useRef } from "react";

/**
 * ClippedCircle — a cursor-following disc, clipped by its parent.
 *
 * Drop inside any `position: relative; overflow: hidden` element. The disc
 * tracks the pointer and scales in on enter, so the parent's own edges do the
 * masking — no clip-path maths, and it inherits whatever radius the parent
 * already has.
 *
 * It paints with `mix-blend-mode: difference`, which is what makes this worth
 * having over a plain highlight: the content above it inverts as the disc
 * passes, so one element handles both light-on-dark and dark-on-light without
 * anyone picking a hover colour.
 *
 * Position is written straight to the element as a transform inside rAF, not
 * through React state — a pointermove-driven setState would re-render the
 * subtree on every mouse event.
 *
 * Suppressed on coarse pointers, where there is no hover to follow, and under
 * prefers-reduced-motion.
 */
export function ClippedCircle({
  circleSize = 260,
  className,
}: {
  circleSize?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let seeded = false;
    let frame = 0;
    let stopAt = 0;
    let alive = false;

    // The loop only turns over while the pointer is inside, plus the length of
    // the scale-out transition. A page can carry a dozen of these — a
    // permanent rAF per instance would burn frames on rows nobody is touching.
    const loop = () => {
      eased.x += (target.x - eased.x) * 0.22;
      eased.y += (target.y - eased.y) * 0.22;
      el.style.transform = `translate3d(${eased.x - circleSize / 2}px, ${
        eased.y - circleSize / 2
      }px, 0) scale(${alive ? 1 : 0})`;

      if (alive || performance.now() < stopAt) {
        frame = requestAnimationFrame(loop);
      } else {
        frame = 0;
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!seeded) {
        eased.x = target.x;
        eased.y = target.y;
        seeded = true;
      }
      wake();
    };
    const onEnter = () => {
      alive = true;
      wake();
    };
    const onLeave = () => {
      alive = false;
      seeded = false;
      // Keep drawing until the disc has finished scaling away, so it does not
      // freeze mid-shrink on the last painted frame.
      stopAt = performance.now() + 420;
      wake();
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [circleSize]);

  return (
    <span
      ref={ref}
      className={`v5-clip-circle ${className ?? ""}`}
      style={{ width: circleSize, height: circleSize }}
      aria-hidden
    />
  );
}
