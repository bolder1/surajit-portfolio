"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Chapter } from "@/lib/systemStory";
import { useScrollSteps } from "./useScrollSteps";

/**
 * PinnedChapter — the shared frame every chapter on /system uses.
 *
 * One tall outer element, one sticky stage. The visual is handed the active
 * step so it can advance itself; the narration column lists every beat at
 * once with the current one lit, so the reader can always see how much
 * argument is left. That is the difference between a scroll story and a
 * scrolljacked page: the length is legible.
 *
 * Unpinned (narrow, short, or reduced-motion) it collapses to an ordinary
 * stacked section with the visual on top and every beat readable.
 */
export function PinnedChapter({
  chapter,
  children,
}: {
  chapter: Chapter;
  children: (state: { active: number; progress: number; pinned: boolean }) => ReactNode;
}) {
  const steps = chapter.beats.length;
  const { ref, active, progress, pinned } = useScrollSteps(steps);

  // A six-beat chapter is taller than the stage it is pinned inside, which
  // clipped the chapter heading. Rather than shrink the type, the beat list
  // becomes a filmstrip: it holds a fixed height and slides so the active
  // beat sits centred. Scroll position is set, never animated from JS, so
  // the browser owns the easing.
  const stripRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !pinned) return;
    const li = strip.children[active] as HTMLElement | undefined;
    if (!li) return;
    strip.scrollTo({
      top: Math.max(0, li.offsetTop - (strip.clientHeight - li.offsetHeight) / 2),
      behavior: "smooth",
    });
  }, [active, pinned]);

  return (
    <section
      className={`sys-ch${pinned ? " is-pinned" : ""}`}
      id={chapter.id}
      ref={ref}
      // Each beat gets a viewport of travel, plus one to read the last on.
      style={pinned ? { minHeight: `${(steps + 1) * 100}vh` } : undefined}
      aria-labelledby={`sys-ch-${chapter.id}`}
    >
      <div className="sys-ch-stage">
        <div className="sys-ch-inner">
          <header className="sys-ch-head">
            <span className="sys-ch-no">{chapter.no}</span>
            <h2 className="sys-ch-name" id={`sys-ch-${chapter.id}`}>
              {chapter.name}
            </h2>
            <span className="sys-ch-count" aria-hidden>
              {String(Math.min(active + 1, steps)).padStart(2, "0")} / {String(steps).padStart(2, "0")}
            </span>
          </header>

          {/* A one-beat chapter is a demonstration, not a sequence — it gets
              the full width and its single beat runs underneath as a caption. */}
          <div className={`sys-ch-body${steps === 1 ? " is-solo" : ""}`}>
            <div className="sys-ch-visual">{children({ active, progress, pinned })}</div>

            <ol className="sys-ch-beats" ref={stripRef}>
              {chapter.beats.map((b, i) => (
                <li
                  key={b.kicker}
                  className={`sys-beat${i === active ? " is-on" : ""}${i < active ? " is-done" : ""}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="sys-beat-k">{b.kicker}</span>
                  <p className="sys-beat-l">{b.line}</p>
                  {b.note && <p className="sys-beat-n">{b.note}</p>}
                </li>
              ))}
            </ol>
          </div>

          {/* per-chapter scrub, so the pinned section reports its own length */}
          <div className="sys-ch-scrub" aria-hidden>
            <span style={{ transform: `scaleX(${pinned ? progress : 1})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
