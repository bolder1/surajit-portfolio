"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { WhammyField } from "@/components/v5/WhammyField";

/**
 * §01 MastheadHeroV5 — scroll-driven masthead.
 *
 * A tall scroll scene (.v5-hero-scene) with a pinned stage
 * (.v5-hero-sticky). As the user scrolls the runway, progress `p`
 * (0..1) drives a choreography:
 *
 *   p 0.00 → 0.18  tagline + nav strip fade and lift away
 *   p 0.00 → 0.45  the two name words converge from the spread Figma
 *                  layout to dead-center, rising to vertical middle
 *   p 0.55 → 1.00  "Surajit" exits left, "Dutta" exits right; aurora
 *                  dims — handing off to the About section below
 *
 * All easing happens here; CSS just reads the vars
 * (--fade --rise --split --firstX --lastX) off the sticky element.
 */

const SOCIAL_LINKS = [
  { label: "Linkedin", href: "https://linkedin.com/in/surajit3255" },
  { label: "GitHub",   href: "https://github.com" },
  { label: "Dribble",  href: "https://dribbble.com" },
];

const NAV_LINKS = [
  { label: "Work",    href: "/work" },
  { label: "Gallery", href: "#gallery" },
  { label: "AI",      href: "/ai" },
  { label: "Info",    href: "/info" },
  { label: "Contact", href: "/contact" },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;

export function MastheadHeroV5() {
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    if (!scene || !stage) return;

    // The name is one centered, tight unit. It rises vertically to center
    // (handled in CSS via --rise), then in the final stage the two words
    // split apart and exit the screen.
    const EXIT_VW = 70; // outward travel off-screen during split

    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), runway);
      const p = runway > 0 ? scrolled / runway : 0;

      const fade = clamp01(p / 0.18);
      const rise = easeOutCubic(clamp01(p / 0.45));
      const split = easeInCubic(clamp01((p - 0.58) / 0.42));

      const vw = window.innerWidth / 100;
      // Stage 3 only: Surajit exits left, Dutta exits right.
      const firstX = -EXIT_VW * split * vw;
      const lastX = EXIT_VW * split * vw;

      stage.style.setProperty("--p", p.toFixed(4));
      stage.style.setProperty("--fade", fade.toFixed(4));
      stage.style.setProperty("--rise", rise.toFixed(4));
      stage.style.setProperty("--split", split.toFixed(4));
      stage.style.setProperty("--firstX", `${firstX.toFixed(1)}px`);
      stage.style.setProperty("--lastX", `${lastX.toFixed(1)}px`);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

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
    <section ref={sceneRef} id="hero" className="v5-hero-scene" aria-label="Intro">
      <div ref={stageRef} className="v5-hero-sticky">
        {/* Backdrop: a bent, wobbling string field.
            The static wash behind it is the no-WebGL2 fallback. */}
        <div className="v5-hero-abstract" aria-hidden />
        <WhammyField />
        {/* Type-safety scrim. The shader is bright enough that the
            tagline dropped to 1.7:1 in its hottest patches; this pulls
            the corners the copy sits in back down without flattening
            the middle of the field. */}
        <div className="v5-hero-scrim" aria-hidden />

        {/* 3D object = provided render; tilts toward the cursor (--mx/--my) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="v5-hero-object" src="/v5/img-b.avif" alt="" aria-hidden />

        {/* Tagline */}
        <p className="v5-hero-tagline">
          Product designer for <em>IT, identity &amp; security teams.</em> I
          turn complex enterprise systems — IAM, PAM, IGA, UEM — into calm,
          usable software that survives audits, scale, and the second year.
        </p>

        {/* Display name */}
        <h1 className="v5-hero-name" aria-label="Surajit Dutta">
          <span className="first">Surajit</span>
          <span className="last">Dutta.</span>
        </h1>

        {/* Nav strip */}
        <nav className="v5-hero-navstrip" aria-label="Primary">
          <div>
            {SOCIAL_LINKS.map((link, i) => (
              <span key={link.label} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && <span className="v5-navsep">/</span>}
                <a href={link.href} className="v5-navlink">{link.label}</a>
              </span>
            ))}
          </div>
          <div>
            {NAV_LINKS.map((link, i) => (
              <span key={link.label} style={{ display: "inline-flex", alignItems: "center" }}>
                {i > 0 && <span className="v5-navsep">/</span>}
                {/* Route links go through the router; the in-page hash does
                    not. These were all plain anchors, which meant the primary
                    navigation of the site did a full document reload on every
                    click — slower than it needed to be, and invisible to the
                    page transition, which only sees client-side routing. */}
                {link.href.startsWith("/") ? (
                  <Link href={link.href} className="v5-navlink">{link.label}</Link>
                ) : (
                  <a href={link.href} className="v5-navlink">{link.label}</a>
                )}
              </span>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
