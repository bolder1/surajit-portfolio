---
version: 1
name: "Phosphor & Glass"
description: >
  Frame system for Surajit Dutta's 52 s designer reel. An early-80s vector-CRT world (one magenta
  phosphor beam, a perspective vector floor, a scope-axis horizon) in cyberpunk neon on violet-black.
  His real work sits under Apple-style liquid glass that visibly bends the beam and the floor as they
  pass behind it. Everything is hand-built motion, synthesised sound, real screenshots and his real photo.
unit: "frame 1920x1080 · 30 fps · 120 BPM (beat 15 f = 0.5 s, bar 60 f = 2 s) · 1560 f total"
principle: "one beam · one focal accent per frame · real work under real glass · nothing generated"
proof: "compositions/00-styleframe.html · review/styleframe-*.png · review/styleframe.mp4"

colors:
  void: "#0B0716" # base background of every frame
  void-deep: "#070410" # vignette edge, drop shadows, fades to black
  tube: "#140C26" # raised dark surfaces: Tier B tint base, inactive tiles
  grid: "#4A2C8C" # vector floor, graticule, wireframe outlines at rest
  haze: "#3B1E6E" # horizon haze radial only (never a flat fill)
  ink: "#F3EEFF" # primary type (17.5:1 on void)
  ink-dim: "#B4A8DA" # labels, secondary type (9.0:1)
  ink-faint: "#8C7EB8" # tertiary text, inactive states (5.5:1, the floor for any text)
  beam: "#FF2E97" # THE line. hot magenta. default focal accent
  beam-core: "#FFD9EC" # white-hot beam core, power-on flash, sheen
  cyan: "#22E6FF" # system/state accent, scope axis, glass edge light
  volt: "#F5FF3B" # electric yellow, hits only (a number landing, a day lighting)
  capture-well: "#0E0D10" # behind screenshots inside glass

typography:
  display:
    fontFamily: "Mona Sans"
    file: "assets/fonts/MonaSans-var.woff2"
    axes: "wdth 75–125 · wght 200–900"
    rest: "wdth 125 · wght 900 · UPPERCASE"
    size: "120–220 px (name 176 px in the style frame)"
    lineHeight: 0.92
    tracking: "-0.01em"
  statement:
    fontFamily: "Mona Sans"
    rest: "wdth 100 · wght 380 · sentence case"
    size: "44–64 px"
    lineHeight: 1.2
  label:
    fontFamily: "JetBrains Mono"
    file: "assets/fonts/JetBrainsMono-normal.woff2"
    rest: "wght 500 · UPPERCASE · tracking 0.14em · color ink-dim"
    size: "22–26 px"
  numeral:
    fontFamily: "Doto"
    file: "assets/fonts/Doto-var.woff2"
    rest: "wght 900 · tabular-nums"
    size: "220–360 px"

glass:
  tierH: { use: "one hero glass per frame (device, plate, portrait slab)", technique: "SVG lens filter on a duplicated world", dir: +1, power: 2, chroma: "R 1.00 · G 0.90 · B 0.80" }
  tierB: { use: "chips, pills, tiles, beads (max 3 per frame)", technique: "backdrop-filter: url(#svg-lens)", dir: -1, power: 1.6, chroma: "R 1.00 · G 0.90 · B 0.80" }
  device: { w: 480, h: 880, radius: 76, screenInset: 40, screenRadius: 40, bezel: 84, scale: 112, pad: 90 }
  plate: { radius: 56, bezel: "0.1 × min(w,h), clamp 48–96", scale: "1.33 × bezel", pad: "scale × 0.6 + 20" }
  chip: { height: "64–80", radius: "h / 2", bezel: "0.42 × h", scale: "0.58 × h" }
  tile: { radius: 22, bezel: 28, power: 1.8, scale: 40 }
  bead: { size: 72, radius: 36, bezel: 30, scale: 36 }
  tint: { tierH: "rgba(180,150,255,0.07)", tierB: "rgba(20,12,38,0.42)" }

motion:
  bpm: 120
  beat: "15 f / 0.5 s"
  bar: "60 f / 2 s"
  eases:
    slam: "expo.out 0.30–0.42 s (type, numerals)"
    snap: "power4.out 0.12–0.20 s (pads, labels, UI state)"
    pen: "none at 1350 px/s cruise · power2.out into a stop (beam travel)"
    launch: "power2.in 0.25–0.35 s (beam shots, moves into a cut)"
    glass: "ReelKit.spring(0.55, 0.62, 1.2) over 1.2 s (Tier H condense)"
    chip: "ReelKit.spring(0.45, 0.80, 0.7) over 0.7 s (Tier B entrance)"
    digital: "steps(n) (typing, counters, caret)"
    drift: "sine.inOut / none (haze, scroll, floor)"
    exit: "power3.in 0.15–0.25 s"
  banned: "back.*, elastic.*, bounce.* (the glass springs are the only overshoot)"
---

# Phosphor & Glass

## Concept

**One magenta beam, drawn like a 1982 vector CRT, traces Surajit's road from circuit boards to calm
enterprise software, and every piece of his real work it reaches is held under Apple-style liquid
glass that bends the beam as it passes.**

The retro half is his past: he trained in Electronics & Telecom, so the world is a bench oscilloscope
and a vector arcade tube, where everything is drawn by one beam and nothing is filled. The glass
half is his present: product design at the level of a 2025 OS material. The tension between the two
is the film's look and its story. The beam is the protagonist; the glass is where the work lives.

Brand voice in three physical words: **soldered, luminous, exact.**

## Palette and ratios

Tokens are in the frontmatter. Quote them verbatim; never invent a hex. Allowed alphas are listed in
the recipes below; anything else is a token at 100%.

Coverage per frame, by area:

| Role                         | Tokens                          | Share of frame |
| ---------------------------- | ------------------------------- | -------------- |
| Ground                       | void, void-deep, tube           | 80–88%         |
| Structure                    | grid, haze, glass skin          | 6–12%          |
| Type                         | ink, ink-dim, ink-faint         | 3–8%           |
| Focal accent (one per frame) | beam **or** cyan **or** volt    | ≤ 3% (≤ 6% on F3, F7, F12 hits) |
| Support accent               | the other neon, at ≤ 45% alpha  | ≤ 1.5%         |

Rules:

- **One focal accent per frame.** The frame table at the end names it. When the focal accent is
  cyan or volt, the beam drops to its persisted state (stroke-opacity 0.5, no head) for that frame.
- **volt is a hit, not a colour.** It appears on the frame a number lands or a day lights, then
  decays to ink within 0.5 s. Never on a hold for more than 1 beat. Never on type smaller than 120 px.
- **Glow marks light sources only:** the beam, a powered-on screen, a landing number. Type never
  glows (no text-shadow on ink). Glass never glows; it reflects (rim light).
- **No full-screen linear gradients** (H.264 bands them). Haze is a radial gradient; grain dithers it.
- **Neutrals are violet-tinted.** No #000, no #FFF except the beam head (#FFFFFF, a light source).

## Retro texture system

Era: **1979–1984 vector CRT.** Vector arcade cabinets (Tempest, Battlezone, Star Wars) plus the bench
oscilloscope. Vector tubes have no scanlines and no pixels: a beam draws lines and the phosphor glows
and decays. That is the whole texture language; it is applied the same way in every frame.

1. **The beam.** Four stacked strokes on one path:
   `old` beam 5 px @ 50% (everything drawn so far) · `fresh` beam 6 px, a 560 px segment trailing the
   head · `core` beam-core 2.2 px (everything drawn so far) · `head` #FFFFFF 7 px, a 70 px segment.
   Set with `ReelKit.dash(paths, len, s, seg)`; `len` from `getTotalLength()` at build time.
   **Bloom** = SVG filter: `feGaussianBlur σ5` + `σ16` merged under the source. Filter region = beam
   bounding box + 60 px (a 2400×1500 region costs ~40% more render time for nothing).
2. **Phosphor persistence.** After a hard stop the head fades in 0.10–0.12 s and `fresh` decays to
   0.55–0.60 opacity in 0.6–0.7 s (power2.out). `old` stays at 0.5. The persisted beam is the calm
   through-line that is always somewhere on screen.
3. **Routing.** 45° and 90° bends only (PCB routing). Every bend the beam stops on gets a **pad**:
   ring r 11, stroke beam 3.5 px, fill void, pops 0→1 in 0.18 s power4.out as the head arrives.
   Curves exist only in F11 (the knot) and F12 (the signature).
4. **Vector floor.** Horizon y 690 (a frame may move it ±120 px), vanishing point x 960, 33 radial
   lines (300 px apart 780 px below the horizon), 44 rows from `ReelKit.gridRowY(k, phase, 690, 1560)`.
   Stroke grid 1.5 px under a vertical mask: 0 at the horizon → 0.5 at 18% → 0.9 at the bottom edge.
   Scroll: phase advances 2 per second (one cell per beat). Speed ramp ×4 on the F3 drop (first 15 f)
   and the F5→F6 dolly.
5. **Scope-axis horizon.** cyan 1.6 px @ 42%, ticks every 48 px (±4 px), major every 240 px (±9 px).
   Present whenever the floor is. F1 replaces the floor with a flat graticule: 10 × 8 divisions of
   192 px, grid @ 35%, centre axes ticked like the horizon.
6. **Haze.** Radial gradient centred on (960, horizon), radii 1150 × 330, haze @ 85% → 32% at 0.45 → 0.
   Breathes 75% ↔ 100% (sine.inOut, 1 s, yoyo).
7. **CRT power-on** (entrance of every raster asset: captures, case screens, portrait). scaleX
   0.02→1 in 0.12 s power4.out, then scaleY 0.006→1 in 0.24 s expo.out; a beam-core flash layer
   95%→0 in 0.36 s; a scanline overlay (3 px period, 1 px void-deep @ 55%) 90%→0 in 0.7 s power2.in.
   Scanlines exist **only** during these 21 frames. SFX `crt-on`.
8. **CRT power-off.** Used once: F11's last 12 frames (1368–1380). Frame container scaleY 1→0.004 in
   6 f power3.in, then scaleX 1→0 in 4 f power4.in, a beam-core dot holds 2 f. SFX `power-down`.
9. **Grain.** `ReelKit.grainURL(1337)` tile, `mix-blend-mode: overlay` @ 10%, re-rolled every video
   frame with `ReelKit.grainPos(t)`. Topmost layer of every frame, `data-layout-ignore`.
10. **Vignette.** Radial 78% × 74%, clear to 58%, void-deep @ 72% at the edge. Sits above the world,
    **below** type and glass (over type it greys the first letter of the name).
11. **Chroma split on cuts only.** ±6 px R/B horizontal offset collapsing to 0 over ≤ 4 frames, on the
    cuts marked "chroma" in the transition table. Use the installed `rgb-glitch-text` component with
    its 6-step jitter cut to 2 steps of 0.066 s. Never on a hold.

Not in this film: synthwave sun or stripes, palm trees, mountains, starfields, chrome gradient text,
VHS tracking noise, whole-frame scanlines, whole-frame barrel curvature, pixel fonts, lens flares,
padlocks or shields.

## Liquid glass

Two tiers, both tested in headless Chrome 152 with SwiftShader (the render path used here). Build them
with `window.ReelKit` (`assets/lib/reel-kit.js`, loaded once by `index.html`); do not hand-roll maps.

### Tier H: hero lens (one per frame)

The glass contains a **second copy of the frame's world** (floor, haze, axis, beam), offset by the
glass position, and an SVG filter displaces that copy outward at the rim. The rim therefore shows
neon from *outside* the glass, compressed and split into a spectral fringe: the beam visibly enters
the glass before it reaches it. This is the Apple liquid-glass behaviour and it is the look.

```html
<div id="f03-device">                          <!-- position, size, border-radius, overflow:hidden, isolation:isolate -->
  <div id="f03-lens" style="filter:url(#f03-lens-f)">   <!-- inset:0 -->
    <div class="f03-world" style="left:-Xpx; top:-Ypx"></div>  <!-- copy of the world; Y,X = device position -->
    <div id="f03-screen">…capture or portrait…</div>          <!-- content sits UNDER the glass, so its edges bend too -->
  </div>
  <div class="lg-tint"></div><div class="lg-shade"></div><div class="lg-rim"></div>
</div>
```

```js
defs.insertAdjacentHTML("beforeend",
  ReelKit.lensFilter("f03-lens-f", { w: 480, h: 880, r: 76, bezel: 84, dir: 1, power: 2, pad: 90 }));
ReelKit.setRefraction(document.getElementById("f03-lens-f"), 112 * k); // k: 0 → 1
```

- Build the world with a function and call it twice (frame + lens copy); give every gradient/mask
  id a per-copy suffix. GSAP tweens target classes so both copies move together.
- The device may **translate** only if the copy counter-translates (copy.x = −device.x). No rotation,
  no 3D, no scale on Tier H (the copy would misalign). Tilted planes use Tier B or the skin alone.
- `color-interpolation-filters="sRGB"` and `filterUnits/primitiveUnits="userSpaceOnUse"` are required
  (ReelKit sets them). Without sRGB the map values drift and the centre warps.
- Frost, when wanted: CSS `filter: blur(1.2px)` on the world copy only (never on the content).

### Tier B: backdrop glass (chips, pills, tiles, beads; max 3 per frame)

```css
#f04-chip { border-radius: 38px; backdrop-filter: url(#f04-chip-f); }  /* nothing else in that list */
```
```js
defs.insertAdjacentHTML("beforeend",
  ReelKit.lensFilter("f04-chip-f", { w: 470, h: 76, r: 38, bezel: 32, dir: -1, power: 1.6 }));
ReelKit.setRefraction(document.getElementById("f04-chip-f"), 44 * k);
```

`backdrop-filter` can only sample inside the element, so Tier B maps point **inward**: the rim
magnifies what is under it. Works over anything (video, captures, other glass). Tier B may scale and
rotate.

### The skin (both tiers)

- **Tint** `.lg-tint`: Tier H rgba(180,150,255,0.07); Tier B carrying text rgba(20,12,38,0.42).
- **Shade** `.lg-shade` (inset stack): `inset 0 2px 1px -1px rgba(255,255,255,.7)`, `inset 0 26px 40px
  -30px rgba(255,255,255,.35)`, `inset 0 -34px 54px -34px rgba(34,230,255,.28)`, `inset 0 0 36px
  rgba(180,150,255,.10)`, `inset 0 0 0 1px rgba(243,238,255,.10)`.
- **Specular rim** `.lg-rim`: 2 px masked ring (`mask-composite: exclude` + `-webkit-mask-composite:
  xor`), `conic-gradient(from var(--spec), #FFF@95% 0°, #FFF@18% 46°, transparent 90°, beam@70% 168°,
  transparent 214°, cyan@45% 300°, #FFF@95% 360°)`. Lit top-left, beam-tinted bottom-right, cyan
  edge chroma on the left.
- **Drop** `0 60px 90px -40px rgba(7,4,16,.95)`; glass that stands on the floor adds a **floor
  caustic**: beam ellipse @ 30%, rx = 0.56 × glass width, ry 30, `feGaussianBlur σ22`, 20 px below.

### Glass motion

| Moment          | Recipe                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Tier H condense | refraction 0→full with `ReelKit.spring(0.55, 0.62, 1.2)` over 1.2 s (one liquid wobble); skin opacity 0→1 in 0.3 s power2.out; `--spec` +100° in 1.6 s power3.out. **No position or scale move.** SFX `glass-tink`. |
| Tier B entrance | scale 0.86→1 + opacity 0→1 and refraction 0→full, both `ReelKit.spring(0.45, 0.8, 0.7)` over 0.7 s; `--spec` +140° in 1.0 s. |
| Exit (melt)     | refraction → 0 in 0.25 s power2.in while skin opacity → 0. Glass never slides out. |
| Hold            | `--spec` may drift 10°/s (sine). No wobble loops. |

### Verified behaviour and limits (tested 2026-10-09)

- Tier H outward lens wraps outside neon into the rim with R/G/B dispersion (see
  `review/styleframe-02-rim.png`). Tier B backdrop lens bends content under the chip.
- `backdrop-filter: url(#svg)` works in this Chrome but is edge-clamped: outward maps show nothing
  from outside. Hence the inward Tier B map.
- `backdrop-filter: url(#lens) blur(2px) saturate(1.6)` in one list **dropped the blue channel**
  (magenta and cyan vanished). Never combine `url()` with other backdrop functions.
- `feGaussianBlur` inside a backdrop SVG filter left a dark inner frame (the backdrop edge is
  transparent). No blur inside Tier B filters.
- WebGL1 runs on SwiftShader; WebGL2 does not. The registry liquid-glass blocks (`vfx-liquid-glass`,
  `liquid-glass-widgets`) need three.js plus the html-in-canvas `drawElementImage` API and ship
  placeholder copy, so they were rejected in favour of this SVG recipe.
- Budget: 1 Tier H + 3 Tier B visible at once. Each Tier H costs 3 displacement passes over
  (w + 2·pad) × (h + 2·pad) per frame.

## Typography

- **Display (Mona Sans, wdth 125 / wght 900, uppercase).** The arcade-marquee voice: extended black
  caps. Signature move: on entrance the width axis opens 75→125 in 0.42 s expo.out while the line
  rises out of a mask (yPercent 105→0), like a filter opening on a synth. On a later beat hit it may
  pulse 125→110→125 over 0.25 s. Tween the custom property: `{"--wdth": 125}` with
  `font-variation-settings: "wdth" var(--wdth), "wght" 900`.
- **Statement (Mona Sans, wdth 100 / wght 380).** His own lines only. Clip-path wipe left→right,
  0.45 s power3.out. One statement per frame, max 9 words.
- **Label (JetBrains Mono 500, uppercase, 0.14em).** True system text only: years, places, roles,
  states. Typed with `steps(n)` at about 60 characters per second, with a beam-coloured block caret
  that blinks in eighths (0.25 s) and goes dark after 3 blinks.
- **Numeral (Doto 900).** Count with `steps()` like an arcade score; the landing digit is volt for
  1 beat, then ink.
- **Arrows are drawn, not typed.** None of the shipped font subsets has → (U+2192) or ≈. Draw a
  shaft plus a 45° head as an SVG stroke (ink 2.4 px at label size; beam strokes in headlines).
- **No second display face.** Mona Sans Expanded Black already carries the retro marquee, and its
  width axis is the signature move; a chrome or neon display font would break "one expressive font
  per frame". Instrument Serif (impeccable reflex list, editorial lane) and Inter Tight are not used.
- Minimum sizes: labels 22 px, statements 44 px, display 120 px. Hierarchy steps ≥ 1.25×.

## Motion language

Energetic means **fast arrivals, hard stops, held frames**, not everything moving.

- **Easing set** is in the frontmatter. Every frame uses at least three characters (slam, pen,
  glass are the usual three). No back/elastic/bounce.
- **Beat grid.** Each bar's downbeat carries the primary hit (a cut, a slam, a condense). Beats 2–4
  carry secondary hits (a chip, a label, a pad). Eighths carry tertiary detail (caret, second line).
  At most a third of the elements move at once. The key composition of each frame holds ≥ 1 beat.
- **Speed ramps.** The beam cruises (none), decelerates into pads (power2.out), and fires through
  glass (power2.in). Camera moves (a frame's world container) go power3.in into a cut and expo.out
  out of the next one, velocity-matched.
- **Silence.** 8 frames of void before the drop (232–240) and the breakdown (F11) are part of the
  motion design; nothing moves in them except grain.

### Transition system (the beam carries most of them)

| Cut (f) | From → To | Method                                                                                                    |
| ------- | --------- | --------------------------------------------------------------------------------------------------------- |
| 120     | F1 → F2   | **Match.** No visible cut: F1's last beam point is F2's first; the graticule dissolves to the node layout over 8 f. |
| 240     | F2 → F3   | **Drop.** F2 pinches to a dot (220–232, power3.in), void 232–240, F3 opens with a 2 f beam-core flash @ 35% and the floor rushing (×4 scroll for 15 f). |
| 360     | F3 → F4   | **Whip along the beam.** Out: world x 0→−400 + blur 0→24 px, 6 f power3.in. In: x 400→0, blur 24→0, 9 f expo.out. |
| 480     | F4 → F5   | **Continue.** Same lateral pan, no blur; the beam's exit y in F4 = its entry y in F5. |
| 600     | F5 → F6   | **Dolly.** Out: scale 1→1.25 + floor ×4, 10 f power3.in. In: scale 0.8→1, 12 f expo.out. |
| 780     | F6 → F7   | **Hard cut + chroma** (4 f). |
| 960     | F7 → F8   | **Hard cut.** |
| 1080    | F8 → F9   | **Continue upward.** Out y 0→−300, 6 f power3.in; in y 300→0, 9 f expo.out. |
| 1200    | F9 → F10  | **Hard cut + chroma** (3 f). |
| 1320    | F10 → F11 | **Hard cut** into the breakdown. |
| 1380    | F11 → F12 | **CRT off → CRT on** (1368–1380 off, 1380–1392 on). |
| 1530    | F12 end   | Fade to void-deep over 30 f, sine.inOut. |

## Asset treatment

Copy every asset into `assets/` (paths in compositions are root-relative: `assets/img/…`).

- **Screenshots and case screens** (`../../public/showcase/*-m.jpg`, `*-d.jpg`,
  `../../public/projects/**`): always inside glass. The frame's hero capture is the Tier H screen;
  secondaries sit in a Tier B frame or wear the skin alone. **UI Fidelity:** no colour grade, no hue
  shift, no duotone, no scanlines after power-on. The showcase concept renders are very dark (average
  luma ≈ 37/255), so each one gets the measured exposure correction through the canonical tool:
  `npx hyperframes media-treatment --file compositions/<frame>.html --selector "#<img-id>" --grading
  '{"adjust":{"exposure":0.42,"contrast":0.12,"shadows":0.1}}' --apply` (run `--analyze` first; keep
  exposure ≤ 0.5). Light case screens (banking-tool, design-system cover) get no correction and sit
  on capture-well. Entrance is always the CRT power-on. Inside the glass, tall mobile captures scroll
  at constant speed (≈ 75 px/s, `ease: none`); desktop captures push in 1.00→1.04 over the hold.
- **Portrait** (`../../public/v5/portrait.png`, 3776×4532, red-lit, alpha): downscale to 1200 px tall
  before use (`assets/img/portrait.png`). It lives in a Tier H slab (F3, F12). Treatment: "phosphor
  print", an ordered dither in the film's own inks through media-treatment, resolving after power-on
  (recipe and test in `review/portrait-test.png`; see the note at the end of this file).
- **3D loops** (`public/v5/*.webm`): not used. They read as a different, rendered world.

## Per-frame focal elements

| Frame                     | f         | Focal element                              | Accent | Glass                                   | Retro device                     |
| ------------------------- | --------- | ------------------------------------------ | ------ | --------------------------------------- | -------------------------------- |
| F1 Origin                 | 0–120     | the beam head routing a PCB trace          | beam   | 2 Tier B year chips                      | graticule, pads, CRT-on of world |
| F2 Thesis                 | 120–240   | his line "The systems thinking…"           | beam   | 3 Tier B node tiles                      | persistence, pinch to dot        |
| F3 Name                   | 240–360   | SURAJIT DUTTA                              | beam   | Tier H portrait slab                     | floor rush, power-on, sheen once |
| F4 Fortmindz 2022         | 360–480   | beam threading the checkout chips          | beam   | 3 Tier B chips (4th is the label)        | wireframe vectors, pads          |
| F5 Impero IT 2023         | 480–600   | the component sheet assembling             | cyan   | 3 Tier B phone shells                    | vector outlines, snap ticks      |
| F6 miniOrange 2024→now    | 600–780   | the hero capture (UEM mobile)              | cyan   | Tier H device + 2 Tier B capture frames  | dolly over floor, power-on       |
| F7 Five days              | 780–960   | "3 weeks → 5 days" and the 5 lit days      | volt   | 5 Tier B day tiles (3 visible at a time) | Doto counter, chroma cut         |
| F8 What I do              | 960–1080  | the glass selector over the active word    | beam   | 1 Tier B selector pill                   | width-axis slams                 |
| F9 How I work             | 1080–1200 | the pulse travelling the 5 steps           | cyan   | 5 Tier B beads (3 near the pulse lit)    | scope axis, persistence          |
| F10 Numbers               | 1200–1320 | the number landing                         | volt   | Tier H plate over the counter            | arcade score count               |
| F11 Make complex feel calm| 1320–1380 | the line pulling straight                  | beam-core / ink | none (the breath)              | CRT power-off                    |
| F12 Invitation            | 1380–1560 | the name, signed by the beam               | beam   | Tier H portrait slab + Tier B status chip | CRT power-on, signature stroke  |

## Builder contract

- `index.html` loads `assets/vendor/gsap.min.js` (GSAP 3.14.2, vendored from npm because the render
  browser cannot reach the CDN: `net::ERR_TUNNEL_CONNECTION_FAILED`) and `assets/lib/reel-kit.js`.
  Frames never load scripts from a CDN.
- Paths are root-relative (`assets/…`). `../assets` is a lint error (`invalid_parent_traversal_in_asset_path`).
- Prefix every id, filter id, gradient id and mask id with the frame id (`f06-…`): SVG filters are
  global once frames are assembled, and transitions overlap two frames.
- Mark layers for the layout audit: grain and vignette `data-layout-ignore`; type that sits under them
  `data-layout-allow-occlusion`; world copies and scrolling captures `data-layout-allow-overflow`.
- Every visual is a pure function of timeline time (ReelKit setters in `onUpdate` are fine). No
  `Math.random`, no clocks, `repeat: -1` never.
- Keep each frame file under ~350 lines (lint warns above that); shared code lives in ReelKit.
- Copy: only `FACTS.md` claims, no em dashes, nothing about AI. Every string passes the humanizer rules.

## Don'ts

- Don't let two neons compete in one frame. Don't put volt on a hold.
- Don't glow type. Don't fill shapes in the world (vector = strokes).
- Don't use glass as decoration: every glass element holds something real (a capture, a label, a
  number, his portrait) or selects something (F8).
- Don't make identical card grids; the D-day tiles and beads are sequences, not grids.
- Don't use glitch, chroma or scanlines on holds.
- Don't generate anything: no AI images, video, voice, music or copy about AI.
