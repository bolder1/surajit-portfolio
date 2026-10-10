# The illustration kit: core

Everything drawn in the v6 films (screens, components, tables, canvases) is built from this directory. ILLUSTRATION.md is the spec; this file is the API of the core files and the rules every other kit lane follows.

## Rules for every file in `src/v6/illus/`

- The kit never reads the frame and never takes a frame number. Every motion is a progress prop in 0..1 that the scene computes (`prog(f, a, b, EO)`); the kit draws.
- No random calls. Rhythm comes from `rand` through `greek.ts`, seeded by a prop or by `seedFrom(x, y)`. Nothing changes per frame on its own: a still at any two frames of a hold is pixel-identical.
- No hex, no token path, no word and no number inside any `.tsx` here. Colours come from `useIllus()` and `toneColor()`; system values from `artefact.ts`. `.tsx` files import only from `./theme`, `./artefact`, `./greek`, `./layouts` and sibling components (a `../../lib/...` import would fail the path lint).
- Strokes 1 px; radius 4 on controls, 8 on containers, 2 on bars; sizes multiples of 4; gaps 12 and 16 inside components, 16 and 24 between regions.
- No CSS transitions, no animations, no `filter: blur()`, no SVG filters. One `box-shadow` per `Slab`, nothing else casts one.
- Lints, run before any still: the four greps listed in ILLUSTRATION.md 6.1 and V1-DIRECTION.md 9.4 (hex or slash paths in a `.tsx`, the frame hook or random calls anywhere in this directory, em dashes, the banned names) all print nothing over `src/v6/illus/` including this file. `npx tsc --noEmit -p .` and `npx eslint src/v6` clean.
- `index.ts` belongs to the core lane; a component lane adds one `export * from "./<File>"` line per file it lands.

## theme.ts

- `IllusTheme`: `surface`, `panel`, `stroke`, `barHi`, `barLo`, `state`, `light { surface, stroke, barHi, barLo, panel? }`, `shadow: "elevation" | "hard" | "none"`, `shadowColor`, `border?`, `font`, `pool` (the key-light base colour).
- `THEME_V1`, `THEME_V2`, `THEME_V3`. `IllusProvider value={THEME_V1}` wraps a film once; `useIllus()` in every component.
- Mode is a number 0..1 (0 dark, 1 light) so a flip can tween; `"dark"` and `"light"` are accepted wherever a `Mode` is (`modeT()` converts). A `Slab` publishes its mode to everything inside it; `useIllusMode()` reads it. `toneColor(theme, t, tone)` gives the colour for `"surface" | "panel" | "stroke" | "hi" | "lo" | "state"` at mode `t`, tweened between the dark and light sets.
- Colour helpers: `parseColor`, `rgba`, `alpha(c, a)`, `mixColor(a, b, t)`.
- Light mode has no separate panel tone unless a theme sets `light.panel`; a panel in a light slab falls back to the light surface and is separated by its stroke.

## artefact.ts

The only home of the system's values. `NAME_MODE` ("real"), `TOKENS`, `tokenName(id)` (corrects the file's spelling), `MODES`, `BUTTON`, `BUTTON_ORANGE`, `BUTTON_LABEL` ("Button", read from node 995:4512), `ALERT`, `STATUS` (all five Subtle tints `verified: true`, read with the Figma variable tool and cross-checked by `sample_tints.py`), `STATUS_NAMES`, `STATUS_LABELS`, `requireStatus(name)` (throws in development on an unverified tint), `RULE`, `ELEVATION`, `REACH_LINE`, `SYSTEM_LABEL`, `ARTEFACT_FONT`.

## greek.ts

`GREEK` (bar height and pitch per scale: caption 6/16, body 8/20, title 12/28, value 18/36, display 24/48), `BAR_RADIUS`, `BAR_MIN`, `seedFrom(x, y)`, `greekWidths(seed, n, base)`, `greekLines(seed, n, base)`, `kvWidths(seed, w, keyW)`, `seriesFrom(seed, n)` (memoised; heights 0..1, 1 at the top), `donutFrom(seed)`, `stagger(p, i, n, each = 8, gap = 2)` (an item's eased progress from a group's linear progress; feed `Lines`, table rows, tree rows with linear `grow`).

## layouts.ts

`Rect`, `Region`, `Layout { id, w, h, mode, regions, recipe, order }`: `DASHBOARD` 1530 x 853, `EXPLORER` 1560 x 768, `BANKING_CONFIGURE`, `BANKING_PROCESS`, `BANKING_REPORT` 1900 x 866 (light). `recipe` carries each region's default contents (sidebar rows and groups, header actions, tile count, chart shares, table rows and columns, tree nodes, form fields, the card, the tabs). `tileRects(region, count, gap)` and `chartRects(region, lineShare, gap)` split a region. `CanvasLayout`: `CANVAS_AD` (36 seeded page rects, 3 px bars) and `CANVAS_LIBRARY` (two clusters of seeded 20 to 60 px rects, 220 total, to be drawn as one path per cluster). `LAYOUT_PAD` 24, `TILE_GAP` 16.

## Slab.tsx

`Slab({ x, y, w, h, radius = 8, elevation = "low" | "mid" | "high" | "flat" | number 0..2, shadow = 1, mode, tone = "surface" | "panel", opacity = 1, pool?: { cx, cy, r, a }, style, children })`. The shadow follows the theme: `elevation` as a `box-shadow` from `ELEVATION` (a number interpolates low to mid to high for a lifting plane; `shadow` fades it in for assembly), `hard` as a flat offset, `none` as the theme border only. The pool is a single radial clipped by an inner child, so `style={{ transformStyle: "preserve-3d" }}` on the slab itself is safe. Children are positioned in the slab's own px. `elevationAt(e)` is exported for anything that needs the interpolated row.

## Greek.tsx

`Bar({ x, y, w, h = 8, tone = "lo" | "hi" | "state", grow = 1, opacity })`: a rounded rect (radius 2) that extends with `grow` (scaleX, origin left). `Lines({ x, y, w, n = 3, scale = "body", seed, tone, grow, stagger = 2, titled })`: a paragraph from `greekLines`. `KV({ x, y, w, keyW = 0.32, seed, grow, scale, pitch = 32 })`: a `lo` key and a `hi` value. All read the nearest slab's mode.

## Glyph.tsx

`Glyph({ name, size = 16, color, x, y, draw = 1, rotate = 0, opacity })` with `name` one of `check-circle`, `x-circle`, `triangle`, `info-circle`, `circle`, `x`, `chevron`, `search`. SVG, 1 px, at most two strokes, drawn on with `draw`. `color` defaults to the theme stroke; status glyphs pass the tint's icon colour.

## sample_tints.py

`python3 -I src/v6/illus/sample_tints.py <alert-set export png>` prints the five Subtle tints sampled at fixed coordinates and checks them against `artefact.ts`. The export is a reference only and is never placed in a frame.
