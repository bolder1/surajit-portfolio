import { Fragment } from "react";

/**
 * Ticks — renders `backticked` spans in prose as <code>.
 *
 * The copy in lib/designSystem carries token names inline, and a token name
 * set in body text is genuinely hard to read: `_global-sizes/20px = 1-25rem`
 * has spaces, slashes and an equals sign in it, so without a code face the
 * sentence looks like it lost a word. This is deliberately the smallest
 * possible thing that solves that — one delimiter, no markdown parser, no
 * dangerouslySetInnerHTML.
 *
 * An unmatched trailing backtick renders as literal text rather than
 * swallowing the rest of the sentence.
 */
export function Ticks({ children }: { children: string }) {
  const parts = children.split("`");
  return (
    <>
      {parts.map((part, i) =>
        // Odd indices sit between a pair of backticks — unless this is the
        // last part, which means the closing tick was never written.
        i % 2 === 1 && i < parts.length - 1 ? (
          <code key={i} className="ds-tick">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{i % 2 === 1 ? `\`${part}` : part}</Fragment>
        )
      )}
    </>
  );
}
