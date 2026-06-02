/**
 * §09 FooterV5 — big split name + stacked link columns.
 */

const SOCIAL = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/surajit3255" },
  { label: "Dribbble", href: "https://dribbble.com/surajit3255" },
];
const NAV = [
  { label: "Work", href: "/work" },
  { label: "Gallery", href: "/gallery" },
  { label: "AI", href: "/ai" },
  { label: "Info", href: "/info" },
  { label: "Contact", href: "/contact" },
];

export function FooterV5() {
  return (
    <footer className="v5-footer2">
      {/* Big flat "let's build something" band, stepped on top of the footer */}
      <div className="v5-footer-cta" id="contact">
        <div className="v5-footer-cta-left">
          <p className="eyebrow">/ open to work — 2026</p>
          <h2 className="v5-footer-cta-title">
            Let&rsquo;s build <em>something that lasts.</em>
          </h2>
        </div>
        <div className="v5-footer-cta-actions">
          <a href="mailto:surajit3255@gmail.com" className="v5-btn-primary">EMAIL ME&nbsp;↗</a>
          <a href="/cv.pdf" className="v5-btn-outline" download>DOWNLOAD CV&nbsp;↓</a>
        </div>
      </div>

      {/* Top link rows */}
      <nav className="v5-footer2-top" aria-label="Footer">
        <div className="col">
          <a href="mailto:surajit3255@gmail.com">surajit3255@gmail.com</a>
          <span className="muted">© 2026</span>
        </div>
        <div className="col center">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener">
              {s.label.toUpperCase()}
            </a>
          ))}
        </div>
        <div className="col right">
          {NAV.map((n) => (
            <a key={n.label} href={n.href}>
              {n.label.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>

      {/* Big split name */}
      <h2 className="v5-footer2-name" aria-label="Surajit Dutta">
        <span className="first">Surajit</span>
        <span className="last">
          Dutta<span className="dot">.</span>
        </span>
      </h2>
    </footer>
  );
}
