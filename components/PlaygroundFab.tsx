"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

/**
 * PlaygroundFab — the site-wide door into the 3D world.
 *
 * A chunky, game-cartridge 3D button pinned to the bottom edge of every
 * page (except the playground itself). Extruded depth, cursor-follow
 * tilt, a spinning 3D diamond and a shine sweep — pressed it sinks,
 * released it drives you in.
 */
export function PlaygroundFab() {
  const pathname = usePathname();
  const btnRef = useRef<HTMLAnchorElement>(null);

  if (pathname?.startsWith("/playground")) return null;

  const onMove = (e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="v5-playfab-dock" aria-hidden={false}>
      <a
        ref={btnRef}
        href="/playground"
        className="v5-playfab"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label="Enter the 3D world — drive the portfolio"
      >
        <span className="v5-playfab-face">
          <span className="v5-playfab-gem" aria-hidden>
            <i /><i />
          </span>
          <span className="v5-playfab-copy">
            <b>ENTER THE 3D WORLD</b>
            <small>DRIVE THE PORTFOLIO · TWO WORLDS · ONE CAR</small>
          </span>
          <span className="v5-playfab-key" aria-hidden>▶</span>
          <span className="v5-playfab-shine" aria-hidden />
        </span>
      </a>
    </div>
  );
}
