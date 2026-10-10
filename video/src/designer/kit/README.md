# Designer kit API (written by the kit builders)

## 1. Illustration kit (doodles.tsx, Marquee.tsx, Collage.tsx)

The illustration kit is built and reviewed by rendering. `npx tsc --noEmit -p .` passes and the font grep from DESIGNER.md is clean in my four files. I ran five review rounds on rendered stills and fixed what each round showed. Nothing is committed.

**Files:** `src/designer/kit/doodles.tsx`, `Marquee.tsx`, `Collage.tsx`, `SpecimenDoodles.tsx`. `Marquee.tsx` sets a `data-period` attribute on the strip track so the loop can be checked; it is harmless.

**Specimen renders** (`KitDoodles`, frames 0, 30, 60, 89):
- `/tmp/claude-0/-home-user-surajit-portfolio/a6e9d308-29b5-5ce4-81c3-7899b08cb385/scratchpad/kit/KitDoodles/KitDoodles-sheet.jpg` (contact sheet)
- `.../kit/KitDoodles/KitDoodles-0.png`, `-30.png`, `-60.png`, `-89.png`

I also confirmed two things in throwaway scratch compositions, since deleted:
- **Marquee loop:** it wraps with 0 pixel difference (frame 0 against frame 1373, one period at speed 1).
- **Untangle:** it reaches a perfectly straight line at progress 1.

# API reference (all in `src/designer/kit/`)

**Conventions**
- `x,y` is the centre of the element in px. Pass `anchor` (`"c"` default, `"tl"`, `"tr"`, `"bl"`, `"br"`, `"t"`, `"b"`, `"l"`, `"r"`) to move that to a corner.
- The parent must be positioned, for example an `AbsoluteFill`.
- **BlockPhoto** defaults to `anchor="tl"`, so you give it grid coordinates.
- **Marquee** takes `x,y` as the strip centre.
- **Trace** draws in absolute frame px.
- Use `draw(f,a,b)` and `pop(f,at)` from `designer/motion` for `draw` and `pop`.

**doodles.tsx**

`DoodleProps` is the common set `{ x, y, size?, rotate?, color?, stroke?, draw?=1, pop?=1, shadow?, flip?, seed? }`. Stroke stays 5-8 px on screen at any size. `shadow` is a CSS colour for a hard down-right offset and is off by default. Change `seed` to make two copies of the same doodle look different.

| Export | Extra props and defaults | Purpose |
|---|---|---|
| `Sparkle` | `twin` (adds a small second sparkle), yellow, size 96 | 4-point star |
| `Star` | `solid`, yellow, rotate -8 | Chunky 5-point star |
| `Asterisk` | orange | Three crossing strokes |
| `Plus` | cream | Crooked plus |
| `CurlyArrow` | `kind: "curl" \| "loop" \| "swoop" \| "tick"`, orange, size 150 | Arrow with a 2-stroke head. It points up-right or right; use `rotate` or `flip` to aim it. |
| `Squiggle` | `length=220, amp=11, wave=38`, yellow | Wavy line |
| `ScribbleUnderline` | `w=420, thickness=18`, orange | Marker highlighter, two passes. `x,y` is the centre of the underline. |
| `ScribbleCircle` | `w=220, h=140`, yellow | About 1.2 laps with overshoot. `x,y` is the ellipse centre. |
| `Spiral` | `turns=2.6` | Spiral from the centre out |
| `Lightning` | `solid`, yellow | Chunky bolt |
| `Smiley` | `wink`, `ink`, yellow | Funky face: pill eyes, orange cheeks, wide smile |
| `Heart` | `solid`, orange | Lopsided heart |
| `Eye` | `iris`, `ink`, cream | Eye with lashes |
| `Crown` | `solid`, `ink`, yellow | Three-point crown |
| `RingBadge` | `items=["Product design","UX / UI","Systems"], speed=1.4` (deg per frame), `angle`, `bg`, `ink`, `centerBg`, `shadow`, `children` | Rotating text on a circle, drawn star separators. Children sit at the badge centre, so use `<Smiley x={0} y={0}/>` or a centred div. Keep total characters under about 36. |
| `Starburst` | `size=230, points=16, fill, color, fontSize, shadow`, `children` | Zig-zag sticker with centred text |
| `SpeechBubble` | `w=520, h=190, fill, color, fontSize=44, tail: "bl" \| "br", plain` (keeps sentence case instead of uppercase), `children` | Blob with a tail. `x,y` anchors the blob and the tail hangs below it. |
| `Untangle` | `size=260, length=720, progress=1, draw, seed=2` | Scribble ball that morphs the same polyline into a straight horizontal line. `x,y` is the centre of both ball and line. |
| `Tangle` | as `Untangle`, without `progress` and `length` | The scribble ball on its own |
| `Trace` | `points`, `progress` (required), `stroke=6, radius=16, pads` (vertex indices, default first and last), `padSize, popSpan=0.06, ghost, headDot`, colours | Circuit route that draws on; the pads pop as the head passes. |
| `traceHead(points, p, radius?)` | returns `{x, y, angle}` | Head position, for hanging a sparkle on the tip |
| `traceLength(points, radius?)` | returns px | Total route length |
| `Wobble` | `scale=3, freq=0.02, octaves=1, seed=3, boil=0` (frames per re-seed, 3-4 gives line boil) | One displacement filter on a full-frame wrapper |

Helpers also exported: `SepMark` (drawn dot, star, sparkle or asterisk), `smoothPath`, `easeOutBack`, `placeStyle`, `shadowLocal`, `traceGeometry`, and the types `Pt` and `Anchor`.

**Marquee.tsx**

`Marquee` props: `items`, `speed=6`, `angle=-4`, `height=96`, `bg=orange`, `color=void`, `fontSize=height*0.5`, `direction="left"|"right"`, `sep="star"|"dot"|"sparkle"|"asterisk"`, `sepColor`, `offset` (px phase), `shadow` (off by default), `x=960`, `y=540`, `frame` (overrides the clock), `length=2700`, and `cross`.
- `cross` is a second strip on top at another angle: `{items, angle?=5, bg?=cream, color?, direction?="right", ...}`.
- The loop is seamless and frame-driven. It measures one group of items once, after the font loads, using delayRender.

**Collage.tsx**
- `PHOTO = { clean, duo, rim }` are static paths to the house portraits.
- `BlockPhoto` props: `block: "orange" | "yellow" | "cream"` (or any CSS colour), `src`, `x,y,w,h`, and optional `zoom=1.22` (head pokes above the block), `focusX=0.5`, `offsetX`, `offsetY`, `overflowTop=true`, `radius=0`, `shadow`, `rotate`, `pop`. Children are overlaid in block coordinates, with (0,0) at the block's top-left.
- `TiltCard` props: `src, x, y, w, h, rotate=-4, shadow=void, radius=28, border, tape` (true gives yellow), `focus="top left"`, `children` in card coordinates.
- `Sticker` takes `children`, `rotate`, `bg=yellow`, `color`, `fontSize=30`, `shadow`, `plain`.
- `Pill` takes `label`, `icon`, `iconSide`, `bg`, `color`, `chip`, `height=76`, `fontSize`, `shadow`.
- `IconPlay`, `IconArrowUpRight` and `IconArrowRight` are drawn SVG icons to pass into `Pill`.
- Hard shadows keep a fixed screen direction when the element is rotated.

# Known limits
- Keep `Untangle` outside `Wobble`: the filter puts visible kinks in a line that is meant to be perfectly straight.
- `Wobble` also distorts text slightly. Keep it away from small labels, or wrap only the illustration layer.
- `Wobble` is a full-frame filter, so use at most one per scene.
- `Trace` is a full-frame SVG, so its coordinates are frame px and not relative to its parent.
- `RingBadge` spacing comes from `textLength`, which only adjusts letter spacing. Too many characters will crowd the ring.
- `BlockPhoto` aims at the 1500x1800 portraits. For another image, pass `imgW` and `imgH` and tune `focusX`.
- The portraits are never cropped or masked, as the rules require.
- I did not time a full render. The `Wobble` filter is the only expensive part.

# Tips for scene builders
- **Timing:** `draw={draw(f, a, b)}` for strokes, `pop={pop(f, at)}` for stickers. The pop spring can overshoot above 1 and that is intended. Pair a sticker pop with the `snap` SFX.
- **Meaning, not decoration:** use one `CurlyArrow` that points at the thing, one `ScribbleCircle` round the number, one `ScribbleUnderline` under the key words. A sparkle works as a "landed" mark on a pad; sparkles sprinkled everywhere read as AI slop.
- **Colour:** shadows read on dark ground only in a lighter or hotter colour, so pass `shadow={P.orange}` or `P.orangeDeep`. On an orange block use `P.void`.
- **Seeds:** vary `seed` when a scene repeats a doodle, or the copies come out identical.
- **Untangle timing:** the thread pulls from the left end first, so ease `progress` yourself. With the hard in-out ease `EIO` most of the motion happens in a narrow band; linear reads more like pulling a thread.
- **Trace, D1 to D2:** `traceHead(points, p)` gives the tip for a landing sparkle. Pads pop over the last 6% of progress before each pad. The last pad is capped so it still pops at `progress=1`.
- **Marquee clipping:** it bleeds past the frame at its angle. To confine it, wrap it in an `overflow:hidden` box and use `x,y` relative to that box, as the specimen does.
- **Layout without flex:** `Sticker`, `Pill` and the bubble text use absolute positioning and `max-content` instead of flex, to keep the `display\b` grep clean.

---

## 2. Icons + UI kit (icons.tsx, ui.tsx)

The kit is built: all three files are done, `npx tsc --noEmit -p .` passes, the font grep is clean, and eslint reports nothing. I did four review rounds on rendered stills and fixed layout, overflow, link/sliders icon and entrance-stagger problems along the way. Nothing is committed.

Files are in `/home/user/surajit-portfolio/video/src/designer/kit/`: `icons.tsx`, `ui.tsx` (re-exports `Icon`, `ICON_NAMES`, `IconName`), and `SpecimenUI.tsx` (export `SpecimenUI`, composition `KitUI`).

## Style (one system)
- **Stroke:** 3 px, cream on dark fills, void (`P.void`) on bright fills.
- **Radii:** 12 or 28 only. Pills clamp to height/2.
- **Spacing and type:** 8 px grid; Bricolage labels are 20 px or larger.
- **Shadow:** a flat offset shape, 4–12 px, `P.orangeDeep` on dark surfaces and `P.orange` on yellow/cream ones.
- **Common props:** every component takes optional `x`, `y` (absolute placement, px) and `style` (extra CSS such as transform or opacity). Animated values are `boolean | 0..1`.

## icons.tsx
- **`Icon({ name, size=32, color=P.paper, stroke?, fill?, draw=1, style? })`** draws one chunky round-cap line icon from a 24 px grid.
  - `stroke` is in screen px. The default is about size×0.085, minimum 2.5, maximum 8.
  - `fill` colours the closed main shapes.
  - `draw` (0..1) draws the glyph on. During `draw<1` the stroke is expressed in grid units, because non-scaling-stroke breaks `pathLength` dashes. The width looks identical.
- **`ICON_NAMES`, `IconName`, `iconStroke(size)`.** 47 icons:
  - cart, bag, pin, card, check, search, menu, heart, star, home, user, users, bell
  - calendar, clock, plus, minus, x, arrow, chevron, chevdown, layers, grid, list
  - sliders, chart, pulse, cross, fork, ticket, tag, phone, mail, globe, eye
  - box, pencil, message, bolt, image, play, link, toggle
  - extras: send, bookmark, download, trending

## ui.tsx
**Helpers**
- `UI` is the system constants.
- `Place` is the shared `{x, y, style}` props type.
- `flex(dir, extra)` is a flex-style helper.
- `Pop({at, rot, origin, children})` is a spring pop-in wrapper.

**Controls and atoms**
- `IconTile({name, size=48, tone})` is an icon in a 12 px-radius square.
- `Btn({label, icon?, iconRight?, variant="primary|secondary|yellow|cream|dark", size="m|s", w?, pressed=0..1})` is a 56 px (`m`) or 48 px (`s`) tall pill. `pressed` slides it into its shadow.
- `Field({label?, value, placeholder?, focused, typed=0..1, caret?, icon?, w=268})` has a caret that blinks every 8 frames and an orange focus state.
- `Toggle({on, w=72})`.
- `Checkbox({checked, label?})`: the tick draws on.
- `Chip({label, icon?, active, tone="orange|yellow|cream", w?})`.
- `Seg({items, index, w=300})`: `index` can be fractional, so the thumb slides.
- `Tabs({items, index, w=300})`: the underline slides.
- `Badge({label, icon?, tone})`.
- `Avatar({initials, tone, size=56, face?: 0|1|2})`: initials, or a drawn face when `face` is set.
- `SearchBar({value, placeholder, focused, typed, action="sliders"|null, w=268})`.
- `Row({icon, title, sub?, right="chevron"|string|node, tone, w=268})`, 76 px tall.
- `Card({w?, h?, tone="dark|orange|yellow|cream", shadow?, pad=16, r=28, children})`.
- `Stat({value, label, delta?, tone, w=240, h=168})`.
- `Progress({value, label?, w=268})`.
- `Stepper({steps, index, w=480})`: `index` is fractional; done steps show a tick and the active step pops.
- `Toast({title, sub?, icon="check", tone="dark|orange|yellow", w=360})`.

**Frames, calendar and screen cards**
- `Window({w=720, h=480, url, shadow, children})`. `WINDOW_HEADER=60`; `windowInner(w,h)` gives the content size.
- `Phone({w=300, h=620, status=true, nav: number|false, navIcons, pad=16, shadow, children})`.
  - `w` and `h` are the screen size. The outer box is 32 px larger each way, and `x`/`y` place the outer box (`phoneOuter()`).
  - `status` adds a status bar and home bar, so children get a 44 px top and 30 px bottom safe area (`nav` raises the bottom one).
  - `pad` is the content's horizontal padding, so full-width content is 268 px.
  - `nav` is a bottom tab bar, with `nav={i}` as the active tab.
- `CalendarCell({day?, caption?, size=64 | w,h, tone, on, mark=0..1, dim, bare})`.
  - `on` fills the cell with `tone`; `mark` draws a tick; `dim` fades it.
  - `caption` shows only when the cell is at least 96 px wide.
  - Cells 80 px or larger use the big layout (number top-left, caption bottom-left, tick top-right).
- `Calendar({month, year, startDay (0=Mon), days, marks:{day: tone}, today, w=360})`.
- Screen cards, default width 268: `ProductCard`, `FoodCard`, `AppointmentCard({slot})`, `TicketCard`.
  - All take `{w, shadow, pressed}`; `shadow` takes a colour or `false`.
  - Fixed heights are in `CARD_H` = `{product:368, food:320, appointment:336, ticket:400}`, at any width. The ticket is drawn 8 px larger because of its shadow.
- `Barcode({w, h, seed, color})` is a ragged barcode for stubs.

## Specimen renders
Four pages that take over from each other: icons from frame 0, controls from 24, Window/Calendar/Stepper/Toast from 48, four Phones from 70. Each page starts already mid-entrance. In the 0/30/60/89 stills frame 0 shows icons popping in and frame 30 shows controls entering. Frame 60 shows Window, Calendar and Stepper, and 89 shows the Phones.

- Final stills 0/30/60/89 and contact sheet: `/tmp/claude-0/-home-user-surajit-portfolio/a6e9d308-29b5-5ce4-81c3-7899b08cb385/scratchpad/kit/KitUI/final/` (contact sheet is `KitUI-sheet.jpg`)
- Fully settled pages (frames 23, 47, 69, 89): `.../kit/KitUI/r4/KitUI-{23,47,69,89}.png`
- Earlier review rounds: `.../kit/KitUI/r1`, `r2`, `r3` (same folder)

## Known limits
- Orange hard shadows are everywhere by default. In a scene with several cards or phones, pass `shadow={false}` or another colour to stay under about 30% orange.
- The face avatars are tiny charm illustrations, not portraits.
- Icon `draw` shows disjoint pieces mid-draw for multi-path glyphs, because each part draws in parallel.
- The status-bar time is fixed at `9:41`.
- The `Phone` frame (28 outer radius, 12 screen radius) and `Window` are not scaled by the kit; scale them from the parent with `transform`.

## Tips for scene builders
- Wrap anything that should land in `Pop at={frame}`. It is hidden before `at`, so nothing shows early.
- Animate props rather than remounting: `Btn pressed`, `Toggle on`, `Seg index`, `Stepper index`, `Field typed`, `Progress value` and `CalendarCell on/mark/dim` all take frame-driven numbers.
- For the D7 15-cell grid, use `CalendarCell` with `w`/`h` of about 150×160 (a grid cell) and a `caption` such as `MON`.
- For the D4 browser scene, `Window` content is sized by `windowInner(w,h)`. A `ProductCard` at `w=256` fits three per row in an 840 px window.
- The compositions compose into a `Phone` with `nav={i}`; the content area is then 268 px wide and 496 px tall.
- Text never wraps (`nowrap`), so size containers to fit. Labels are 20 px or larger throughout.
- Import `Icon` from `../kit/ui` or `../kit/icons`, interchangeably.
