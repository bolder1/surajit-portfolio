---
workflow: general-video
flow: automation
storyboard: yes
message: "Surajit Dutta is a product designer who turns complex systems into calm, usable software, and ships it fast."
destination: portfolio-site
aspect: 1920x1080
language: en
audience: hiring managers, design leads and founders looking at his portfolio
length: 60s
angle: personal designer journey
---

## Intent

This is a portfolio intro reel about Surajit **as a designer**: who he is, his path into design, what he does, how he works, what he's good at, and proof in real numbers. It isn't about security products or one employer. Enterprise work is one chapter, not the whole story. It should feel personal, crafted and cinematic, and it must not look AI-generic. It has full sound design and music. He'll show it on his own portfolio site, so there are no social formats.

## Assets

- `../../public/v5/portrait.png`: his portrait. It belongs to the title and the end card.
- `../../public/showcase/*-d.jpg` and `*-m.jpg`: real product captures (UEM, FinanceOS, MODS docs, Academy, weekend builds). They belong to the journey chapters.
- `../../public/projects/{design-system,iga,uem,ad-tools,banking-tool}/*.png`: real case screens.
- `../../public/v5/*.webm`: 3D loops (robot hand, keycaps, skate wheel). Optional accents.
- `../../video/public/sfx/*.wav`: synthesised SFX library from the previous reel. Reuse it.

## Customizations

- One continuous vermilion line is the visual through-line. It starts as a circuit trace from his engineering years, becomes user flows, then his design system's single stroke weight, and finally signs off under his name.
- Synthesised music at 100 BPM (warm, not dark-techno), with every cut on the beat.
- Count-ups on the numbers (Doto dot-matrix).

## Notes

- Every claim must come from `FACTS.md`. Don't use em dashes in on-screen copy. All copy goes through the humanizer rules.
- Follow `../../video/ANTI-SLOP.md`: no fake metrics, no generic card grids, no glow on everything, no editorial-lane crutch, glitch only on cuts if at all.
- Brand colours come from the live site (v5): `#0a0a0a`, `#f0eee8`, oxblood `#661010`→`#a8281a`, vermilion `#d9472f`.
