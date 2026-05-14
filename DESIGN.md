# Folio — design system

## Palette
OKLCH-tinted neutrals + one accent. Strategy: **Restrained** for inner pages,
**Committed** on the visualize hero scenes (the accent is the storytelling
glyph, not decoration).

| Token | Hex | OKLCH | Use |
|---|---|---|---|
| `--paper` | `#f3ecde` | oklch(94% 0.020 80) | base canvas, "newsprint" |
| `--paper-2` | `#e8dfcc` | oklch(89% 0.025 80) | sub-section bg, alternate stripe |
| `--ink` | `#161109` | oklch(15% 0.020 60) | primary text + rules |
| `--ink-soft` | `#3b2f24` | oklch(28% 0.020 60) | body prose |
| `--muted` | `#6f6357` | oklch(48% 0.015 70) | mono eyebrows, meta |
| `--rule` | `#2a201a` | oklch(20% 0.018 60) | thick rules, top dividers |
| `--rule-soft` | `#c8bda8` | oklch(78% 0.018 75) | hairlines, soft dividers |
| `--accent` | `#d8331a` | oklch(54% 0.205 30) | vermilion — diamonds, italic accents, hover |
| `--accent-soft` | `#f3a292` | oklch(75% 0.110 30) | subtle accent fills |

Never `#000` / `#fff`. The neutrals are tinted toward the paper hue.

## Typography
- **Display**: Instrument Serif 400 + italic. `letter-spacing: -0.025em` /
  `-0.03em` italic. Line height 0.92 for headlines, 1.6 for body prose.
- **Mono**: Geist Mono 400. 11px / 0.18em letter-spacing / uppercase. Used for
  eyebrows, dateline meta, page-margin labels, tile registration marks.
- **Body prose**: Instrument Serif (yes — body is set in the same display
  serif at 19px / 1.6 line-height). Italic is reserved for emphasis.
- Drop cap: `::first-letter` 5.2em italic in `--accent`, with subtle
  text-shadow for newsprint feel.
- Hierarchy: ratio ≥ 1.25 between steps. Display goes from 22 → 32 → 64 →
  88 → 120 → 160 px depending on container.

## Motion
- Easing: `[0.22, 1, 0.36, 1]` (ease-out-quart) for entrance,
  `cubic-bezier(0.65, 0.05, 0.36, 1)` for the scanning wipe.
- Durations: 0.25s for nav, 0.55–0.7s for content reveals, 1.4–2.2s for
  path-length animations, 14–40s for ambient loops.
- No bounce / elastic.
- Round trig coords to 2 decimals to keep server/client output identical.

## Component conventions
- **Section eyebrow** `.section-tag` — vermilion border, monospace 10px,
  printer's-mark corner ticks (top-left + bottom-right squares).
- **Diamond glyph** — 8px square, rotated 45°. Filled (◆) = converge,
  hollow (◇) = diverge. The narrative spine.
- **Pull quote** — italic, hanging-punctuation, rules above + below.
- **Page margins** — vertical eyebrow strip on `lg+`, sectional folio number.
- **Illustration palette** — line-work only; vermilion fills only on the
  one element you want the eye to land on.

## Anti-patterns explicitly banned
- Side-stripe borders on cards.
- Gradient text. Period.
- Glassmorphism / blurred panels.
- Hero-metric template (big number + small label + supporting stats with
  decorative accent line).
- Identical card grids (each Domain card has a unique icon + meta line).
- Modal as first thought.

## File map
- `app/globals.css` — tokens + utilities + drop caps + section-tag corners.
- `components/Masthead.tsx` — newspaper top bar (large + compact variants).
- `components/Folio.tsx` — newspaper footer.
- `components/HomeSections.tsx` — magazine page sections.
- `components/CaseStudy.tsx` — case-study sections + placeholder tiles.
- `components/CaseStudyRich.tsx` — extended case-study layouts.
- `components/WorkArchive.tsx` — filterable archive grid on `/work`.
- `components/Button.tsx` — buttons, status pills, tags.
- `components/CountUp.tsx` — animated outcome counters.
- `components/RequestAccess.tsx` — mailto request flow for locked cases.
- `components/Reveal.tsx` — scroll-triggered fade.
- `components/SmoothScroll.tsx` — Lenis bootstrap.
