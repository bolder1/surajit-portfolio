"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { CoverImage } from "@/components/CoverImage";
import type { Project } from "@/lib/types";

/**
 * ArchiveGallery — synapserstudio /archive scatter, v2 register.
 *
 * Boot:
 *   The page mounts the scatter at scale 0.6, locked centered.
 *   When `revealed` flips true (parent fires this after loader fades),
 *   we transition over 1500ms to scale 1.0 + apply a tiny eased nudge
 *   so the user can immediately tell the plane is interactive.
 *
 * Interaction:
 *   - Pointer drag to pan (PointerEvents, set capture)
 *   - Wheel pan (both axes), ctrl+wheel zoom
 *   - Keyboard ← ↑ → ↓ pan / +/- zoom / 0 reset
 *   - Hover any tile shows its title + category in a small mono badge
 *     anchored above the tile; the focused tile gets a "← DRAG →"
 *     badge to teach the interaction
 *   - Click any tile fires onPick(slug) — parent shows the popup
 *
 * Tile layout:
 *   Three rough horizontal bands (top / middle / bottom) with mixed
 *   aspect ratios, slight rotation jitter and pixel offsets so the
 *   plane feels hand-arranged rather than gridded.
 */

interface ScatterTile {
  slug: string;
  title: string;
  year: string;
  category: string;
  bg: string;
  ink: string;
  cover?: { src: string; alt: string };
  glyph?: string;
  // World-space position (pixels relative to plane origin 0,0).
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number; // degrees, small (±2.5)
}

/* Per-project visual params. The mix of aspects + sizes is the whole
   point — strict grid here would kill the "moodboard" feel. */
const ASPECTS: Array<{ w: number; h: number }> = [
  { w: 320, h: 200 }, // landscape
  { w: 220, h: 280 }, // portrait
  { w: 260, h: 260 }, // square
  { w: 380, h: 220 }, // wide
  { w: 200, h: 240 }, // narrow portrait
  { w: 300, h: 180 }, // landscape
  { w: 240, h: 240 }, // square
];

const PAN_KEY_STEP = 240;

/* Deterministic pseudo-random — same on SSR + client. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function layout(projects: Project[]): ScatterTile[] {
  // 4 columns × N rows, each cell gets a project; offsets jitter it
  // off the strict grid for a natural feel.
  const COLS = 4;
  const CELL_W = 460;
  const CELL_H = 360;
  return projects.map((p, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const baseX = (col - (COLS - 1) / 2) * CELL_W;
    const baseY = (row - 1) * CELL_H;
    const aspect = ASPECTS[i % ASPECTS.length];
    const jitterX = (rand(i + 1) - 0.5) * 140;
    const jitterY = (rand(i + 7) - 0.5) * 110;
    return {
      slug: p.slug,
      title: p.title,
      year: p.year,
      category: p.category,
      bg: p.hoverColor ?? "#1c1c1c",
      ink: p.hoverInk ?? "#f0eee8",
      cover: p.cover,
      glyph: p.hoverIllustration?.toLowerCase() ?? p.slug.slice(0, 2),
      x: baseX + jitterX,
      y: baseY + jitterY,
      w: aspect.w,
      h: aspect.h,
      rot: (rand(i + 33) - 0.5) * 5,
    };
  });
}

export interface ArchiveGalleryProps {
  projects: Project[];
  /** Set true once the loader has finished — drives the boot zoom. */
  revealed: boolean;
  onPick: (slug: string) => void;
}

export function ArchiveGallery({ projects, revealed, onPick }: ArchiveGalleryProps) {
  const tiles = useMemo(() => layout(projects), [projects]);

  const stageRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.6); // boot at 0.6, expand to 1.0
  const [isPanning, setIsPanning] = useState(false);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  /* Boot zoom — when `revealed` flips, ease zoom from 0.6 → 1.0. */
  useEffect(() => {
    if (!revealed) return;
    const t = window.setTimeout(() => {
      setZoom(1.0);
      // Pick a random tile as the "drag teacher" — only first time.
      const idx = Math.floor(rand(Date.now()) * tiles.length);
      setFocusSlug(tiles[idx]?.slug ?? null);
    }, 400);
    return () => window.clearTimeout(t);
  }, [revealed, tiles]);

  /* Pointer drag pan */
  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-archive-tile]") || t.closest("[data-popup]")) return;
      (e.target as HTMLDivElement).setPointerCapture?.(e.pointerId);
      drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
      setIsPanning(true);
      setFocusSlug(null);
    },
    [pan.x, pan.y]
  );
  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setPan({ x: drag.current.px + dx, y: drag.current.py + dy });
  }, []);
  const onPointerUp = useCallback(() => {
    drag.current = null;
    setIsPanning(false);
  }, []);

  /* Wheel — pan both axes; ctrl/cmd + wheel zooms. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const next = Math.max(0.5, Math.min(2.4, zoom - e.deltaY * 0.0015));
        setZoom(next);
      } else {
        e.preventDefault();
        setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoom]);

  /* Keyboard nav (when stage focused) */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onKey = (e: KeyboardEvent) => {
      if (!stage.contains(document.activeElement)) return;
      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); setPan((p) => ({ ...p, x: p.x + PAN_KEY_STEP })); break;
        case "ArrowRight": e.preventDefault(); setPan((p) => ({ ...p, x: p.x - PAN_KEY_STEP })); break;
        case "ArrowUp":    e.preventDefault(); setPan((p) => ({ ...p, y: p.y + PAN_KEY_STEP })); break;
        case "ArrowDown":  e.preventDefault(); setPan((p) => ({ ...p, y: p.y - PAN_KEY_STEP })); break;
        case "+": case "=": e.preventDefault(); setZoom((z) => Math.min(2.4, z + 0.2)); break;
        case "-": case "_": e.preventDefault(); setZoom((z) => Math.max(0.5, z - 0.2)); break;
        case "0":           e.preventDefault(); setZoom(1.0); setPan({ x: 0, y: 0 }); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const planeStyle: CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transition: isPanning
      ? "none"
      : "transform 1500ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="application"
      aria-label="Archive gallery — drag to pan, click to read"
      data-cursor="drag"
      className="relative w-full h-full overflow-hidden outline-none"
      style={{
        background: "var(--v2-paper)",
        cursor: isPanning ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={planeRef}
        className="absolute top-1/2 left-1/2"
        style={{ ...planeStyle, transformOrigin: "0 0", willChange: "transform" }}
      >
        {tiles.map((t) => {
          const isFocus = focusSlug === t.slug;
          const isHover = hoverSlug === t.slug;
          return (
            <button
              key={t.slug}
              type="button"
              data-archive-tile={t.slug}
              data-cursor="image"
              onMouseEnter={() => setHoverSlug(t.slug)}
              onMouseLeave={() =>
                setHoverSlug((s) => (s === t.slug ? null : s))
              }
              onClick={(e) => {
                e.stopPropagation();
                onPick(t.slug);
              }}
              className="absolute text-left border border-[color:var(--v2-rule-soft)] bg-[color:var(--v2-paper-2)] shadow-[0_4px_18px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-shadow duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: t.x,
                top: t.y,
                width: t.w,
                height: t.h,
                transform: `translate(-50%, -50%) rotate(${
                  isHover || isFocus ? 0 : t.rot
                }deg) scale(${isHover ? 1.03 : 1})`,
                transition:
                  "transform 360ms cubic-bezier(0.16,1,0.3,1), box-shadow 360ms cubic-bezier(0.16,1,0.3,1)",
                zIndex: isHover || isFocus ? 5 : 1,
                cursor: "pointer",
              }}
              aria-label={`${t.title} — ${t.year}, ${t.category}`}
            >
              {/* Cover (with glyph fallback) */}
              <CoverImage
                src={t.cover?.src}
                alt={t.title}
                glyph={t.glyph}
                bg={t.bg}
                ink={t.ink}
                className="absolute inset-0 w-full h-full border-0"
                cursorFlavor="default"
              />

              {/* Hover label — title + category, only when hovered */}
              <div
                aria-hidden
                className="absolute -bottom-7 left-0 right-0 text-center pointer-events-none transition-opacity duration-300"
                style={{ opacity: isHover ? 1 : 0 }}
              >
                <p className="v2-mono inline-block px-2 py-1 bg-[color:var(--v2-paper)] border border-[color:var(--v2-rule-soft)]">
                  {t.title} — {t.category}
                </p>
              </div>

              {/* "← DRAG →" teaching badge — only on the focused boot tile */}
              {isFocus && (
                <div
                  aria-hidden
                  className="absolute -bottom-9 left-1/2 -translate-x-1/2 pointer-events-none"
                >
                  <span className="v2-mono inline-flex items-center gap-2 px-3 py-1 bg-[color:var(--v2-paper)] border border-[color:var(--v2-rule)]">
                    <span>←</span>
                    <span>drag</span>
                    <span>→</span>
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Edge vignette — keeps focus on the central scatter */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, var(--v2-paper) 96%)",
          opacity: 0.7,
        }}
      />

      {/* Bottom HUD — instruction strip */}
      <div
        aria-hidden
        className="absolute bottom-20 left-1/2 -translate-x-1/2 v2-mono text-[color:var(--v2-ink-soft)] pointer-events-none select-none"
      >
        drag · scroll · ←↑↓→ keys · ctrl+scroll to zoom
      </div>
    </div>
  );
}
