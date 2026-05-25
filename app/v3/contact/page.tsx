import type { Metadata } from "next";
import { MastheadV3 } from "@/components/v3/MastheadV3";
import { FooterV3 } from "@/components/v3/FooterV3";

export const metadata: Metadata = {
  title: "Contact — Surajit Dutta",
  description:
    "Email is the fastest way to reach me. Share the role, team, and location preference, and I'll reply with the most relevant case studies and resume.",
};

const CHANNELS = [
  {
    label: "Email",
    value: "surajit3255@gmail.com",
    href: "mailto:surajit3255@gmail.com?subject=Product%20Design%20role%20%E2%80%94%20%5BCompany%5D%20%E2%80%94%20%5BTeam%2FProduct%5D",
    note: "Fastest. Reply within 24 hours.",
    event: { channel: "email" },
  },
  {
    label: "LinkedIn",
    value: "/in/surajit3255",
    href: "https://www.linkedin.com/in/surajit3255/",
    note: "Warm intros, coffee chats.",
    event: { channel: "linkedin" },
  },
  {
    label: "GitHub",
    value: "/bolder1",
    href: "https://github.com/bolder1",
    note: "Code reviews, public builds.",
    event: { channel: "github" },
  },
  {
    label: "Dribbble",
    value: "/surajit3255",
    href: "https://dribbble.com/surajit3255",
    note: "Visual range. Updated less often.",
    event: { channel: "dribbble" },
  },
];

/**
 * /v3/contact — single contact card with channels + recruiter
 * micro-copy. No big email moment (the home FinalCTA already had one);
 * this page is the "I'm here, here's how" reference.
 */
export default function V3ContactPage() {
  return (
    <>
      <MastheadV3 />
      <main id="main">
        {/* Header */}
        <section className="border-b border-[color:var(--v3-rule-soft)]">
          <div className="v3-container py-16 md:py-24">
            <p className="v3-eyebrow mb-6">/ Contact</p>
            <h1
              className="v3-display"
              style={{ fontSize: "clamp(36px, 5.6vw, 72px)", maxWidth: "20ch" }}
            >
              Email is the fastest way to reach me.
            </h1>
            <p
              className="v3-prose-lg mt-6"
              style={{ color: "var(--v3-ink-soft)", maxWidth: "60ch" }}
            >
              Share the role, team, and location preference and I'll reply
              with the most relevant case studies and resume. I'm open to
              roles focused on enterprise UX, AI product design, design
              systems, and workflow-heavy SaaS.
            </p>
            <p
              className="v3-mono mt-6"
              style={{ color: "var(--v3-ink-muted)" }}
            >
              Suggested subject: Product Design role — [Company] — [Team / Product]
            </p>
          </div>
        </section>

        {/* Channels */}
        <section aria-label="Channels">
          <div className="v3-container py-12 md:py-16">
            <p className="v3-eyebrow mb-8">/ Channels</p>
            <ul role="list" className="border-t border-[color:var(--v3-rule-soft)]">
              {CHANNELS.map((c) => {
                const external = c.href.startsWith("http");
                return (
                  <li
                    key={c.label}
                    className="border-b border-[color:var(--v3-rule-soft)]"
                  >
                    <a
                      href={c.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer noopener" : undefined}
                      className="group block py-6 md:py-8 no-underline transition-colors"
                      style={{ color: "var(--v3-ink)" }}
                      data-event="contact_click"
                      data-channel={c.event.channel}
                    >
                      <div className="grid grid-cols-12 items-baseline gap-4">
                        <div
                          className="col-span-2 md:col-span-2 v3-mono"
                          style={{ color: "var(--v3-ink-muted)" }}
                        >
                          {c.label}
                        </div>
                        <div className="col-span-8 md:col-span-6">
                          <p
                            className="v3-display group-hover:text-[color:var(--v3-accent)] transition-colors"
                            style={{ fontSize: "clamp(18px, 2.4vw, 28px)" }}
                          >
                            {c.value}
                          </p>
                          <p
                            className="mt-1"
                            style={{ color: "var(--v3-ink-muted)", fontSize: 14 }}
                          >
                            {c.note}
                          </p>
                        </div>
                        <div
                          className="col-span-2 md:col-span-4 text-right"
                        >
                          <span
                            aria-hidden
                            className="inline-block transition-transform group-hover:translate-x-1"
                            style={{ color: "var(--v3-accent)", fontSize: 18 }}
                          >
                            {external ? "↗" : "→"}
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
      <FooterV3 />
    </>
  );
}
