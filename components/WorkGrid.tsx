"use client";

import Link from "next/link";
import { useState } from "react";
import { CoverImage } from "@/components/CoverImage";
import type { Project } from "@/lib/types";

/**
 * WorkGrid — bishal.cc pattern.
 *
 * Black tiles in a strict grid. On hover, the project's hoverColor is
 * lifted up to <body> via the --hover-tint CSS variable so the entire
 * page background animates to the tile's brand color. A small
 * illustration glyph (the project shortcode) fades in on the right
 * side of the active tile.
 *
 * Implementation notes:
 *   - Hover state is tracked in React (active slug) so we can also
 *     apply the page-tint when the user keyboard-focuses a tile.
 *   - The actual color flip is done by setting body.style on the
 *     active slug change; cleanup runs on mouseleave / blur.
 *   - Tiles use a heavy display headline; illustration is a single
 *     two-to-four-character mono glyph (the project shortcode).
 *
 * Accessibility:
 *   - Each tile is a real anchor (<Link>).
 *   - Hover/focus parity — the page tint also fires on :focus-visible.
 *   - Reduced motion respected at the CSS level (body transition kill).
 */
export function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);

  /* Apply the page tint on active change. Returns a cleanup that
     resets the tint when no tile is active. */
  function applyTint(p: Project | null) {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (p?.hoverColor) {
      body.style.setProperty("--hover-tint", p.hoverColor);
      if (p.hoverInk) body.style.setProperty("color", p.hoverInk);
    } else {
      body.style.removeProperty("--hover-tint");
      body.style.removeProperty("color");
    }
  }

  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--rule-soft)]"
      role="list"
    >
      {projects.map((p, i) => {
        const isActive = active === p.slug;
        return (
          <li
            key={p.slug}
            className="border-r border-b border-[var(--rule-soft)]"
          >
            <Link
              href={`/work/${p.slug}`}
              data-cursor="work"
              className="group relative block min-h-[260px] md:min-h-[320px] bg-[var(--paper-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[-3px]"
              onMouseEnter={() => {
                setActive(p.slug);
                applyTint(p);
              }}
              onMouseLeave={() => {
                if (active === p.slug) {
                  setActive(null);
                  applyTint(null);
                }
              }}
              onFocus={() => {
                setActive(p.slug);
                applyTint(p);
              }}
              onBlur={() => {
                if (active === p.slug) {
                  setActive(null);
                  applyTint(null);
                }
              }}
              style={
                {
                  "--tile-hover": p.hoverColor ?? "#1a1a1a",
                  "--tile-hover-ink": p.hoverInk ?? "#f0eee8",
                } as React.CSSProperties
              }
            >
              {/* Background layer — cover image, full bleed. Falls back to
                  glyph treatment automatically via CoverImage. */}
              <div className="absolute inset-0 z-0">
                <CoverImage
                  src={p.cover?.src}
                  alt={p.title}
                  glyph={p.hoverIllustration}
                  bg={p.hoverColor ?? "#1a1a1a"}
                  ink={p.hoverInk ?? "#f0eee8"}
                  className="w-full h-full border-0"
                  cursorFlavor="work"
                />
              </div>

              {/* Scrim — defaults visible, pulls up on hover so the cover
                  reads more clearly. */}
              <div
                aria-hidden
                className="absolute inset-0 z-[1] transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)",
                  opacity: 1,
                }}
              />

              {/* Content layer */}
              <div className="relative z-[2] p-7 md:p-9 h-full min-h-[260px] md:min-h-[320px] flex flex-col">
                {/* Top row — index + shortcode (always visible) */}
                <div className="flex items-start justify-between">
                  <span className="mono text-[var(--paper)]/85">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="mono font-medium tracking-[0.18em] text-[var(--paper)]/70"
                  >
                    {p.hoverIllustration ?? "→"}
                  </span>
                </div>

                {/* Title block — pinned bottom */}
                <div className="mt-auto">
                  <h3
                    className="display text-[26px] md:text-[34px] leading-[1.05]"
                    style={{ color: p.hoverInk ?? "#f0eee8" }}
                  >
                    {p.title}
                  </h3>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="mono text-[var(--paper)]/70">
                      {p.category} · {p.year}
                    </span>
                    <span
                      aria-hidden
                      className="mono opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                      style={{ color: "var(--accent)" }}
                    >
                      open →
                    </span>
                  </div>
                </div>
              </div>

              {/* Active indicator stripe along the top edge */}
              <span
                aria-hidden
                className={`absolute left-0 top-0 h-[3px] bg-[var(--accent)] transition-all duration-500 z-[3] ${
                  isActive ? "w-full" : "w-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
