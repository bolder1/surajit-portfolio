"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * VersionToggle — small floating switcher between V1 (brutalist), V2
 * (olive synapserstudio), and V3 (recruiter-first compression). Pinned
 * bottom-right, reachable from every page.
 *
 * Mapping rules:
 *   - V1 paths (/, /work, /cases, /gallery, /ai, …) ↔ V2 root /v2 ↔ V3 root /v3.
 *   - We don't deep-map every page (each version's IA is different).
 *   - V1 archive-adjacent paths jump to /v2/archive when toggling to V2.
 *
 * Visual: 3-button bordered pill. Active half filled.
 */
export function VersionToggle() {
  const pathname = usePathname() ?? "/";
  const onV3 = pathname === "/v3" || pathname.startsWith("/v3/");
  const onV2 = !onV3 && pathname.startsWith("/v2");
  const onV1 = !onV2 && !onV3;

  // Where each button sends you, depending on the current page.
  const v1Href =
    pathname.includes("/archive") ? "/work" : "/";
  const v2Href = "/v2";
  const v3Href = "/v3";

  return (
    <div
      aria-label="A/B test the portfolio versions"
      className="fixed bottom-4 right-4 z-[300] pointer-events-none"
    >
      <div className="pointer-events-auto inline-flex items-stretch border border-current bg-[rgba(20,20,18,0.65)] backdrop-blur-[6px]">
        <Tab href={v1Href} active={onV1} label="V1" />
        <Sep />
        <Tab href={v2Href} active={onV2} label="V2" />
        <Sep />
        <Tab href={v3Href} active={onV3} label="V3" />
      </div>
      <p className="pointer-events-none mt-1.5 text-center font-mono text-[9px] tracking-[0.14em] uppercase text-white/60 select-none">
        A/B/C
      </p>
    </div>
  );
}

function Tab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      data-cursor="accent"
      aria-current={active ? "page" : undefined}
      className={`px-3 h-7 inline-flex items-center justify-center font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
        active ? "bg-white text-black" : "text-white hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}

function Sep() {
  return <span aria-hidden className="block w-px bg-white/30" />;
}
