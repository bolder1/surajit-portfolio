# Anti-slop rules for the reel

Every agent working on this video reads this before touching a scene. These rules are distilled from the
`impeccable` skill (its AI-slop test, absolute bans and brand reflex lists), `design-taste-frontend`,
and the `humanizer` / `stop-slop` writing skills, then adapted to motion design.

## The test

Pause any frame. If someone could say "AI made that" and you'd believe them, the frame fails.

Run the **category-reflex check** at two levels:

- **First order.** If the look can be guessed from the category alone, it's a training-data default.
  For security that means neon green or blue on black, padlocks, shields, hooded hackers, binary rain,
  globes and circuit boards. **All of these are banned.**
- **Second order.** "Security that isn't neon" tends to become black plus one red accent, HUD brackets,
  scrambled hex, glitch and scanlines. That is the trap one level deeper, and **this film is close to it**.
  What gets us out of it is specificity and restraint, not more effects:
  - **His real material:** his face mesh, the real flows he designs, the real numbers (3 weeks to 5 days),
    his real domains.
  - **Timing:** every move locked to the music, holds and silences, match cuts.
  - **Few effects:** each effect is used once, with a reason.

## Visual bans

1. **Meaningless data.** No random hex streams, decorative percentages (`99.8%`, `0.998`, `MATCH 98.2`),
   loading bars that mean nothing, or filler readouts. Every label, number and readout must be true or
   advance a story beat. Prefer states over fake measurements: `LIVENESS · PASS`, `FACTOR 2 OF 2`,
   `SUBJECT · S. DUTTA`, `SCOPE · 7 DOMAINS`.
2. **Glitch and RGB split** only on cuts, at most 6 frames. Never on a hold, and never as decoration.
3. **No uniform entrances.** Don't fade every element up 20px. Each element enters in a way that suits
   its role:
   - type is masked, slammed or decoded
   - lines draw on
   - UI snaps
   - photos resolve
4. **No even rhythm.** Use speed ramps, hard stops and silence. Hold the important frame for a full beat
   or longer. Don't animate everything at once.
5. **No centred-everything.** Use asymmetric compositions and extreme scale contrast (huge type next to
   tiny labels). Crop type off-frame sometimes. Leave real negative space.
6. **No identical card grids** and no bento of icon, title and text cards.
7. **No glow on everything.** Glow and the vermilion accent only mark state (active, verified, granted,
   alert). Accent coverage stays under about 10% of the frame, except at the GRANTED climax.
8. **No decorative gradient text or glassmorphism.** A single specular sweep that crosses a name once is
   allowed. A gradient fill sitting still is not.
9. **No clip-art icons** (padlock, shield, key emoji, sparkles for "AI", brain, globe) and no emoji.
   Draw purposeful line geometry that comes from the real UI.
10. **No lens flares, neon gradients, or cyan, teal, blue or green.**
11. **No side-stripe accent borders** (a thick coloured left border on cards) and no nested cards.

## Typography

- **Primary voice: Mona Sans variable.** Animate its width and weight; that is our signature move.
- **Instrument Serif italic is a brand font, but on impeccable's reflex list.** Use it for at most one
  short human phrase per scene. Never build the "editorial lane" around it: a serif italic headline,
  tiny tracked mono labels and hairline rules is the saturated 2026 look.
- **JetBrains Mono only for real system text** (protocol lines, states, timecode), at legible sizes.
  No walls of tiny mono.
- **Doto only for big numerals.**
- **Hierarchy:** at least a 1.25× scale step and real weight contrast. Big type should be really big.

## On-screen copy (humanizer / stop-slop rules)

- **No em dashes (`—`)** in on-screen copy. This is also a site rule in PRODUCT.md. Use `·`, a comma, a
  colon or a line break.
- **No "not X, but Y" contrasts, rhetorical questions or forced triads.** Two items beat three.
- **Banned words:** elevate, seamless, unlock, unleash, empower, next-gen, cutting-edge, revolutionize,
  journey, delve, robust, leverage, game-changer, innovative.
- **Concrete verbs and nouns.** Name the actual thing ("Domain Admins", "prod-db-01").
- **Every word earns its frame.** If a line restates what the picture already shows, cut it.
- **Only true claims.** Use only facts from STORYBOARD.md: no invented clients, metrics or logos.

## Sound

- Every sound has a cause on screen. No whoosh on every cut by reflex.
- Leave silence before big hits, from 6 to 10 frames.
- Vary the UI sounds. Use several key variants and thin out repeats; a click on every character is
  noise.

## Checks before you call a scene done

1. Render stills with `./stills.sh <ID> /tmp/<ID> <frames>` and run the AI-slop test on each frame.
2. Run `npx impeccable --json src/scenes/<file>.tsx` (it catches code-level tells such as side-tabs,
   gradient text and glass). An exit code of 2 means there are findings to fix.
3. Read every on-screen string once more against the copy rules above (the `humanizer` skill covers
   this in depth).
