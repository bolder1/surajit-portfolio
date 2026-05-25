import Link from "next/link";
import { Button, StatusPill } from "./Button";

/* ──────────────────────────────────────────────────────────
   MASTHEAD — Brutalist + Electric.

   Two variants:
     compact  — sticky 56px strip used on every inner page.
     large    — used only on the home page; nameplate moment.

   New IA: Cases / Work / Gallery / AI / About / Hire.
   Single accent moment per surface: the laser-red period after
   the name + an `[ AVAILABLE ]` console-style status.
   ─────────────────────────────────────────────────────── */
export function Masthead({ variant = "large" }: { variant?: "large" | "compact" }) {
  if (variant === "compact") return <MastheadCompact />;
  return <MastheadLarge />;
}

function MastheadCompact() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--rule-soft)] bg-[var(--paper)]/95 backdrop-blur-[6px]">
      <div className="swiss-container">
        <div className="flex items-center justify-between min-h-[56px] py-2 gap-4">
          <Link
            href="/"
            className="display text-[18px] md:text-[22px] text-[var(--ink)]"
            aria-label="Surajit Dutta, home"
          >
            surajit<span className="text-[var(--accent)]">.</span>
          </Link>
          <PrimaryNav />
          <Button
            href="/resume.pdf"
            download="Surajit-Dutta-CV.pdf"
            size="sm"
            variant="primary"
            iconRight={<span aria-hidden>↓</span>}
          >
            CV
          </Button>
        </div>
      </div>
    </header>
  );
}

function MastheadLarge() {
  const today = new Date();
  const dateStr = today
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    .toUpperCase();

  return (
    <header className="border-b border-[var(--rule-soft)] bg-[var(--paper)]">
      <div className="swiss-container pt-6 pb-10 md:pt-8 md:pb-14">
        {/* Console-style status strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mono border-b border-[var(--rule-soft)]">
          <span>
            <span className="text-[var(--accent)]">$</span> {dateStr.toLowerCase()} ·{" "}
            <span className="text-[var(--ink)]">[ available ]</span> · pune / ist · async-us
          </span>
          <Link
            href="/hire"
            className="inline-flex items-center gap-2 text-[var(--ink)] hover:text-[var(--accent)]"
          >
            <span className="block w-2 h-2 bg-[var(--accent)]" aria-hidden />
            open to product design roles
          </Link>
        </div>

        {/* Nameplate moment — lowercase Inter Display 800 */}
        <div className="swiss-grid items-end pt-10 md:pt-14">
          <div className="col-span-12 md:col-span-9">
            <p className="mono mb-4">product designer / enterprise saas / design systems</p>
            <h1 className="display text-[18vw] sm:text-[13vw] md:text-[10vw] lg:text-[176px]">
              <Link href="/">
                surajit dutta<span className="text-[var(--accent)]">.</span>
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
              Download CV
            </Button>
          </div>
        </div>

        {/* Nav strip */}
        <div className="flex items-center justify-between pt-8 mt-10 border-t border-[var(--rule)] mono gap-4 flex-wrap">
          <span className="hidden md:inline">
            3+ yrs · iam · pam · iga · uem · @ miniorange
          </span>
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}

function PrimaryNav() {
  return (
    <ul className="flex items-center mono" role="list">
      <NavItem href="/" label="Folio" />
      <Sep />
      <NavItem href="/cases" label="Cases" />
      <Sep />
      <NavItem href="/work" label="Work" />
      <Sep />
      <NavItem href="/gallery" label="Gallery" />
      <Sep />
      <NavItem href="/ai" label="AI" />
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
        className={`inline-flex items-center min-h-[44px] md:min-h-[36px] px-2.5 hover:text-[var(--accent)] transition-colors ${
          accent ? "text-[var(--accent)] font-semibold" : ""
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
