# Sound language for the designer reel

The user asked for SFX across the whole video, chosen for what each moment needs and more intuitive this
time. The rule is that **every visible action has a sound the viewer would expect, and the same kind of
action always makes the same kind of sound.** Sounds are musical: tonal blips are pitched to the track's
key and land on the beat grid (120 BPM, 1 beat = 15 f).

All sounds are synthesised. There are no AI or stock libraries. The files live in `assets/sfx/`: the
retro set comes from the sound designer, the rest are reused from the previous reel.

## Action → sound (use these consistently)

| Visual action | Sound | Notes |
|---|---|---|
| Neon light trail starts drawing | `laser` (short zap) + a soft electric hum under the draw | The hum fades as the line settles |
| Line routes a corner / reaches a node | `blip` pitched up the scale per node | Notes from the key's minor pentatonic, rising as the path progresses |
| Liquid-glass panel / chip appears | `glass-tink` + a soft air `swish` | The tink lands exactly when the glass edge catches light |
| Glass panel slides / morphs / refracts | low-passed `swish` | Quieter than appearances |
| Mono / system text types | `key-0..5` on every 2nd character | Vary the key variants; never the same one twice in a row |
| Big title / name slam | `gated-snare-hit` + `boom`, on the downbeat | Music hits there too, so keep the SFX tight and short |
| Headline word lands | `synth-stab` | One stab per headline, not per word |
| Counter / odometer ticking | `arcade-blip`, pitch rising with the number | Thin to at most 1 per 2 frames |
| Counter lands on its value | `synth-stab` + `snap` | |
| Phone tap / button press | `click` | |
| Component snaps into the library grid | `snap` | Stagger them like the visuals; cap at about 8 audible |
| Screens fly past (camera dolly) | `whoosh-retro` with Doppler | One per screen, panned left→right with the motion |
| Calendar cell folds away | `click-lo` | Fast ripple |
| The 5 kept days light up | 5 ascending `blip`s (an arpeggio) | It should feel like a reward |
| Skill word appears (F8) | `blip-hi`, stepping up the scale per word | The run of skills plays as a melody |
| Process node lights (F9) | `blip` + a pulse `swish` as energy travels to the next node | |
| Knot untangles (F11) | reversed `tape-stop` (stretch), then a single pure sine tone | The breakdown: almost silent |
| Scene transition (major chapters only) | `tape-stop` or `whoosh-retro` | Only F3, F6, F12. No reflex whoosh on every cut |
| CRT / scanline power-on (open) | `crt-on` | F1 only |
| End card settles | `shimmer` | Ends on the final chord |
| Video end | CRT power-off blip (short `crt-on` reversed) | Last 10 frames, optional |

## Mixing

- Music bed sits under everything. SFX peaks should sit 6–10 dB below the bed's kick and snare, except
  for the title slams and the 5-day reward, which can match it.
- Leave 6–10 frames of silence before the F3 drop and before F12.
- Pan moving things with their motion (screens, light trail). Keep UI sounds centred.
- No more than 3 SFX on any one frame.
- When the result is mixed down, every sound should read as part of the music, not on top of it.
