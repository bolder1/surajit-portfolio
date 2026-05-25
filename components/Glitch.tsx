"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Glitch — CSS-only RGB-shift + scanline-flash text effect.
 *
 * Default mode: plays on first paint (a 600ms shudder), then again on
 * hover/focus. Honors prefers-reduced-motion (effect disabled).
 *
 * Implementation:
 *   - Two ::before/::after pseudo-layers carry the same text content
 *     and shift on a randomized timing using CSS animation steps.
 *   - The actual element renders the text normally; the layers add
 *     red/cyan offsets.
 *   - Because pseudo elements can't read children for content, we
 *     mirror the text via `data-text` attribute.
 */
export function Glitch({
  children,
  intensity = "regular",
  trigger = "hover",
  className = "",
}: {
  children: string;
  intensity?: "regular" | "loud";
  /** auto = play once on mount; hover = on hover/focus; always = idle loop */
  trigger?: "auto" | "hover" | "always";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (trigger !== "auto") return;
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-glitch-state", "play");
    const id = window.setTimeout(() => {
      el.setAttribute("data-glitch-state", "idle");
    }, 700);
    return () => window.clearTimeout(id);
  }, [trigger]);

  return (
    <span
      ref={ref}
      data-text={children}
      data-glitch-trigger={trigger}
      data-glitch-intensity={intensity}
      data-glitch-state="idle"
      className={`glitch ${className}`}
      style={{ position: "relative", display: "inline-block" } as CSSProperties}
    >
      {children}
      <style jsx global>{`
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0;
        }
        .glitch::before {
          color: #ff2d20;
          mix-blend-mode: screen;
          transform: translate(-2px, 0);
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }
        .glitch::after {
          color: #00e5ff;
          mix-blend-mode: screen;
          transform: translate(2px, 0);
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        @keyframes glitch-burst {
          0%   { opacity: 0; transform: translate(0, 0); }
          10%  { opacity: 1; transform: translate(-4px, 0); }
          20%  { opacity: 0.7; transform: translate(3px, -1px); }
          35%  { opacity: 0.9; transform: translate(-2px, 1px); }
          55%  { opacity: 0.5; transform: translate(4px, 0); }
          75%  { opacity: 0.8; transform: translate(-1px, -1px); }
          100% { opacity: 0; transform: translate(0, 0); }
        }
        @keyframes glitch-burst-after {
          0%   { opacity: 0; transform: translate(0, 0); }
          10%  { opacity: 1; transform: translate(4px, 0); }
          20%  { opacity: 0.7; transform: translate(-3px, 1px); }
          35%  { opacity: 0.9; transform: translate(2px, -1px); }
          55%  { opacity: 0.5; transform: translate(-4px, 0); }
          75%  { opacity: 0.8; transform: translate(1px, 1px); }
          100% { opacity: 0; transform: translate(0, 0); }
        }

        /* trigger=hover */
        .glitch[data-glitch-trigger="hover"]:hover::before,
        .glitch[data-glitch-trigger="hover"]:focus-visible::before {
          animation: glitch-burst 600ms steps(8, end) 1;
        }
        .glitch[data-glitch-trigger="hover"]:hover::after,
        .glitch[data-glitch-trigger="hover"]:focus-visible::after {
          animation: glitch-burst-after 600ms steps(8, end) 1;
        }

        /* trigger=auto — state-driven */
        .glitch[data-glitch-trigger="auto"][data-glitch-state="play"]::before {
          animation: glitch-burst 600ms steps(8, end) 1;
        }
        .glitch[data-glitch-trigger="auto"][data-glitch-state="play"]::after {
          animation: glitch-burst-after 600ms steps(8, end) 1;
        }

        /* trigger=always — loops gently */
        .glitch[data-glitch-trigger="always"]::before {
          animation: glitch-burst 1.6s steps(10, end) infinite;
          animation-delay: 2s;
        }
        .glitch[data-glitch-trigger="always"]::after {
          animation: glitch-burst-after 1.6s steps(10, end) infinite;
          animation-delay: 2.4s;
        }

        /* loud variant — doubles the offset */
        .glitch[data-glitch-intensity="loud"]::before {
          transform: translate(-4px, 0);
        }
        .glitch[data-glitch-intensity="loud"]::after {
          transform: translate(4px, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .glitch::before,
          .glitch::after { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </span>
  );
}

/**
 * ReducedMotionAck — ozgur.design touch. Shows a small mono line
 * acknowledging the user's reduced-motion preference. Lives in the
 * page footer / about page.
 */
export function ReducedMotionAck() {
  const seen = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    seen.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Force re-render via class so we don't ship hidden React state.
    document.documentElement.setAttribute(
      "data-reduced-motion",
      seen.current ? "true" : "false"
    );
  }, []);
  return (
    <p
      className="mono text-[var(--muted-soft)] text-[10px]"
      data-reduced-motion-only
    >
      btw, you seem to have reduced motion enabled. the cursor + scroll
      effects on this site are calmer for you.
      <style jsx global>{`
        [data-reduced-motion="true"] [data-reduced-motion-only] { display: block; }
        [data-reduced-motion-only] { display: none; }
      `}</style>
    </p>
  );
}
