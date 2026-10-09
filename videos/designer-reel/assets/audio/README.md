# Designer reel: audio

Every sound here is synthesised in code with numpy/scipy (oscillators, filters, noise, convolution).
There are no samples, no downloads and no AI-generated music or voice.

Regenerate from the reel root (`videos/designer-reel/`):

```bash
python3 sound/compose.py      # assets/audio/bed.wav + bed-hits.json + review/bed.png
python3 sound/sfx_retro.py    # assets/sfx/*.wav + review/sfx.png
```

Both scripts import the shared toolkit `../../video/sound/dsp.py` read-only. Output is deterministic (fixed seeds).

## The bed

| | |
|---|---|
| File | `bed.wav`, 52.000 s exactly (2,496,000 samples), 48 kHz, 16-bit stereo |
| Tempo | 120 BPM, so 1 beat = 15 f, 1 bar = 60 f, one 16th = 3.75 f (30 fps) |
| Key | F# minor. Loop is F#m, D, A, E (i, VI, III, VII), one chord per bar; ends on the cadence D, E, F#m |
| Loudness | -16.0 LUFS integrated, -3.6 dBFS true peak, LRA 3.4 LU (checked with ffmpeg `ebur128`) |
| Style | Retrowave / synth-pop: punchy kick, gated-reverb snare on 2 and 4, octave-pumping bass, 16th saw arp through a dotted-8th ping-pong delay, detuned voice-led pad, mono lead with glide and vibrato, kick sidechain pump on bass, pad, arp and reverb |
| Hook | 8-bar lead motif (C#, E, F#, then a falling answer). Plays bars 4-11 (F3-F6), returns bars 16-19 (F8-F9) doubled an octave down, then reworked for the final lift and landing on A5 over the last chord |

### Files

| File | What it is |
|---|---|
| `bed.wav` | The 52 s music bed described above. Put it on its own `<audio>` track from frame 0. |
| `bed-hits.json` | Machine-readable copy of the section map, hit list and every full-band kick frame (for scripted sync). |
| `README.md` | This file. |
| `../sfx/arcade-blip.wav` | NEW. 8-bit square chirp C#6 to F#6 with a short echo. Counters, small UI wins, list items landing. |
| `../sfx/laser.wav` | NEW. Retro "pew": pulse wave diving 2.7 kHz to 160 Hz with a ping-pong echo. Fast reveals and wipes. |
| `../sfx/crt-on.wav` | NEW. Tube power-on: relay thunk, degauss hum on F#, static crackle, beam zip. The opening frame or a screen switching on. |
| `../sfx/tape-stop.wav` | NEW. A beat of the bed's sound (kick, F# bass, F#m stab) slowing to a halt. Hard stops and freeze-frames. |
| `../sfx/gated-snare-hit.wav` | NEW. The bed's 80s gated-reverb snare as a one-shot. Accent a word or panel slam on a beat. |
| `../sfx/synth-stab.wav` | NEW. F#m supersaw chord stab with a dotted-8th echo tail. Title or stat punctuation off the downbeat. |
| `../sfx/glass-tink.wav` | NEW. Bright glassy ping on F#6 (inharmonic bar partials, slight L/R shimmer). For the liquid-glass panels landing. |
| `../sfx/glass-tink-2.wav` | NEW. Same ping a fifth up (C#7). Use for the second or third glass panel in a sequence. |
| `../sfx/whoosh-retro.wav` | NEW. Filtered-noise sweep plus a flanged saw pitch sweep, panned left to right. Transitions and fly-ins. |
| `../sfx/click.wav` | Copied. Short bright UI click. |
| `../sfx/key-0.wav` … `key-5.wav` | Copied. Six keyboard-key variants for type-on text (rotate them). |
| `../sfx/blip.wav` | Copied. Soft sine blip. |
| `../sfx/blip-hi.wav` | Copied. Higher, shorter blip. |
| `../sfx/blip-up.wav` | Copied. Upward-gliding blip (a step completing). |
| `../sfx/swish.wav` | Copied. Short bright swish. |
| `../sfx/whoosh.wav` | Copied. Medium filtered-noise whoosh. |
| `../sfx/riser.wav` | Copied. 2 s noise and saw riser. |
| `../sfx/impact.wav` | Copied. Cinematic hit with sub, crack and ring (5 s tail). |
| `../sfx/boom.wav` | Copied. Sub boom, 90 Hz falling to 28 Hz. |
| `../sfx/snap.wav` | Copied. Tight snap tick. |
| `../sfx/shimmer.wav` | Copied. High sparkle cluster with reverb. |
| `../../sound/compose.py` | Generator for the bed (instruments, arrangement, mix, master, review plot). |
| `../../sound/sfx_retro.py` | Generator for the SFX folder (synthesises the new ones, copies and re-normalises the rest). |
| `../../review/bed.png` | Spectrogram, per-frame RMS/peak and stem levels with section and hit markers. |
| `../../review/sfx.png` | Spectrogram contact sheet of the nine new SFX. |

All SFX are 48 kHz stereo 16-bit, peak-normalised to -1 dBFS. The pitched ones are tuned to F# minor so they sit inside the music.

## Section map

| Frames | Bars | Frame | Chords | What the music does |
|---|---|---|---|---|
| 0-120 | 0-1 | F1 Origin | F#m, D | Pad fades up from silence, filtered 16th arp. No drums. |
| 120-240 | 2-3 | F2 Thesis | A, E | Filtered kick, offbeat hats and root bass enter. White-noise riser from 120. Snare build, tom fill, then the 232-240 gap. |
| 240-360 | 4-5 | F3 Name | F#m, D | **DROP.** Full band, crash, sub boom, lead hook (call). |
| 360-480 | 6-7 | F4 Fortmindz | A, E | Groove plus the hook's answer phrase. |
| 480-600 | 8-9 | F5 Impero IT | F#m, D | Claps and shaker join, arp switches to pedal pattern, hook repeats. |
| 600-780 | 10-12 | F6 miniOrange | A, E, F#m | Bass goes to 16th octaves. Hook climbs and resolves (bars 10-11). Lead rests in bar 12 with a stab at 720. |
| 780-960 | 13-15 | F7 Five days | D, A, E | No lead. Climbing arp and a glass-bell counter-melody. Stab and crash at 900, then roll and riser. |
| 960-1080 | 16-17 | F8 What I do | F#m, D | Lead hook returns, doubled an octave down. |
| 1080-1200 | 18-19 | F9 How I work | A, E | Hook answer phrase. Tom fill out. |
| 1200-1320 | 20-21 | F10 Numbers | F#m, D | Lead out. Four counter stabs on beats. Tape-stop 1305-1320. |
| 1320-1380 | 22 | F11 Calm | Amaj9 | **Breakdown.** Pad and arp only, filter closing, then a short riser. Breath at 1377-1380. |
| 1380-1500 | 23-24 | F12 Invitation | D(add9), E | **Final lift.** Full band, big chord, extra octave pad and arp, lead climbs. Tom fill 1470-1500. |
| 1500-1560 | 25 | F12 outro | F#m9 | **Final chord.** Band stops, lead lands on A5, reverb tail fades to digital silence at 1560. |

## Hit-frame map (lock visuals to these)

Section starts carry a crash. Don't stack `impact.wav` on them. Use it only where a frame needs extra weight (240 or 1380).

| Frame | Hit |
|---|---|
| 0 | F1 start. Pad fades up from silence. |
| 120 | F2. Filtered kick, hats and bass enter. Riser starts (runs to 232). Small reverse-cymbal swell ends here. |
| 180, 187.5, 195, 202.5 | 8th-note snare crescendo. |
| 210, 213.75, 217.5, 221.25, 225, 228.75 | Tom fill, high to low. |
| **232-240** | **Near-silence gap.** The whole mix drops to -40 dB (about -60 dBFS RMS). Hold the frame or go dark. |
| **240** | **DROP.** Crash, sub boom, full band, lead hook. |
| 360 | F4 crash. |
| 465, 468.75, 472.5, 476.25 | Snare pickup into F5. |
| 480 | F5 crash. Claps and shaker join. |
| 585, 588.75, 592.5, 596.25 | Snare pickup into F6 (reverse swell 570-600). |
| 600 | F6 crash. 16th-octave bass. |
| 720 | Synth stab. Lead rests. |
| 750 to 776.25 (every 3.75 f) | Tom fill into F7 (no kick at 765). |
| **780** | F7 crash plus a light sub. Glass-bell notes at 780, 802.5, 825 / 840, 862.5, 885 / 900, 922.5. |
| **900** | F7 accent: synth stab plus crash. Land the "3 weeks to 5 days" stat or odometer here. |
| 930 to 956.25 | 16th snare roll plus riser into F8. |
| **960** | F8 crash plus sub. Lead hook returns. |
| 1050 to 1061.25 | Snare pickup into F9. |
| 1080 | F9 crash. |
| 1170 to 1196.25 | Tom fill into F10 (no kick at 1185). |
| 1200 | F10 crash. Lead out. |
| **1230, 1245, 1260, 1275** | Counter stabs (F#m, F#m, D, D). One per counter landing. |
| **1305-1320** | Tape-stop. The whole band slows to a halt (pitch dives). Pair it with a slowdown or freeze. |
| **1320** | F11 breakdown starts. Pad and arp only, the line can untangle here. |
| 1335-1377 | Riser. Soft snare roll 1350-1375. |
| **1377-1380** | Breath gap (-26 dB). |
| **1380** | **FINAL LIFT.** Crash, sub boom, big D(add9) chord stab, full band, lead. |
| 1470 to 1496.25 | Big tom fill (no kick at 1485). |
| **1500** | **FINAL CHORD** F#m9. Last kick, crash and sub. Band stops. |
| 1512-1560 | Fade. Fully silent by 1560 (the last 10 ms are digital zero). |

### Beat grid

- **Kicks (full band):** every 15 f from 240 to 1305, except 765 and 1185, then 1380 to 1470 and 1500. That's 78 hits, all listed in `bed-hits.json` as `full_band_kicks`. Filtered intro kicks: 120, 135, 150, 165, 180, 195.
- **Gated snare (backbeat):** on beats 2 and 4, so `bar*60 + 15` and `bar*60 + 45` for bars 4-21 and 23. The beat-4 snare drops out in the fill bars 12, 15, 19 and 24.
- **Offbeat open hats:** `beat + 7.5` f throughout the groove. Good for small glass glints, but don't hit every one.

## Mixing notes for the final render

- The bed is mastered to -16 LUFS with a -3.6 dBFS true peak (under the -2 dBFS ceiling), so a final `loudnorm` pass has room and won't need to limit it.
- Sit SFX about 6 to 10 dB under the bed. The bed already carries a crash on every section start, so prefer `glass-tink`, `arcade-blip` and `key-*` for detail and save `impact` and `boom` for 240 and 1380.
- `glass-tink` and `glass-tink-2` are on F# and C#, so they always agree with the chords.
