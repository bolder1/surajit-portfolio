"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCaseProjects, getWorkProjects } from "@/lib/projects";

/**
 * GalleryMacV5 — a glass "desktop" gallery.
 *
 * The hero portrait sits faint and blurred behind a scatter of labeled
 * project icons. Clicking an icon opens a large, draggable, Apple-style
 * glass tab that showcases that project's photos/screens (placeholders).
 * Many tabs can be open at once, overlapping; each is draggable by its
 * bar and closable. A glass dock holds quick shortcuts.
 */

const COLORS = [
  "#2f57c4", "#11806a", "#7a36c0", "#b4501f", "#0a7fb8",
  "#1f7a45", "#a23ee0", "#c2521f", "#2f86c4", "#7e22ce",
  "#14532d", "#9a1f3a", "#2b6cb0", "#7c5e10",
];

const SPOTS: Array<{ top: number; left: number }> = [
  { top: 16, left: 10 }, { top: 12, left: 64 }, { top: 22, left: 38 },
  { top: 30, left: 82 }, { top: 40, left: 16 }, { top: 26, left: 52 },
  { top: 52, left: 30 }, { top: 46, left: 70 }, { top: 60, left: 12 },
  { top: 58, left: 50 }, { top: 64, left: 80 }, { top: 36, left: 60 },
  { top: 18, left: 88 }, { top: 50, left: 90 },
];

const DOCK = [
  { label: "Email", href: "mailto:surajit3255@gmail.com", glyph: "✉" },
  { label: "Info", href: "/info", glyph: "☺" },
  { label: "AI", href: "/ai", glyph: "✦" },
  { label: "LinkedIn", href: "https://linkedin.com/in/surajit3255", glyph: "in" },
  { label: "Dribbble", href: "https://dribbble.com/surajit3255", glyph: "◓" },
  { label: "GitHub", href: "https://github.com", glyph: "⌥" },
];

const SHOT_KINDS = ["dashboard", "flow", "list", "modal", "mobile", "form"];
const SHOT_GRAD: Record<string, string> = {
  dashboard: "linear-gradient(150deg,#2a2440,#0d0c14)",
  form: "linear-gradient(150deg,#10303a,#0a1418)",
  list: "linear-gradient(150deg,#2a1a14,#120c0a)",
  mobile: "linear-gradient(150deg,#241a30,#0e0b14)",
  flow: "linear-gradient(150deg,#16302a,#0a1612)",
  modal: "linear-gradient(150deg,#301a28,#140a10)",
};
const DEFAULT_SHOTS = ["Overview", "Primary flow", "Detail view", "States & edges", "Responsive", "Handoff"];

type Win = { slug: string; x: number; y: number; z: number };

export function GalleryMacV5() {
  const [wins, setWins] = useState<Win[]>([]);
  const zRef = useRef(10);
  const dragRef = useRef<{ slug: string; dx: number; dy: number } | null>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const focusSlug = useRef<string | null>(null);

  // Move keyboard focus to a freshly opened tab.
  useEffect(() => {
    if (focusSlug.current && tabRefs.current[focusSlug.current]) {
      tabRefs.current[focusSlug.current]?.focus();
      focusSlug.current = null;
    }
  }, [wins]);

  const seen = new Set<string>();
  const items = [...getCaseProjects(), ...getWorkProjects()]
    .filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)))
    .slice(0, SPOTS.length);
  const bySlug = Object.fromEntries(items.map((p) => [p.slug, p]));
  const caseSlugs = new Set(getCaseProjects().map((c) => c.slug));

  const shotsFor = (slug: string) => {
    const p = bySlug[slug];
    if (p?.screens && p.screens.length) {
      return p.screens.map((s, i) => ({ caption: s.caption, kind: s.placeholder ?? SHOT_KINDS[i % SHOT_KINDS.length] }));
    }
    return DEFAULT_SHOTS.map((c, i) => ({ caption: `${String(i + 1).padStart(2, "0")} / ${c}`, kind: SHOT_KINDS[i % SHOT_KINDS.length] }));
  };

  const open = (slug: string) => {
    focusSlug.current = slug;
    setWins((prev) => {
      const found = prev.find((w) => w.slug === slug);
      zRef.current += 1;
      if (found) return prev.map((w) => (w.slug === slug ? { ...w, z: zRef.current } : w));
      const n = prev.length;
      return [...prev, { slug, x: 60 + n * 34, y: 70 + n * 30, z: zRef.current }];
    });
  };
  const close = (slug: string) => setWins((prev) => prev.filter((w) => w.slug !== slug));
  const focus = (slug: string) => {
    zRef.current += 1;
    setWins((prev) => prev.map((w) => (w.slug === slug ? { ...w, z: zRef.current } : w)));
  };

  const onPointerDown = (e: React.PointerEvent, slug: string) => {
    const win = wins.find((w) => w.slug === slug);
    if (!win) return;
    focus(slug);
    dragRef.current = { slug, dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setWins((prev) => prev.map((w) => (w.slug === d.slug ? { ...w, x: e.clientX - d.dx, y: e.clientY - d.dy } : w)));
  };
  const onPointerUp = () => { dragRef.current = null; };

  return (
    <section id="gallery" className="v5-galmac" aria-label="Work gallery">
      {/* Faint blurred hero portrait background */}
      <div className="v5-galmac-bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/v5/portrait.png" alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
      </div>
      <div className="v5-galmac-grain" aria-hidden />

      <Link href="/" className="v5-galmac-back">← Back</Link>
      <div className="v5-galmac-hint">
        <span className="eyebrow">/ the gallery</span>
        <span className="tip">Click any project · drag the tabs · open as many as you like</span>
      </div>

      {/* Desktop */}
      <div
        className="v5-galmac-desk is-in"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Scattered project icons */}
        {items.map((p, i) => {
          const spot = SPOTS[i];
          return (
            <button
              key={p.slug}
              className="v5-galmac-item"
              style={{ top: `${spot.top}%`, left: `${spot.left}%` }}
              onClick={() => open(p.slug)}
            >
              <span className="thumb" style={{ background: `radial-gradient(ellipse 90% 80% at 60% 25%, ${COLORS[i % COLORS.length]}, #0c0c0e 78%)` }}>
                {p.title.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
              </span>
              <span className="label">{p.title}</span>
            </button>
          );
        })}

        {/* Open glass tabs */}
        {wins.map((w) => {
          const p = bySlug[w.slug];
          if (!p) return null;
          const shots = shotsFor(w.slug);
          return (
            <div
              key={w.slug}
              ref={(el) => { tabRefs.current[w.slug] = el; }}
              className="gal-tab"
              role="dialog"
              aria-label={`${p.title} — project photos`}
              tabIndex={-1}
              style={{ left: w.x, top: w.y, zIndex: w.z }}
              onPointerDown={() => focus(w.slug)}
            >
              <div className="gal-tab-bar" onPointerDown={(e) => onPointerDown(e, w.slug)}>
                <button
                  className="gal-tab-close"
                  aria-label="Close"
                  onClick={(e) => { e.stopPropagation(); close(w.slug); }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
                <div className="gal-tab-titles">
                  <span className="t">{p.title}</span>
                  <span className="m">{p.category} · {p.year}</span>
                </div>
              </div>
              <div className="gal-tab-body">
                <div className="gal-tab-grid">
                  {shots.map((s) => (
                    <figure className="gal-shot" key={s.caption}>
                      <span className="canvas" style={{ background: SHOT_GRAD[s.kind] ?? SHOT_GRAD.dashboard }} />
                      <figcaption>{s.caption}</figcaption>
                    </figure>
                  ))}
                </div>
                {caseSlugs.has(w.slug) && (
                  <Link href={`/cases/${w.slug}`} className="gal-tab-case">Open full case study →</Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Glass dock */}
      <nav className="v5-galmac-dock" aria-label="Shortcuts">
        {DOCK.map((d) => (
          <a key={d.label} href={d.href} className="v5-galmac-dock-item" data-label={d.label}
            target={d.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
            <span className="ico" aria-hidden>{d.glyph}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
