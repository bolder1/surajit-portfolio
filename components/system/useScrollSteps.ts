"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrollSteps — the engine behind every pinned chapter on /system.
 *
 * A chapter is a tall outer element containing one sticky viewport. As the
 * outer element travels past, this reports which step is active and how far
 * through the whole chapter we are (0..1).
 *
 * Deliberately measured against the element's own bounding box rather than
 * window.scrollY: chapters sit at unpredictable document offsets and a
 * scrollY-based sum drifts the moment anything above them changes height.
 *
 * Below `minWidth`/`minHeight` the caller drops its pin and becomes a native
 * scroller, so `pinned` is reported here rather than duplicated per chapter —
 * hijacked scroll on a phone is not worth the effect.
 */
export function useScrollSteps(steps: number, opts?: { minWidth?: number; minHeight?: number }) {
  const minWidth = opts?.minWidth ?? 760;
  const minHeight = opts?.minHeight ?? 620;

  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const mq = () =>
      window.innerWidth >= minWidth &&
      window.innerHeight >= minHeight &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;

      const on = mq();
      setPinned(on);
      if (!on) {
        // Unpinned: every step is simply present, so light them all.
        setActive(steps - 1);
        setProgress(1);
        return;
      }

      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      // Before the chapter arrives p is 0; after it leaves, 1.
      const p = travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));
      setProgress(p);
      // Steps get equal shares; the last one holds through the tail so the
      // chapter doesn't flick back before it unpins.
      setActive(Math.min(steps - 1, Math.floor(p * steps)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [steps, minWidth, minHeight]);

  return { ref, active, progress, pinned };
}
