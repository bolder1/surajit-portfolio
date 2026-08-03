import Link from "next/link";
import { getCaseProjects } from "@/lib/projects";
import { CaseThumb } from "@/components/CaseThumb";
import { ScrambleText } from "./ScrambleText";
import { ClippedCircle } from "./ClippedCircle";

/**
 * §04 CaseListV5 — "Selected work" list ported from v3.
 *
 * Big numbered rows. Each row carries an animated browser-mock thumbnail
 * (CaseThumb) that builds its interior UI in on hover, plus the product
 * name, a one-line outcome, and role+year meta. Same experience as v3,
 * restyled to the v5 dark / maroon design system.
 */

const VARIANT_BY_SLUG: Record<string, "directory" | "table" | "analytics"> = {
  "ad-tools": "directory",
  "iga-platform": "table",
  "banking-analytics": "analytics",
};

export function CaseListV5() {
  const cases = getCaseProjects();
  return (
    <section id="showcase" className="v5-caselist" aria-labelledby="v5-caselist-heading">
      <div className="v5-caselist-wrap">
        <div className="v5-caselist-head">
          <div>
            <p className="v5-caselist-eyebrow">/ selected work</p>
            <h2 id="v5-caselist-heading" className="v5-caselist-title">
              <ScrambleText text="The" />{" "}
              <em>
                <ScrambleText text="long versions." />
              </em>
            </h2>
          </div>
          <p className="v5-caselist-intro">
            Detailed write-ups — role, research, decisions, trade-offs, and
            outcomes. Every other project lives in the{" "}
            <Link href="/work">work archive</Link>.
          </p>
        </div>

        <ul className="v5-caselist-rows" role="list">
          {cases.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/cases/${p.slug}`}
                className="group v5-caselist-row"
                aria-label={p.title}
                data-cursor-label="Read the case"
              >
                <span className="v5-caselist-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="v5-caselist-thumb">
                  <CaseThumb variant={VARIANT_BY_SLUG[p.slug] ?? "directory"} />
                </span>
                <span className="v5-caselist-text">
                  <span className="ttl">{p.title}</span>
                  <span className="sub">{p.subtitle}</span>
                </span>
                <span className="v5-caselist-meta">
                  {p.year} · {p.role?.split("·")[0]?.trim()}
                </span>
                <span className="v5-caselist-arrow" aria-hidden>→</span>
                <ClippedCircle circleSize={200} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
