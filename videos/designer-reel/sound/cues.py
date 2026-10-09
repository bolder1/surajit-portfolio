#!/usr/bin/env python3
"""The designer reel's SFX cue sheet: ONE editable table (CUES below).

    python3 sound/cues.py          # prints the expanded sheet, per-frame counts and any rule breaks
    python3 sound/mix.py           # renders assets/audio/mix.wav from this table + the bed

Each row is (absolute_frame, sfx_name, gain_db, pan, note) at 30 fps (frames may be fractional:
862.5 is the eighth after 855).

sfx_name   a file in assets/sfx/ ("glass-tink"), a derived sound from sound/sfx_special.py
           ("tape-rewind", "hum-80f", ...), optionally pitched by resampling:
           "blip@E6" lands the blip on E6, "shimmer@+2" plays it a tone up.
gain_db    the cue's PEAK relative to the bed's kick/snare peak (mix.py measures that reference
           from bed.wav at the full-band kicks and backbeat snares, about -5.3 dBFS).
           Normal SFX sit -6..-10 (F1, F2 and F11 have no full drums, so their cues sit lower to
           stay inside the pad). Only the name slam (240), the 5-day reward (855-885) and the
           final lift (1380-1388) come up to -3/-4 (near-matching: on top of the bed's own
           kick, crash and sub a full 0 dB match would only be eaten by the limiter). Dense runs
           (counter ticks) and soft beds (hum, air swishes, fly-bys, the F11 breakdown) sit lower
           on purpose.
pan        0 = keep the file's own stereo image (centred UI sounds),
           x = shift the whole image towards x (-1 left .. +1 right, equal power),
           (a, b) = fold to mono and travel from a to b over the sound (moving things: beam, screens).
note       what happens on screen, and the storyboard frame it comes from.

Tonal cues use F# minor pentatonic notes (F#, A, B, C#, E). Where a tonal cue's storyboard frame
sits within a frame of the 16th-note grid it is nudged onto the grid and the note says so.

Helpers expand runs into rows: type_on() puts a key-0..5 on every 2nd character of a type-on
(the variant never repeats back to back) and ticks() thins a counter to one arcade tick per
2 frames with the pitch climbing.
"""
import random
import sys
from collections import Counter, namedtuple

FPS = 30
Cue = namedtuple("Cue", "frame name gain_db pan note")

# --------------------------------------------------------------------------- helpers
_keys = {"prev": None, "rng": random.Random(2016)}


def _next_key():
    choices = [k for k in range(6) if k != _keys["prev"]]
    k = _keys["rng"].choice(choices)
    _keys["prev"] = k
    return f"key-{k}"


def type_on(start, end, text, gain_db, note, min_gap=1):
    """Keys for a mono type-on: `text` spread evenly over frames start..end, a key on every 2nd
    character (1st, 3rd, 5th ...), snapped to whole frames (the type steps on frames), at least
    `min_gap` frames apart (2 = sparse). Small deterministic level jitter so it doesn't machine-gun."""
    step = (end - start) / len(text)
    rows, last = [], None
    for i in range(0, len(text), 2):
        f = int(round(start + i * step))
        if last is not None and f - last < min_gap:
            continue
        jitter = round(_keys["rng"].uniform(-1.0, 0.5), 1)
        rows.append((f, _next_key(), gain_db + jitter, 0, f"{note} · char {i + 1}/{len(text)} {text[i]!r}"))
        last = f
    return rows


# first notes of the arcade chirp (it jumps a 4th) that keep both notes inside F# minor pentatonic
TICK_LADDER = ["E5", "F#5", "B5", "C#6", "E6", "F#6", "B6"]


def ticks(start, end, gain_db, note, every=2):
    """Counter ticks from start to end (inclusive), one per `every` frames, pitch climbing."""
    frames = list(range(start, end + 1, every))
    assert len(frames) <= len(TICK_LADDER), "counter longer than the tick ladder"
    return [(f, f"arcade-tick@{TICK_LADDER[i]}", gain_db, 0, f"{note} · tick {i + 1}/{len(frames)}")
            for i, f in enumerate(frames)]


# --------------------------------------------------------------------------- THE TABLE
CUES = [
    # ===== F1 Origin (0-120): tube powers on, the beam routes a circuit trace left -> right =====
    (0, "crt-on", -6, 0, "F1 0: the tube powers on from black"),
    (30, "laser", -10, -0.5, "F1 30: beam-core dot appears at the left edge and starts the trace"),
    (30, "hum-80f", -15, (-0.6, 0.35), "F1 30-110: soft hum under the draw, follows the head, gone by 110"),
    (45, "blip@C#6", -11, -0.45, "F1 45: pad 1 pops at a bend"),
    (48.75, "glass-tink", -10, 0, "F1 48: chip 1 condenses over the trace (nudged +0.75 f onto the 16th)"),
    *type_on(50, 64, "2016 · ELECTRONICS & TELECOM", -15, "F1 ~50: chip 1 types (~60 cps)"),
    (60, "blip@E6", -11, -0.25, "F1 60: pad 2"),
    (75, "blip@F#6", -11, -0.05, "F1 75: pad 3"),
    (90, "blip@A6", -11, 0.15, "F1 90: pad 4"),
    (93.75, "glass-tink-2", -11, 0, "F1 93: chip 2 condenses (nudged +0.75 f onto the 16th)"),
    *type_on(95, 114, "2019 · B.TECH, INFORMATION TECHNOLOGY", -15, "F1 ~95: chip 2 types (~60 cps)"),

    # ===== F2 Thesis (120-240): pads become node tiles; flow folds; 232-240 is the bed's void =====
    (127.5, "glass-tink", -9, 0, "F2 128: node tile 1 condenses (on the eighth)"),
    (142.5, "glass-tink-2", -10, 0, "F2 143: node tile 2 condenses (on the eighth)"),
    (157.5, "glass-tink", -9, 0, "F2 158: node tile 3 condenses (on the eighth)"),
    (212, "swish-lp", -14, 0, "F2 212: the flow folds in, tiles melt (low-passed swish)"),

    # ===== F3 Name (240-360): the drop =====
    (240, "gated-snare-hit", -4, 0, "F3 240: SURAJIT slams on the downbeat (hero, near the bed's snare)"),
    (240, "boom-tight", -9, 0, "F3 240: sub under the slam, cut short (the bed has its own sub)"),
    (255, "glass-tink", -8, 0, "F3 255: Tier H portrait slab condenses"),
    *type_on(270, 290, "PRODUCT DESIGNER · UX / UI", -10, "F3 270-290: mono label types above the name"),
    (300, "laser", -8, 0.25, "F3 300: beam fires from the pad toward the slab on the right"),

    # ===== F4 Fortmindz (360-480): beam threads CART -> ADDRESS -> PAY -> DONE, camera rides right =====
    *type_on(372, 392, "2022 · KOLKATA · UX/UI DESIGNER, FORTMINDZ", -10, "F4 372-392: marker types top left"),
    (375, "blip@E6", -8, -0.3, "F4 375: beam reaches CART"),
    (375, "swish", -14, 0, "F4 375: soft air under CART landing"),
    (390, "blip@F#6", -8, -0.05, "F4 390: beam reaches ADDRESS"),
    (390, "swish", -14, 0, "F4 390: soft air under ADDRESS landing"),
    (405, "blip@A6", -8, 0.2, "F4 405: beam reaches PAY"),
    (405, "swish", -14, 0, "F4 405: soft air under PAY landing"),
    (420, "blip@B6", -8, 0.4, "F4 420: beam reaches DONE"),
    (420, "arcade-blip", -8, 0, "F4 420: DONE lights, its rim light runs"),

    # ===== F5 Impero IT (480-600): three phone shells, parts snap into a component sheet =====
    *type_on(480, 500, "2023 · UX/UI DESIGNER, IMPERO IT", -10, "F5 480-500: marker types"),
    (480, "glass-tink", -8, 0, "F5 480: shell 1 (food delivery) lands"),
    (480, "swish", -14, 0, "F5 480: soft air under shell 1"),
    (495, "glass-tink-2", -9, 0, "F5 495: shell 2 (healthcare) lands"),
    (495, "swish", -14, 0, "F5 495: soft air under shell 2"),
    (510, "glass-tink", -8, 0, "F5 510: shell 3 (events) lands"),
    (510, "swish", -14, 0, "F5 510: soft air under shell 3"),
    (518, "click", -8, 0, "F5 518: tap on a shell"),
    (526, "click", -8, 0, "F5 526: tap on another shell"),
    (540, "snap", -7, 0, "F5 540: component 1 snaps into the sheet"),
    (544, "snap", -8, 0, "F5 544: component 2"),
    (548, "snap", -7, 0, "F5 548: component 3"),
    (552, "snap", -8, 0, "F5 552: component 4"),
    (556, "snap", -7, 0, "F5 556: component 5"),
    (560, "snap", -8, 0, "F5 560: component 6"),
    (564, "snap", -7, 0, "F5 564: component 7"),
    (568, "snap", -8, 0, "F5 568: component 8 (cap: 8 audible)"),
    (570, "synth-stab", -7, 0, "F5 570: the component sheet locks"),

    # ===== F6 miniOrange (600-780): dolly over the floor, captures fly past, hero device lands =====
    (600, "whoosh-retro", -7, 0, "F6 600: chapter transition, dolly into the floor (file's own L->R sweep)"),
    (615, "whoosh-flyby", -13, (-0.15, -0.9), "F6 615: IGA overview flies past on the left (Doppler)"),
    (630, "whoosh-flyby", -13, (0.15, 0.9), "F6 630: UEM discovery flies past on the right (Doppler)"),
    (645, "whoosh-flyby", -13, (-0.15, -0.9), "F6 645: design-system cover flies past on the left (Doppler)"),
    (660, "glass-tink", -8, 0, "F6 660: hero device condenses as Tier H"),
    *type_on(662, 690, "2024 → NOW · PRODUCT DESIGNER, MINIORANGE · PUNE", -10,
             "F6 662-690: marker types top left (arrow drawn, still takes a step)"),
    *type_on(725, 733, "MODS DESIGN SYSTEM", -10, "F6 725-733: spec tag types, sparse", min_gap=2),
    *type_on(734, 760, "ONE STROKE WEIGHT · TWO CORNER RADII · THREE SPACING SCALES", -10,
             "F6 734-760: spec line types under the stroke, sparse", min_gap=2),

    # ===== F7 Five days (780-960): 15 cells fold to 5, days light, counter lands on 900 =====
    (795, "click-lo", -7, 0, "F7 795: cell 1 of 10 folds away (ripple)"),
    (798.33, "click-lo", -8, 0, "F7 798: cell 2 folds"),
    (801.67, "click-lo", -7, 0, "F7 802: cell 3 folds"),
    (805, "click-lo", -8, 0, "F7 805: cell 4 folds"),
    (808.33, "click-lo", -7, 0, "F7 808: cell 5 folds"),
    (811.67, "click-lo", -8, 0, "F7 812: cell 6 folds"),
    (815, "click-lo", -7, 0, "F7 815: cell 7 folds"),
    (818.33, "click-lo", -8, 0, "F7 818: cell 8 folds"),
    (821.67, "click-lo", -7, 0, "F7 822: cell 9 folds"),
    (825, "click-lo", -8, 0, "F7 825: cell 10 folds, the five slide together"),
    (840, "synth-stab", -6, 0, "F7 840: '3 weeks -> 5 days' slams in"),
    (855, "blip@E6", -3, 0, "F7 855: D1 lights (reward arpeggio 1/5)"),
    (862.5, "blip@F#6", -3, 0, "F7 862.5: D2 lights (2/5)"),
    (870, "blip@A6", -3, 0, "F7 870: D3 lights (3/5)"),
    (877.5, "blip@B6", -3, 0, "F7 877.5: D4 lights (4/5)"),
    (885, "blip@C#7", -3, 0, "F7 885: D5 lights (5/5, lands on C#, the 3rd of A)"),
    *ticks(886, 898, -15, "F7 886-899: Doto counter climbs to ~70%"),
    (900, "snap", -7, 0, "F7 900: counter lands on ~70% FASTER (bed has the stab + crash)"),

    # ===== F8 What I do (960-1080): seven disciplines, glass selector follows =====
    (975, "blip-hi@F#6", -8, 0, "F8 975: 'Product design' slams in (skill run 1/7)"),
    (982.5, "blip-hi@A6", -8, 0, "F8 982.5: 'Interaction design' (2/7)"),
    (990, "blip-hi@B6", -8, 0, "F8 990: 'Design systems' (3/7)"),
    (997.5, "blip-hi@C#7", -8, 0, "F8 997.5: 'UX research' (4/7)"),
    (1005, "blip-hi@E7", -9, 0, "F8 1005: 'Prototyping' (5/7)"),
    (1012.5, "blip-hi@F#7", -9, 0, "F8 1012.5: 'Information architecture' (6/7)"),
    (1020, "blip-hi@A7", -9, 0, "F8 1020: 'Usability testing' (7/7, A over the D bar)"),
    (1027.5, "glass-tink", -8, 0, "F8 1028: selector settles on the last word (on the eighth)"),
    *type_on(1035, 1050, "FIGMA · FRAMER · NOTION · ILLUSTRATOR · PHOTOSHOP · LOTTIE", -10,
             "F8 1035-1050: toolbox line types, sparse", min_gap=2),

    # ===== F9 How I work (1080-1200): a pulse travels left -> right through five beads =====
    (1095, "blip@E6", -8, -0.5, "F9 1095: pulse reaches DISCOVER & FRAME"),
    (1095, "swish", -13, (-0.5, -0.25), "F9 1095: energy travels on to bead 2"),
    (1110, "blip@F#6", -8, -0.25, "F9 1110: RESEARCH & TEST lights"),
    (1110, "swish", -13, (-0.25, 0.0), "F9 1110: energy travels on to bead 3"),
    (1125, "blip@A6", -8, 0.0, "F9 1125: DEFINE THE SYSTEM lights"),
    (1125, "swish", -13, (0.0, 0.25), "F9 1125: energy travels on to bead 4"),
    (1140, "blip@B6", -8, 0.25, "F9 1140: DESIGN & REFINE lights"),
    (1140, "swish", -13, (0.25, 0.5), "F9 1140: energy travels on to bead 5"),
    (1155, "blip@C#7", -8, 0.5, "F9 1155: DELIVER & SUPPORT lights"),
    (1155, "swish", -13, (0.5, 0.8), "F9 1155: the pulse runs on off the last bead"),

    # ===== F10 Numbers (1200-1320): four counters land on the bed's four stabs =====
    *ticks(1218, 1228, -15, "F10 1218-1229: counter 1 (4 YEARS) rolls"),
    (1230, "snap", -7, 0, "F10 1230: 4 lands (bed stab)"),
    *ticks(1233, 1243, -15, "F10 1233-1244: counter 2 (58 PROJECTS) rolls"),
    (1245, "snap", -7, 0, "F10 1245: 58 lands (bed stab)"),
    *ticks(1248, 1258, -15, "F10 1248-1259: counter 3 (12+ PRODUCTS) rolls"),
    (1260, "snap", -7, 0, "F10 1260: 12+ lands (bed stab)"),
    *ticks(1263, 1273, -15, "F10 1263-1274: counter 4 (3 COMPANIES) rolls"),
    (1275, "snap", -7, 0, "F10 1275: 3 lands (bed stab)"),

    # ===== F11 The principle (1320-1380): the breakdown, almost silent; 1377-1380 is the breath =====
    (1320, "tape-rewind", -5, 0, "F11 1320: reversed, stretched tape-stop as the knot starts to give"),
    (1340, "sine-calm", -18, 0, "F11 1340: one pure C#6 sine as the line goes straight (ends 1376)"),
    (1365, "crt-off", -7, 0, "F11 1365: the tube switches off (reversed crt-on, ends by 1377)"),

    # ===== F12 Invitation (1380-1560): power-on into the end card, signature on the final chord =====
    (1380, "whoosh-retro", -8, 0, "F12 1380: under the CRT power-on, 8 dB under the bed's crash"),
    (1387.5, "gated-snare-hit", -4, 0, "F12 1388: SURAJIT DUTTA lands (final lift; on the eighth)"),
    (1410, "glass-tink", -8, 0, "F12 1410: status chip condenses, its rim light runs"),
    *type_on(1425, 1439, "surajit3255@gmail.com", -10, "F12 1425-1439: contact line 1 types"),
    (1440, "laser", -8, -0.15, "F12 1440: the signature stroke starts under the name"),
    (1440, "hum-60f", -12, (-0.15, 0.55), "F12 1440-1500: soft hum under the signature, follows it right"),
    *type_on(1440, 1455, "surajit-dutta.vercel.app", -10, "F12 1440-1455: contact line 2 types"),
    (1505, "shimmer@+2", -8, 0, "F12 1505: end card settles (shimmer up a tone: E-G-B -> F#-A-C#)"),
]

# --------------------------------------------------------------------------- rules
SECTIONS = [("F1", 0, 120), ("F2", 120, 240), ("F3", 240, 360), ("F4", 360, 480), ("F5", 480, 600),
            ("F6", 600, 780), ("F7", 780, 960), ("F8", 960, 1080), ("F9", 1080, 1200),
            ("F10", 1200, 1320), ("F11", 1320, 1380), ("F12", 1380, 1560)]
SILENCES = [(232, 240), (1377, 1380)]
LAST_START = 1505            # nothing new after this, except the shimmer tail starting on it
MAX_PER_FRAME = 3


def cues():
    """The table as Cue tuples, time-sorted (stable, so same-frame rows keep table order)."""
    return sorted((Cue(*c) for c in CUES), key=lambda c: c.frame)


def section_of(frame):
    for sid, a, b in SECTIONS:
        if a <= frame < b:
            return sid
    return "out"


def check(cs=None):
    cs = cs or cues()
    problems = []
    per = Counter(int(c.frame) for c in cs)
    for f, n in sorted(per.items()):
        if n > MAX_PER_FRAME:
            problems.append(f"frame {f}: {n} SFX start (max {MAX_PER_FRAME})")
    for c in cs:
        for a, b in SILENCES:
            if a <= c.frame < b:
                problems.append(f"{c.frame} {c.name}: starts inside the {a}-{b} silence")
        if c.frame > LAST_START or (c.frame == LAST_START and not c.name.startswith("shimmer")):
            problems.append(f"{c.frame} {c.name}: starts after {LAST_START}")
    keys = [c for c in cs if c.name.startswith("key-")]
    for p, q in zip(keys, keys[1:]):
        if p.name == q.name:
            problems.append(f"{p.frame}/{q.frame}: {p.name} twice in a row")
    tk = [c for c in cs if c.name.startswith("arcade-tick")]
    for p, q in zip(tk, tk[1:]):
        if q.frame - p.frame < 2:
            problems.append(f"{p.frame}/{q.frame}: counter ticks closer than 2 frames")
    return problems


def counts_by_section(cs=None):
    cs = cs or cues()
    out = {sid: Counter() for sid, _, _ in SECTIONS}
    for c in cs:
        kind = "keys" if c.name.startswith("key-") else "ticks" if c.name.startswith("arcade-tick") else "other"
        out[section_of(c.frame)][kind] += 1
    return out


def main():
    cs = cues()
    for c in cs:
        pan = c.pan if not isinstance(c.pan, tuple) else f"{c.pan[0]:+.2f}>{c.pan[1]:+.2f}"
        print(f"{c.frame:8.2f}  {c.name:<18} {c.gain_db:+6.1f} dB  pan {str(pan):<12} {c.note}")
    print()
    for sid, k in counts_by_section(cs).items():
        print(f"{sid:<4} {sum(k.values()):3d} cues  (keys {k['keys']}, ticks {k['ticks']}, other {k['other']})")
    print(f"total {len(cs)} cues; busiest frame has {max(Counter(int(c.frame) for c in cs).values())} starts")
    probs = check(cs)
    print("rule check:", "OK" if not probs else "\n  " + "\n  ".join(probs))
    return 1 if probs else 0


if __name__ == "__main__":
    sys.exit(main())
