---
format: 1920x1080
duration: 52s
fps: 30
message: "Surajit Dutta is a product designer who turns complex systems into calm, usable software, and ships it fast."
arc: Origin → Thesis → Name (drop) → Journey (3 stops) → Proof → Craft → Process → Numbers → Principle (breakdown) → Invitation
audience: hiring managers, design leads and founders on his portfolio
mode: collaborative
tempo: 120 BPM (1 beat = 15 f, 1 bar = 60 f at 30 fps), F# minor, bed = assets/audio/bed.wav
design: frame.md ("Phosphor & Glass")
through_line: one magenta phosphor beam (circuit trace → user flow → design-system stroke → signature)
style_frame: compositions/00-styleframe.html (review/styleframe-0{1,2,3}-*.png, review/styleframe.mp4)
---

# The Line, in phosphor and glass

One magenta beam, drawn like a 1982 vector CRT, routes Surajit's path from a circuit board to calm
enterprise software. Every piece of his real work it reaches sits under Apple-style liquid glass that
bends the beam as it passes. Visual rules, tokens and recipes live in `frame.md`; sounds follow the
action→sound table in `SOUND.md`; every cut lands on the bed's hit map (`assets/audio/README.md`).

**No AI in the film.** No generated media, and no AI talk on screen. Every string below comes from
`FACTS.md`; his own lines are quoted exactly.

| #   | Frame                  | Frames    | Dur | Focal accent    | Transition in              |
| --- | ---------------------- | --------- | --- | --------------- | -------------------------- |
| 1   | Origin                 | 0–120     | 4 s | beam            | CRT power-on from black    |
| 2   | Thesis                 | 120–240   | 4 s | beam            | match (trace continues)    |
| 3   | Name                   | 240–360   | 4 s | beam            | DROP after 232–240 void    |
| 4   | Fortmindz, 2022        | 360–480   | 4 s | beam            | whip along the beam        |
| 5   | Impero IT, 2023        | 480–600   | 4 s | cyan            | continue along the beam    |
| 6   | miniOrange, 2024 → now | 600–780   | 6 s | cyan            | dolly into the floor       |
| 7   | Five days              | 780–960   | 6 s | volt            | hard cut + chroma (4 f)    |
| 8   | What I do              | 960–1080  | 4 s | beam            | hard cut                   |
| 9   | How I work             | 1080–1200 | 4 s | cyan            | continue upward            |
| 10  | Numbers                | 1200–1320 | 4 s | volt            | hard cut + chroma (3 f)    |
| 11  | Make complex feel calm | 1320–1380 | 2 s | beam-core / ink | hard cut (breakdown)       |
| 12  | Invitation             | 1380–1560 | 6 s | beam            | CRT off → CRT on           |

Frame numbers below are absolute (film) frames; builders subtract the frame's start for local time.

## Frame 1 — Where the line starts

- scene: A tube powers on; a single beam routes a circuit trace across a scope graticule and solders two years into place.
- duration: 4s
- frames: 0–120
- poster: 3.2s
- transition_in: CRT power-on from black (0–12)
- status: outline
- src: compositions/01-origin.html
- shape: rules svg-path-draw + discrete-text-sequence + ambient-glow-bloom
- accent: beam
- glass: two Tier B chips (the year captions)
- retro: whole-frame CRT power-on, flat graticule (10×8 × 192 px), pads, phosphor persistence
- copy: `2016 · ELECTRONICS & TELECOM` · `2019 · B.TECH, INFORMATION TECHNOLOGY`
- sfx: 0 `crt-on` · 30 `laser` + soft hum under the draw (fades by 110) · 45, 60, 75, 90 `blip` pitched up per pad · captions type with `key-0..5` on every 2nd character (rotate variants) · 48 and 93 `glass-tink`, `glass-tink-2` as each chip lands

0–12: the frame powers on like a tube (a beam-core line opens to the full frame). 12–30: the graticule
draws on in grid (35%) with its ticked centre axes; this is the bench scope from his diploma years.
30: a beam-core dot appears at the left edge and starts routing a PCB trace with 45° and 90° bends
(pen, constant speed). Pads pop at the bends on beats 45, 60, 75, 90. On the 45 pad a Tier B chip
condenses over the trace and types `2016 · ELECTRONICS & TELECOM`; the trace visibly kinks where it
passes under the chip. On the 90 pad the second chip types `2019 · B.TECH, INFORMATION TECHNOLOGY`.
The point is simple: he trained as an engineer first. 100–120: the head keeps running toward the
right third without stopping; its last position is Frame 2's first.

## Frame 2 — The thesis

- scene: The trace bends into a user-flow diagram while his own two lines land, then everything pinches to a dot before the drop.
- duration: 4s
- frames: 120–240
- poster: 3.0s
- transition_in: match (the trace continues; the graticule dissolves to the node layout over 8 f)
- status: outline
- src: compositions/02-thesis.html
- shape: rules svg-path-draw + card-morph-anchor + kinetic-beat-slam
- accent: beam
- glass: three Tier B node tiles (r 22) on the flow
- retro: phosphor persistence, pinch-to-dot (220–232)
- copy: "The systems thinking came from here." · "The design fluency came later." (his words)
- sfx: 120 nothing extra (the bed's filtered kick enters) · 128, 143, 158 `glass-tink`, `glass-tink-2`, `glass-tink` as the three tiles condense · 135 and 180 the statements land on the bed's snares (no extra SFX) · 212 low-passed `swish` as the flow folds in · 232–240 silence (the bed's gap)

120: the pads from Frame 1 become screen nodes. Three Tier B tiles condense on the pads (one per
beat) and the beam reroutes between them as flow connectors. The tiles hold simple vector wireframes
(outlines only, no fake text). 135: "The systems thinking came from here." wipes on at statement size
(64 px) above the flow. 180: "The design fluency came later." wipes on below it; the beam's head
starts its final segment. 210–220: the snare/tom fill builds; tiles melt (refraction → 0). 220–232:
the whole frame pinches to a single beam-core dot (scale to the dot, power3.in). 232–240: void,
grain only. The drop lands on the next frame.

## Frame 3 — Name

- scene: The drop: the vector floor rushes in, SURAJIT DUTTA slams on the downbeat and the beam routes his silhouette behind a liquid-glass portrait slab.
- duration: 4s
- frames: 240–360
- poster: 3.6s
- transition_in: drop (2 f beam-core flash @ 35%, floor scroll ×4 for 15 f)
- status: outline
- src: compositions/03-name.html
- shape: blueprint kinetic-type-beats + rules kinetic-beat-slam + svg-path-draw
- accent: beam
- glass: Tier H portrait slab (480 × 880, r 76), right third
- retro: floor rush, CRT power-on of the portrait, dither resolve, one sheen across the name
- assets: assets/img/portrait-duo.png + assets/img/portrait-dither.png (baked, see frame.md)
- copy: `PRODUCT DESIGNER · UX / UI` · SURAJIT / DUTTA · "I make complex software feel simple." (his line)
- sfx: 240 `gated-snare-hit` + `boom` (the bed's crash and sub are here too; keep SFX tight) · 247 nothing (the second line rides the hit) · 255 `glass-tink` as the slab condenses · 270–290 `key-0..5` on every 2nd character for the label · 300 `laser` as the beam fires through the glass · 330 the statement lands on the bed's backbeat (no SFX)

This frame is the style frame at full energy. 240: hard open on the drop, the floor already rushing
toward camera. SURAJIT slams at 240 and DUTTA on the eighth (247), each rising out of its mask while
the width axis opens 75→125. 255: the Tier H slab condenses on the right; the portrait powers on
inside it as a four-ink dither and resolves to the duotone with 35% dither left as print texture
(270–285). 270: the mono label types above the name. 285–300: the beam runs in from the left under
the name, stops on a pad, then fires (300) and routes his head-and-shoulders silhouette with 45°
bends behind the slab, so the rim bends it and fringes it. A single sheen crosses the name as the
beam fires. 330: "I make complex software feel simple." wipes on bottom left. 330–360: hold.

## Frame 4 — Stop 1: Fortmindz, 2022

- scene: The beam threads a checkout flow through four glass chips while website wireframes slide past.
- duration: 4s
- frames: 360–480
- poster: 3.3s
- transition_in: whip along the beam (out 6 f power3.in, in 9 f expo.out, 24 px blur peak)
- status: outline
- src: compositions/04-fortmindz.html
- shape: blueprint spatial-pan-stations + rules svg-path-draw + spring-pop-entrance
- accent: beam
- glass: Tier B chips CART, ADDRESS, PAY (3 at once); DONE is the 4th and replaces CART as it leaves frame left
- retro: vector wireframes (outlines only), pads, lt-neon-border rim run on DONE
- copy: `2022 · KOLKATA · UX/UI DESIGNER, FORTMINDZ` · chips `CART` `ADDRESS` `PAY` `DONE` · wireframe tags `WEBSITES` `APPS` · "Learned to ship on a deadline alongside developers." (his words)
- sfx: 360 nothing extra (bed crash) · 372–392 `key-0..5` every 2nd character for the marker · 375, 390, 405, 420 `blip` stepping up the scale as the beam reaches each chip · 375, 390, 405 soft `swish` under each chip landing (no tink, keep tinks for the hero glass) · 420 `arcade-blip` as DONE lights and its rim light runs · 435 statement lands (no SFX) · 465–476 the bed's snare pickup

The camera rides the beam to the right like stations on one long canvas. A marker types at top left.
Outline-only wireframes of a website and an app slide past in the background (grid colour, 1.5 px),
tagged `WEBSITES` and `APPS`. The beam threads CART → ADDRESS → PAY → DONE, one chip per beat; each
chip snaps in on the CHIP spring as the head arrives and the beam bends through its rim. On DONE a
light runs once around the chip edge (adapted `lt-neon-border`). 435: "Learned to ship on a deadline
alongside developers." wipes on. 470–480: the beam keeps going right; the camera follows.

## Frame 5 — Stop 2: Impero IT, 2023

- scene: Three glass phone shells for food delivery, healthcare and events; their parts fly out and snap into a component sheet.
- duration: 4s
- frames: 480–600
- poster: 3.2s
- transition_in: continue along the beam (same pan, no blur)
- status: outline
- src: compositions/05-impero.html
- shape: blueprint spatial-pan-stations + rules depth-scatter-assemble + spring-pop-entrance
- accent: cyan (the component sheet); the beam drops to its persisted state
- glass: three Tier B phone shells (r 44)
- retro: vector outline UI parts, snap ticks
- copy: `2023 · UX/UI DESIGNER, IMPERO IT` · phone tags `FOOD DELIVERY` `HEALTHCARE` `EVENTS` · sheet tag `COMPONENT LIBRARIES` · "Felt the pull toward enterprise." (his words)
- sfx: 480–500 `key-0..5` every 2nd character for the marker · 480, 495, 510 `glass-tink`, `glass-tink-2`, `glass-tink` as each shell lands, with a soft `swish` · 518 and 526 `click` (taps on two shells) · 540–570 `snap` per component, staggered like the visuals, at most 8 audible · 570 `synth-stab` as the sheet locks · 585–596 the bed's snare pickup

Three phone shells condense on beats 480, 495, 510, each holding an outline-only screen and a mono
tag. 540 (bar downbeat): buttons, inputs, list rows and cards lift out of the phones as cyan
outlines and snap into a component sheet on the right, staggered 4 f apart (no identical grid:
real component sizes). 570: the sheet locks and its tag types. 575: "Felt the pull toward
enterprise." wipes on. 590–600: the floor tilts up into view under everything; the dolly starts.

## Frame 6 — Stop 3: miniOrange, 2024 → now

- scene: A dolly over the vector floor past his real enterprise captures; the hero capture lands under liquid glass and the beam straightens into the design system's one stroke.
- duration: 6s
- frames: 600–780
- poster: 4.6s
- transition_in: dolly (out scale 1→1.25 + floor ×4 for 10 f; in scale 0.8→1, 12 f expo.out)
- status: outline
- src: compositions/06-enterprise.html
- shape: blueprint camera-journey (cursorless flight) + device-surface-showcase + rules motion-blur-streak
- accent: cyan
- glass: Tier H device (the hero capture) + two Tier B capture frames on the fly-by
- retro: dolly over the floor at ×4 scroll, CRT power-on of each capture
- assets: showcase uem-mobile-m, uem-discovery-d, mods-docs-m (all baked with `bake.py lift`), projects/iga/01-overview.png, projects/design-system/01-cover.png (no lift)
- copy: `2024 → NOW · PRODUCT DESIGNER, MINIORANGE · PUNE` · "Enterprise software for IT, identity & security teams." · `MODS DESIGN SYSTEM` · `ONE STROKE WEIGHT · TWO CORNER RADII · THREE SPACING SCALES`
- sfx: 600 `whoosh-retro` (one of the three chapter transitions SOUND.md allows) · 615, 630, 645 `whoosh-retro` per capture flying past, panned with its motion (−6 dB from the first) · 660 `glass-tink` as the hero device condenses · 662–690 `key-0..5` every 2nd character for the marker · 720 the bed's stab (no extra SFX) as the beam straightens · 725–760 `key-0..5` for the spec line, sparse · 750–776 the bed's tom fill

600–660: the camera dollies forward over the floor; three captures in Tier B frames power on and fly
past left and right (IGA overview, UEM discovery, design-system cover), each slightly tilted (Tier B
can rotate; Tier H cannot). 660: the hero device lands centre right as Tier H, holding the UEM mobile
capture scrolling at 75 px/s; the marker types top left. 675: "Enterprise software for IT,
identity & security teams." wipes on. 720 (the bed's stab): the beam, which has been running along
the floor, pulls itself into one perfectly straight 2 px stroke across the frame (the design
system's single stroke weight); the device screen cuts to the MODS docs capture. 725–760: the spec
line types under the stroke with its `MODS DESIGN SYSTEM` tag. 760–780: hold, then hard cut.

## Frame 7 — Proof: five days

- scene: A 15-cell calendar strip folds down to 5 glass day tiles that light in order; the stat lands on the accent.
- duration: 6s
- frames: 780–960
- poster: 5.2s
- transition_in: hard cut + chroma split (4 f, `rgb-glitch-text` cut to 2 steps)
- status: outline
- src: compositions/07-five-days.html
- shape: blueprint dataviz-countup + rules counting-dynamic-scale + discrete-text-sequence
- accent: volt (the lit days and the stat)
- glass: five Tier B day tiles in a row (r 22), lit one by one; never more than 3 refracting at once
- retro: Doto counter, vector calendar outlines
- copy: `ACTIVE DIRECTORY PROTOTYPE` · `3 WEEKS` · "3 weeks → 5 days" (arrow drawn) · `D1 INTERVIEWS + JTBD` · `D2 5 FLOW VARIANTS IN 4 HOURS` · `D3 HI-FI ON THE DESIGN SYSTEM` · `D4 PROTOTYPE + DESIGN QA` · `D5 WALKTHROUGH + HANDOFF` · `~70% FASTER`
- sfx: 780 nothing extra (bed crash and light sub) · 795–825 `click-lo` ripple as 10 cells fold away (from the previous reel's library: `../../video/public/sfx/click-lo.wav`) · 840 `synth-stab` as the headline lands · 855, 862.5, 870, 877.5, 885 five ascending `blip`s, one per lit day (the reward arpeggio) · 886–899 `arcade-blip` ticks as the counter climbs, at most one per 2 frames · 900 `snap` on the landing (the bed has the stab and crash) · 930–956 the bed's snare roll and riser

780: a strip of 15 outline cells draws on (3 weeks of workdays) with `3 WEEKS` above and the caption
`ACTIVE DIRECTORY PROTOTYPE` top left. 795–825: ten cells fold away in a fast ripple and the five
left slide together and condense into Tier B day tiles. 840: "3 weeks → 5 days" slams in at display
size; the arrow is a drawn beam stroke. 855–885: the days light in volt one per eighth note, each
typing its label (D1 to D5) under the tile. 886–900: a Doto counter climbs and lands `~70% FASTER`
exactly on 900, volt for one beat, then ink. 900–960: hold for reading; lit tiles decay from volt
to ink over 0.5 s, the beam returns at 50% under the row.

## Frame 8 — What I do

- scene: Seven disciplines stack into a list while a liquid-glass selector slides down it on the eighths, magnifying each word as it passes.
- duration: 4s
- frames: 960–1080
- poster: 3.4s
- transition_in: hard cut
- status: outline
- src: compositions/08-craft.html
- shape: blueprint fixed-anchor-cycle + rules kinetic-beat-slam
- accent: beam (the selector's rim and the beam under the list)
- glass: one Tier B selector pill (the only glass in the frame)
- retro: width-axis slams, beam underline
- copy: Product design · Interaction design · Design systems · UX research · Prototyping · Information architecture · Usability testing · toolbox `FIGMA · FRAMER · NOTION · ILLUSTRATOR · PHOTOSHOP · LOTTIE`
- sfx: 960 nothing extra (bed crash, hook returns) · 975, 982.5, 990, 997.5, 1005, 1012.5, 1020 `blip-hi` stepping up the scale per word (the run plays as a melody) · 1028 `glass-tink` as the selector settles on the last word · 1035–1050 `key-0..5` every 2nd character for the toolbox line, sparse · 1050–1061 the bed's snare pickup

The words stack top to bottom at display size, left-anchored, each slamming in on an eighth with the
width-axis move. A Tier B pill follows the newest word down the list; its inward lens magnifies the
word under it (a real glass selection, iOS-style). By 1027 all seven are on screen and readable. 1035:
the toolbox types in mono along the bottom. 1065–1080: everything pushes up (continue upward).

## Frame 9 — How I work

- scene: Five glass beads on the beam; a white-hot pulse travels through them and each step lights as it passes.
- duration: 4s
- frames: 1080–1200
- poster: 3.4s
- transition_in: continue upward (in y 300→0, 9 f expo.out)
- status: outline
- src: compositions/09-process.html
- shape: rules svg-path-draw + spring-pop-entrance + ambient-glow-bloom
- accent: cyan (each step's label lights cyan as the pulse reaches it)
- glass: five Tier B beads (72 px); only the bead under the pulse and its neighbours refract at full strength
- retro: scope-axis ticks under the beam, phosphor persistence on the pulse
- copy: `DISCOVER & FRAME` · `RESEARCH & TEST` · `DEFINE THE SYSTEM` · `DESIGN & REFINE` · `DELIVER & SUPPORT` · "Research-led. Decision-first." (his words, shortened)
- sfx: 1095, 1110, 1125, 1140, 1155 `blip` + a pulse `swish` as energy travels to the next bead · 1170 statement lands (no SFX) · 1170–1196 the bed's tom fill

The beam runs straight across the middle third with ticks like the horizon axis. Five beads sit on it
and condense on the first beat. From 1095 the head travels left to right as a white-hot pulse and
reaches one bead per beat; the bead's rim fringes the pulse, its label types beneath and lights cyan,
then settles to ink-dim. 1170: "Research-led. Decision-first." wipes on below the row. Hard cut
at 1200.

## Frame 10 — By the numbers

- scene: An arcade score readout: four Doto counters land on the bed's four stabs under a glass plate, then the whole frame slows to a stop with the tape.
- duration: 4s
- frames: 1200–1320
- poster: 3.2s
- transition_in: hard cut + chroma split (3 f)
- status: outline
- src: compositions/10-numbers.html
- shape: blueprint dataviz-countup + rules counting-dynamic-scale + vertical-spring-ticker
- accent: volt (the number landing)
- glass: Tier H plate over the active counter (r 56)
- retro: arcade score count with steps(), tape-stop slowdown
- copy: `4` YEARS DESIGNING · `58` PROJECTS · `12+` ENTERPRISE PRODUCTS SHIPPED · `3` COMPANIES, 2 CITIES
- sfx: 1218–1229, 1233–1244, 1248–1259, 1263–1274 `arcade-blip` ticks per counter, at most one per 2 frames, pitch rising · 1230, 1245, 1260, 1275 `snap` on each landing (the bed carries the four stabs) · 1305–1320 the bed's tape-stop (no extra SFX)

A Tier H plate sits left of centre with the floor behind it. Each counter rolls up in Doto inside the
plate and lands on its stab (1230, 1245, 1260, 1275), volt for one beat, with its label in mono at
the right. As the next one starts, the previous number shrinks into a ledger column at the top right,
so the four end up stacked and readable. 1305–1320: everything slows to a stop with the tape (floor
scroll rate → 0, the beam's head freezes, a 4 px downward sag, power2.out). Hard cut at 1320.

## Frame 11 — The principle

- scene: The breakdown: a tangled line pulls itself straight and calm, his principle settles in, then the tube switches off.
- duration: 2s
- frames: 1320–1380
- poster: 1.5s
- transition_in: hard cut into the breakdown
- status: outline
- src: compositions/11-calm.html
- shape: rules svg-path-draw + nudge-curve
- accent: beam-core / ink (the frame desaturates; no magenta at full strength)
- glass: none (the breath)
- retro: CRT power-off (1365–1377), dot holds through the breath (1377–1380)
- copy: "Make complex feel calm." (his principle)
- sfx: 1320 reversed `tape-stop` (stretched) as the knot starts to give · 1340 a single pure sine tone (the sound designer's) as the line goes straight · 1365 short reversed `crt-on` for the power-off blip · 1377–1380 the bed's breath gap

1320: a knot of beam-core line (one continuous curve, the only curves in the film besides the
signature) sits centre frame. 1325–1350: it pulls straight (sine.inOut), losing its colour to
beam-core. 1335: "Make complex feel calm." settles in at 96 px, and its width axis relaxes 125→100
as it lands: the signature move played backwards. 1365–1377: the tube switches off (scaleY to a
line, then to a dot). 1377–1380: a beam-core dot in the void.

## Frame 12 — Invitation

- scene: The tube powers back on into the end card: portrait under glass, the name, availability and contact; the beam signs off under the name on the final chord.
- duration: 6s
- frames: 1380–1560
- poster: 4.8s
- transition_in: CRT power-on (1380–1392) on the final lift
- status: outline
- src: compositions/12-end.html
- shape: blueprint logo-assemble-lockup + rules svg-path-draw + typewriter-reveal
- accent: beam (the signature)
- glass: Tier H portrait slab (left third) + one Tier B status chip
- retro: CRT power-on, floor at rest (×0.5 scroll), signature stroke ending in a pad
- assets: assets/img/portrait-duo.png + assets/img/portrait-dither.png
- copy: SURAJIT DUTTA · "Product designer" · `OPEN TO SENIOR ROLES & SELECT FREELANCE` · `surajit3255@gmail.com` · `surajit-dutta.vercel.app`
- sfx: 1380 `whoosh-retro` under the power-on (the third chapter transition; −8 dB under the bed's crash, boom and chord) · 1388 `gated-snare-hit` as the name lands · 1410 `glass-tink` as the status chip condenses, its rim light runs · 1425–1455 `key-0..5` every 2nd character for the contact lines · 1440 `laser` + soft hum as the signature starts drawing · 1500 the signature's pad lands on the final chord (no extra SFX) · 1505 `shimmer` as the end card settles

1380–1392: the tube powers on into the end card. The Tier H slab on the left holds the portrait
(dither resolving to the duotone, as in Frame 3). 1388: SURAJIT DUTTA lands at display size right of
the slab with the width-axis move; "Product designer" wipes on under it (1395). 1410: the status
chip condenses with a light running once around its rim. 1425–1455: the two contact lines type in
mono. 1440–1500: the beam draws one flowing signature stroke under the name, the film's only flourish,
and ends in a pad exactly on the final chord at 1500. 1500–1530: hold for reading. 1530–1560: fade to
void-deep (sine.inOut) as the bed's tail fades to silence.

## Build notes for every frame

- Read `frame.md` first (tokens, glass tiers, motion set, transition table, builder contract) and
  start from `compositions/00-styleframe.html` and `window.ReelKit`.
- Bake assets before building: `python3 -I assets/lib/bake.py lift …` for dark captures and
  `… portrait …` for the portrait. No runtime `data-color-grading` (≈ 9× render cost here).
- Ids, filter ids, gradient and mask ids are prefixed with the frame id (`f04-…`).
- Lock hits to the bed's hit map in `assets/audio/README.md`; SFX are placed by the sound pass in
  `index.html`, not inside the frames.
