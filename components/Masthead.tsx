import Link from "next/link";
import { Button, StatusPill } from "./Button";

/* ──────────────────────────────────────────────────────────
   MASTHEAD — Swiss Modernism rebuild.

   - One grotesk family, weight + tracking carry hierarchy.
   - Single accent appears once per surface (the period after
     the name).
   - Strict 12-col grid; no decorative editorial flourishes
     ("VOL.", "ISSUE", "FILED" all removed).
   - Two variants:
       large    — used on the home page, full nameplate moment.
       compact  — used on inner pages, ~64px sticky strip.
   ─────────────────────────────────────────────────────── */
export function Masthead({ variant = "large" }: { variant?: "large" | "compact" }) {
  if (variant === "compact") return <MastheadCompact />;
  return <MastheadLarge />;
}

function MastheadCompact() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--rule-soft)] bg-[var(--paper)]/95 backdrop-blur-[6px]">
      <div className="swiss-container">
        <div className="swiss-grid items-center min-h-[64px] py-3">
          <Link
            href="/"
            className="display text-xl md:text-2xl col-span-6 sm:col-span-4 md:col-span-3"
            aria-label="Surajit Dutta, home"
          >
            Surajit&nbsp;Dutta<span className="text-[var(--accent)]">.</span>
          </Link>

          <div className="col-span-6 sm:col-span-8 md:col-span-9 flex items-center justify-end gap-1 sm:gap-2">
            <PrimaryNav />
            <span className="hidden md:block w-px h-5 bg-[var(--rule-soft)] mx-2" aria-hidden />
            <Button
              href="/resume.pdf"
              download="Surajit-Dutta-CV.pdf"
              size="sm"
              variant="primary"
              iconRight={<span aria-hidden>↓</span>}
            >
              Resume
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function MastheadLarge() {
  const today = new Date();
  const dateStr = today
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  return (
    <header className="border-b border-[var(--rule)] bg-[var(--paper)]">
      <div className="swiss-container pt-6 pb-10 md:pt-8 md:pb-14">
        {/* Top mono strip — date, availability, location.
            Honest metadata, no editorial flourishes. */}
        <div className="swiss-grid items-center pb-6 border-b border-[var(--rule-soft)] mono">
          <span className="col-span-6 md:col-span-3">{dateStr}</span>
          <span className="hidden md:block md:col-span-6 text-center">
            OPEN TO PRODUCT DESIGN ROLES · FULL-TIME · IST / ASYNC US
          </span>
          <span className="col-span-6 md:col-span-3 md:text-right">PUNE · IN</span>
        </div>

        {/* Nameplate moment — Inter Display tight, single accent period.
            Asymmetric grid: name takes 9/12, meta block takes 3/12 right. */}
        <div className="swiss-grid items-end pt-10 md:pt-14">
          <div className="col-span-12 md:col-span-9">
            <p className="mono mb-4">
              PRODUCT DESIGNER · ENTERPRISE SAAS · DESIGN SYSTEMS
            </p>
            <h1 className="display text-[15vw] sm:text-[11vw] md:text-[9vw] lg:text-[152px]">
              <Link href="/">
                Surajit&nbsp;Dutta<span className="text-[var(--accent)]">.</span>
              </Link>
            </h1>
          </div>

          <div className="hidden md:flex md:col-span-3 flex-col items-end gap-4 pb-4">
            <StatusPill size="md" />
            <Button
              href="/resume.pdf"
              download="Surajit-Dutta-CV.pdf"
              variant="primary"
              iconRight={<span aria-hidden>↓</span>}
            >
              Download Resume
            </Button>
          </div>
        </div>

        {/* Subtitle row — the one sentence pitch. */}
        <p className="body-prose pt-8 md:pt-10 max-w-prose">
          I design enterprise software people actually want to use — IAM, PAM,
          UEM, and the design systems that keep all of it coherent. Three
          years at miniOrange, AI-native workflow, ~70% cycle compression.
        </p>

        {/* Primary nav, anchored to the bottom rule. */}
        <div className="swiss-grid items-center pt-8 mt-10 border-t border-[var(--rule)] mono gap-4">
          <span className="hidden md:inline-block md:col-span-8">
            3+ YEARS · IAM · PAM · IGA · UEM · @ MINIORANGE
          </span>
          <nav
            aria-label="Primary"
            className="col-span-12 md:col-span-4 flex items-center justify-start md:justify-end gap-1 sm:gap-2"
          >
            <PrimaryNav />
          </nav>
        </div>
      </div>
    </header>
  );
}

function PrimaryNav() {
  return (
    <ul className="flex items-center gap-0 sm:gap-1 mono" role="list">
      <NavItem href="/" label="Folio" />
      <Sep />
      <NavItem href="/work" label="Work" />
      <Sep />
      <NavItem href="/about" label="About" />
      <Sep />
      <NavItem href="/hire" label="Hire" accent />
    </ul>
  );
}

function NavItem({ href, label, accent }: { href: string; label: string; accent?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={`inline-flex items-center min-h-[44px] md:min-h-[36px] px-3 hover:text-[var(--accent-deep)] transition-colors ${
          accent ? "text-[var(--accent-deep)] font-semibold" : ""
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

function Sep() {
  return (
    <li aria-hidden className="text-[var(--rule-soft)]" role="presentation">
      /
    </li>
  );
}
