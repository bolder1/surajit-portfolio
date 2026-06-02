"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * §02 AboutPortraitV5 — the original rounded-portrait About.
 *
 * Quote + bio on the left, a rounded-corner portrait on the right that
 * drops in from the top edge with its early haze clearing as the section
 * scrolls in (--ap / --ap2). Info is a plain-text link under the bio.
 * (The glassmorphism photo treatment lives on the bento card instead.)
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function AboutPortraitV5() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = vh * 0.25;
      const raw = (start - rect.top) / (start - end);
      const ap = easeOutCubic(clamp01(raw));
      const ap2 = easeOutCubic(clamp01((raw - 0.18) / 0.82));
      section.style.setProperty("--ap", ap.toFixed(4));
      section.style.setProperty("--ap2", ap2.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(compute); };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="about" className="v5-about" ref={sectionRef} aria-labelledby="v5-about-heading">
      {/* Rounded portrait on the right */}
      <div className="v5-about-portrait">
        <span className="v5-about-mono" aria-hidden>SD</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/v5/portrait.png"
          alt="Surajit Dutta"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <h2 id="v5-about-heading" className="v5-about-quote">
        As a <em>creative Builder</em>, I craft tailor-made product
        experiences, blending technical precision and emotion.
      </h2>

      <p className="v5-about-bio">
        I&rsquo;m Surajit — a product designer for IT, identity and
        security teams. Three years across IAM, PAM, IGA and UEM at
        miniOrange, building enterprise UX where rigor meets craft and
        flows survive real use.
      </p>

      <Link href="/info" className="v5-about-info">
        Info <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
