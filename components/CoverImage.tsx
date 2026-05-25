"use client";

import { useState } from "react";

/**
 * CoverImage — universal cover/thumb renderer with a graceful fallback.
 *
 * Three states:
 *   1. cover src provided AND loaded     → renders the actual image
 *   2. cover src provided BUT load fails → falls back to glyph treatment
 *   3. no cover src provided             → glyph treatment directly
 *
 * The glyph treatment is the abstract block (project color + 2-4 char
 * shortcode at large size) we already use across Gallery + Work tiles.
 * That way the page stays visually consistent whether the user has
 * shipped cover photos or not — they can drop files into
 * /public/projects/covers/ and tiles light up automatically.
 *
 * Cursor flavor:
 *   The wrapper sets data-cursor="work" so the matveyan custom cursor
 *   flips to the square-block flavor over any cover tile. Override via
 *   `cursorFlavor` prop if needed.
 */
export type CoverImageProps = {
  /** /projects/covers/<slug>.webp etc. Pass empty/undefined for glyph-only. */
  src?: string;
  /** Alt text — required for accessibility. */
  alt: string;
  /** Shortcode shown in the glyph fallback (e.g. "AD", "IGA"). */
  glyph?: string;
  /** Background color for the glyph state (project.hoverColor). */
  bg?: string;
  /** Text color for the glyph state (project.hoverInk). */
  ink?: string;
  /** Tailwind classes for the outer frame — size + aspect. */
  className?: string;
  /** Cursor flavor for the custom cursor. Default: image. */
  cursorFlavor?: "default" | "accent" | "work" | "gallery" | "image" | "text" | "drag" | "hidden";
  /** When true, glyph is smaller (used for inline 64-80px thumbs). */
  compact?: boolean;
  /** When true, render `loading="eager"` (for above-the-fold heroes). */
  eager?: boolean;
};

export function CoverImage({
  src,
  alt,
  glyph,
  bg = "var(--paper-2)",
  ink = "var(--ink)",
  className = "",
  cursorFlavor = "work",
  compact = false,
  eager = false,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      data-cursor={cursorFlavor}
      className={`relative overflow-hidden border border-[var(--rule-soft)] ${className}`}
      style={{ background: showImage ? "var(--paper-3)" : bg, color: ink }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center display leading-none select-none ${
            compact ? "text-[28px]" : "text-[80px] md:text-[120px]"
          }`}
          style={{ color: ink, opacity: 0.85 }}
        >
          {(glyph ?? alt.slice(0, 2)).toLowerCase()}
        </span>
      )}
    </div>
  );
}
