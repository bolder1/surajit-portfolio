"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { CoverImage } from "./CoverImage";

/**
 * Carousel — brutalist image carousel.
 *
 * Wraps CoverImage so the same load-error-→-glyph fallback applies per
 * slide. Renders prev / next arrows in matveyan style, dot indicators,
 * counter, optional caption strip.
 *
 * Interactions:
 *   - Click arrows or dots
 *   - ← / → keys when focused
 *   - Touch / pointer swipe (>60px horizontal)
 *   - Auto-advance off by default (set `autoplay` prop)
 *
 * Sizing:
 *   - Outer frame inherits caller width
 *   - aspect prop drives the height (default 16:10)
 *
 * Empty input: renders nothing (caller's job to gate).
 */

export interface CarouselSlide {
  /** Image src; can be omitted to fall back to glyph */
  src?: string;
  alt: string;
  caption?: string;
  /** Override glyph for this slide (otherwise inherits prop) */
  glyph?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  /** Fallback glyph + colors when no src on a slide */
  glyph?: string;
  bg?: string;
  ink?: string;
  aspect?: "4:3" | "16:10" | "16:9" | "21:9" | "1:1";
  autoplay?: number; // ms between advances; 0/undefined = off
  className?: string;
  /** Accessible label for the carousel region */
  label?: string;
}

const ASPECT_PADDING: Record<NonNullable<CarouselProps["aspect"]>, string> = {
  "4:3":  "75%",
  "16:10": "62.5%",
  "16:9": "56.25%",
  "21:9": "42.86%",
  "1:1":  "100%",
};

export function Carousel({
  slides,
  glyph,
  bg,
  ink,
  aspect = "16:10",
  autoplay,
  className = "",
  label = "Image carousel",
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [pressed, setPressed] = useState(false);
  const downX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + total) % total);
    },
    [total]
  );
  const goTo = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);

  /* Keyboard nav — only when the carousel root has focus or contains it. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  /* Autoplay */
  useEffect(() => {
    if (!autoplay || total <= 1) return;
    if (pressed) return;
    const id = window.setInterval(() => go(1), autoplay);
    return () => window.clearInterval(id);
  }, [autoplay, go, pressed, total]);

  /* Pointer swipe */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    downX.current = e.clientX;
    setPressed(true);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (downX.current == null) return;
    const dx = e.clientX - downX.current;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    downX.current = null;
    setPressed(false);
  };

  if (total === 0) return null;
  const current = slides[index];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={`outline-none ${className}`}
      data-cursor="work"
    >
      {/* Track */}
      <div
        className="relative w-full overflow-hidden border border-[var(--rule-soft)] bg-[var(--paper-2)] select-none"
        style={{ paddingBottom: ASPECT_PADDING[aspect] }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Each slide stacked absolutely; opacity-crossfade between them */}
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? "auto" : "none",
            }}
            aria-hidden={i !== index}
          >
            <CoverImage
              src={s.src}
              alt={s.alt}
              glyph={s.glyph ?? glyph}
              bg={bg}
              ink={ink}
              className="w-full h-full"
              cursorFlavor="work"
              eager={i === 0}
            />
          </div>
        ))}

        {/* Frame border accent — top-left + bottom-right corner ticks */}
        <span aria-hidden className="pointer-events-none absolute top-0 left-0 w-4 h-px bg-[var(--accent)]" />
        <span aria-hidden className="pointer-events-none absolute top-0 left-0 w-px h-4 bg-[var(--accent)]" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-4 h-px bg-[var(--accent)]" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-px h-4 bg-[var(--accent)]" />

        {/* Prev / Next arrows — only render when more than one slide */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              data-cursor="accent"
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 bg-[var(--paper)]/85 backdrop-blur-[2px] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--paper)] transition-colors mono"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              data-cursor="accent"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 bg-[var(--paper)]/85 backdrop-blur-[2px] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--paper)] transition-colors mono"
            >
              →
            </button>
          </>
        )}

        {/* Counter — top right mono */}
        {total > 1 && (
          <div
            aria-hidden
            className="absolute top-3 right-3 mono text-[10px] tracking-[0.14em] uppercase bg-[var(--paper)]/80 backdrop-blur-[2px] px-2 py-1 text-[var(--ink-soft)]"
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Caption + dots strip */}
      {(current.caption || total > 1) && (
        <div className="mt-3 flex items-baseline justify-between gap-4">
          {current.caption ? (
            <p className="mono text-[var(--muted)] flex-1 min-w-0 truncate">
              {current.caption}
            </p>
          ) : (
            <span />
          )}
          {total > 1 && (
            <div className="flex items-center gap-1.5 shrink-0" role="tablist" aria-label="Slide indicator">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  data-cursor="accent"
                  className={`h-1.5 transition-all duration-200 ${
                    i === index
                      ? "w-6 bg-[var(--accent)]"
                      : "w-3 bg-[var(--rule-soft)] hover:bg-[var(--ink-soft)]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
