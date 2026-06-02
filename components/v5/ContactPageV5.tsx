import Link from "next/link";

/**
 * ContactPageV5 — dedicated /contact page on the Info/AI one-pager shell:
 * orange abstract + scrim, big header + BACK, a left meta/visual rail, and
 * a right column with the CTA, buttons, and channel rows.
 */

const META = [
  { label: "Based in", value: "Kolkata, India · IST" },
  { label: "Status", value: "Open to roles & select freelance" },
  { label: "Reply", value: "Usually within a day" },
];

const CHANNELS = [
  { label: "Email", value: "surajit3255@gmail.com", href: "mailto:surajit3255@gmail.com" },
  { label: "LinkedIn", value: "/in/surajit3255", href: "https://linkedin.com/in/surajit3255" },
  { label: "Dribbble", value: "@surajit3255", href: "https://dribbble.com/surajit3255" },
  { label: "GitHub", value: "github.com", href: "https://github.com" },
];

export function ContactPageV5() {
  return (
    <main className="v5-info v5-aip v5-contact">
      <div className="v5-hero-abstract" aria-hidden><span /></div>
      <div className="v5-info-scrim" aria-hidden />

      <header className="v5-info-header">
        <h1 className="v5-info-title">Contact</h1>
        <Link href="/" className="v5-info-back">← Back</Link>
      </header>

      <div className="v5-info-grid">
        <aside className="v5-info-side">
          <div className="v5-info-portrait v5-aip-portrait">
            <span className="x tl">+</span>
            <span className="x tr">+</span>
            <span className="x bl">+</span>
            <span className="x br">+</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/v5/img-b.avif" alt="" aria-hidden />
          </div>
          <div className="v5-info-meta">
            {META.map((m) => (
              <div className="v5-info-meta-row" key={m.label}>
                <span className="v5-info-meta-label">{m.label}</span>
                <span className="v5-info-meta-value">{m.value}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="v5-info-main">
          <p className="v5-info-eyebrow">Contact</p>
          <h2 className="v5-info-name">
            Let&rsquo;s build <em>something that lasts.</em>
          </h2>
          <p className="v5-info-lead">
            Senior product design roles and selective freelance. The work
            starts with a conversation — start one here.
          </p>

          <div className="v5-contact-actions">
            <a href="mailto:surajit3255@gmail.com" className="v5-btn-primary">EMAIL ME&nbsp;↗</a>
            <a href="/cv.pdf" className="v5-btn-outline" download>DOWNLOAD CV&nbsp;↓</a>
          </div>

          <div className="v5-contact-channels">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="v5-contact-channel"
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener"
              >
                <span className="lbl">{c.label}</span>
                <span className="val">{c.value}</span>
                <span className="arr" aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="v5-info-footer">
        <a href="mailto:surajit3255@gmail.com">surajit3255@gmail.com</a>
      </footer>
    </main>
  );
}
