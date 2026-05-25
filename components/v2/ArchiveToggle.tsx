"use client";

import { LayoutGrid, List } from "lucide-react";

/**
 * ArchiveToggle — small bottom-center switcher between gallery (grid)
 * and list views. Bordered pill, two icon buttons, active state filled.
 *
 * Matches the synapserstudio /archive bottom toggle exactly: two icons,
 * one bordered container, active = filled with ink color.
 */
export function ArchiveToggle({
  view,
  onChange,
}: {
  view: "gallery" | "list";
  onChange: (next: "gallery" | "list") => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Archive view"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[40] flex items-center border border-[color:var(--v2-rule)] bg-[color:var(--v2-paper)]/95 backdrop-blur-[6px]"
    >
      <button
        type="button"
        role="tab"
        aria-selected={view === "gallery"}
        onClick={() => onChange("gallery")}
        aria-label="Gallery view"
        className={`inline-flex items-center justify-center w-12 h-10 transition-colors ${
          view === "gallery"
            ? "bg-[color:var(--v2-ink)] text-[color:var(--v2-paper)]"
            : "text-[color:var(--v2-ink-soft)] hover:text-[color:var(--v2-ink)]"
        }`}
      >
        <LayoutGrid size={16} strokeWidth={1.5} />
      </button>
      <span aria-hidden className="block w-px h-6 bg-[color:var(--v2-rule)]" />
      <button
        type="button"
        role="tab"
        aria-selected={view === "list"}
        onClick={() => onChange("list")}
        aria-label="List view"
        className={`inline-flex items-center justify-center w-12 h-10 transition-colors ${
          view === "list"
            ? "bg-[color:var(--v2-ink)] text-[color:var(--v2-paper)]"
            : "text-[color:var(--v2-ink-soft)] hover:text-[color:var(--v2-ink)]"
        }`}
      >
        <List size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
