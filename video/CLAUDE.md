# Reel (Remotion) — agent rules

- Read `ANTI-SLOP.md` before designing, editing or reviewing any scene. It overrides taste defaults.
- Storyboard and section timings: `STORYBOARD.md`; section map: `src/timeline.ts`.
- Scenes live in `src/scenes/` and export `Scene` + `cues`. Shared helpers in `src/lib/` (theme, anim, FX, ModuleShell, cues).
- Check visuals with `./stills.sh <SectionId> /tmp/<SectionId> <frames...>`; full render with `./render.sh`.
- Skills to use: `impeccable` (critique / AI-slop test, `npx impeccable --json <tsx>`), `humanizer` for any on-screen copy, `remotion-best-practices` for Remotion APIs.
