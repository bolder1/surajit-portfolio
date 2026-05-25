"use client";

import { useEffect, useState } from "react";

/**
 * ArchiveLoader — synapserstudio boot sequence.
 *
 * Phases:
 *   0  "hold"    — dark square sits center, gentle pulse (600ms)
 *   1  "expand"  — the square scales out + fades, opening the page (700ms)
 *   2  "done"    — overlay unmounted, parent shows gallery at small scale
 *
 * The parent uses the same timing to drive its own "stage zoom" — the
 * gallery is initially scaled to 0.6 and zooms to 1.0 ~1.5s after the
 * loader finishes, giving the immersive "boot then settle" feel.
 *
 * Honors prefers-reduced-motion: skips animation, fires onDone immediately.
 */
export function ArchiveLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setPhase(2);
      onDone();
      return;
    }
    // hold → expand
    const t1 = window.setTimeout(() => setPhase(1), 700);
    // expand → done
    const t2 = window.setTimeout(() => {
      setPhase(2);
      onDone();
    }, 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  if (phase === 2) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center bg-[color:var(--v2-paper)]"
      style={{
        opacity: phase === 1 ? 0 : 1,
        transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Center mark — a small dark square that pulses, then zooms out
          well past the viewport edge as the overlay fades. */}
      <div
        className="bg-[color:var(--v2-ink)]"
        style={{
          width: 48,
          height: 48,
          transform:
            phase === 0
              ? "scale(1)"
              : "scale(40)",
          transition:
            "transform 1100ms cubic-bezier(0.7, 0, 0.84, 0)",
        }}
      />
      {/* Hairline ring that pulses */}
      <div
        className="absolute w-12 h-12 border border-[color:var(--v2-ink)]"
        style={{
          animation: phase === 0 ? "v2-pulse 900ms ease-in-out infinite" : "none",
          opacity: phase === 0 ? 0.6 : 0,
          transition: "opacity 200ms",
        }}
      />

      {/* Bottom mono — boot text */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 v2-mono"
        style={{
          opacity: phase === 0 ? 1 : 0,
          transition: "opacity 280ms ease",
        }}
      >
        loading archive
      </div>

      <style jsx global>{`
        @keyframes v2-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.45);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
