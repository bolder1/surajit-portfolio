import Link from "next/link";

/**
 * FooterV3 — compact, recruiter-friendly. No big email moment (that's
 * the FinalCTA's job); the footer is just channels + sitemap + colophon.
 */
export function FooterV3() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t border-[color:var(--v3-rule-soft)]"
      style={{ background: "var(--v3-paper-2)" }}
    >
      <div className="v3-container py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-baseline">
          <div className="md:col-span-3 v3-mono" style={{ color: "var(--v3-ink-muted)" }}>
            <p style={{ color: "var(--v3-ink)" }}>© {year} Surajit Dutta</p>
            <p>pune · ist · async-us</p>
          </div>

          <nav className="md:col-span-5" aria-label="Sitemap">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 v3-mono" role="list">
              <FooterLink href="/v3/work" label="Work" />
              <FooterLink href="/v3/about" label="About" />
              <FooterLink href="/v3/resume" label="Resume" />
              <FooterLink href="/v3/contact" label="Contact" />
              <FooterLink href="/v3/lab" label="Lab" />
            </ul>
          </nav>

          <nav className="md:col-span-4 md:text-right" aria-label="Channels">
            <ul className="flex flex-wrap md:justify-end gap-x-5 gap-y-2 v3-mono" role="list">
              <FooterLink href="mailto:surajit3255@gmail.com" label="Email" external />
              <FooterLink href="https://www.linkedin.com/in/surajit3255/" label="LinkedIn" external />
              <FooterLink href="https://github.com/bolder1" label="GitHub" external />
              <FooterLink href="https://dribbble.com/surajit3255" label="Dribbble" external />
            </ul>
          </nav>
        </div>

        <div
          className="mt-8 pt-6 border-t border-[color:var(--v3-rule-soft)] v3-mono"
          style={{ color: "var(--v3-ink-muted)" }}
        >
          v3 · recruiter-first compression · set in Inter, EB Garamond, JetBrains Mono
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
  const cls = "no-underline hover:text-[color:var(--v3-accent)] transition-colors";
  if (external) {
    return (
      <li>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
          className={cls}
          style={{ color: "var(--v3-ink)" }}
        >
          {label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={cls} style={{ color: "var(--v3-ink)" }}>
        {label}
      </Link>
    </li>
  );
}
