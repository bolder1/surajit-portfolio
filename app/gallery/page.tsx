import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { GalleryStage, type GalleryPiece } from "@/components/GalleryStage";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Gallery — Surajit Dutta",
  description:
    "An infinite plane of every piece. Drag to pan, click any work to zoom + read.",
};

/**
 * /gallery — the immersive scattered-tile experience.
 *
 * Pulls every project (cases + work + gallery-track), maps to
 * GalleryPiece shape, and feeds the stage. Cover images come from
 * project.cover when available; otherwise the abstract glyph
 * treatment runs. No <Folio> below — the stage is full-bleed.
 */
export default function GalleryPage() {
  const all = getAllProjects();

  // Per-project visual fallback if no cover. Two-letter shortcode.
  const pieces: GalleryPiece[] = all.map((p) => {
    const glyph = p.hoverIllustration ?? p.slug.slice(0, 2);
    return {
      slug: p.slug,
      title: p.title,
      description:
        p.subtitle ??
        p.summary ??
        "A project from the archive — open the work page for the full story.",
      year: p.year,
      color: p.hoverColor ?? "#1c1c1c",
      ink: p.hoverInk ?? "#f0eee8",
      cover: p.cover,
      glyph: glyph.toLowerCase(),
      // Mix of aspects so the plane reads as a real moodboard, not a grid.
      aspect:
        p.category === "Mobile App"
          ? "3:4"
          : p.category === "Website"
            ? "16:9"
            : p.category === "Design System"
              ? "1:1"
              : "4:3",
    };
  });

  return (
    <>
      <Masthead variant="compact" />
      <main id="main" className="h-[calc(100vh-56px)]">
        <GalleryStage pieces={pieces} />
      </main>
    </>
  );
}
