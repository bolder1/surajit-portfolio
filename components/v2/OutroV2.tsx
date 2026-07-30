"use client";

import { useEffect, useRef, useState } from "react";

/**
 * §08 OutroV2 — the close, then the footer.
 *
 * A marquee band whose scroll direction is driven by page scroll (it runs
 * forward as you approach and keeps running on its own once you stop), then a
 * plain contact block: one email, copy-to-clipboard inline, no modal.
 *
 * The footer is deliberately not a four-column link farm. Primary paths, the
 * social handles that are real, and an honest site note in place of a legal
 * page nobody would write for a portfolio.
 */

const EMAIL = "surajit3255@gmail.com";

/* Fixed rather than `new Date()`, so the server and client markup can never
   disagree at a year boundary. */
const YEAR = 2026;

const SOCIAL = [
  { label: "LinkedIn", href: "https://linkedin.com/in/surajit3255" },
  { label: "Dribbble", href: "https://dribbble.com/surajit3255" },
  { label: "GitHub", href: "https://github.com" },
];

const PATHS = [
  { label: "Work", href: "/work" },
  { label: "Gallery", href: "/gallery" },
  { label: "AI toolkit", href: "/ai" },
  { label: "3D world", href: "/playground" },
  { label: "Info", href: "/info" },
  { label: "Contact", href: "/contact" },
];

export function OutroV2() {
  const sceneRef = useRef<HTMLElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const belt = beltRef.current;
    if (!scene || !belt) return;

    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      // 0 as the band enters the viewport, 1 once it has fully passed
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight))
      );
      belt.style.setProperty("--shift", `${(p * -34).toFixed(2)}%`);
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (insecure context or denied permission). The address
      // is already on screen and the mailto link next to it still works.
      setCopied(false);
    }
  };

  return (
    <section ref={sceneRef} id="v2-contact" className="v2-outro" aria-labelledby="v2-outro-h">
      <div className="v2-belt" ref={beltRef} aria-hidden>
        <div className="v2-belt-track">
          <div className="v2-belt-row">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                Brief on Monday <i>◆</i> product by Friday <i>◆</i>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-wrap v2-outro-body">
        <p className="v2-eyebrow">
          <b>09</b> Next
        </p>
        <h2 id="v2-outro-h" className="v2-outro-title">
          Bring me the
          <br />
          <em>impossible</em> deadline.
        </h2>
        <p className="v2-prose v2-outro-lead">
          If you have a scope, a stakeholder and a date that everyone has quietly
          agreed is unrealistic, that is the interesting version of the job. Send
          it over.
        </p>

        <div className="v2-outro-actions">
          <a
            className="v2-btn"
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("A deadline that looks unrealistic")}`}
          >
            Email me
            <span className="v2-btn-arrow" aria-hidden>
              →
            </span>
          </a>
          <button type="button" className="v2-btn-ghost v2-copy" onClick={copy}>
            {copied ? "Copied" : EMAIL}
          </button>
          <a className="v2-link" href="/resume.pdf" download>
            Download CV
          </a>
        </div>
      </div>

      <footer className="v2-foot">
        <div className="v2-wrap">
          <div className="v2-foot-grid">
            <div className="v2-foot-col">
              <p className="v2-foot-lbl">Elsewhere</p>
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
            <div className="v2-foot-col">
              <p className="v2-foot-lbl">This site</p>
              {PATHS.map((p) => (
                <a key={p.label} href={p.href}>
                  {p.label}
                </a>
              ))}
            </div>
            <div className="v2-foot-col is-note">
              <p className="v2-foot-lbl">Site note</p>
              <p>
                No analytics, no cookies, no trackers. Nothing you do here is
                recorded. The contact links open your own mail client, so the
                only data I ever see is what you choose to send me.
              </p>
            </div>
          </div>

          <div className="v2-foot-base">
            <p>Surajit Dutta · Kolkata, IST · {YEAR}</p>
            <p className="v2-foot-built">
              Concept 02, &ldquo;Velocity&rdquo;. Concept 01 is at{" "}
              <a href="/">the editorial home</a>.
            </p>
            <a href="#v2-intro" className="v2-foot-top">
              Back to top <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
