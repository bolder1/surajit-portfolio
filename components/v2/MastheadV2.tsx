"use client";

import Link from "next/link";

/**
 * MastheadV2 — synapserstudio top bar.
 *
 * Left: small wordmark + "SURAJIT DUTTA / PUNE, IN"
 * Center: page indicators (001 / HOMEPAGE — 002 / MANIFESTO — 003 / SELECTED WORK)
 * Right: tiny mono toggle (year / available)
 *
 * Stays out of the way of the hero composition — sits in the top
 * 56px strip, no shadow, hairline divider below.
 */
const PAGES = [
  { href: "#hero",     label: "001/HOMEPAGE",     active: true },
  { href: "#manifesto", label: "002/MANIFESTO",   active: false },
  { href: "#work",     label: "003/SELECTED WORK", active: false },
];

export function MastheadV2() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--v2-rule-soft)] bg-[color:var(--v2-paper)]/85 backdrop-blur-[6px]">
      <div className="px-6 md:px-10 py-3 md:py-4 flex items-center justify-between gap-6">
        {/* Wordmark left */}
        <Link href="/v2" className="flex items-center gap-3">
          <span aria-hidden className="block w-5 h-5">
            {/* Tiny mark */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <rect x="2" y="2" width="6" height="6" fill="var(--v2-ink)" />
              <rect x="12" y="2" width="6" height="6" fill="var(--v2-ink)" />
              <rect x="2" y="12" width="6" height="6" fill="var(--v2-ink)" />
              <rect x="12" y="12" width="6" height="6" fill="none" stroke="var(--v2-ink)" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="v2-mono leading-tight">
            <span className="block">SURAJIT</span>
            <span className="block">DUTTA</span>
          </span>
        </Link>

        {/* Page indicators center */}
        <nav className="hidden md:flex items-center gap-1 border border-[color:var(--v2-rule)] px-2 py-2">
          {PAGES.map((p, i) => (
            <span key={p.label} className="flex items-center">
              <Link
                href={p.href}
                className={`v2-mono px-3 py-1 ${
                  p.active
                    ? "bg-[color:var(--v2-ink)] text-[color:var(--v2-paper)]"
                    : "text-[color:var(--v2-ink-soft)] hover:text-[color:var(--v2-ink)]"
                } transition-colors`}
              >
                {p.label}
              </Link>
              {i < PAGES.length - 1 && (
                <span aria-hidden className="text-[color:var(--v2-ink-muted)] mx-0.5 v2-mono">·</span>
              )}
            </span>
          ))}
        </nav>

        {/* Right meta */}
        <div className="hidden md:flex items-center gap-3 v2-mono">
          <span className="text-[color:var(--v2-ink-soft)]">2026</span>
          <span aria-hidden className="block w-px h-4 bg-[color:var(--v2-rule-soft)]" />
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-[color:var(--v2-accent)]" />
            available
          </span>
        </div>
      </div>
    </header>
  );
}
