"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { CoverImage } from "@/components/CoverImage";
import type { Project } from "@/lib/types";

/**
 * ArchivePopup — small detail card overlay shown when the user clicks
 * any archive tile (or list row).
 *
 * Behavior:
 *   - Centered, max-width ~520px
 *   - Cover + title + meta + 2-line summary + CTA "open work →"
 *   - Click outside / press Escape closes
 *   - Animated in/out with opacity + scale via key remount
 *
 * The popup is intentionally small (not full-screen): the archive page
 * keeps its identity behind a translucent scrim so the user feels they
 * peeked at one piece, not been pulled out of the surface.
 */
export function ArchivePopup({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  /* Escape to close + body scroll lock while open */
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      data-popup
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      className="fixed inset-0 z-[50] flex items-center justify-center p-4 animate-popup-in"
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,20,18,0.42)] cursor-default"
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[520px] border border-[color:var(--v2-rule)] bg-[color:var(--v2-paper)]"
        style={{
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
          animation: "popup-card-in 380ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center text-[color:var(--v2-ink-soft)] hover:text-[color:var(--v2-ink)] z-[1]"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* Cover band */}
        <div className="aspect-[16/9]">
          <CoverImage
            src={project.cover?.src}
            alt={project.title}
            glyph={project.hoverIllustration}
            bg={project.hoverColor ?? "#1c1c1c"}
            ink={project.hoverInk ?? "#f0eee8"}
            className="w-full h-full border-0"
            cursorFlavor="default"
            eager
          />
        </div>

        {/* Text */}
        <div className="p-5 md:p-6">
          <div className="v2-mono text-[color:var(--v2-ink-soft)] mb-3">
            {project.year} · {project.category}
          </div>
          <h3
            id="popup-title"
            className="v2-display"
            style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
          >
            {project.title.toUpperCase()}
          </h3>
          <p className="mt-3 text-[color:var(--v2-ink-soft)]" style={{ fontStyle: "italic" }}>
            {project.subtitle}
          </p>

          {/* Footer — link out + role hint */}
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <Link
              href={`/work/${project.slug}`}
              className="v2-mono inline-flex items-center gap-2 hover:text-[color:var(--v2-accent)] transition-colors"
            >
              open work
              <span aria-hidden>→</span>
            </Link>
            <span className="v2-mono text-[color:var(--v2-ink-soft)] text-right">
              {project.role}
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes popup-card-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-popup-in {
          animation: popup-fade-in 200ms ease both;
        }
        @keyframes popup-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-popup-in,
          [data-popup] > div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
