import Link from "next/link";

/**
 * FinalCTA — recruiter-friendly closing. Email is primary. Resume +
 * LinkedIn flank it. Single line of micro-copy with subject suggestion.
 *
 * This is the only place on the home where "open to roles" and
 * channels are exposed. No duplication in masthead or footer.
 */
export function FinalCTA() {
  return (
    <section
      id="contact-cta"
      className="border-b border-[color:var(--v3-rule-soft)]"
      aria-labelledby="contact-cta-heading"
    >
      <div className="v3-container py-20 md:py-28 text-center md:text-left">
        <p className="v3-eyebrow mb-6" style={{ justifyContent: "center", display: "inline-flex" }}>
          / 03 — Let's talk
        </p>
        <h2
          id="contact-cta-heading"
          className="v3-display mx-auto"
          style={{
            fontSize: "clamp(36px, 5.6vw, 76px)",
            maxWidth: "18ch",
            lineHeight: 1.05,
          }}
        >
          Hiring for enterprise UX, AI product, or workflow-heavy SaaS?
        </h2>

        <p
          className="v3-prose-lg mt-6 mx-auto"
          style={{ maxWidth: "52ch", color: "var(--v3-ink-soft)" }}
        >
          Email is the fastest way to reach me. Share the role, team, and
          location preference, and I'll reply with the most relevant case
          studies and resume.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-3">
          <a
            href="mailto:surajit3255@gmail.com?subject=Product%20Design%20role%20%E2%80%94%20%5BCompany%5D%20%E2%80%94%20%5BTeam%2FProduct%5D"
            className="v3-btn v3-btn-primary"
            data-event="contact_click"
            data-channel="email"
          >
            surajit3255@gmail.com
            <span aria-hidden style={{ marginLeft: 2 }}>↗</span>
          </a>
          <Link href="/v3/resume" className="v3-btn v3-btn-outlined">
            View resume
          </Link>
          <a
            href="/resume.pdf"
            download
            className="v3-btn v3-btn-ghost"
            data-event="resume_download"
            data-source="home_final_cta"
          >
            Download PDF
            <span aria-hidden style={{ marginLeft: 4 }}>↓</span>
          </a>
        </div>

        <p
          className="v3-mono mt-10"
          style={{ color: "var(--v3-ink-muted)" }}
        >
          Open to roles · Available · IST · async US
        </p>
      </div>
    </section>
  );
}
