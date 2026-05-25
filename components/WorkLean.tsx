"use client";

import Link from "next/link";
import { Button, Tag } from "@/components/Button";
import { Carousel, type CarouselSlide } from "@/components/Carousel";
import { CoverImage } from "@/components/CoverImage";
import { SerialMark } from "@/components/Ornaments";
import type { Project } from "@/lib/types";

/**
 * WorkLean — the "basic info + image carousel" detail template for
 * work-track projects.
 *
 * Distinct from the rich CaseStudy renderer at /cases/[slug]: work
 * items get a small header + cover hero + carousel of available
 * images + a short prose block + tags + back navigation. No research
 * methods, no UX laws, no decisions block. The full case-study path
 * stays available for the 3 case-track entries.
 *
 * Image source priority:
 *   1. project.cover (set via lib/projects COVERS map)
 *   2. project.gallery items (legacy data) — each becomes a carousel slide
 *   3. project.screens items with image.src
 *   Falls back to a single-slide glyph if no images at all.
 */
export function WorkLean({
  project,
  next,
}: {
  project: Project;
  next?: Project;
}) {
  // Assemble carousel slides. Cover first; then any gallery / screens
  // items that have an actual src. Filter out placeholder-only items.
  const slides: CarouselSlide[] = [];
  if (project.cover?.src) {
    slides.push({
      src: project.cover.src,
      alt: project.cover.alt,
      caption: `${project.title} — cover`,
    });
  }
  if (project.gallery) {
    for (const g of project.gallery) {
      if (g.image?.src) {
        slides.push({
          src: g.image.src,
          alt: g.image.alt,
          caption: g.caption,
        });
      }
    }
  }
  if (project.screens) {
    for (const s of project.screens) {
      if (s.image?.src) {
        slides.push({
          src: s.image.src,
          alt: s.image.alt,
          caption: s.caption,
        });
      }
    }
  }
  // If nothing has an image, still render a single glyph slide so the
  // carousel frame holds the layout.
  if (slides.length === 0) {
    slides.push({ alt: project.title, caption: project.subtitle });
  }

  return (
    <>
      {/* Hero — cover image + title overlay */}
      <section
        className="relative border-b border-[var(--rule-soft)] overflow-hidden"
        style={{ background: project.hoverColor ?? "var(--paper-2)" }}
        data-cursor="default"
      >
        {/* Cover layer */}
        <div className="absolute inset-0 z-0">
          <CoverImage
            src={project.cover?.src}
            alt={project.title}
            glyph={project.hoverIllustration}
            bg={project.hoverColor ?? "#1a1a1a"}
            ink={project.hoverInk ?? "#f0eee8"}
            className="w-full h-full border-0"
            cursorFlavor="default"
            eager
          />
        </div>
        {/* Scrim */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Content */}
        <div className="relative z-[2] swiss-container py-16 md:py-24 lg:py-32 min-h-[60vh] flex flex-col justify-between gap-12">
          {/* Top meta line */}
          <div className="flex flex-wrap items-baseline justify-between gap-3 mono" style={{ color: project.hoverInk ?? "#f0eee8" }}>
            <SerialMark no={project.order} />
            <Link
              href="/work"
              className="opacity-80 hover:opacity-100 underline-offset-4 hover:underline"
            >
              ← all work
            </Link>
          </div>
          {/* Title block */}
          <div className="max-w-4xl" style={{ color: project.hoverInk ?? "#f0eee8" }}>
            <p className="mono opacity-80 mb-3">
              {project.category} · {project.year} · {project.role}
            </p>
            <h1 className="display text-[12vw] sm:text-[9vw] md:text-[6vw] lg:text-[88px] leading-[0.95]">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="body-prose mt-4 max-w-prose opacity-95">
                {project.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Carousel + summary */}
      <section className="border-b border-[var(--rule-soft)]">
        <div className="swiss-container py-12 md:py-16">
          <div className="swiss-grid items-start">
            <div className="col-span-12 md:col-span-8">
              <p className="section-tag mb-6">/ visuals</p>
              <Carousel
                slides={slides}
                glyph={project.hoverIllustration}
                bg={project.hoverColor ?? "#1a1a1a"}
                ink={project.hoverInk ?? "#f0eee8"}
                aspect="16:10"
                label={`${project.title} carousel`}
              />
            </div>
            <div className="col-span-12 md:col-span-4 md:pl-8 md:pt-12">
              <p className="section-tag mb-5">/ overview</p>
              {project.summary ? (
                <p className="body-prose">{project.summary}</p>
              ) : (
                <p className="body-prose-sm text-[var(--ink-soft)]">
                  {project.subtitle}
                </p>
              )}
              {project.team && (
                <p className="mono mt-6 text-[var(--muted)]">{project.team}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tags + nav */}
      <section className="border-b border-[var(--rule-soft)]">
        <div className="swiss-container py-10 md:py-12">
          <div className="swiss-grid items-end gap-y-6">
            <div className="col-span-12 md:col-span-8">
              <p className="mono-accent mb-3">— stack</p>
              <ul className="flex flex-wrap gap-2" role="list">
                {project.tags.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right flex flex-wrap md:justify-end gap-3">
              <Button href="/work" variant="outlined">
                ← all work
              </Button>
              {project.figmaUrl ? (
                <Button href={project.figmaUrl} external variant="primary">
                  View Figma
                </Button>
              ) : (
                <Button href="/cases" variant="primary">
                  See cases
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Next work — mini tile */}
      {next && (
        <section className="border-b border-[var(--rule-soft)]">
          <Link
            href={`/work/${next.slug}`}
            data-cursor="work"
            className="group block relative min-h-[200px] md:min-h-[260px]"
          >
            <div className="absolute inset-0 z-0">
              <CoverImage
                src={next.cover?.src}
                alt={next.title}
                glyph={next.hoverIllustration}
                bg={next.hoverColor ?? "#1a1a1a"}
                ink={next.hoverInk ?? "#f0eee8"}
                className="w-full h-full border-0"
                cursorFlavor="work"
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.75) 100%)",
              }}
            />
            <div
              className="relative z-[2] swiss-container py-10 md:py-14 flex flex-wrap items-baseline justify-between gap-4"
              style={{ color: next.hoverInk ?? "#f0eee8" }}
            >
              <div>
                <p className="mono mb-2 opacity-80">next →</p>
                <h2 className="display text-[34px] md:text-[52px] leading-[1] group-hover:translate-x-1 transition-transform">
                  {next.title}
                </h2>
              </div>
              <p className="mono opacity-80">
                {next.category} · {next.year}
              </p>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}
