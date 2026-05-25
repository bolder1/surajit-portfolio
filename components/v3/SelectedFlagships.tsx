import Link from "next/link";
import { getCaseProjects } from "@/lib/projects";
import { CoverImage } from "@/components/CoverImage";

/**
 * SelectedFlagships — 3 case study list, ozgur-pattern, V3 register.
 *
 * Big numbered rows. Each row: serial mark / thumb / title /
 * one-line outcome / role+year meta / arrow.
 *
 * Pulls from `getCaseProjects()` so V1 + V3 stay in sync.
 */
export function SelectedFlagships() {
  const cases = getCaseProjects();
  return (
    <section
      id="selected-work"
      className="border-b border-[color:var(--v3-rule-soft)]"
      aria-labelledby="selected-work-heading"
    >
      <div className="v3-container py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="v3-eyebrow mb-5">/ 01 — Selected work</p>
            <h2
              id="selected-work-heading"
              className="v3-display"
              style={{ fontSize: "clamp(32px, 4.6vw, 56px)" }}
            >
              Three case studies, told in depth.
            </h2>
          </div>
          <p
            className="v3-prose"
            style={{ maxWidth: "44ch", color: "var(--v3-ink-muted)" }}
          >
            Detailed write-ups with role, research, decisions, trade-offs, and
            outcomes. Every other project is in the{" "}
            <Link
              href="/v3/work"
              className="underline underline-offset-4"
              style={{ color: "var(--v3-ink)", textDecorationColor: "var(--v3-accent)" }}
            >
              work archive
            </Link>
            .
          </p>
        </div>

        <ul role="list" className="border-t border-[color:var(--v3-rule-soft)]">
          {cases.map((p, i) => (
            <li
              key={p.slug}
              className="border-b border-[color:var(--v3-rule-soft)]"
            >
              <Link
                href={`/v3/work/${p.slug}`}
                className="group block py-6 md:py-8 no-underline transition-colors"
                style={{ color: "var(--v3-ink)" }}
              >
                <div className="grid grid-cols-12 items-center gap-4 md:gap-6">
                  <div
                    className="col-span-2 md:col-span-1 v3-mono"
                    style={{ color: "var(--v3-ink-muted)" }}
                  >
                    / {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="col-span-10 md:col-span-2">
                    <CoverImage
                      src={p.cover?.src}
                      alt={p.title}
                      glyph={p.hoverIllustration}
                      bg={p.hoverColor ?? "#1c1c1c"}
                      ink={p.hoverInk ?? "#f0eee8"}
                      compact
                      className="w-full aspect-[16/10] border-[color:var(--v3-rule-soft)]"
                      cursorFlavor="default"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <h3
                      className="v3-display group-hover:text-[color:var(--v3-accent)] transition-colors"
                      style={{ fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.1 }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="mt-2"
                      style={{ color: "var(--v3-ink-muted)", fontSize: 15, lineHeight: 1.5 }}
                    >
                      {p.subtitle}
                    </p>
                  </div>

                  <div className="col-span-10 md:col-span-2">
                    <p className="v3-mono" style={{ color: "var(--v3-ink-muted)" }}>
                      {p.year}
                    </p>
                    <p
                      className="v3-mono mt-1"
                      style={{ color: "var(--v3-ink-muted)" }}
                    >
                      {p.role.split("·")[0].trim()}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1 text-right">
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-1"
                      style={{ color: "var(--v3-accent)", fontSize: 18 }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
