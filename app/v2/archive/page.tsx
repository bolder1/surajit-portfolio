"use client";

import { useMemo, useState } from "react";
import { MastheadV2 } from "@/components/v2/MastheadV2";
import { ArchiveLoader } from "@/components/v2/ArchiveLoader";
import { ArchiveGallery } from "@/components/v2/ArchiveGallery";
import { ArchiveList } from "@/components/v2/ArchiveList";
import { ArchiveToggle } from "@/components/v2/ArchiveToggle";
import { ArchivePopup } from "@/components/v2/ArchivePopup";
import { getAllProjects } from "@/lib/projects";

/**
 * /v2/archive — the synapserstudio /archive composition.
 *
 * Boot: ArchiveLoader holds for ~700ms, then zooms + fades out. While
 * the loader is up, the gallery sits behind it at scale 0.6. When the
 * loader's `onDone` fires, `revealed` flips true and the gallery does
 * its boot-zoom from 0.6 → 1.0 over 1.5s.
 *
 * Two views (toggleable via bottom-center pill):
 *   gallery — drag-pan scatter of mixed-aspect tiles
 *   list    — synapserstudio /archive list: hover row → center preview
 *
 * Click any tile or row → ArchivePopup with details + "open work" link.
 *
 * Metadata is on a sibling layout (server side) since this page is
 * client-only.
 */
export default function ArchivePage() {
  const projects = useMemo(() => getAllProjects(), []);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const [revealed, setRevealed] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeProject = useMemo(
    () => (activeSlug ? projects.find((p) => p.slug === activeSlug) ?? null : null),
    [activeSlug, projects]
  );

  return (
    <>
      <MastheadV2 activeHref="/v2/archive" />

      {/* Stage — full viewport minus masthead */}
      <main
        id="main"
        className="relative w-full"
        style={{ height: "calc(100vh - 56px)" }}
      >
        {view === "gallery" ? (
          <ArchiveGallery
            projects={projects}
            revealed={revealed}
            onPick={(slug) => setActiveSlug(slug)}
          />
        ) : (
          <ArchiveList
            projects={projects}
            onPick={(slug) => setActiveSlug(slug)}
          />
        )}

        {/* Loader sits above everything during boot */}
        <ArchiveLoader onDone={() => setRevealed(true)} />

        {/* Bottom toggle — always visible */}
        <ArchiveToggle view={view} onChange={setView} />

        {/* Popup overlay */}
        <ArchivePopup
          project={activeProject}
          onClose={() => setActiveSlug(null)}
        />
      </main>
    </>
  );
}
