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

---

# Concept 02 — "Velocity" (`/v2`)

A second home-page concept, switchable from the toggle docked to the top-centre
of `/` and `/v2`. It argues one thing: speed, with a system behind it. Scoped
entirely to `.v2-root`, nested inside `.v5-root` and overriding every token it
inherits, so the two concepts cannot leak into each other.

## Palette — "volt on void"
Deliberately not concept 01's warm orange/maroon. A cool graphite-green
near-black carries the page and a single high-chroma chartreuse does all the
signalling. Greens read as voltage and as terminal-heritage precision, and are
the one family the default AI-portfolio palette never reaches for.

| Token | Hex | Use |
|---|---|---|
| `--v2-void` | `#07090a` | page base, faint green cast (never `#000`) |
| `--v2-void-2` | `#0a0d0e` | alternate section base |
| `--v2-slab` / `-2` / `-3` | `#101413` `#161b19` `#1c2220` | raised surfaces |
| `--v2-line` / `-2` / `-3` | `#1b2120` `#283029` `#3a443c` | rules, three weights |
| `--v2-bone` / `-2` | `#eef1e9` `#a8afa5` | primary text, prose |
| `--v2-mute` / `--v2-faint` | `#6c7470` `#454d49` | meta, tertiary |
| `--v2-volt` | `#c8f24e` | **the** accent. Never a gradient. |
| `--v2-volt-2` / `-deep` | `#a6cd2f` `#4c6416` | ticks, spent rail |

Shadows are tinted green-black (`rgba(4,8,5,…)`) with one light source, top-left.

## Typography
- **Display**: Archivo variable (`wght` 100–900 + `wdth` 62–125). The width axis
  is the point: the hero headline animates 62 → 106 on entry, so the words
  physically expand into place. Section titles sit at `wdth` 84–92.
- **UI / prose**: Geist. Body copy capped at ~62ch.
- **Mono**: Geist Mono for every label, eyebrow and number. All figures are
  `tabular-nums`.

## Sections
| § | id | What it does |
|---|---|---|
| 01 | `v2-intro` | Hero. Hand-written GLSL velocity field (`VelocityField.tsx`) |
| 02 | `v2-speed` | Velocity ledger. Pinned 340vh runway → horizontal card track |
| 03 | `v2-range` | The T. Crossbar draws, then the stem drops, scroll-driven |
| 04 | `v2-system` | The engine. Interactive 1,296-variant matrix on canvas |
| 05 | `v2-process` | The pipeline. 8 stations, judgement above the rail |
| 06 | `v2-proof` | Receipts. Row list with a cursor-trailing preview |
| 07 | `v2-engage` | The offer. Three engagements as one spec sheet |
| 08 | `v2-contact` | Kinetic belt, contact, footer |

## Motion
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrance and scroll-linked work,
  `cubic-bezier(0.34, 1.42, 0.64, 1)` for the toggle thumb and dot pops.
- Scroll-linked sections write CSS custom properties once per rAF; no element is
  animated from JS directly.
- Every pinned section drops its pin below 700px wide or 620px tall and becomes
  a native snap-scroller. Hijacked scroll on a phone is not worth the effect.
- `prefers-reduced-motion` freezes the shader on one frame and disables reveals.

## Rules this concept holds to
- One accent. No second hue, anywhere.
- No gradient text, no glassmorphism panels, no pill badges.
- No three-equal-card feature row: the crossbar is 7 unequal cells, the offer is
  a spec sheet with aligned baselines, the receipts are rows.
- Numbers are real or clearly framed as comparisons. No prices invented.
- Every claim on the page is either checkable in the UI (the matrix) or links to
  a live URL (the receipts).
