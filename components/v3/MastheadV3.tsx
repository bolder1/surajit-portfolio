"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * MastheadV3 — recruiter-first sticky nav.
 *
 * Four items only: Work · About · Resume · Contact.
 * Wordmark left, nav center-right.
 * No status pill, no console strip, no "open to roles" duplication —
 * those signals appear once on the home final CTA, not in the chrome.
 */

const TABS = [
  { href: "/v3/work",    label: "Work" },
  { href: "/v3/about",   label: "About" },
  { href: "/v3/resume",  label: "Resume" },
  { href: "/v3/contact", label: "Contact" },
];

export function MastheadV3() {
  const pathname = usePathname() ?? "/v3";
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--v3-rule-soft)] bg-[color:var(--v3-paper)]/90 backdrop-blur-[6px]">
      <div className="v3-container flex items-center justify-between gap-6 h-14">
        <Link
          href="/v3"
          aria-label="Surajit Dutta — home"
          className="flex items-baseline gap-2 text-[color:var(--v3-ink)] no-underline"
        >
          <span style={{ fontFamily: "var(--v3-sans)", fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
            Surajit Dutta
          </span>
          <span className="v3-serif-italic" style={{ fontSize: 14, color: "var(--v3-ink-muted)" }}>
            — product designer
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {TABS.map((t) => {
            const active = pathname === t.href || pathname.startsWith(t.href + "/");
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className="inline-flex items-center h-9 px-3 text-[14px] no-underline transition-colors"
                style={{
                  color: active ? "var(--v3-ink)" : "var(--v3-ink-muted)",
                  fontWeight: active ? 600 : 400,
                  borderBottom: active ? "2px solid var(--v3-accent)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile collapse — single "Menu" link; keeps the chrome simple */}
        <div className="md:hidden flex items-center gap-3">
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="text-[13px] no-underline"
                style={{
                  color: active ? "var(--v3-ink)" : "var(--v3-ink-muted)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
