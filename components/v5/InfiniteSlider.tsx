"use client";

import type { ReactNode } from "react";

/**
 * InfiniteSlider — a seamless marquee.
 *
 * The children are rendered twice and the track translates by exactly half its
 * width (or height), so the loop closes on itself with no jump. Duplication is
 * why the seam is invisible: at the moment the track resets, run B is sitting
 * precisely where run A started.
 *
 * Speed is expressed as pixels-per-second and converted to a duration from the
 * measured track length via CSS alone, so a longer list scrolls at the same
 * pace rather than the same duration.
 *
 * Reduced motion stops the animation and resets the translation to zero, which
 * leaves the first run readable as a static row.
 */
export function InfiniteSlider({
  children,
  /** seconds for one full cycle */
  duration = 34,
  gap = 40,
  direction = "horizontal",
  reverse = false,
  pauseOnHover = true,
  className,
}: {
  children: ReactNode;
  duration?: number;
  gap?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "v5-slider",
        direction === "vertical" ? "is-vertical" : "",
        reverse ? "is-reverse" : "",
        pauseOnHover ? "is-pausable" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--slide-dur": `${duration}s`,
          "--slide-gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <div className="v5-slider-track">
        {/* Two identical runs. The second is aria-hidden so the content is
            announced once, not twice. */}
        <div className="v5-slider-run">{children}</div>
        <div className="v5-slider-run" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
