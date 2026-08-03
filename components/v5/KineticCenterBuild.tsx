"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * KineticCenterBuild — a phrase assembles word by word, staying centred.
 *
 * Words enter from the right with a soft blur and push the line as they land;
 * because the row is centred and each word is `layout`-animated, the existing
 * words slide left to make room rather than the line growing from a fixed
 * origin. That reflow is the effect — the sentence appears to compose itself.
 *
 * Announced via `aria-live="polite"` on a visually-hidden copy of the FULL
 * phrase, not the partial build. Announcing every intermediate state would
 * read the sentence a word at a time, which is noise; announcing the finished
 * phrase once is the useful thing.
 *
 * Reduced motion shows the whole phrase at once and swaps instantly.
 */
export function KineticCenterBuild({
  phrases,
  /** ms between words landing */
  stagger = 190,
  /** ms the completed phrase holds before the next one */
  hold = 2100,
  className,
}: {
  phrases: string[];
  stagger?: number;
  hold?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [built, setBuilt] = useState(0);

  const words = phrases[phraseIdx]?.split(" ") ?? [];
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (reduced) {
      // Still cycle, just without the per-word build.
      setBuilt(words.length);
      const t = setTimeout(
        () => setPhraseIdx((i) => (i + 1) % phrases.length),
        hold + 600
      );
      return () => clearTimeout(t);
    }

    if (built < words.length) {
      const t = setTimeout(() => setBuilt((b) => b + 1), stagger);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setPhraseIdx((i) => (i + 1) % phrases.length);
      setBuilt(0);
    }, hold);
    return () => clearTimeout(t);
  }, [built, words.length, phrases.length, stagger, hold, reduced]);

  // Reset the build when the phrase changes.
  useEffect(() => {
    if (!reduced) setBuilt(0);
  }, [phraseIdx, reduced]);

  // Root is a <span>, not a <div>: this gets dropped inside an <h2> as the
  // heading's own content, and a block element there is invalid nesting.
  return (
    <span className={`v5-kcb ${className ?? ""}`}>
      <span className="v5-kcb-live" aria-live="polite">
        {phrases[phraseIdx]}
      </span>

      {/* Ghost. The longest phrase, laid out with identical words and gaps but
          never painted, so the block's height is the tallest it will ever need
          and the page below cannot shift as words land or a phrase rewraps.
          A `min-height` guess does not survive a viewport where the longest
          phrase wraps to three lines; measuring the real thing does. */}
      <span className="v5-kcb-ghost" aria-hidden>
        {longest.split(" ").map((w, i) => (
          <span className="v5-kcb-word" key={i}>
            {w}
          </span>
        ))}
      </span>

      <span className="v5-kcb-row" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          {words.slice(0, built).map((w, i) => (
            <motion.span
              className="v5-kcb-word"
              key={`${phraseIdx}-${i}-${w}`}
              layout
              initial={reduced ? false : { opacity: 0, x: 34, filter: "blur(9px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, filter: "blur(7px)" }}
              transition={{
                layout: { type: "spring", stiffness: 420, damping: 38 },
                duration: 0.34,
                ease: [0.2, 0.7, 0.3, 1],
              }}
            >
              {w}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </span>
  );
}
