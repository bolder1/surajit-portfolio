# Designer reel: v2 look, v3 story (52 s, 1560 f, 120 BPM)

The film the user asked for: **the "Access Granted" look (this Remotion project) telling the designer-reel story**
(who Surajit is as a product designer). Build scenes in `src/designer/scenes/D1..D12.tsx`; each exports
`Scene` (local frames 0..dur) and `cues` (SFX at local frames, same as the v2 scenes). Preview with
`./stills.sh D4 /tmp/D4 10 40 70` (composition ids D1..D12; `Designer` is the whole film).

## The v2 look (keep it, this is the brief)
Read `ANTI-SLOP.md`, `CLAUDE.md`, `src/lib/theme.ts`, `FX.tsx`, `Finish.tsx`, `ModuleShell.tsx` and two finished scenes
(`src/scenes/S3.tsx`, `src/scenes/scope/M7.tsx`). In short: near-black warm ground `#060504`, paper `#f3ecde` ink, ONE
vermilion `#ff3b1f` used as state/emphasis (≤ 10% of a frame; no glow on everything), Mona Sans variable (wdth/wght
animated) for display, Instrument Serif italic for his sentences, JetBrains Mono for small labels (≥ 16 px, ≥ 45% opacity),
Doto for count-ups. 2.39:1 letterbox (138 px bars) is CLOSED until frame 1380: design inside y 138–942. HUD corners, grain,
vignette come from `Finish` (do not draw them). Hard cuts; glitch only on the cut frames (added by ReelD, never inside
a scene). Camera shake only on 240 / 900 / 1380 (ReelD). No fades-for-fade's-sake: use masks, wipes, snaps.
Every frame has one focal thing. Real assets only; no AI, no stock art, no clip-art icons, no fake UI boxes with crossed
lines (draw content-like blocks: bars of varying width, price lines, avatars as circles).

## Hard content rules
- Only claims from `../videos/designer-reel/FACTS.md`. No AI, no Figma Make / Claude / Cursor, no em dashes anywhere on
  screen. Years: **4 YEARS** (the number v3 used). Phone number never.
- His own words verbatim: "The systems thinking came from here. The design fluency came later." · "I make complex software
  feel simple." · "Research-led. Decision-first." · "Make complex feel calm." · "Learned to ship on a deadline alongside
  developers." · "Felt the pull toward enterprise." · "Enterprise software for IT, identity & security teams."

## Sound: the bed is v3's (`public/music/designer-bed.wav`, F# minor, 120 BPM). Land your hits on its hit frames:
drop **240** (crash + sub boom, full band; void/silence 232–240) · section crashes at 360, 480, 600, 780(+light sub), 960,
1080, 1200, 1380 · synth stab 720 · **900** stat (stab + crash) · tom fill 750–776 · snare roll 930–956 · counter stabs
**1230, 1245, 1260, 1275** · tape-stop **1305–1320** (everything slows to a halt) · 1320 breakdown (pad + arp only) ·
breath 1377–1380 · final lift **1380** · final chord **1500** (band stops) · fade out to silence by 1560. Kicks every
15 f from 240 (not 765, 1185).
SFX: author `cues` in each scene. Available names: see `src/lib/cues.ts` (v2 set: click, key-0..5, snap, blip, blip-hi,
blip-up, swish, whoosh, impact, boom, shimmer, tape-stop, click-lo...) plus the retro set: `glass-tink`, `glass-tink-2`,
`arcade-blip`, `laser`, `gated-snare-hit`, `synth-stab`, `whoosh-retro`, `crt-on`, `crt-off`, `sine-calm`, `tape-rewind`,
`hum-80f`. One sound per kind of action, same action = same sound. At most 3 SFX starting on any frame. SFX sit well under
the bed's kick; use `vol` 0.25–0.6 for UI sounds, 0.7–1 only for the three big hits. Mono type-ons: `keySfx(i)` on every
2nd character. No reflex whoosh on every cut. Keep silence where the bed has it (232–240, 1377–1380).

## Frames (absolute film frames; `local = absolute − from`)
| id | from | dur | what |
|---|---|---|---|
| D1 Origin | 0 | 120 | A hairline vermilion trace routes across black like a circuit (45°/90° bends) and stops on pads; mono captions type: `2016 · ELECTRONICS & TELECOM`, then `2019 · B.TECH, INFORMATION TECHNOLOGY`. He trained as an engineer first. Opens from black (no crt trick needed; a cold open on the first line is fine). The trace keeps moving at 120 (match cut into D2). |
| D2 Thesis | 120 | 120 | His two lines land big (80 px+, Mona Sans / Instrument Serif italic): "The systems thinking came from here." (on 135) then "The design fluency came later." (on 180); the trace becomes a user-flow of 3 node outlines under them. 210–232 everything collapses into one point; 232–240 pure void, silence. |
| D3 Name | 240 | 120 | THE DROP at 240: SURAJIT / DUTTA slams (adapt `src/scenes/S3.tsx`: decrypt, width slam, light sweep), `PRODUCT DESIGNER · UX / UI · 4 YEARS`, his line "I make complex software feel simple." (on 330, must hold ≥ 1 s). His real portrait (`src/scenes/_S8/portrait.png` + `rim.png`, or `public/img/portrait-cut.png`) on the right with the vermilion rim light. |
| D4 Fortmindz | 360 | 120 | Marker `2022 · KOLKATA · UX/UI DESIGNER, FORTMINDZ` (types 372–392). A checkout flow lights step by step on beats 375, 390, 405, 420: CART → ADDRESS → PAY → DONE (stepper from `src/scenes/_M1/kit.tsx` or your own), over content-like website/app wireframes tagged `WEBSITES` `APPS`. His line "Learned to ship on a deadline alongside developers." on 436 and holds to 470. |
| D5 Impero IT | 480 | 120 | Marker `2023 · UX/UI DESIGNER, IMPERO IT`. Three phone outlines land on 480/495/510: `FOOD DELIVERY` `HEALTHCARE` `EVENTS`. On 540 their buttons, inputs and cards fly out and snap (staggered, ≤ 8 audible snaps) into one organised sheet tagged `COMPONENT LIBRARIES`. "Felt the pull toward enterprise." on 575, holds ≥ 20 f. |
| D6 miniOrange | 600 | 180 | Marker `2024 → NOW · PRODUCT DESIGNER, MINIORANGE · PUNE`. HIS REAL WORK ONLY (no concept renders, no drawn dashboards): hero = the real MODS design-system cover (`../videos/designer-reel/assets/img/f06-mods-cover.png`, light image: pull its exposure down, keep it inside a dark frame so the ground stays dark), fly-bys = `f06-uem-components.png` and `f06-uem-screens.png` (same folder). "Enterprise software for IT, identity & security teams." on 675. On 720 (synth stab) a single straight 2 px vermilion stroke crosses the frame and the spec line types: `ONE STROKE WEIGHT · TWO CORNER RADII · THREE SPACING SCALES` with tag `MODS DESIGN SYSTEM`. |
| D7 Proof | 780 | 180 | Adapt `src/scenes/S5.tsx` (calendar/odometer): `ACTIVE DIRECTORY PROTOTYPE`; 15 cells (3 weeks) fold to 5 days (cell ripple 795–825); "3 WEEKS → 5 DAYS" at 840; D1..D5 light on 855, 862.5, 870, 877.5, 885 with labels `INTERVIEWS + JTBD` · `5 FLOW VARIANTS IN 4 HOURS` · `HI-FI ON THE DESIGN SYSTEM` · `PROTOTYPE + DESIGN QA` · `WALKTHROUGH + HANDOFF`; the odometer lands **`~70% FASTER` exactly on 900** (use Mona Sans for `~` and `%`, Doto only if the glyphs read; the "~" must be visible). REMOVE every AI mention that S5 has. Hold 901–959 with purposeful motion (not static). |
| D8 What I do | 960 | 120 | Seven disciplines slam on the eighths from 960 (the first on 960): Product design · Interaction design · Design systems · UX research · Prototyping · Information architecture · Usability testing. Each readable at once (no overlaps), active one in paper with a vermilion marker, the rest dim. Toolbox line in mono: `FIGMA · FRAMER · NOTION · ILLUSTRATOR · PHOTOSHOP · LOTTIE`. |
| D9 How I work | 1080 | 120 | Five steps on a line, a pulse lights them one per beat from 1095: `DISCOVER & FRAME` · `RESEARCH & TEST` · `DEFINE THE SYSTEM` · `DESIGN & REFINE` · `DELIVER & SUPPORT`; then "Research-led. Decision-first." (1155+, holds). Compose the whole frame (labels ≥ 28 px). |
| D10 Numbers | 1200 | 120 | Four Doto count-ups land on 1230 / 1245 / 1260 / 1275: `4` YEARS DESIGNING · `58` PROJECTS · `12+` ENTERPRISE PRODUCTS SHIPPED · `3` COMPANIES, 2 CITIES. Nothing of a counter is visible before it starts. They end stacked and readable as one lockup. 1305–1320 the whole frame slows to a halt (the tape-stop). |
| D11 Principle | 1320 | 60 | The breakdown: a tangled line pulls itself straight; "Make complex feel calm." settles in (width axis relaxes 125 → 100); 1365–1377 the frame closes down to a dot; 1377–1380 a single dot in the void (silence). Quiet scene: no big hits. |
| D12 Invitation | 1380 | 180 | The letterbox opens (Finish) with the final lift on 1380. Adapt `src/scenes/S8.tsx` (portrait with rim light, SURAJIT DUTTA., contact typing): "Product designer", status `OPEN TO SENIOR ROLES & SELECT FREELANCE`, `surajit3255@gmail.com`, `surajit-dutta.vercel.app`; one signature underline that lands exactly on the final chord at 1500; hold; fade to black over 1530–1560 (Finish also fades). |

## Working rules for builders
Own only your scene files (`src/designer/scenes/D*.tsx`, helper folders `src/designer/scenes/_D<n>/`, assets under
`public/img/d/` or imported PNGs). Do NOT edit `src/lib/*`, `src/designer/{timeline,registry,ReelD}.ts*`, `Root.tsx`, other
scenes. Remotion rules: no CSS transitions/animations; everything from `useCurrentFrame()`; assets via `staticFile()` or
imports with the `png.d.ts` pattern. Machine: 4 CPUs, other builders run in parallel: run ONE Chrome command at a time
(`./stills.sh`, never a full render), and `npx tsc --noEmit -p .` before you finish. Budget: build all your scenes in one pass,
snapshot, fix once, snapshot, finish (don't polish forever; this is the "quick" version).
