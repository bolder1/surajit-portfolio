"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Glitch } from "@/components/Glitch";
import { CoverImage } from "@/components/CoverImage";
import { getCaseProjects } from "@/lib/projects";

/**
 * SelectedWorkV2 — ozgur.design list pattern for the V2 home.
 *
 * Three case studies in a numbered list. Each row:
 *   - serial mark "01 / RECENTLY"
 *   - big display title that glitches on scroll-into-view
 *   - small thumbnail (cover or glyph fallback)
 *   - category tag uppercase mono right
 *   - hover row → other rows dim, hovered row glitches loud
 *
 * Glitch on scroll is implemented via IntersectionObserver + a
 * data-state attribute the Glitch component already reads when
 * trigger="auto". We don't auto-loop — once a row has entered the
 * viewport and glitched, it stays calm.
 */

const STATE_ATTR = "data-glitch-state";

export function SelectedWorkV2() {
  const cases = getCaseProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  /* Glitch on enter — each row fires once when ≥40% visible. */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>("[data-row-title]");
    const fired = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired.has(entry.target)) {
            fired.add(entry.target);
            const glitches = (entry.target as HTMLElement).querySelectorAll(
              ".glitch"
            );
            glitches.forEach((el) => {
              el.setAttribute(STATE_ATTR, "play");
              window.setTimeout(() => el.setAttribute(STATE_ATTR, "idle"), 700);
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      data-cursor="default"
      className="relative border-t border-[color:var(--v2-rule-soft)] py-16 md:py-24"
      aria-label="Selected work"
    >
      {/* Section header */}
      <header className="px-6 md:px-12 lg:px-24">
        <p className="v2-mono text-[color:var(--v2-ink-soft)]">
          / 003 — recently
        </p>
        <h2
          className="v2-display mt-4 leading-[0.9]"
          style={{ fontSize: "clamp(56px, 8vw, 120px)" }}
        >
          <Glitch trigger="hover" intensity="loud">
            Selected work,
          </Glitch>
          <br />
          <span style={{ fontFamily: "var(--v2-serif), Georgia, serif", fontStyle: "italic", fontWeight: 500, textTransform: "lowercase" }}>
            2022–present.
          </span>
        </h2>
        <p
          className="mt-5 max-w-prose v2-satellite"
          style={{ fontSize: 20 }}
        >
          Three case studies in depth. Every other piece lives in the{" "}
          <Link
            href="/v2/archive"
            data-cursor="accent"
            className="underline underline-offset-4 hover:text-[color:var(--v2-accent)] transition-colors"
          >
            archive
          </Link>
          .
        </p>
      </header>

      {/* Rows */}
      <div ref={containerRef} className="mt-12 md:mt-16">
        {cases.map((p, i) => {
          const dim = hover !== null && hover !== p.slug;
          return (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor="image"
              data-row-title
              onMouseEnter={() => setHover(p.slug)}
              onMouseLeave={() =>
                setHover((s) => (s === p.slug ? null : s))
              }
              className="group block border-t border-[color:var(--v2-rule-soft)] last:border-b transition-opacity duration-500"
              style={{ opacity: dim ? 0.32 : 1 }}
            >
              <div className="px-6 md:px-12 lg:px-24 py-8 md:py-10 flex flex-wrap items-center gap-6 md:gap-10">
                {/* Serial */}
                <div className="w-20 shrink-0 v2-mono text-[color:var(--v2-ink-soft)]">
                  / {String(i + 1).padStart(2, "0")}
                </div>

                {/* Thumb */}
                <div className="shrink-0 w-24 h-16 md:w-32 md:h-20">
                  <CoverImage
                    src={p.cover?.src}
                    alt={p.title}
                    glyph={p.hoverIllustration}
                    bg={p.hoverColor ?? "#1c1c1c"}
                    ink={p.hoverInk ?? "#f0eee8"}
                    compact
                    className="w-full h-full border-[color:var(--v2-rule-soft)]"
                    cursorFlavor="image"
                  />
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="v2-display leading-[0.95]"
                    style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
                  >
                    <Glitch
                      trigger="auto"
                      intensity={hover === p.slug ? "loud" : "regular"}
                    >
                      {p.title}
                    </Glitch>
                  </h3>
                  <p
                    className="mt-1 v2-satellite text-[color:var(--v2-ink-soft)] truncate"
                    style={{ fontSize: 17 }}
                  >
                    {p.subtitle}
                  </p>
                </div>

                {/* Category tag */}
                <div className="hidden md:block w-56 shrink-0 text-right">
                  <span
                    className="v2-mono uppercase"
                    style={{
                      color:
                        hover === p.slug
                          ? "var(--v2-ink)"
                          : "var(--v2-ink-soft)",
                    }}
                  >
                    {p.category}
                  </span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 v2-mono">
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer line */}
      <div className="px-6 md:px-12 lg:px-24 mt-12 md:mt-16 flex flex-wrap items-baseline justify-between gap-4">
        <p className="v2-mono text-[color:var(--v2-ink-soft)]">
          {cases.length} cases · {cases.length === 3 ? "three in depth" : ""}
        </p>
        <Link
          href="/v2/archive"
          data-cursor="accent"
          className="v2-mono inline-flex items-center gap-2 hover:text-[color:var(--v2-accent)] transition-colors"
        >
          everything in the archive
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
