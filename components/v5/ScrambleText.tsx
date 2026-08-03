"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ScrambleText — characters shuffle through noise, then resolve.
 *
 * Accessibility contract:
 *
 * - **Reduced motion**: the effect never runs; the real text is always shown.
 * - **Hover-device detection**: `(hover: hover) and (pointer: fine)` gates the
 *   pointer trigger, so a touch device cannot leave the text stuck mid-scramble.
 * - **The real text is always in the DOM.** Scrambled glyphs are written to a
 *   separate `aria-hidden` layer and the accessible copy stays intact, so a
 *   screen reader, a search crawler and a text search all see the words. This
 *   is why the component does not simply overwrite `textContent`.
 *
 * On the keyboard trigger: the upstream spec renders a `<button type="button">`
 * so focus can start the effect. That is right for a control, and wrong for a
 * section heading — it announces "button" for something that does nothing when
 * pressed, and adds a tab stop that leads nowhere. So `interactive` is opt-in:
 * decorative headings render a plain span and are skipped by the tab order,
 * while anything genuinely actionable gets the button and the focus trigger.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$@/\\<>*+=-";

export function ScrambleText({
  text,
  className,
  /** ms the whole run takes */
  duration = 620,
  /** ms between glyph swaps — lower is faster/noisier */
  speed = 34,
  /** render as a focusable button and also trigger on focus */
  interactive = false,
}: {
  text: string;
  className?: string;
  duration?: number;
  speed?: number;
  interactive?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  // Keep in sync if the copy changes underneath us.
  useEffect(() => setDisplay(text), [text]);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setDisplay(text);
  }, [text]);

  const run = useCallback(() => {
    if (!enabled.current || timer.current) return;
    const started = performance.now();
    const chars = [...text];

    timer.current = setInterval(() => {
      frame.current += 1;
      const p = Math.min(1, (performance.now() - started) / duration);
      // Resolve left to right: a character locks once the wavefront passes it.
      const settled = p * chars.length;

      setDisplay(
        chars
          .map((c, i) => {
            if (c === " ") return c;
            if (i < settled) return c;
            // Deterministic per (frame, index) rather than Math.random, so the
            // noise is reproducible and never differs between two renders of
            // the same frame.
            const n = (frame.current * 31 + i * 17) % GLYPHS.length;
            return GLYPHS[n];
          })
          .join("")
      );

      if (p >= 1) stop();
    }, speed);
  }, [text, duration, speed, stop]);

  const handlers = {
    onPointerEnter: run,
    onPointerLeave: stop,
    ...(interactive ? { onFocus: run, onBlur: stop } : {}),
  };

  // The accessible copy exists ONLY while the glyphs are scrambled.
  //
  // Keeping it mounted permanently put the words in the DOM twice, so
  // selecting a heading and copying it produced every word doubled —
  // "Everything here isEverything here is deployed.deployed." At rest the
  // painted copy already holds the real text, so a second one buys nothing
  // and costs correct selection, correct copy, and a clean crawlable heading.
  // During the scramble it comes back, so assistive tech never sees noise.
  const scrambling = display !== text;

  const inner = (
    <>
      {scrambling && <span className="v5-scr-a11y">{text}</span>}
      {/* The painted copy. Hidden from assistive tech ONLY while it is showing
          noise — at rest it holds the real text and is the heading's only
          child, so hiding it unconditionally left the heading with no
          accessible name at all. */}
      <span className="v5-scr-ink" aria-hidden={scrambling || undefined}>
        {display}
      </span>
    </>
  );

  if (interactive) {
    return (
      <button type="button" className={`v5-scr ${className ?? ""}`} {...handlers}>
        {inner}
      </button>
    );
  }

  return (
    <span className={`v5-scr ${className ?? ""}`} {...handlers}>
      {inner}
    </span>
  );
}

/**
 * ScrambleCycle — the same noise, but self-driving.
 *
 * Where `ScrambleText` waits for a pointer, this walks a list of phrases and
 * scrambles into each one on a timer. Unresolved characters are painted in the
 * accent colour and lock to the body colour as the wavefront passes, so the
 * line reads as text resolving out of static rather than text being replaced.
 *
 * Differences from the hover component, and why:
 *
 * - **It runs without a pointer**, so `(hover: hover)` is not a gate here — a
 *   phone gets the effect too. Reduced motion still turns it off entirely and
 *   leaves the first phrase standing.
 * - **The live phrase is announced once per change**, not per frame. An
 *   `aria-live` region fed mid-scramble would read gibberish aloud.
 * - Characters are per-span so the accent can be applied to just the noise;
 *   `ScrambleText` gets away with one flat string because it never recolours.
 */
export function ScrambleCycle({
  phrases,
  /** ms each phrase holds once resolved */
  interval = 2000,
  /** ms between glyph swaps */
  speed = 30,
  className,
}: {
  phrases: string[];
  interval?: number;
  speed?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  // `settled` is how many characters have locked. Starting at the full length
  // means the first server/client paint is the plain phrase — no hydration gap.
  const [settled, setSettled] = useState(Number.POSITIVE_INFINITY);
  const frame = useRef(0);

  const phrase = phrases[index] ?? "";

  // Advance the phrase on a timer.
  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
      setSettled(0);
    }, interval);
    return () => clearInterval(t);
  }, [phrases.length, interval]);

  // Resolve the current phrase left to right.
  useEffect(() => {
    if (settled >= phrase.length) return;
    const t = setInterval(() => {
      frame.current += 1;
      setSettled((s) => s + 1);
    }, speed);
    return () => clearInterval(t);
  }, [settled, phrase.length, speed]);

  return (
    <span className={`v5-scrc ${className ?? ""}`}>
      {/* Announced once per phrase — never mid-resolve. */}
      <span className="v5-scr-live" aria-live="polite">
        {phrase}
      </span>
      <span aria-hidden>
        {[...phrase].map((c, i) => {
          if (c === " ") return <span key={i}> </span>;
          const locked = i < settled;
          const n = (frame.current * 31 + i * 17) % GLYPHS.length;
          return (
            <span key={i} className={locked ? undefined : "v5-scrc-noise"}>
              {locked ? c : GLYPHS[n]}
            </span>
          );
        })}
      </span>
    </span>
  );
}
