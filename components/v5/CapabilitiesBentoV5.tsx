"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CapabilitiesBentoV5 — one big scrollable bento that merges
 * "What I bring to the table" with the About / experience content, plus
 * the 3D video loops, a featured case, an animated "design OS" panel,
 * and more. Cards have depth + a cursor-tracked 3D tilt.
 *
 * Motion is OFF by default; a single global "Motion" toggle in the header
 * plays/pauses every video at once so the loops never distract.
 */

const DISCIPLINES = [
  "Product Design",
  "Interaction Design",
  "Design Systems",
  "UX Research",
  "Prototyping (AI-augmented)",
  "AI-Augmented Workflows",
  "AI Orchestration",
  "Information Architecture",
  "Usability Testing",
  "Design Strategy",
];

const STATS = [
  { num: "3+", lbl: "Years in product design" },
  { num: "12+", lbl: "Enterprise products shipped" },
  { num: "~70%", lbl: "AI-driven cycle compression" },
];

const TOOLS = [
  "Figma", "Figma Make AI", "Framer", "Claude", "Cursor",
  "Notion", "Illustrator", "Photoshop", "Lottie", "ChatGPT",
];

function VideoTile({ area, src, blend, tag }: { area: string; src: string; blend: "lighten" | "none"; tag?: string }) {
  return (
    <div className={`cap-card cap-video ${area}`}>
      <video autoPlay loop muted playsInline preload="auto" className={blend === "lighten" ? "is-lighten" : ""}>
        <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
      </video>
      {tag && <span className="cap-tag">{tag}</span>}
    </div>
  );
}

export function CapabilitiesBentoV5() {
  const rootRef = useRef<HTMLElement>(null);
  const [motion, setMotion] = useState(true);

  const toggleMotion = () => {
    const root = rootRef.current;
    if (!root) return;
    const next = !motion;
    setMotion(next);
    root.querySelectorAll("video").forEach((v) => {
      if (next) v.play().catch(() => {});
      else v.pause();
    });
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".cap-card"));
    const cleanups: Array<() => void> = [];
    cards.forEach((card) => {
      let frame = 0;
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (!frame) frame = requestAnimationFrame(() => {
          frame = 0;
          card.style.setProperty("--rx", `${(py * -8).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
          card.style.setProperty("--lift", "1");
        });
      };
      const onLeave = () => {
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--lift", "0");
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="about-more" className={`v5-cap ${motion ? "" : "motion-off"}`} ref={rootRef} aria-labelledby="v5-cap-heading">
      <div className="v5-cap-wrap">
        <div className="v5-cap-head">
          <div>
            <p className="v5-cap-eyebrow">/ capabilities</p>
            <h2 id="v5-cap-heading" className="v5-cap-title">
              What I bring to <em>the table.</em>
            </h2>
          </div>
          <button
            className={`v5-cap-motion ${motion ? "on" : ""}`}
            onClick={toggleMotion}
            aria-pressed={motion}
            aria-label={motion ? "Pause all motion" : "Play all motion"}
          >
            <span className="dot" aria-hidden />
            Motion {motion ? "On" : "Off"}
          </button>
        </div>

        <div className="v5-cap-grid">
          {/* Lead */}
          <div className="cap-card area-head cap-text">
            <p className="cap-kicker">Product design · enterprise IT, identity & security</p>
            <p className="cap-lead">
              I design for the operator after the operator — turning dense,
              high-stakes systems into product people trust.
            </p>
          </div>

          <VideoTile area="area-robot" src="/v5/robot-hand-alpha.webm" blend="none" tag="3D render" />

          {/* Stats */}
          <div className="cap-card area-stats cap-text">
            <div className="cap-stats">
              {STATS.map((s) => (
                <div key={s.lbl}><span className="num">{s.num}</span><span className="lbl">{s.lbl}</span></div>
              ))}
            </div>
          </div>

          {/* Disciplines (was "Services") */}
          <div className="cap-card area-disc cap-text">
            <p className="cap-card-head">What I do</p>
            <ul className="cap-services">
              {DISCIPLINES.map((s) => (<li key={s}>{s}</li>))}
            </ul>
          </div>

          <VideoTile area="area-skate" src="/v5/skate-wheel-alpha.webm" blend="none" />
          <VideoTile area="area-keycaps" src="/v5/keycaps-loop.webm" blend="lighten" />

          {/* Quote */}
          <div className="cap-card area-quote cap-text">
            <p className="cap-quote">
              Research-led, decision-first, AI-native. I write specs that
              survive implementation and ship flows that survive use.
            </p>
          </div>

          {/* Image tile (transparent 3D torus) — replaces the service video */}
          <div className="cap-card cap-video area-svid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cap-img" src="/v5/orb-torus.png" alt="" aria-hidden />
          </div>

          {/* Toolbox marquee */}
          <div className="cap-card area-tools cap-text">
            <p className="cap-card-head">Everyday toolbox</p>
            <div className="cap-marquee">
              <div className="cap-track">
                {[...TOOLS, ...TOOLS].map((t, i) => (<span className="cap-chip" key={i}>{t}</span>))}
              </div>
            </div>
          </div>

          <VideoTile area="area-step" src="/v5/step-video.mp4" blend="lighten" />

          {/* Location */}
          <div className="cap-card area-loc cap-text">
            <p className="cap-loc-title">Kolkata, India</p>
            <p className="cap-loc-sub">Designing for teams everywhere · GMT+5:30</p>
          </div>

          {/* CTA */}
          <a href="#contact" className="cap-card area-cta cap-cta">
            <span className="t">Let&rsquo;s build something</span>
            <span className="a" aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
