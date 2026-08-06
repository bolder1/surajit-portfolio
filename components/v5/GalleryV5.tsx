"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { getWorkProjects, getCaseProjects } from "@/lib/projects";

/**
 * §05 GalleryV5 — a 3D ring of work, in a pinned scroll scene.
 *
 * The ring is built with rotateY(angle) translateZ(radius) inside a
 * perspective stage, tilted on X so it reads as a circle lying in 3D
 * space (not a flat 2D circle). An inner layer spins continuously and
 * speeds up on hover — "work comes into frame in a circular motion."
 *
 * Scroll choreography (gp 0..1 across the runway):
 *   gp 0.00 → 0.25  tiles fly IN from far and settle onto the ring
 *   gp 0.16 → 0.62  center content pops in at the middle
 *   gp 0.60 → 1.00  tiles fly OUT of the frame (radius grows, fade),
 *                   center fades — handing off to the next section
 *
 * JS sets --spread / --ring-rot / --items-op / --center-op on the
 * sticky stage; CSS composes everything.
 */

const COLORS: Record<string, { c1: string; c2: string }> = {
  "ad-tools":           { c1: "#2f57c4", c2: "#1e3a8a" },
  "iga-platform":       { c1: "#11806a", c2: "#0c4a3e" },
  "iam-platform":       { c1: "#7a36c0", c2: "#581c87" },
  "pam-platform":       { c1: "#b4501f", c2: "#7c2d12" },
  "uem-platform":       { c1: "#0a7fb8", c2: "#075985" },
  "mods-design-system": { c1: "#6a4a32", c2: "#3f2c1f" },
  "product-os":         { c1: "#3a3a3a", c2: "#0c0a09" },
  "banking-analytics":  { c1: "#1f7a45", c2: "#14532d" },
  "dpdp-compliance":    { c1: "#a23ee0", c2: "#7e22ce" },
  "signup-customizer":  { c1: "#c2521f", c2: "#9a3412" },
  "patient-portal":     { c1: "#2f86c4", c2: "#1e6091" },
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;

export function GalleryV5() {
  const sceneRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Build the ring set: work projects + cases, deduped, capped at 10.
  const seen = new Set<string>();
  const items = [...getWorkProjects(), ...getCaseProjects()]
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .slice(0, 10);

  const count = items.length;
  const RADIUS = 440; // px

  useEffect(() => {
    const scene = sceneRef.current;
    const sticky = stickyRef.current;
    if (!scene || !sticky) return;

    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), runway);
      const gp = runway > 0 ? scrolled / runway : 0;

      const inFactor = easeOutCubic(clamp01(gp / 0.25));
      const outFactor = easeInCubic(clamp01((gp - 0.6) / 0.4));
      const spread = 1 + (1 - inFactor) * 1.5 + outFactor * 1.9;
      const itemsOp = inFactor * (1 - outFactor);
      const ringRot = -24 + gp * 250;

      const centerIn = clamp01((gp - 0.16) / 0.18);
      const centerOut = clamp01((gp - 0.62) / 0.22);
      const centerOp = centerIn * (1 - centerOut);

      sticky.style.setProperty("--spread", spread.toFixed(4));
      sticky.style.setProperty("--ring-rot", `${ringRot.toFixed(2)}deg`);
      sticky.style.setProperty("--items-op", itemsOp.toFixed(4));
      sticky.style.setProperty("--center-op", centerOp.toFixed(4));
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
    <section ref={sceneRef} id="gallery" className="v5-gallery-scene" aria-label="Work gallery">
      <div ref={stickyRef} className="v5-gallery-sticky">
        <div className="v5-gallery-stage" aria-hidden={false} data-cursor="drag">
          <div className="v5-gallery-ring">
            <div className="v5-gallery-spin">
              {items.map((p, i) => {
                const angle = (i / count) * 360;
                const c = COLORS[p.slug] ?? { c1: "#2a2a28", c2: "#141414" };
                return (
                  <Link
                    key={p.slug}
                    href={`/cases/${p.slug}`}
                    className="v5-gallery-item"
                    style={
                      {
                        ["--angle"]: `${angle}deg`,
                        ["--radius"]: `${RADIUS}px`,
                        ["--gc1"]: c.c1,
                        ["--gc2"]: c.c2,
                      } as React.CSSProperties
                    }
                    aria-label={p.title}
                  >
                    <span className="v5-gallery-item-bg" aria-hidden />
                    <span className="v5-gallery-item-cat">{p.category}</span>
                    <span className="v5-gallery-item-label">{p.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center content — pops in at the middle */}
        <div className="v5-gallery-center">
          <p className="v5-gallery-eyebrow">/ the full body of work</p>
          <h2 className="v5-gallery-title">
            Everything that <em>never got</em> a case study.
          </h2>
          <Link href="/gallery" className="v5-gallery-cta">
            Enter the gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
