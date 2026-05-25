import type { Metadata } from "next";
import { MastheadV3 } from "@/components/v3/MastheadV3";
import { FooterV3 } from "@/components/v3/FooterV3";

export const metadata: Metadata = {
  title: "Lab — Surajit Dutta",
  description:
    "AI and code proof. Inspectable evidence — prompt packs, live demos, Figma prototypes, notebooks.",
};

const PROOFS = [
  {
    n: "01",
    kind: "AI prompt pack",
    title: "Edge-case enumeration for enterprise admin flows.",
    body: "A sanitized prompt pack I use to enumerate edge cases for enterprise workflows — role permissions, audit trail states, partial failures, compliance edges. Lifts a category of bugs out of QA and into the spec.",
    cta: { label: "Read the pack →", href: "#", disabled: true, note: "Drop coming soon" },
  },
  {
    n: "02",
    kind: "Live demo",
    title: "Throughline — feedback-to-decision tool.",
    body: "A standalone product I shipped to feel out the AI-as-leverage thesis. Designed and built end-to-end with Claude Code. Triage Inbox, primitive library, decision log.",
    cta: { label: "Open live →", href: "https://throughline-app.vercel.app", external: true },
  },
  {
    n: "03",
    kind: "Figma prototype",
    title: "AD console — five-day prototype.",
    body: "The Active Directory console prototype that shipped in five business days using Figma Make AI. Click-to-load embed; the static cover sits here until you click.",
    cta: { label: "Open Figma →", href: "#", disabled: true, note: "Embed lands in Phase C" },
  },
  {
    n: "04",
    kind: "Notebook + writeup",
    title: "AI-assisted design QA — what worked, what didn't.",
    body: "A reproducible comparison: prompt outputs vs. designer judgment on a dataset of admin-screen reviews. Honest about both sides.",
    cta: { label: "Read on GitHub →", href: "#", disabled: true, note: "Drop coming soon" },
  },
];

/**
 * /v3/lab — concrete AI/code proof. Replaces /ai (which was a tool
 * inventory). Each proof is one inspectable artifact, not a list of
 * tools. Click-to-load shells for any heavy embed.
 */
export default function V3LabPage() {
  return (
    <>
      <MastheadV3 />
      <main id="main">
        {/* Header */}
        <section className="border-b border-[color:var(--v3-rule-soft)]">
          <div className="v3-container py-16 md:py-24 max-w-4xl">
            <p className="v3-eyebrow mb-6">/ Lab</p>
            <h1
              className="v3-display mb-6"
              style={{ fontSize: "clamp(36px, 5.6vw, 72px)" }}
            >
              <span className="v3-serif-italic">Inspectable</span> evidence,
              not a tool inventory.
            </h1>
            <p
              className="v3-prose-lg"
              style={{ color: "var(--v3-ink-soft)" }}
            >
              AI as leverage shows up in the work — not as a homepage
              banner. Below: a sanitized prompt pack, a live product, a
              prototype, and a notebook. Pick whichever you'd inspect in
              a real interview.
            </p>
          </div>
        </section>

        {/* Proofs */}
        <section aria-label="Proof pieces">
          <div className="v3-container py-12 md:py-16">
            <ul role="list">
              {PROOFS.map((p) => (
                <li
                  key={p.n}
                  className="border-t border-[color:var(--v3-rule-soft)] last:border-b py-8 md:py-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                    <div className="md:col-span-3">
                      <p
                        className="v3-mono"
                        style={{ color: "var(--v3-accent)" }}
                      >
                        / {p.n} — {p.kind}
                      </p>
                    </div>
                    <div className="md:col-span-6">
                      <h2
                        className="v3-display"
                        style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.15 }}
                      >
                        {p.title}
                      </h2>
                      <p
                        className="mt-3"
                        style={{ color: "var(--v3-ink-soft)", fontSize: 16, lineHeight: 1.55 }}
                      >
                        {p.body}
                      </p>
                    </div>
                    <div className="md:col-span-3 md:text-right">
                      {p.cta.disabled ? (
                        <>
                          <span
                            className="v3-btn v3-btn-outlined"
                            style={{
                              opacity: 0.5,
                              cursor: "not-allowed",
                              pointerEvents: "none",
                            }}
                            aria-disabled
                          >
                            {p.cta.label}
                          </span>
                          <p
                            className="v3-mono mt-2"
                            style={{ color: "var(--v3-ink-muted)" }}
                          >
                            {p.cta.note}
                          </p>
                        </>
                      ) : (
                        <a
                          href={p.cta.href}
                          target={p.cta.external ? "_blank" : undefined}
                          rel={p.cta.external ? "noreferrer noopener" : undefined}
                          className="v3-btn v3-btn-primary"
                          data-event="embed_open"
                          data-type={p.kind.toLowerCase()}
                        >
                          {p.cta.label}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
