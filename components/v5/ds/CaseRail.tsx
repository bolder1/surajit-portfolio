"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "@/lib/designSystem/chapters";

/**
 * CaseRail — chapter navigation and a read-progress hairline.
 *
 * The page is long enough that a reader needs to know how much argument is
 * left; a scroll story with no visible length is an ambush. The rail is
 * suppressed below the breakpoint where it would compete with the content
 * rather than help, and it uses an IntersectionObserver rather than a scroll
 * handler so it costs nothing between section boundaries.
 */
export function CaseRail() {
  const [active, setActive] = useState(CHAPTERS[0].id);
  const [pct, setPct] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const targets = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (n): n is HTMLElement => Boolean(n)
    );
    if (!targets.length) return;

    // rootMargin pulls the trip-line up to a third from the top, so a chapter
    // becomes "active" when its heading is where the eye is, not when its last
    // pixel finally enters the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-33% 0px -60% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setPct(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav className="ds-rail" aria-label="Chapters">
      <span className="ds-rail-track" aria-hidden>
        <i style={{ transform: `scaleY(${pct})` }} />
      </span>
      <ol className="ds-rail-list">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={`ds-rail-link${active === c.id ? " is-on" : ""}`}
              aria-current={active === c.id ? "true" : undefined}
            >
              <span className="n">{c.no}</span>
              <span className="t">{c.name}</span>
              {c.interactive && <span className="i" aria-label="Interactive">◆</span>}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
