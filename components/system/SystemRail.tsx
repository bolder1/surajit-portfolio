"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/systemStory";

/**
 * SystemRail — document progress plus a chapter index.
 *
 * A scroll story has to declare its length or it reads as an ambush. The
 * hairline at the top is total progress; the rail names the chapter you are
 * in and lets you leave for another one. Both are real navigation, so the
 * rail renders as a list of anchors and is keyboard reachable.
 */
export function SystemRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(CHAPTERS[0].id);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const doc = document.documentElement;
      const travel = doc.scrollHeight - window.innerHeight;
      setProgress(travel > 0 ? Math.min(1, Math.max(0, window.scrollY / travel)) : 0);

      // Whichever chapter owns the upper third wins — stable on sections
      // this tall, and cheaper than observer ratios.
      const mark = window.innerHeight * 0.35;
      let current = CHAPTERS[0].id;
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= mark) current = c.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="sys-progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <nav className="sys-rail" aria-label="Chapters">
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.id} data-on={active === c.id ? "1" : "0"}>
              <a href={`#${c.id}`}>
                <span className="n">{c.no}</span>
                <span className="t">{c.name}</span>
                <span className="tick" aria-hidden />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
