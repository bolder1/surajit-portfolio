"use client";

import { useState } from "react";
import { CoverImage } from "@/components/CoverImage";
import type { Project } from "@/lib/types";

/**
 * ArchiveList — list view of the archive (synapserstudio /archive list).
 *
 * Layout: big "ARCHIVE" header top-left, then full-width rows. Each
 * row carries:
 *   - left:  project title in heavy display (Archivo Black)
 *   - right: category in italic serif
 *
 * Hover behavior:
 *   - The hovered row stays at full opacity.
 *   - All non-hovered rows fade to 0.18.
 *   - A fixed-position center preview image crossfades in showing the
 *     project's cover (or glyph fallback). The image scales up gently
 *     from 0.95 to 1.0 on enter.
 *
 * Click bubbles up via onPick — the parent handles the popup card.
 */
export function ArchiveList({
  projects,
  onPick,
}: {
  projects: Project[];
  onPick: (slug: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full overflow-y-auto">
      {/* Header */}
      <header className="px-6 md:px-10 pt-10 pb-8">
        <h1 className="v2-display leading-[0.9]" style={{ fontSize: "clamp(64px, 8vw, 120px)" }}>
          ARCHIVE
        </h1>
        <p className="v2-mono mt-2 text-[color:var(--v2-ink-soft)]">
          {projects.length} pieces · hover to preview · click to read
        </p>
      </header>

      {/* Center preview — fixed, fades on hover */}
      <div
        aria-hidden
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]"
        style={{
          width: "min(640px, 50vw)",
          aspectRatio: "16 / 10",
        }}
      >
        {projects.map((p) => {
          const isActive = hover === p.slug;
          return (
            <div
              key={p.slug}
              className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1)" : "scale(0.95)",
              }}
            >
              <CoverImage
                src={p.cover?.src}
                alt={p.title}
                glyph={p.hoverIllustration}
                bg={p.hoverColor ?? "#1c1c1c"}
                ink={p.hoverInk ?? "#f0eee8"}
                className="w-full h-full border border-[color:var(--v2-ink)]"
                cursorFlavor="default"
              />
            </div>
          );
        })}
      </div>

      {/* Rows — each row's text recedes when another row is hovered */}
      <ul className="relative z-[2]" role="list">
        {projects.map((p, i) => {
          const isActive = hover === p.slug;
          const dim = hover !== null && !isActive;
          return (
            <li
              key={p.slug}
              className="border-b border-[color:var(--v2-rule-soft)] last:border-b-0"
            >
              <button
                type="button"
                onMouseEnter={() => setHover(p.slug)}
                onMouseLeave={() =>
                  setHover((s) => (s === p.slug ? null : s))
                }
                onFocus={() => setHover(p.slug)}
                onBlur={() => setHover((s) => (s === p.slug ? null : s))}
                onClick={() => onPick(p.slug)}
                className="group w-full text-left px-6 md:px-10 py-6 md:py-7 flex flex-wrap items-baseline justify-between gap-6 transition-opacity duration-500"
                style={{ opacity: dim ? 0.18 : 1 }}
                aria-label={`${p.title} — ${p.category}`}
              >
                {/* Title — big display sans, uppercase */}
                <h2
                  className="v2-display flex-1 min-w-0"
                  style={{ fontSize: "clamp(28px, 4.6vw, 64px)" }}
                >
                  {p.title.toUpperCase()}
                </h2>

                {/* Category — italic serif, right-aligned */}
                <span
                  className="v2-satellite text-right shrink-0 max-w-[40%]"
                  style={{
                    fontSize: "clamp(16px, 1.8vw, 22px)",
                    color: isActive
                      ? "var(--v2-ink)"
                      : "var(--v2-ink-soft)",
                  }}
                >
                  {p.category}
                </span>

                {/* Trailing index for rhythm — small mono */}
                <span
                  aria-hidden
                  className="v2-mono w-12 text-right opacity-60"
                >
                  /{String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom padding so the toggle doesn't clip the last row */}
      <div className="h-32" />
    </div>
  );
}
