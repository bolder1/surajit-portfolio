import Link from "next/link";

/* ──────────────────────────────────────────────────────────
   FOLIO — page footer in newspaper-folio style.
   ─────────────────────────────────────────────────────── */
export function Folio({ pageNum = "01" }: { pageNum?: string }) {
  return (
    <footer className="border-t-[3px] border-[var(--rule)]">
      <div className="max-w-page mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="mono">© 2026 SURAJIT DUTTA</div>
          <div className="md:text-center folio">
            — Folio · Vol. V · Page {pageNum} —
          </div>
          <div className="md:text-right mono">
            PRINTED IN PUNE &middot;{" "}
            <span className="opacity-60">SET IN INSTRUMENT SERIF + GEIST</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--rule-soft)] flex flex-wrap items-center justify-between gap-4 mono">
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Folio
            </Link>
            <Link href="/work" className="hover:text-[var(--accent)] transition-colors">
              Work
            </Link>
            <Link href="/about" className="hover:text-[var(--accent)] transition-colors">
              About
            </Link>
            <Link href="/#contact" className="hover:text-[var(--accent)] transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:surajit3255@gmail.com"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/surajit3255/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="/resume.pdf"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
