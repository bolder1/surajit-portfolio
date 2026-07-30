"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { V2_SECTIONS } from "./sections";

/**
 * ChromeV2 — the page furniture: a top bar that condenses once you leave the
 * hero, and a left-edge scroll rail whose ticks mark the section you're in.
 *
 * The rail is the "where am I" indicator the site would otherwise lack; it is
 * a real nav, so it renders as a list of anchors and is keyboard reachable.
 */
export function ChromeV2() {
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState<string>(V2_SECTIONS[0].id);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setStuck(window.scrollY > window.innerHeight * 0.72);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nodes = V2_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (n): n is HTMLElement => Boolean(n)
    );
    if (!nodes.length) return;

    // Whichever section owns the middle of the viewport wins. Cheaper and far
    // more stable than IntersectionObserver ratios on sections this tall.
    let frame = 0;
    const pick = () => {
      frame = 0;
      const mid = window.innerHeight * 0.42;
      let current = nodes[0].id;
      for (const n of nodes) {
        if (n.getBoundingClientRect().top <= mid) current = n.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const current = V2_SECTIONS.find((s) => s.id === active) ?? V2_SECTIONS[0];

  return (
    <>
      <header ref={barRef} className={`v2-topbar ${stuck ? "is-stuck" : ""}`}>
        {/* Left cluster. The centre of the bar is left empty for the concept
            toggle, which docks there. */}
        <div className="v2-topbar-left">
          <Link href="#v2-intro" className="v2-mark" aria-label="Surajit Dutta, back to top">
            <span className="v2-mark-glyph" aria-hidden />
            <span>
              <span className="v2-mark-name">Surajit Dutta</span>
              <br />
              <span className="v2-mark-role">AI-native product designer</span>
            </span>
          </Link>

          {/* Where-am-I readout. The rail's labels are hover-only, so this is
              the always-visible position indicator. */}
          <p className={`v2-topbar-now ${stuck ? "is-on" : ""}`} aria-hidden>
            <b>{current.n}</b>
            {current.label}
          </p>
        </div>

        <nav className="v2-topnav" aria-label="Sections">
          <a href="#v2-range" className="v2-topnav-opt">Range</a>
          <a href="#v2-system" className="v2-topnav-opt">System</a>
          <a href="#v2-process" className="v2-topnav-opt">Process</a>
          <a href="#v2-proof" className="v2-topnav-opt">Proof</a>
          <a href="#v2-engage" className="is-cta">Book a sprint</a>
        </nav>
      </header>

      <nav aria-label="Page progress">
        <ol className="v2-rail">
          {V2_SECTIONS.map((s) => (
            <li key={s.id} data-on={active === s.id ? "1" : "0"}>
              <a href={`#${s.id}`}>
                <span className="tick" aria-hidden />
                <span className="lbl">
                  {s.n} {s.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="v2-grain" aria-hidden />
    </>
  );
}
