# Designer reel: "funky dark" look, designer story (52 s, 1560 f, 120 BPM)

Surajit Dutta's portfolio film: his story as a PRODUCT DESIGNER (not security), in a dark, orange, funky, modern look.
Build scenes in `src/designer/scenes/D1..D12.tsx`; each exports `Scene` (local frames 0..dur) and `cues` (SFX at local
frames). Preview a scene: `./stills.sh D4 <outdir> 10 40 70` (compositions D1..D12; `Designer` is the whole film;
`KitDoodles` / `KitUI` are the kit specimen sheets).

## The vibe (the user's own references: match this energy, don't copy)
He sent four references and said: "dark theme with orange, funky good illustrations, modern design and good layout, but no AI slop,
use things in a better way."
1. A bold "Podcast Experience" web page: huge chunky extra-bold sans headlines, cut-out photos on flat saturated colour blocks,
   a B&W portrait with one bright round sticker on the ear, slanted ticker strips (`BUSINESS ● TECHNOLOGY ● HEALTH CARE ● SELF GROW`)
   crossing the frame, black rounded cards, pill buttons with a play icon, a circular rotating-text badge, rounded photo tiles.
2. A dark animator portfolio: near-black ground, hand-drawn brush headline with a lime highlighter underline, doodles everywhere
   (stars, crowns, lightning bolts, curly arrows, squiggles, a smiley, a speech bubble sticker "LET'S CREATE SOMETHING AWESOME!"),
   rounded dark cards with bright pill buttons, an illustrated character, skill icons in a row, an "ABOUT ME" card.
3. A teal portfolio deck: a big illustrated hero, a display typeface with a stencil/line feel, collage grids of work, a numbered
   contents row "01 02 03 04 05", tilted mock-ups with soft shadows.
4. An orange-red branding poster: a portrait cut-out over a visible hairline GRID (12 columns), tiny meta labels sitting inside the
   grid cells (top row, middle, bottom row), a few solid orange squares filling grid cells, big clean headline over the shoulder,
   a small pill with an arrow, and a one-line kicker ("Not what looks cool - What actually lasts.").
What we take: **dark near-black ground, ONE hero orange, flat colour blocks and hard shapes (no glow, no gradients), a visible modern
grid with meta labels, chunky bold sans type, hand-drawn doodle illustrations and stickers, ticker strips, cut-out photo on a colour
block, rounded cards and pills, strong layout.** Funky but organised: loud surface on a strict system (his own thesis: "Systems then surfaces").

## Hard rules
1. **Fonts: ONE family, sans-serif only: Bricolage Grotesque** (`src/designer/type.ts`: `head()`, `sans()`, `label()`, `body()`,
   `numeral()`; variable opsz 12-96, wdth 75-100, wght 200-800). No serif, no mono, no Doto, no Mona Sans, no Inter Tight, no
   second family. `grep -rnE "serif|mono|dots|Doto|JetBrains|Inter Tight|Mona|display\b" src/designer` must find nothing in your files
   (the `family`/helpers from `../type` and `../tokens` only). Glyphs the font lacks (● ↗ ✦ ★) are drawn as SVG, never fallback fonts.
2. **Palette (flat, from `src/designer/tokens.ts` `P`)**: void #0C0A08 ground, cards #1B1612/#241D17, cream paper #F6EEE0 ink,
   **hero ORANGE #FF6A1A**, butter yellow #FFC93D as the only second colour, orange-deep #E4510A for shadows/pressed. NO purple, NO blue,
   NO neon, NO gradients, NO glows/blurs for "atmosphere", NO glassmorphism. Depth = hard offset shadows (a darker flat shape offset
   6-10 px), overlapping flat shapes, grain (global). Orange covers at most ~30% of a frame (big blocks are fine on hit frames).
3. **Layout: everything snaps to the visible 12 x 6 grid** (`G` in tokens.ts: margin 60, cell 150 x 160; `G.x(c)`, `G.y(r)`). The grid
   hairlines and the small meta labels (top row: name / scene label / "Portfolio 2026"; bottom row: "Product designer" / `n / 12`) are drawn
   ABOVE your scene by `FinishFunk`: keep the top ~45 px of row 0 and the bottom ~45 px of row 5 free of small text; big shapes and photos
   may bleed under the labels. Compose with clear hierarchy: one hero element (huge), one supporting group, small labels. Align edges to
   grid lines; use whole cells for blocks; optical balance; never leave a lone small object floating in a big empty area.
4. **Illustration: hand-drawn, built in code, never AI, never stock, never emoji, never clip-art.** Use the kit (`src/designer/kit/`:
   `doodles` = stars, sparkles, curly arrows, squiggles, scribble underline/circle, spiral, lightning, smiley, speech-bubble and starburst
   stickers, hand-drawn tangle; `Marquee` ticker strips; `Collage` photo-on-block; `ui` = icons + components). Doodles are chunky
   (5-8 px strokes), round caps, slightly imperfect, drawn on with `strokeDashoffset` (use `draw()`), popped with springs (`pop()`).
   Each scene needs 2-4 doodle/sticker moments that SAY something (an arrow that points at the thing, a circle around the number),
   not decoration sprinkled everywhere.
5. **UI you draw (phones, browser windows, components, icons) must look designed**: the kit's components only (one icon family on a
   24 px grid, one component family: radii 12/28, stroke 3, 8 px spacing grid, real labels, hard shadow). Never X-box placeholders,
   never ad-hoc icons.
6. **Photo**: use only `public/img/d/portrait-clean.png` (natural colour cut-out), `portrait-duo.png` (cream B&W grade), `portrait-rim.png`
   (rim-light layer); same size 1500x1800 RGBA. The original photo had a motion-ghost that is retouched out: do NOT use any other
   portrait file (`_S2`, `_S8`, `public/v5/portrait.png`, `public/img/portrait-cut.png`) and do not crop/mask the face yourself.
   Orange-block + B&W duotone cut-out is the house treatment (see reference 1); natural colour only if it looks right on the block.
7. **Content**: only claims from `../videos/designer-reel/FACTS.md`. No AI mentions (no Figma Make, Claude, Cursor), no em dashes
   on screen, years = **4 YEARS**, no phone number. His own words verbatim: "The systems thinking came from here. The design fluency came
   later." · "I make complex software feel simple." · "Research-led. Decision-first." · "Make complex feel calm." · "Learned to ship on a
   deadline alongside developers." · "Felt the pull toward enterprise." · "Enterprise software for IT, identity & security teams." ·
   "Let's build something that lasts."
8. **Motion**: energetic and playful but controlled: pops with overshoot for stickers, hard slams for headlines (expo out), wipes/masks for
   text, draw-on for doodles, marquee strips sliding at constant speed, cells of the grid filling orange on hits. Hard cuts between scenes
   (ReelD adds a 4-frame glitch only where `timeline.ts` says so). No fades for the sake of it. No CSS transitions/animations: all from
   `useCurrentFrame()`. Camera shake is added by ReelD on 240 / 900 / 1380 only.

## Sound: the bed is v3's (`public/music/designer-bed.wav`, F# minor, 120 BPM, kicks every 15 f from 240). Land your hits on its frames:
drop **240** (crash + sub; void/silence 232-240) · section crashes 360, 480, 600, 780 (+light sub), 960, 1080, 1200, 1380 · synth stab 720 ·
**900** stat (stab + crash) · tom fill 750-776 · snare roll 930-956 · counter stabs **1230, 1245, 1260, 1275** · tape-stop **1305-1320**
(everything slows to a halt) · 1320 breakdown (pad + arp only) · breath 1377-1380 · final lift **1380** · final chord **1500** (band stops) ·
silent by 1560. SFX: author `cues` per scene; names in `src/lib/cues.ts` (v2 set: snap, click, click-lo, blip, blip-hi, blip-up, swish,
whoosh, key-0..5 (use `keySfx(i)`), impact, boom, shimmer, tape-stop...) plus `glass-tink`, `glass-tink-2` (use as bright "pings" for
stickers landing), `arcade-blip`, `laser`, `gated-snare-hit`, `synth-stab`, `whoosh-retro`, `crt-on`, `crt-off`, `sine-calm`,
`tape-rewind`, `hum-80f`. One sound per kind of action; at most 3 SFX start on a frame; UI sounds vol 0.25-0.6, the three big hits 0.7-1.
Sticker pop = `snap` (+ `glass-tink` for a hero sticker), doodle draw = soft `swish`, marquee start = `whoosh-retro` once, counters = `arcade-blip`
thinned. Keep silence where the bed has it (232-240, 1377-1380).

## Frames (absolute film frames; `local = absolute - from`). Layout hints are starting points, not orders.
| id | from | dur | content and layout |
|---|---|---|---|
| D1 Origin | 0 | 120 | Black + the grid drawing itself. A chunky orange hand-drawn circuit trace (6 px, 45/90 bends) routes across the cells and lands on pads at grid intersections (orange dot + cream ring, sparkle doodle on landing). Two big year stamps: `2016` (head ~260 px, cream) with label `ELECTRONICS & TELECOM`, then `2019` with `B.TECH, INFORMATION TECHNOLOGY`. He trained as an engineer first. A small doodle (spark / resistor squiggle) near the pads. The trace keeps travelling at 120 (match cut into D2). |
| D2 Thesis | 120 | 120 | His two lines huge (head 110-130 px), cell-aligned: "The systems thinking came from here." (on 135; the words `systems thinking` get an orange scribble underline drawn on) then "The design fluency came later." (on 180, set black on an orange block, `later.` gets a curly arrow doodle). The trace from D1 becomes a three-node flow under them. 210-232 everything collapses into one orange cell that shrinks to a point; 232-240 pure void, silence. |
| D3 Name | 240 | 120 | THE DROP at 240. An orange block slams in (cols 7-12, full height) carrying his B&W cut-out portrait with a doodle halo (scribble circle, sparkles, one round sticker like the ear dot in reference 1). `SURAJIT` / `DUTTA` slam in huge (head 230-260 px, cream, cols 0-7), pill `PRODUCT DESIGNER · UX / UI · 4 YEARS`, a ticker strip across the bottom (`PRODUCT DESIGN ● UX ● UI ● DESIGN SYSTEMS ● RESEARCH ● PROTOTYPING`). On 330 his line "I make complex software feel simple." in a speech-bubble sticker (hold >= 1 s). The flash/slam is visible ON frame 240. |
| D4 Fortmindz | 360 | 120 | Big `2022` + `FORTMINDZ` + label `KOLKATA · UX/UI DESIGNER` on the left (cols 0-5). Right (cols 6-11): a drawn browser window (kit) with an e-commerce page (product card, price, "Add to cart"); a checkout stepper as sticker chips `CART` `ADDRESS` `PAY` `DONE` lighting orange one per beat on 375/390/405/420 with doodle arrows between; stickers `WEBSITES` `APPS`. His line "Learned to ship on a deadline alongside developers." from 436, held to 470. |
| D5 Impero IT | 480 | 120 | Big `2023` + `IMPERO IT` + label `UX/UI DESIGNER`. Three phones (kit Phone) land on 480/495/510: `FOOD DELIVERY` (food card, pin, order button), `HEALTHCARE` (appointment card, pulse icon), `EVENTS` (ticket, calendar). On 540 their components fly out and snap (staggered, <= 8 audible) into one tidy board tagged `COMPONENT LIBRARIES`. "Felt the pull toward enterprise." as a sticker on 575, hold >= 20 f. |
| D6 miniOrange | 600 | 180 | Big `2024 → NOW` (draw the arrow as SVG), `MINIORANGE · PUNE`, `PRODUCT DESIGNER`. HIS REAL WORK ONLY: the real MODS design-system cover (`../videos/designer-reel/assets/img/f06-mods-cover.png`, light image: place it as a tilted card with a hard shadow on an orange block so the frame stays dark) and the two real UEM Figma crops (`f06-uem-components.png`, `f06-uem-screens.png`, same folder) as tilted collage cards (like reference 3). "Enterprise software for IT, identity & security teams." on 675. On 720 (synth stab) a straight orange line draws across the frame and three stickers land: `ONE STROKE WEIGHT` `TWO CORNER RADII` `THREE SPACING SCALES` with tag `MODS DESIGN SYSTEM`. |
| D7 Proof | 780 | 180 | `ACTIVE DIRECTORY PROTOTYPE`. 15 hand-drawn calendar cells (3 weeks) fold to 5 (ripple 795-825). "3 WEEKS → 5 DAYS" huge on 840 with a drawn arrow. `D1`..`D5` chips light orange on 855, 862.5, 870, 877.5, 885 with labels `INTERVIEWS + JTBD` · `5 FLOW VARIANTS IN 4 HOURS` · `HI-FI ON THE DESIGN SYSTEM` · `PROTOTYPE + DESIGN QA` · `WALKTHROUGH + HANDOFF`. The stat `~70% FASTER` lands EXACTLY on 900: giant numerals (>= 300 px) in an orange block, starburst sticker `FASTER`, a circle scribble round the number; the "~" and "%" clearly visible. Hold 901-959 with motion. |
| D8 What I do | 960 | 120 | Seven disciplines as huge stacked words on the eighths from 960 (first word already slamming ON 960): Product design · Interaction design · Design systems · UX research · Prototyping · Information architecture · Usability testing. Active word cream on an orange highlight block, others dim; a small doodle sticker at the end of each active word; a big counter `01-07` on the right. Bottom ticker strip: `FIGMA ● FRAMER ● NOTION ● ILLUSTRATOR ● PHOTOSHOP ● LOTTIE`. |
| D9 How I work | 1080 | 120 | A hand-drawn winding path across the grid with five big numbered stops (circles on grid intersections); an orange pulse dot travels one stop per beat from 1095: `DISCOVER & FRAME` · `RESEARCH & TEST` · `DEFINE THE SYSTEM` · `DESIGN & REFINE` · `DELIVER & SUPPORT`; "Research-led. Decision-first." (1155+, big, holds). Labels >= 28 px. |
| D10 Numbers | 1200 | 120 | Four colour blocks on the grid (orange, yellow, cream, card), each with a giant rolling numeral landing on 1230 / 1245 / 1260 / 1275: `4` YEARS DESIGNING · `58` PROJECTS · `12+` ENTERPRISE PRODUCTS SHIPPED · `3` COMPANIES, 2 CITIES. Nothing of a block visible before its count starts. A doodle sticker on one. 1305-1320 everything eases to a halt (tape-stop), hard cut at 1320. |
| D11 Principle | 1320 | 60 | Breakdown. A hand-drawn orange tangle (scribble) pulls itself into one straight line; "Make complex feel calm." in big type settles in (width axis relaxes); 1365-1377 everything shrinks into one dot; 1377-1380 a single dot on black. Quiet: no big hits. |
| D12 Invitation | 1380 | 180 | The final lift on 1380: an orange block with his cut-out portrait (cols 0-5), `SURAJIT DUTTA.` huge on the right, `PRODUCT DESIGNER`, pill `OPEN TO SENIOR ROLES & SELECT FREELANCE`, contact rows with icons: `surajit3255@gmail.com`, `surajit-dutta.vercel.app`; his line "Let's build something that lasts."; a hand-drawn underline/scribble that lands EXACTLY on the final chord at 1500; fade to black 1530-1560 (FinishFunk also fades). |

## Builder rules
Own only your files (`src/designer/scenes/D<n>.tsx`, helpers in `src/designer/scenes/_D<n>/`, assets under `public/img/d/` or imported PNGs).
Never edit `src/lib/*`, `src/designer/{timeline,registry,ReelD,tokens,type,motion,FinishFunk}`, `src/designer/kit/*`, `Root.tsx` or other scenes.
Remotion: no CSS transitions/animations; frame-driven only; assets via `staticFile()` or imports (see `src/scenes/_S8/png.d.ts` pattern).
Machine: 4 CPUs, other builders run in parallel: ONE Chrome command at a time (`./stills.sh`, never a full render), `npx tsc --noEmit -p .`
before you finish. Quick version: build in one pass, snapshot, fix once, snapshot, finish.
