"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * VersionToggle — small floating A/B switcher between v1 (the
 * brutalist build) and v2 (the synapserstudio direction). Pinned
 * top-right (above HUD) so it's reachable from every page.
 *
 * Mapping rules:
 *   - v1 paths (/, /work, /cases, /gallery, /ai, …) ↔ v2 root (/v2)
 *     and v2 archive (/v2/archive).
 *   - We don't try to deep-map every page (the v2 surfaces are
 *     differently shaped). Toggle always sends you to the top of the
 *     other version: / for v1, /v2 for v2.
 *   - Exception: /work, /gallery, /cases (v1) → /v2/archive (v2),
 *     since archive is the consolidated equivalent.
 *
 * Visual: short bordered pill, "V1 / V2" with the active half filled.
 */
export function VersionToggle() {
  const pathname = usePathname() ?? "/";
  const onV2 = pathname.startsWith("/v2");

  // Where each button sends you, depending on the current page.
  const v1Href =
    pathname.includes("/archive") ? "/work" : "/";
  const v2Href = "/v2";

  return (
    <div
      aria-label="A/B test the portfolio versions"
      className="fixed bottom-4 right-4 z-[300] pointer-events-none"
    >
      <div className="pointer-events-auto inline-flex items-stretch border border-current bg-[rgba(20,20,18,0.55)] backdrop-blur-[6px]">
        <Link
          href={v1Href}
          data-cursor="accent"
          aria-current={!onV2 ? "page" : undefined}
          className={`px-3 h-7 inline-flex items-center justify-center font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
            !onV2
              ? "bg-white text-black"
              : "text-white hover:bg-white/10"
          }`}
        >
          V1
        </Link>
        <span aria-hidden className="block w-px bg-white/30" />
        <Link
          href={v2Href}
          data-cursor="accent"
          aria-current={onV2 ? "page" : undefined}
          className={`px-3 h-7 inline-flex items-center justify-center font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
            onV2
              ? "bg-white text-black"
              : "text-white hover:bg-white/10"
          }`}
        >
          V2
        </Link>
      </div>
      <p className="pointer-events-none mt-1.5 text-center font-mono text-[9px] tracking-[0.14em] uppercase text-white/60 select-none">
        A/B
      </p>
    </div>
  );
}
