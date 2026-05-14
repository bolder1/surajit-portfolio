"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** The original outcome value e.g. "↓ 38%", "↑ 2.4×", "< 90s", "0", "WCAG AA" */
  value: string;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Animated outcome counter for case study Outcomes section.
 * Parses the first numeric token in `value` and counts up from 0
 * when the element scrolls into view. Non-numeric values render
 * as static text (e.g. "WCAG AA", "iOS + Android"). Honors
 * prefers-reduced-motion by skipping the animation entirely.
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const parsed = parseNumeric(value);
    if (!parsed) {
      /* Non-numeric — leave as is. */
      setDisplay(value);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || startedRef.current) continue;
          startedRef.current = true;
          animateValue(parsed, value, setDisplay);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);

    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

interface Parsed {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
}

function parseNumeric(input: string): Parsed | null {
  /* Match a numeric token, optional decimal, surrounded by anything else.
     Examples handled:
       "↓ 38%"   → prefix "↓ ", num 38, suffix "%"
       "↑ 2.4×"  → prefix "↑ ", num 2.4, suffix "×"
       "< 90s"   → prefix "< ", num 90, suffix "s"
       "0"       → prefix "", num 0, suffix ""
       "30–40%"  → prefix "", num 30, suffix "–40%"  (we count the first number,
                                                        leave the range tail static)
       "120+"    → prefix "", num 120, suffix "+"
       "★ 4.6"   → prefix "★ ", num 4.6, suffix ""
  */
  const m = /^(.*?)(\d+(?:\.\d+)?)(.*)$/s.exec(input);
  if (!m) return null;
  const [, prefix, numStr, suffix] = m;
  const num = parseFloat(numStr);
  if (Number.isNaN(num)) return null;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix, number: num, suffix, decimals };
}

function animateValue(
  parsed: Parsed,
  fallback: string,
  set: (s: string) => void
) {
  const duration = 1200;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3); /* cubic ease-out */

  const frame = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const current = parsed.number * ease(t);
    const formatted =
      parsed.decimals > 0
        ? current.toFixed(parsed.decimals)
        : Math.round(current).toString();
    set(`${parsed.prefix}${formatted}${parsed.suffix}`);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      /* Ensure final state matches the original string exactly. */
      set(fallback);
    }
  };
  requestAnimationFrame(frame);
}
