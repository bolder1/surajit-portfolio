#!/usr/bin/env python3
"""The designer reel's SFX cue sheet: ONE editable table (CUES below).

    python3 sound/cues.py          # prints the expanded sheet, per-frame counts and any rule breaks
    python3 sound/mix.py           # renders assets/audio/mix.wav from this table + the bed

Each row is (absolute_frame, sfx_name, gain_db, pan, note) at 30 fps (frames may be fractional:
862.5 is the eighth after 855).

sfx_name   a file in assets/sfx/ ("glass-tink"), a derived sound from sound/sfx_special.py
           ("tape-rewind", "hum-80f", "laser-rev", ...), optionally pitched by resampling:
           "blip@E6" lands the blip on E6, "shimmer@+2" plays it a tone up.
gain_db    the cue's PEAK relative to the bed's kick/snare peak (mix.py measures that reference
           from bed.wav at the full-band kicks and backbeat snares, about -5.3 dBFS).
           Normal SFX sit -6..-10 (F1, F2 and F11 have no full drums, so their cues sit lower to
           stay inside the pad). Only the name slam (240), the 5-day reward (855-885) and the
           final lift (1380-1388) come up to -3/-4 (near-matching: on top of the bed's own
           kick, crash and sub a full 0 dB match would only be eaten by the limiter). Dense runs
           (counter ticks, keys) and soft beds (hum, air swishes, fly-bys, the F11 breakdown) sit
           lower on purpose.
pan        0 = keep the file's own stereo image (centred UI sounds),
           x = shift the whole image towards x (-1 left .. +1 right, equal power),
           (a, b) = fold to mono and travel from a to b over the sound (moving things: beam, screens).
note       what happens on screen and the absolute frame the frame fixers measured it on.

SYNC (polish pass 2): every frame is the one the six frame fixers measured from the rebuilt timelines.
A cue sits on the first frame its visual shows, not nudged onto the 16th grid. A long-attack sound
(the fly-by whoosh, peak 13.8 f in) starts early so its peak lands on the fly-past.
Tonal cues use F# minor pentatonic notes (F#, A, B, C#, E).

Helpers expand runs into rows:
  type_on()  a key on every 2nd character (the 2nd, 4th, 6th ...) on the whole frame it first shows,
             at most one per frame; sparse (min_gap=2) = one key every 2 frames while it types. The frames come from the compositions' own
             timing: steps_chars() for GSAP steps(n) type-ons, rate_chars() / chip_chars() for the
             60 cps linear ones. Variants key-0..5 are assigned in cues() after sorting, so even
             overlapping type-ons never repeat a variant back to back.
  ticks()    one arcade tick per counter step that is shown, thinned to at most one per 2 frames,
             pitch climbing; the landing itself is a separate snap row.
cues() then thins keys: a key within 1 frame of a counter tick is dropped (the ticks carry the count),
two keys on one frame keep the first, and keys are the first to go if a frame would pass 3 starts.
"""
import math
import random
import sys
from collections import Counter, namedtuple

FPS = 30
Cue = namedtuple("Cue", "frame name gain_db pan note")
KEY = "key"                    # placeholder name; cues() assigns key-0..5
SECTIONS = [("F1", 0, 120), ("F2", 120, 240), ("F3", 240, 360), ("F4", 360, 480), ("F5", 480, 600),
            ("F6", 600, 780), ("F7", 780, 960), ("F8", 960, 1080), ("F9", 1080, 1200),
            ("F10", 1200, 1320), ("F11", 1320, 1380), ("F12", 1380, 1560)]

# --------------------------------------------------------------------------- helpers
_rng = random.Random(2016)


def _la(t):
    """GSAP's own 1e-7 rounding of timeline times."""
    return round(t * 1e7) / 1e7


def steps_chars(t0, dur, n):
    """Frame each of n characters first shows on, for a GSAP steps(n) type-on of `dur` frames starting on frame t0.
    GSAP's steps(n) ease is floor((n + 1) p) / n, so character k lands at t0 + k * dur / (n + 1); the film is
    sampled on whole frames. When k lands exactly on a frame, which side it falls on is decided by GSAP's float
    arithmetic, so this repeats it: the frame's composition timeline sits at la(film time - slot start) and
    p = (that - la(local t0)) / la(dur). Checked against gsap 3.14.2 seeking the nested timelines for every
    steps type-on in the film (477 characters, 0 mismatches)."""
    slot = next(a for _, a, b in SECTIONS if a <= t0 < b)
    s0, d = _la((t0 - slot) / FPS), _la(dur / FPS)
    first, f = [], int(t0) - 1
    while len(first) < n:
        p = (_la(f / FPS - slot / FPS) - s0) / d
        shown = 0 if p < 0 else int((n + 1) * min(p, 0.99999999))
        first += [f] * max(0, shown - len(first))
        f += 1
    return first


def rate_chars(first, per_char, n):
    """Character k (1-based) lands at first + (k - 1) * per_char and first shows on the next whole frame."""
    return [math.ceil(first + (k - 1) * per_char - 1e-6) for k in range(1, n + 1)]


def chip_chars(lit, n):
    """F1 year chips: the glass widens at 60 chars/s from its tink frame `lit` and a character shows as soon as
    it fits: (84 + 19.6 + 28 - 80) / 19.24 = 2.682 characters of growth before the first one."""
    return rate_chars(lit + (1 + 51.6 / 19.24) / 2, 0.5, n)


def type_on(chars, text, gain_db, note, min_gap=1):
    """Keys for a mono type-on: one on every 2nd character (2nd, 4th ...) on the frame it first shows, at most
    one per frame. Sparse (min_gap=2): one key every 2 frames, on frames where a character shows. Small
    deterministic level jitter so it doesn't machine-gun."""
    assert len(chars) == len(text), (note, len(chars), len(text))
    rows, last = [], None
    for i in range(1 if min_gap == 1 else 0, len(text), 2 if min_gap == 1 else 1):
        f = chars[i]
        if last is not None and f - last < min_gap:
            continue
        jitter = round(_rng.uniform(-1.0, 0.5), 1)
        rows.append((f, KEY, gain_db + jitter, 0, f"{note} · char {i + 1}/{len(text)} {text[i]!r}"))
        last = f
    return rows


# first notes of the arcade chirp (it jumps a 4th) that keep both notes inside F# minor pentatonic
TICK_LADDER = ["E5", "F#5", "B5", "C#6", "E6", "F#6", "B6"]


def ticks(frames, gain_db, note):
    """Counter ticks on the given frames (each one a shown step, at least 2 frames apart), pitch climbing."""
    frames = list(frames)
    assert len(frames) <= len(TICK_LADDER), "counter longer than the tick ladder"
    assert all(b - a >= 2 for a, b in zip(frames, frames[1:])), "ticks closer than 2 frames"
    return [(f, f"arcade-tick@{TICK_LADDER[i]}", gain_db, 0, f"{note} · tick {i + 1}/{len(frames)}")
            for i, f in enumerate(frames)]


C1 = "2016 · ELECTRONICS & TELECOM"
C2 = "2019 · B.TECH, INFORMATION TECHNOLOGY"
F3_LABEL = "PRODUCT DESIGNER · UX / UI"
F4_MARK = "2022 · KOLKATA · UX/UI DESIGNER, FORTMINDZ"
F5_MARK = "2023 · UX/UI DESIGNER, IMPERO IT"
F5_TAG = "COMPONENT LIBRARIES"
F6_MARK = "2024→NOW · PRODUCT DESIGNER, MINIORANGE · PUNE"      # the drawn arrow is one step
F6_TAG, F6_S1, F6_S2 = "MODS DESIGN SYSTEM", "ONE STROKE WEIGHT · TWO CORNER RADII", "THREE SPACING SCALES"
F7_DAYS = ["INTERVIEWS +\nJTBD", "5 FLOW VARIANTS\nIN 4 HOURS", "HI-FI ON THE\nDESIGN SYSTEM",
           "PROTOTYPE +\nDESIGN QA", "WALKTHROUGH +\nHANDOFF"]
F7_LIT = [855, 862.5, 870, 877.5, 885]
F8_TOOLS = "FIGMA · FRAMER · NOTION · ILLUSTRATOR · PHOTOSHOP · LOTTIE"
F10_LABS = [("YEARS DESIGNING", 1204), ("COMPANIES, 2 CITIES", 1238), ("PROJECTS", 1253),
            ("ENTERPRISE PRODUCTS SHIPPED", 1268)]                        # typed in ceil(n / 2) frames
F12_C1, F12_C2 = "surajit3255@gmail.com", "surajit-dutta.vercel.app"


# --------------------------------------------------------------------------- THE TABLE
CUES = [
    # ===== F1 Origin (0-120): tube powers on, the beam routes a circuit trace; two year chips grow and type =====
    (0, "crt-on", -6, 0, "F1 0: the tube powers on from black"),
    (30, "laser", -10, -0.5, "F1 30: spark at the left edge, the beam starts the trace"),
    (30, "hum-80f", -15, (-0.6, 0.35), "F1 30-110: soft hum under the draw, follows the head, gone by 110"),
    (45, "blip@C#6", -11, -0.5, "F1 45: pad A pops (378, 828)"),
    (48, "glass-tink", -10, 0, "F1 48: chip 1 bead lands, rim flashes at full strength"),
    *type_on(chip_chars(48, len(C1)), C1, -15, "F1 50-64: chip 1 types at 60 cps (even chars 51-64)"),
    (60, "blip@E6", -11, -0.4, "F1 60: pad B (498, 518)"),
    (75, "blip@F#6", -11, -0.22, "F1 75: pad C (693, 333)"),
    (90, "blip@A6", -11, 0.02, "F1 90: pad D (985, 420)"),
    (93, "glass-tink-2", -11, 0, "F1 93: chip 2 bead lands, rim flashes"),
    *type_on(chip_chars(93, len(C2)), C2, -15, "F1 95-113: chip 2 types at 60 cps (even chars 96-113)"),

    # ===== F2 Thesis (120-240): trace reroutes into a user flow, three tiles, the pinch; 232-240 is the void =====
    (135, "blip@B6", -11, 0.19, "F2 135: pad E pops (1187, 828), the head stops"),
    (146, "swish-lp", -15, 0, "F2 146-153: chip 1 melts"),
    (150, "glass-tink", -9, 0, "F2 150: tile 0 lands on pad A and flashes"),
    (150, "laser", -11, -0.45, "F2 150: the flow beam fires out of pad A"),
    (150, "hum-45f", -16, (-0.45, 0.7), "F2 150-195: soft hum under the flow draw, follows the head right"),
    (157, "swish-lp", -15, 0, "F2 157-164: chip 2 melts"),
    (165, "glass-tink-2", -10, 0, "F2 165: head reaches (985, 444), tile 1 lands and flashes"),
    (180, "glass-tink", -9, 0, "F2 180: head reaches (1591, 828), tile 2 lands and flashes"),
    (195, "blip@C#7", -11, 0.7, "F2 195: head lands on the final pad (1808, 540)"),
    (210, "swish-lp", -14, 0, "F2 210-219: tiles melt and fold into their pads"),
    (224, "laser-rev", -11, (-0.3, 0.7), "F2 224-229: the line zips back into its head (ends on the 229 flare)"),

    # ===== F3 Name (240-360): the drop =====
    (240, "gated-snare-hit", -4, 0, "F3 240: SURAJIT slams on the downbeat (hero, near the bed's snare)"),
    (240, "boom-tight", -9, 0, "F3 240: sub under the slam, cut short (the bed has its own sub)"),
    (255, "glass-tink", -8, 0, "F3 255: Tier H portrait slab condenses"),
    *type_on(steps_chars(270, 18, len(F3_LABEL)), F3_LABEL, -10, "F3 270-288: label types"),
    (285, "laser", -12, -0.4, "F3 285-297: beam runs in under the name"),
    (296, "blip@F#6", -9, 0, "F3 296: pad pops at (960, 612)"),
    (300, "laser", -8, 0.25, "F3 300: beam fires, starts tracing his silhouette"),
    (300, "hum-34f", -14, (0.05, 0.85), "F3 300-333: soft hum under the trace, follows the head out right"),

    # ===== F4 Fortmindz (360-480): beam threads CART -> ADDRESS -> PAY -> DONE, then fires off right =====
    *type_on(steps_chars(372, 20, len(F4_MARK)), F4_MARK, -10, "F4 372-392: marker types top left"),
    (374, "blip@E6", -8, -0.3, "F4 374: CART pad pops (head brakes into it on 375)"),
    (375, "glass-tink", -11, 0, "F4 375: CART chip springs in, rim light"),
    (375, "swish", -14, 0, "F4 375: soft air under CART"),
    (389, "blip@F#6", -8, -0.05, "F4 389: ADDRESS pad pops"),
    (390, "glass-tink-2", -11, 0, "F4 390: ADDRESS chip springs in"),
    (390, "swish", -14, 0, "F4 390: soft air under ADDRESS"),
    (404, "blip@A6", -8, 0.2, "F4 404: PAY pad pops"),
    (405, "glass-tink", -11, 0, "F4 405: PAY chip springs in"),
    (405, "swish", -14, 0, "F4 405: soft air under PAY"),
    (419, "blip@B6", -8, 0.4, "F4 419: DONE pad pops"),
    (420, "glass-tink-2", -11, 0, "F4 420: DONE chip springs in"),
    (420, "swish", -14, 0, "F4 420: soft air under DONE"),
    (420, "arcade-blip", -8, 0, "F4 420: DONE lights, its edge light runs 420-442"),
    (453, "laser", -9, (0.15, 0.9), "F4 453: beam fires right, head off the right edge ~463"),

    # ===== F5 Impero IT (480-600): shells condense mid-pan, parts snap into a component sheet =====
    *type_on(steps_chars(480, 20, len(F5_MARK)), F5_MARK, -10, "F5 480-500: marker types"),
    (480, "glass-tink", -8, 0, "F5 480: shell p0 (food delivery) condenses mid-pan"),
    (480, "swish", -14, (0.8, 0.3), "F5 480: soft air, p0 slides in from the right"),
    (495, "glass-tink-2", -9, 0, "F5 495: shell p1 (healthcare) condenses while sliding"),
    (495, "swish", -14, (0.8, 0.3), "F5 495: soft air, p1 slides in"),
    (510, "glass-tink", -8, 0, "F5 510: shell p2 (events) condenses as the camera stops"),
    (510, "swish", -14, (0.5, 0.1), "F5 510: soft air, p2 settles"),
    (518, "click", -8, 0, "F5 518: tap ring on the order button"),
    (526, "click", -8, 0, "F5 526: tap flips the reminder toggle"),
    (540, "laser", -12, 0.2, "F5 540: parts light cyan, the sheet frame draws out of the pad (1180, 610)"),
    (546, "snap", -7, 0, "F5 546: button lands in the sheet (guide flash)"),
    (550, "snap", -8, 0, "F5 550: chip lands"),
    (554, "snap", -7, 0, "F5 554: toggle lands"),
    (558, "snap", -8, 0, "F5 558: input lands"),
    (562, "snap", -7, 0, "F5 562: list row lands"),
    (566, "snap", -8, 0, "F5 566: card lands"),
    (570, "snap", -7, 0, "F5 570: segmented control lands (7 of 7)"),
    (570, "synth-stab", -7, 0, "F5 570: the sheet locks (cyan flash)"),
    *type_on(steps_chars(570, 9.6, len(F5_TAG)), F5_TAG, -10, "F5 570-580: tag types"),

    # ===== F6 miniOrange (600-780): dolly over the floor, two glass captures fly past, hero plate =====
    (600, "whoosh-retro", -7, 0, "F6 600: chapter transition, dolly into the floor (file's own L->R sweep)"),
    (600, "glass-tink", -10, 0, "F6 600: card C0 (UEM data discovery) condenses, rim light"),
    (615, "glass-tink-2", -9, 0, "F6 615: card C1 (UEM designed screens) condenses"),
    (630, "whoosh-flyby", -13, (-0.15, -0.9), "F6 638-646: C0 flies past up-left (peak lands ~644)"),
    (645, "whoosh-flyby", -13, (0.15, 0.9), "F6 653-661: C1 flies past right (peak lands ~659)"),
    (660, "glass-tink", -8, 0, "F6 660: hero plate condenses as Tier H"),
    *type_on(steps_chars(662, 28, len(F6_MARK)), F6_MARK, -10, "F6 662-690: marker types top left"),
    *type_on(steps_chars(725, 8, len(F6_TAG)), F6_TAG, -10, "F6 725-733: spec tag types, sparse", min_gap=2),
    *type_on(steps_chars(733, 18, len(F6_S1)), F6_S1, -10, "F6 733-751: spec line 1 types, sparse", min_gap=2),
    (735, "glass-tink-2", -9, 0, "F6 735: design-system cover card condenses"),
    *type_on(steps_chars(751, 10, len(F6_S2)), F6_S2, -10, "F6 751-761: spec line 2 types, sparse", min_gap=2),

    # ===== F7 Five days (780-960): 15 cells fold to 5, tiles condense, days light, counter lands on 900 =====
    *[(795 + 3 * m, "click-lo", -7 - (m % 2), 0, f"F7 {795 + 3 * m}: cell fold {m + 1}/10 snaps shut")
      for m in range(10)],
    *[(832 + 2 * i, "glass-tink" if i % 2 == 0 else "glass-tink-2", -13, 0, f"F7 {832 + 2 * i}: tile D{i + 1} condenses")
      for i in range(5)],
    (840, "synth-stab", -6, 0, "F7 840: arrow fires, '5 DAYS' slams"),
    (855, "blip@E6", -3, 0, "F7 855: D1 lights (reward arpeggio 1/5)"),
    (862.5, "blip@F#6", -3, 0, "F7 862.5: D2 lights (2/5)"),
    (870, "blip@A6", -3, 0, "F7 870: D3 lights (3/5)"),
    (877.5, "blip@B6", -3, 0, "F7 877.5: D4 lights (4/5)"),
    (885, "blip@C#7", -3, 0, "F7 885: D5 lights (5/5, lands on C#, the 3rd of A)"),
    *[row for i, (lit, txt) in enumerate(zip(F7_LIT, F7_DAYS))
      for row in type_on(steps_chars(lit, 9, len(txt)), txt, -13, f"F7 D{i + 1} label types in its tile", min_gap=2)],
    *ticks(range(887, 900, 2), -15, "F7 887-899: counter steps +5 a frame"),
    (900, "snap", -7, 0, "F7 900: ~70% lands volt, FASTER slams (bed has the stab + crash)"),
    (900, "hum-45f", -17, (-0.8, 0.85), "F7 900-945: soft hum as the persisted beam re-draws under the row"),
    (945, "blip@B6", -9, 0.7, "F7 945: beam stops on its pad at x 1800"),

    # ===== F8 What I do (960-1080): seven disciplines step in on the eighths, glass selector follows =====
    (960, "blip-hi@F#6", -8, 0, "F8 960: PRODUCT DESIGN on the cut (skill run 1/7)"),
    (967.5, "blip-hi@A6", -8, 0, "F8 967.5: INTERACTION DESIGN (2/7)"),
    (975, "blip-hi@B6", -8, 0, "F8 975: DESIGN SYSTEMS (3/7)"),
    (982.5, "blip-hi@C#7", -8, 0, "F8 982.5: UX RESEARCH (4/7)"),
    (990, "blip-hi@E7", -9, 0, "F8 990: PROTOTYPING (5/7)"),
    (997.5, "blip-hi@F#7", -9, 0, "F8 997.5: INFORMATION ARCHITECTURE (6/7)"),
    (1005, "blip-hi@A7", -9, 0, "F8 1005: USABILITY TESTING (7/7, the 3rd of F#m)"),
    (1008, "glass-tink", -8, 0, "F8 1008: selector settles on the last word"),
    (1020, "laser", -9, (-0.8, 0.9), "F8 1020: beam fires down the rail, corner 1024, exits right 1038"),
    *type_on(steps_chars(1024, 29, len(F8_TOOLS)), F8_TOOLS, -10, "F8 1025-1053: toolbox types, sparse",
             min_gap=2),

    # ===== F9 How I work (1080-1200): a pulse travels left -> right through five beads =====
    (1086, "swish", -13, (-1.0, -0.6), "F9 1086-1095: pulse appears at the left edge, slows into bead 1"),
    (1089, "glass-tink", -15, 0, "F9 1089: the move lands, bead glass wobbles once (very quiet)"),
    (1095, "blip@E6", -8, -0.6, "F9 1095: DISCOVER & FRAME lights"),
    (1099, "swish", -13, (-0.6, -0.35), "F9 1099-1110: pulse travels to bead 2"),
    (1110, "blip@F#6", -8, -0.35, "F9 1110: RESEARCH & TEST lights"),
    (1114, "swish", -13, (-0.35, -0.1), "F9 1114-1125: pulse travels to bead 3"),
    (1125, "blip@A6", -8, -0.1, "F9 1125: DEFINE THE SYSTEM lights"),
    (1129, "swish", -13, (-0.1, 0.2), "F9 1129-1140: pulse travels to bead 4"),
    (1140, "blip@B6", -8, 0.2, "F9 1140: DESIGN & REFINE lights"),
    (1144, "swish", -13, (0.2, 0.45), "F9 1144-1155: pulse travels to bead 5"),
    (1155, "blip@C#7", -8, 0.45, "F9 1155: DELIVER & SUPPORT lights"),
    (1159, "swish", -12, (0.45, 1.0), "F9 1159-1167: pulse fires out right, accelerating"),

    # ===== F10 Numbers (1200-1320): four counters land on the bed's four stabs, then drop into the ledger =====
    (1200, "glass-tink", -9, 0, "F10 1200: the Tier H plate condenses on the cut, rim light sweeps"),
    *[row for i, (txt, t0) in enumerate(F10_LABS)
      for row in type_on(steps_chars(t0, math.ceil(len(txt) / 2), len(txt)), txt, -10,
                         f"F10 {t0}: label {i + 1} types", min_gap=2)],
    *ticks([1221, 1223, 1226], -15, "F10 1221-1226: 4 YEARS counts 1, 2, 3"),
    (1230, "snap", -7, 0, "F10 1230: 4 lands volt (bed stab)"),
    (1236, "swish-lp", -13, 0, "F10 1236-1245: 4 drops into ledger row 1"),
    *ticks([1239, 1241], -15, "F10 1239-1241: 3 COMPANIES counts 1, 2"),
    (1245, "snap", -7, 0, "F10 1245: 3 lands volt (bed stab)"),
    (1251, "swish-lp", -13, 0, "F10 1251-1260: 3 drops into ledger row 2"),
    *ticks([1253, 1255, 1257, 1259], -15, "F10 1253-1259: 58 PROJECTS rolls (changes every frame)"),
    (1260, "snap", -7, 0, "F10 1260: 58 lands volt (bed stab)"),
    (1266, "swish-lp", -13, 0, "F10 1266-1275: 58 drops into ledger row 3"),
    *ticks([1268, 1270, 1272, 1274], -15, "F10 1268-1274: 12+ rolls (changes every frame)"),
    (1275, "snap", -7, 0, "F10 1275: 12+ lands volt, the + appears (bed stab)"),
    (1290, "laser", -13, (-0.6, 0.3), "F10 1290: beam head runs in along the rail under the lockup"),
    (1290, "hum-15f", -16, (-0.6, 0.3), "F10 1290-1305: soft hum under it, gone as the tape stops"),

    # ===== F11 The principle (1320-1380): the breakdown, almost silent; 1377-1380 is the breath =====
    (1320, "tape-rewind", -5, 0, "F11 1320: reversed, stretched tape-stop as the knot starts to give"),
    (1340, "sine-calm", -18, 0, "F11 1340: one pure C#6 sine swelling into 1350, the line straight (ends 1376)"),
    (1365, "crt-off", -7, 0, "F11 1365: the tube switches off (reversed crt-on, ends by 1377)"),

    # ===== F12 Invitation (1380-1560): punch, end card, routed signature onto the final chord =====
    (1380, "whoosh-retro", -8, 0, "F12 1380: the punch line opens the tube, 8 dB under the bed's crash"),
    (1388, "gated-snare-hit", -4, 0, "F12 1388: SURAJIT slams in (final lift)"),
    (1410, "glass-tink", -8, 0, "F12 1410: status chip condenses on the floor, its rim light runs"),
    *type_on(rate_chars(1425.5, 0.5, len(F12_C1)), F12_C1, -10, "F12 1426-1435: email types"),
    (1440, "laser", -8, -0.35, "F12 1440: signature leg 1 launches out of the slab"),
    (1440, "hum-15f", -12, (-0.4, 0.2), "F12 1440-1455: soft hum under leg 1, follows it to pad A"),
    *type_on(rate_chars(1441.5, 0.5, len(F12_C2)), F12_C2, -10, "F12 1442-1453: site types"),
    (1455, "blip@B6", -8, 0.2, "F12 1455: head brakes into pad A on the beat"),
    (1470, "hum-30f", -13, (0.2, 0.8), "F12 1470-1500: leg 2 relights at pad A (fades in), hum to pad B"),
    (1505, "shimmer@+2", -8, 0, "F12 1505: shine sweep across slab and chip (shimmer up a tone: F#-A-C#)"),
]

# --------------------------------------------------------------------------- rules
SILENCES = [(232, 240), (1377, 1380)]
LAST_START = 1505            # nothing new after this, except the shimmer tail starting on it
MAX_PER_FRAME = 3
THINNED = []                 # keys cues() dropped, with the reason (printed by main())


def cues():
    """The table as Cue tuples, time-sorted (stable, so same-frame rows keep table order), keys thinned and
    their variants assigned."""
    cs = sorted((Cue(*c) for c in CUES), key=lambda c: c.frame)
    THINNED.clear()
    tick_frames = [c.frame for c in cs if c.name.startswith("arcade-tick")]
    out, key_frames = [], set()
    for c in cs:
        if c.name == KEY:
            if any(abs(c.frame - t) <= 1 for t in tick_frames):
                THINNED.append((c.frame, "within 1 f of a counter tick"))
                continue
            if int(c.frame) in key_frames:
                THINNED.append((c.frame, "second key on the frame"))
                continue
            key_frames.add(int(c.frame))
        out.append(c)
    per = Counter(int(c.frame) for c in out)
    final = []
    for c in out:
        if c.name == KEY and per[int(c.frame)] > MAX_PER_FRAME:
            per[int(c.frame)] -= 1
            THINNED.append((c.frame, f"frame over {MAX_PER_FRAME} starts"))
            continue
        final.append(c)
    rng, prev = random.Random(2019), None
    for i, c in enumerate(final):
        if c.name == KEY:
            k = rng.choice([v for v in range(6) if v != prev])
            prev = k
            final[i] = c._replace(name=f"key-{k}")
    return final


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
    if THINNED:
        print(f"thinned {len(THINNED)} keys: " + ", ".join(f"{f:g} ({why})" for f, why in THINNED))
    probs = check(cs)
    print("rule check:", "OK" if not probs else "\n  " + "\n  ".join(probs))
    return 1 if probs else 0


if __name__ == "__main__":
    sys.exit(main())
