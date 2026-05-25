"use client";

import Link from "next/link";
import { Glitch } from "@/components/Glitch";

/**
 * FooterV2 — closing section + contact moment.
 *
 * Two beats:
 *   1. Big "WORK WITH ME" moment with mailto link. Hover triggers
 *      the loud glitch on the email word.
 *   2. Compact meta strip: copyright, channels, CV.
 *
 * Olive paper register, ink rule on top, single accent dot.
 */
export function FooterV2() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-cursor="default"
      className="border-t border-[color:var(--v2-rule)]"
      style={{ background: "var(--v2-paper-3)" }}
    >
      {/* Hero contact moment */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <p className="v2-mono text-[color:var(--v2-ink-soft)] mb-6">
          / 004 — let's talk
        </p>

        <h2
          className="v2-display leading-[0.92]"
          style={{ fontSize: "clamp(56px, 9vw, 152px)" }}
        >
          <Glitch trigger="hover" intensity="loud">
            work with me.
          </Glitch>
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="md:col-span-7">
            <p
              className="v2-satellite leading-snug max-w-2xl"
              style={{ fontSize: "clamp(20px, 2.4vw, 32px)" }}
            >
              Open to roles + collaborations — IAM, security UX, design
              systems, AI-native product work. Reply within 24 hours.
            </p>
          </div>

          <div className="md:col-span-5">
            <a
              href="mailto:surajit3255@gmail.com"
              data-cursor="accent"
              className="v2-display block leading-[0.95] hover:text-[color:var(--v2-accent)] transition-colors break-all"
              style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
              aria-label="Email — surajit3255 at gmail dot com"
            >
              surajit3255
              <br />
              <span className="opacity-70">@gmail.com</span>
            </a>
            <Link
              href="/resume.pdf"
              data-cursor="accent"
              className="mt-6 v2-mono inline-flex items-center gap-3 border border-[color:var(--v2-ink)] px-5 h-11 hover:bg-[color:var(--v2-ink)] hover:text-[color:var(--v2-paper)] transition-colors"
            >
              download CV
              <span aria-hidden>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Meta strip */}
      <section className="border-t border-[color:var(--v2-rule-soft)] px-6 md:px-12 lg:px-24 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
          <div className="md:col-span-3 v2-mono text-[color:var(--v2-ink-soft)]">
            <p>© {year}</p>
            <p>surajit dutta</p>
            <p>pune · ist</p>
          </div>

          <nav className="md:col-span-6" aria-label="Channels">
            <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2 v2-mono">
              <ChannelLink href="mailto:surajit3255@gmail.com" label="email" external />
              <ChannelLink href="https://www.linkedin.com/in/surajit3255/" label="linkedin" external />
              <ChannelLink href="https://dribbble.com/surajit3255" label="dribbble" external />
              <ChannelLink href="https://github.com/bolder1" label="github" external />
              <ChannelLink href="/resume.pdf" label="cv.pdf" external />
            </ul>
          </nav>

          <div className="md:col-span-3 md:text-right v2-mono text-[color:var(--v2-ink-soft)]">
            <p>
              <span aria-hidden className="inline-block w-1.5 h-1.5 bg-[color:var(--v2-accent)] mr-1.5 align-middle" />
              available
            </p>
            <p>set in inter + eb garamond</p>
            <p className="opacity-60">v2 · synapser register</p>
          </div>
        </div>
      </section>
    </footer>
  );
}

function ChannelLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "text-[color:var(--v2-ink)] hover:text-[color:var(--v2-accent)] underline-offset-4 hover:underline transition-colors";
  return (
    <li>
      <a
        href={href}
        target={external && href.startsWith("http") ? "_blank" : undefined}
        rel={external && href.startsWith("http") ? "noreferrer noopener" : undefined}
        className={cls}
        data-cursor="accent"
      >
        {label}
      </a>
    </li>
  );
}
