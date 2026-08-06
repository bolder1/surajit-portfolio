"use client";

import { usePathname } from "next/navigation";

/**
 * PlaygroundFab — the site-wide door into the 3D world.
 *
 * A small, quiet pill pinned to the bottom-right corner of every page
 * (except the playground itself) — matches the hero's .v5-playbtn pill,
 * just fixed instead of inline.
 *
 * Suppressed on /v2 and the design system case, which carry their own chrome
 * and reach the world from their footer instead; on a narrow viewport the two
 * controls would collide.
 */
export function PlaygroundFab() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/playground") ||
    pathname?.startsWith("/v2") ||
    pathname?.startsWith("/process/design-system")
  )
    return null;

  return (
    <a
      href="/playground"
      className="v5-playfab"
      aria-label="Enter the 3D world — drive the portfolio"
    >
      <span className="v5-playfab-glyph" aria-hidden />
      3D World
    </a>
  );
}
