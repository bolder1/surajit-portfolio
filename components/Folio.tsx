import Link from "next/link";

/* ──────────────────────────────────────────────────────────
   FOLIO — Swiss footer.

   Strict 12-col grid, mono labels, single accent on a hairline.
   No "Vol. V · Page 01" editorial flourish — just the year, the
   sitemap, and the channels.
   ─────────────────────────────────────────────────────── */
export function Folio({ pageNum }: { pageNum?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--rule)] mt-16 md:mt-24">
      <div className="swiss-container py-10 md:py-14">
        {/* Top row — sitemap left, channels right. */}
        <div className="swiss-grid gap-y-8">
          <section className="col-span-12 md:col-span-6">
            <p className="mono mb-5">— Sitemap</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-md" role="list">
              <FooterLink href="/" label="Folio" />
              <FooterLink href="/work" label="Work archive" />
              <FooterLink href="/about" label="About" />
              <FooterLink href="/hire" label="Hire" />
              <FooterLink href="/#contact" label="Contact" />
              <FooterLink href="/resume.pdf" label="Resume / PDF" />
            </ul>
          </section>

          <section className="col-span-12 md:col-span-6 md:flex md:flex-col md:items-end">
            <p className="mono mb-5">— Channels</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 md:text-right" role="list">
              <FooterLink href="mailto:surajit3255@gmail.com" label="Email" external />
              <FooterLink href="https://www.linkedin.com/in/surajit3255/" label="LinkedIn" external />
              <FooterLink href="https://github.com/bolder1" label="GitHub" external />
              <FooterLink href="/resume.pdf" label="Resume" external />
            </ul>
          </section>
        </div>

        {/* Hairline + accent stroke — the single accent moment in the footer. */}
        <div className="relative mt-12 md:mt-14 mb-8">
          <div className="rule-soft" aria-hidden />
          <div
            aria-hidden
            className="absolute left-0 top-0 h-px w-12 bg-[var(--accent)]"
          />
        </div>

        {/* Bottom row — copyright, system credit, page number. */}
        <div className="swiss-grid items-baseline gap-y-3">
          <span className="col-span-12 md:col-span-4 mono">
            © {year} SURAJIT DUTTA
          </span>
          <span className="col-span-12 md:col-span-4 md:text-center mono text-[var(--muted-soft)]">
            SET IN INTER + JETBRAINS MONO
          </span>
          {pageNum && (
            <span className="col-span-12 md:col-span-4 md:text-right mono">
              PAGE {pageNum}
            </span>
          )}
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
    "inline-flex items-center min-h-[36px] text-[var(--ink-soft)] hover:text-[var(--accent-deep)] transition-colors";
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
