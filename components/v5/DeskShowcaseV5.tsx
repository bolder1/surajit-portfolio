"use client";

import { useEffect, useRef } from "react";
import { SHOWCASE_PRODUCTS } from "@/lib/showcase";

/**
 * §C DeskShowcaseV5 — the desk reel.
 *
 * A long pinned scroll scene in three phases:
 *   p 0.00 → 0.12  a silhouette walks in from the back of the stage
 *   p 0.12 → 0.22  the desk rises; laptop + phone zoom to ~80% viewport
 *   p 0.24 → 1.00  twelve product beats — each product gets its own
 *                  background wash; its captured screen scrolls inside
 *                  the device as you scroll the page. No taps needed;
 *                  clicking a device opens the live product.
 *
 * Imperative style (CSS vars + class toggles under rAF), same register
 * as MastheadHeroV5 / ProcessV5. Screens are checked-in captures at
 * /showcase/<slug>-{d,m}.jpg — regenerate from the live apps with
 * `node scripts/capture-showcase.mjs`.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const P_WALK_END = 0.12;
const P_DESK_END = 0.22;
const P_REEL_START = 0.24;

const TAG_LABEL: Record<string, string> = {
  COMPANY: "COMPANY BUILD",
  LAB: "LAB",
  FUN: "FUN BUILD",
};

export function DeskShowcaseV5() {
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLAnchorElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    const glow = glowRef.current;
    const laptop = laptopRef.current;
    const phone = phoneRef.current;
    const metaWrap = metaRef.current;
    const rail = railRef.current;
    if (!scene || !stage || !glow || !laptop || !phone || !metaWrap || !rail) return;

    const dImgs = Array.from(
      laptop.querySelectorAll<HTMLImageElement>("img[data-idx]")
    );
    const mImgs = Array.from(
      phone.querySelectorAll<HTMLImageElement>("img[data-idx]")
    );
    const plates = Array.from(metaWrap.children) as HTMLElement[];
    const ticks = Array.from(rail.children) as HTMLElement[];

    const N = SHOWCASE_PRODUCTS.length;
    const seg = (1 - P_REEL_START - 0.015) / N;
    let lastIdx = -1;
    let frame = 0;

    /** Scroll a captured screen inside its frame by beat progress t. */
    const scrub = (img: HTMLImageElement, t: number) => {
      const frameEl = img.parentElement!;
      const travel = Math.max(img.offsetHeight - frameEl.clientHeight, 0);
      img.style.transform = `translateY(${(-travel * t).toFixed(1)}px)`;
    };

    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      const p = runway > 0 ? clamp01(-rect.top / runway) : 0;

      const walk = easeOut(clamp01(p / P_WALK_END));
      const desk = easeOut(
        clamp01((p - P_WALK_END) / (P_DESK_END - P_WALK_END))
      );

      stage.style.setProperty("--walk", walk.toFixed(4));
      stage.style.setProperty("--desk", desk.toFixed(4));

      // ---- reel ----
      const inReel = p >= P_REEL_START;
      const rawIdx = Math.floor((p - P_REEL_START) / seg);
      const idx = inReel ? Math.min(Math.max(rawIdx, 0), N - 1) : -1;
      const t = inReel
        ? clamp01((p - P_REEL_START - idx * seg) / seg)
        : 0;

      if (idx !== lastIdx) {
        if (lastIdx >= 0) {
          dImgs[lastIdx]?.classList.remove("is-active");
          mImgs[lastIdx]?.classList.remove("is-active");
          plates[lastIdx]?.classList.remove("is-active");
          ticks[lastIdx]?.classList.remove("is-active");
        }
        if (idx >= 0) {
          const prod = SHOWCASE_PRODUCTS[idx];
          dImgs[idx]?.classList.add("is-active");
          mImgs[idx]?.classList.add("is-active");
          plates[idx]?.classList.add("is-active");
          ticks[idx]?.classList.add("is-active");
          laptop.href = prod.url;
          phone.href = prod.url;
          glow.style.background = prod.color;
        } else {
          glow.style.background = "#1a1815";
        }
        stage.classList.toggle("is-reel", idx >= 0);
        lastIdx = idx;
      }

      if (idx >= 0) {
        if (dImgs[idx]) scrub(dImgs[idx], t);
        if (mImgs[idx]) scrub(mImgs[idx], Math.min(t * 1.15, 1));
      }
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
    <section
      ref={sceneRef}
      className="v5-desk-scene"
      aria-label="Product reel — everything I've shipped, playing on a desk"
      style={{ ["--n"]: SHOWCASE_PRODUCTS.length } as React.CSSProperties}
    >
      <div ref={stageRef} className="v5-desk-sticky">
        {/* dreamy backdrop */}
        <div className="v5-desk-stars" aria-hidden />
        <div ref={glowRef} className="v5-desk-glow" aria-hidden />

        {/* the walker (phase A) */}
        <div className="v5-desk-walker" aria-hidden>
          <svg viewBox="0 0 120 220" className="v5-desk-walker-svg">
            {/* stylised mid-stride silhouette */}
            <circle cx="62" cy="26" r="15" fill="currentColor" />
            <path
              d="M54 44 C50 60 48 78 50 96 L44 150 L30 196 L40 200 L58 154 L64 122
                 L72 152 L86 198 L96 194 L80 146 L74 96 C78 76 76 58 70 44 Z"
              fill="currentColor"
            />
            <path d="M56 56 L34 96 L40 102 L60 70 Z" fill="currentColor" />
            <path d="M70 54 L88 92 L82 98 L66 68 Z" fill="currentColor" />
          </svg>
          <span className="v5-desk-walker-shadow" />
        </div>

        <p className="v5-desk-caption v5-desk-caption-walk" aria-hidden>
          EVERY PRODUCT BEGINS WITH A WALK TO THE DESK
        </p>

        {/* the desk rig (phases B + C) */}
        <div className="v5-desk-rig">
          <a
            ref={laptopRef}
            className="v5-desk-laptop"
            href={SHOWCASE_PRODUCTS[0].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the product on screen in a new tab"
          >
            <span className="v5-desk-laptop-screen">
              {SHOWCASE_PRODUCTS.map((prod, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={prod.slug}
                  data-idx={i}
                  src={`/showcase/${prod.slug}-d.jpg`}
                  alt={`${prod.name} — desktop`}
                  className="v5-desk-shot"
                />
              ))}
            </span>
            <span className="v5-desk-laptop-base" aria-hidden />
          </a>

          <a
            ref={phoneRef}
            className="v5-desk-phone"
            href={SHOWCASE_PRODUCTS[0].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the product on the phone in a new tab"
          >
            <span className="v5-desk-phone-screen">
              {SHOWCASE_PRODUCTS.map((prod, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={prod.slug}
                  data-idx={i}
                  src={`/showcase/${prod.slug}-m.jpg`}
                  alt={`${prod.name} — mobile`}
                  className="v5-desk-shot"
                />
              ))}
            </span>
          </a>

          <span className="v5-desk-surface" aria-hidden />
        </div>

        {/* product meta plates */}
        <div ref={metaRef} className="v5-desk-meta">
          {SHOWCASE_PRODUCTS.map((prod) => (
            <div className="v5-desk-plate" key={prod.slug}>
              <span
                className={`v5-desk-tag v5-desk-tag-${prod.tag.toLowerCase()}`}
              >
                {TAG_LABEL[prod.tag]}
              </span>
              <span className="v5-desk-name">{prod.name}</span>
              <span className="v5-desk-kind">{prod.kind}</span>
              <span className="v5-desk-blurb">{prod.blurb}</span>
              <span className="v5-desk-url">{prod.url.replace("https://", "")}</span>
            </div>
          ))}
        </div>

        {/* progress rail */}
        <div ref={railRef} className="v5-desk-rail" aria-hidden>
          {SHOWCASE_PRODUCTS.map((prod) => (
            <span className="v5-desk-tick" key={prod.slug} />
          ))}
        </div>

        <p className="v5-desk-caption v5-desk-caption-reel" aria-hidden>
          SCROLL — THE REEL PLAYS ITSELF · CLICK A SCREEN TO OPEN IT LIVE
        </p>
      </div>

      {/* everything live — direct links, no scrolling required */}
      <div className="v5-desk-index" aria-label="All products, live">
        {SHOWCASE_PRODUCTS.map((prod) => (
          <a
            key={prod.slug}
            className="v5-desk-index-chip"
            href={prod.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i style={{ background: prod.color }} aria-hidden />
            {prod.name}
          </a>
        ))}
      </div>
    </section>
  );
}
