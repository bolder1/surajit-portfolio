"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

/**
 * GalleryStage — an infinite, pannable 2D plane of framed pieces.
 *
 * Design intent:
 *   - The plane scrolls in BOTH axes — drag with pointer, swipe on
 *     touch, or use arrow keys.
 *   - Pieces are scattered in an irregular grid that wraps as you pan
 *     (the same set repeats out to a fixed bounded radius — close
 *     enough to "infinite" for portfolio scale).
 *   - Clicking a piece centers + zooms it to the viewport with an
 *     info card overlay; Escape / outside-click closes.
 *   - Keyboard shortcuts:
 *       ← ↑ → ↓     pan by 240px
 *       + / -       zoom in / out
 *       0           reset zoom + pan
 *       Tab         step through pieces in DOM order
 *       Enter       open the focused piece
 *       Escape      close the active piece (or reset focus)
 *
 * The pieces themselves are abstract until covers ship. Each tile
 * renders the project shortcode (mono) + a colored backdrop derived
 * from hoverColor. When a real cover image is supplied via
 * `project.cover.src`, it replaces the abstract treatment.
 */

export interface GalleryPiece {
  /** Project slug — used for routing on click-through. */
  slug: string;
  /** Display title. */
  title: string;
  /** One-line description for the info card. */
  description: string;
  /** Year string for the meta line. */
  year: string;
  /** Background color of the tile (hex/rgb). */
  color: string;
  /** Foreground ink color for contrast. */
  ink: string;
  /** Optional cover image — when present, shown instead of the abstract glyph. */
  cover?: { src: string; alt: string };
  /** Optional 2-4 char shortcode displayed as the abstract treatment. */
  glyph?: string;
  /** Optional explicit (x, y) offsets in plane units. If absent,
      positions are auto-distributed. */
  x?: number;
  y?: number;
  /** Tile aspect — affects the frame size. */
  aspect?: "1:1" | "4:3" | "3:4" | "16:9";
}

/* Layout constants — keep small so the math reads clearly. */
const TILE_W = 280;            // base tile width
const TILE_H = 200;             // base tile height
const HORIZ_GUTTER = 60;
const VERT_GUTTER = 56;
const COLS = 5;                  // pieces laid out in 5 columns before wrapping
const PAN_KEY_STEP = 240;

const ASPECT_SIZE: Record<NonNullable<GalleryPiece["aspect"]>, { w: number; h: number }> = {
  "1:1":  { w: 220, h: 220 },
  "4:3":  { w: 280, h: 210 },
  "3:4":  { w: 200, h: 270 },
  "16:9": { w: 320, h: 180 },
};

/** Pseudo-random jitter — deterministic so SSR + client match. */
function jitter(seed: number, max: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return ((x - Math.floor(x)) - 0.5) * 2 * max;
}

interface LaidOutPiece extends GalleryPiece {
  posX: number;
  posY: number;
  w: number;
  h: number;
  rot: number;
}

function layout(pieces: GalleryPiece[]): LaidOutPiece[] {
  const cellW = TILE_W + HORIZ_GUTTER;
  const cellH = TILE_H + VERT_GUTTER;
  return pieces.map((p, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    // Center the grid around origin (0,0) so pan-center feels natural.
    const baseX = (col - (COLS - 1) / 2) * cellW;
    const baseY = (row - 1.5) * cellH;
    const dim = p.aspect ? ASPECT_SIZE[p.aspect] : ASPECT_SIZE["4:3"];
    const w = dim.w;
    const h = dim.h;
    return {
      ...p,
      posX: (p.x ?? baseX) + jitter(i + 1, 32),
      posY: (p.y ?? baseY) + jitter(i + 17, 28),
      w,
      h,
      rot: jitter(i + 33, 2.2), // small rotation, max ±2.2°
    };
  });
}

export function GalleryStage({ pieces }: { pieces: GalleryPiece[] }) {
  const laid = useMemo(() => layout(pieces), [pieces]);

  const stageRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  /* Center pan on a piece — used by click-to-zoom and arrow nav. */
  const centerOn = useCallback(
    (piece: LaidOutPiece) => {
      const stage = stageRef.current;
      if (!stage) return;
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      // After zoom: world (posX + w/2) -> screen (stageW/2)
      // pan = stageW/2 - zoom * (posX + w/2)
      const targetZoom = 1.4;
      setZoom(targetZoom);
      setPan({
        x: stageW / 2 - targetZoom * (piece.posX + piece.w / 2),
        y: stageH / 2 - targetZoom * (piece.posY + piece.h / 2),
      });
    },
    []
  );

  const reset = useCallback(() => {
    setActiveSlug(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const onPieceClick = useCallback(
    (slug: string, e?: MouseEvent) => {
      e?.preventDefault();
      const piece = laid.find((p) => p.slug === slug);
      if (!piece) return;
      setActiveSlug(slug);
      centerOn(piece);
    },
    [laid, centerOn]
  );

  /* Pointer drag panning — desktop + touch. */
  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("[data-gallery-piece]")) return;
      if ((e.target as HTMLElement).closest("[data-gallery-card]")) return;
      (e.target as HTMLDivElement).setPointerCapture?.(e.pointerId);
      dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
      setIsPanning(true);
    },
    [pan.x, pan.y]
  );
  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
    },
    []
  );
  const onPointerUp = useCallback(() => {
    dragStart.current = null;
    setIsPanning(false);
  }, []);

  /* Wheel — scroll pans both axes; ctrl/cmd + wheel zooms. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      // Trackpad two-finger gestures fire deltaY for vertical, deltaX for horizontal.
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const next = Math.max(0.5, Math.min(2.5, zoom - e.deltaY * 0.0015));
        setZoom(next);
      } else {
        e.preventDefault();
        setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoom]);

  /* Keyboard nav */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setPan((p) => ({ ...p, x: p.x + PAN_KEY_STEP }));
          break;
        case "ArrowRight":
          e.preventDefault();
          setPan((p) => ({ ...p, x: p.x - PAN_KEY_STEP }));
          break;
        case "ArrowUp":
          e.preventDefault();
          setPan((p) => ({ ...p, y: p.y + PAN_KEY_STEP }));
          break;
        case "ArrowDown":
          e.preventDefault();
          setPan((p) => ({ ...p, y: p.y - PAN_KEY_STEP }));
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom((z) => Math.min(2.5, z + 0.2));
          break;
        case "-":
        case "_":
          e.preventDefault();
          setZoom((z) => Math.max(0.5, z - 0.2));
          break;
        case "0":
          e.preventDefault();
          reset();
          break;
        case "Escape":
          if (activeSlug) {
            e.preventDefault();
            reset();
          }
          break;
      }
    },
    [activeSlug, reset]
  );

  const planeStyle: CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
  };

  const activePiece = activeSlug ? laid.find((p) => p.slug === activeSlug) : null;

  return (
    <div
      ref={stageRef}
      className="gallery-stage"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Infinite gallery — drag or use arrow keys to pan"
    >
      {/* Plane */}
      <div
        ref={planeRef}
        className={`gallery-plane ${isPanning ? "is-panning" : ""}`}
        style={planeStyle}
      >
        {laid.map((p) => {
          const isActive = activeSlug === p.slug;
          return (
            <button
              key={p.slug}
              data-gallery-piece={p.slug}
              type="button"
              className={`gallery-frame text-left ${isActive ? "is-active" : ""}`}
              onClick={(e) => onPieceClick(p.slug, e)}
              aria-label={`${p.title} — ${p.year}`}
              style={{
                left: p.posX,
                top: p.posY,
                width: p.w,
                height: p.h,
                transform: `rotate(${isActive ? 0 : p.rot}deg)`,
                background: p.color,
                color: p.ink,
              }}
            >
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover.src}
                  alt={p.cover.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center display text-[64px] md:text-[96px] opacity-90 leading-none">
                  {p.glyph ?? p.title.slice(0, 2).toLowerCase()}
                </span>
              )}
              {/* Frame label — small mono caption at the bottom */}
              <span
                className="absolute left-0 right-0 bottom-0 px-3 py-2 mono text-[10px] tracking-[0.14em] uppercase"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  color: "#f0eee8",
                  backdropFilter: "blur(2px)",
                }}
              >
                <span className="block truncate">{p.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Edge vignette */}
      <div className="gallery-vignette" aria-hidden />

      {/* HUD — top-left status + bottom-right shortcuts */}
      <div className="absolute top-4 left-4 pointer-events-none mono text-[var(--muted)] z-20">
        <p className="text-[var(--accent)]">[ gallery ]</p>
        <p className="mt-1 text-[10px]">
          {laid.length} pieces · zoom {Math.round(zoom * 100)}%
        </p>
      </div>

      <div className="absolute bottom-4 right-4 mono text-[10px] text-[var(--muted)] z-20 pointer-events-none text-right space-y-0.5">
        <p>drag · scroll to pan</p>
        <p>ctrl + scroll · ± · 0 to reset</p>
        <p>← ↑ → ↓ · arrows</p>
        <p>esc · close · enter · open</p>
      </div>

      {/* Info card overlay — appears when a piece is active. */}
      {activePiece && (
        <div
          data-gallery-card
          role="dialog"
          aria-labelledby="gallery-card-title"
          className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-10 z-30 w-[min(560px,calc(100vw-32px))] border border-[var(--rule-soft)] bg-[var(--paper-2)] p-5 md:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <span className="mono-accent">{activePiece.year}</span>
            <button
              type="button"
              onClick={reset}
              aria-label="Close"
              className="mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              esc ✕
            </button>
          </div>
          <h3
            id="gallery-card-title"
            className="display text-[28px] md:text-[36px] leading-[1.05] mb-2"
          >
            {activePiece.title}
          </h3>
          <p className="body-prose-sm">{activePiece.description}</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <a
              href={`/work/${activePiece.slug}`}
              className="link mono inline-flex items-center gap-2"
            >
              open work →
            </a>
            <button
              type="button"
              onClick={reset}
              className="mono text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              back to gallery
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
