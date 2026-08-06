"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * VersionToggle — segmented switch between the two home-page concepts.
 *
 * Only mounts on the two routes it switches between (`/` and `/v2`) so it
 * never floats over case studies or the playground. Pinned bottom-center:
 * the HUD owns bottom-left, PlaygroundFab owns bottom-right.
 *
 * The active-segment fill is keyed off `data-v` so the control adopts each
 * concept's own accent instead of importing one into the other.
 */

const OPTIONS = [
  { href: "/", key: "01", label: "Editorial" },
  { href: "/v2", key: "02", label: "Velocity" },
] as const;

export function VersionToggle() {
  const pathname = usePathname();
  const active = pathname === "/v2" ? "/v2" : pathname === "/" ? "/" : null;
  if (!active) return null;

  return (
    <div
      className="vt-shell"
      data-v={active === "/v2" ? "2" : "1"}
      role="group"
      aria-label="Home page concept"
    >
      <span className="vt-legend" aria-hidden>
        concept
      </span>
      <div className="vt-track">
        <span
          className="vt-thumb"
          aria-hidden
          style={{ transform: `translateX(${active === "/v2" ? 100 : 0}%)` }}
        />
        {OPTIONS.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="vt-seg"
            aria-current={active === o.href ? "page" : undefined}
          >
            <span className="vt-seg-key">{o.key}</span>
            <span className="vt-seg-label">{o.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
