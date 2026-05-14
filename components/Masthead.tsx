import Link from "next/link";
import { Button, StatusPill } from "./Button";

/* ──────────────────────────────────────────────────────────
   MASTHEAD — newspaper top bar.
   Used on the home page (large) and inner pages (compact).
   Now carries an always-visible "Open to roles" status pill
   plus a "Resume PDF" CTA, since the portfolio's job is to
   convince a hiring manager in 90 seconds.
   ─────────────────────────────────────────────────────── */
export function Masthead({ variant = "large" }: { variant?: "large" | "compact" }) {
  const today = new Date();
  const dateStr = today
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  if (variant === "compact") {
    return (
      <header className="border-b-[3px] border-[var(--rule)] bg-[var(--paper)]">
        <div className="max-w-page mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between border-b border-[var(--rule)] py-2 mono">
            <span>SURAJIT&nbsp;DUTTA &middot; PRODUCT DESIGNER</span>
            <span className="hidden md:inline">{dateStr}</span>
            <StatusPill />
          </div>
          <div className="flex items-center justify-between py-3 md:py-4 gap-3">
            <Link
              href="/"
              className="display text-2xl md:text-3xl tracking-tightest"
              aria-label="Surajit Dutta, home"
            >
              Surajit&nbsp;Dutta<span className="text-[var(--accent)]">.</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button href="/resume.pdf" download="Surajit-Dutta-CV.pdf" size="sm" variant="primary" iconRight={<span aria-hidden>↓</span>}>
                Resume
              </Button>
              <PrimaryNav />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b-[3px] border-[var(--rule)] bg-[var(--paper)]">
      <div className="max-w-page mx-auto px-6 md:px-10">
        {/* Top mono strip — now leads with availability */}
        <div className="flex items-center justify-between border-b border-[var(--rule)] py-2 mono gap-4">
          <span>{dateStr}</span>
          <span className="hidden md:inline-flex items-center gap-2">
            <span className="diamond" aria-hidden />
            OPEN TO PRODUCT DESIGN ROLES &middot; FULL-TIME &middot; IST / ASYNC US
          </span>
          <span>VOL. V &middot; ISSUE 01</span>
        </div>

        {/* Big nameplate */}
        <div className="flex items-end justify-between py-6 md:py-8 gap-4">
          <div>
            <p className="mono mb-2">PRODUCT DESIGNER &middot; ENTERPRISE SAAS &middot; DESIGN SYSTEMS</p>
            <h1 className="display text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[128px] tracking-tightest leading-[0.85]">
              <Link href="/">
                Surajit&nbsp;Dutta<span className="text-[var(--accent)]">.</span>
              </Link>
            </h1>
          </div>
          <div className="hidden md:flex flex-col items-end shrink-0 gap-3">
            <Button href="/resume.pdf" download="Surajit-Dutta-CV.pdf" variant="primary" iconRight={<span aria-hidden>↓</span>}>
              Download Resume
            </Button>
            <div className="mono text-right text-[var(--muted)]">
              <div>PUNE &middot; IN</div>
              <div>FILED 2026</div>
            </div>
          </div>
        </div>

        {/* Nav strip */}
        <div className="flex items-center justify-between border-t border-[var(--rule)] py-2 mono gap-4">
          <span className="hidden md:inline">3+ YEARS &middot; AI-NATIVE WORKFLOW &middot; IAM · PAM · IGA · UEM &middot; ~70% CYCLE COMPRESSION &middot; @ MINIORANGE</span>
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}

function PrimaryNav() {
  return (
    <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2 mono">
      <NavLink href="/" label="Folio" />
      <Sep />
      <NavLink href="/work" label="Work" />
      <Sep />
      <NavLink href="/about" label="About" />
      <Sep />
      <NavLink href="/hire" label="Hire" accent />
    </nav>
  );
}

function NavLink({ href, label, accent }: { href: string; label: string; accent?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center min-h-[44px] md:min-h-[36px] px-2 hover:text-[var(--accent)] transition-colors ${
        accent ? "text-[var(--accent)] font-semibold" : ""
      }`}
    >
      {label}
    </Link>
  );
}

function Sep() {
  return (
    <span aria-hidden className="text-[var(--rule-soft)]">
      /
    </span>
  );
}
