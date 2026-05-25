import Link from "next/link";

/* ──────────────────────────────────────────────────────────
   FOLIO — Brutalist footer.

   Console-style ASCII divider at top, sitemap + channels block,
   single laser-red stroke as the one accent moment.
   ─────────────────────────────────────────────────────── */
export function Folio({ pageNum }: { pageNum?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--rule-soft)] mt-16 md:mt-24">
      <div className="swiss-container py-12 md:py-16">
        {/* ASCII divider */}
        <div className="ascii-divider mb-10 md:mb-14 select-none" aria-hidden>
          {"// ".repeat(80)}
        </div>

        <div className="swiss-grid gap-y-10">
          {/* Left — sitemap */}
          <section className="col-span-12 md:col-span-3">
            <p className="mono-accent mb-5">— Sitemap</p>
            <ul className="grid gap-y-2" role="list">
              <FooterLink href="/" label="folio" />
              <FooterLink href="/cases" label="cases" />
              <FooterLink href="/work" label="work" />
              <FooterLink href="/gallery" label="gallery" />
              <FooterLink href="/ai" label="ai workflow" />
              <FooterLink href="/about" label="about" />
              <FooterLink href="/hire" label="hire" />
            </ul>
          </section>

          {/* Channels */}
          <section className="col-span-12 md:col-span-3">
            <p className="mono-accent mb-5">— Channels</p>
            <ul className="grid gap-y-2" role="list">
              <FooterLink href="mailto:surajit3255@gmail.com" label="email" external />
              <FooterLink href="https://www.linkedin.com/in/surajit3255/" label="linkedin" external />
              <FooterLink href="https://dribbble.com/surajit3255" label="dribbble" external />
              <FooterLink href="https://github.com/bolder1" label="github" external />
              <FooterLink href="/resume.pdf" label="resume.pdf" external />
            </ul>
          </section>

          {/* Manifesto strip */}
          <section className="col-span-12 md:col-span-6 md:pl-8">
            <p className="mono-accent mb-5">— Colophon</p>
            <p className="body-prose-sm max-w-md">
              Set in inter display 800 and jetbrains mono. Built with claude
              code, next.js 16 and tailwind 3. No analytics, no cookies, no
              dark patterns. Sources on{" "}
              <a
                href="https://github.com/bolder1/surajit-portfolio"
                target="_blank"
                rel="noreferrer noopener"
                className="link"
              >
                github
              </a>
              .
            </p>
            <p className="mono mt-6 text-[var(--muted-soft)]">
              the editorial register is dead. long live the brutalist.
            </p>
          </section>
        </div>

        {/* Accent stroke */}
        <div className="relative mt-12 mb-6">
          <div className="rule-soft" aria-hidden />
          <div
            aria-hidden
            className="absolute left-0 top-0 h-px w-16 bg-[var(--accent)]"
          />
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap items-baseline justify-between gap-y-3 mono">
          <span>© {year} surajit dutta · pune / ist</span>
          {pageNum && <span className="text-[var(--muted-soft)]">page {pageNum}</span>}
          <span className="text-[var(--muted-soft)]">v3 · brutalist edition</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "inline-flex items-center min-h-[32px] mono text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors";
  if (external) {
    return (
      <li>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
          className={cls}
        >
          {label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={cls}>
        {label}
      </Link>
    </li>
  );
}
