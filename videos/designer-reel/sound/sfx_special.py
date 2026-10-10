#!/usr/bin/env python3
"""Sound bank for the mix: the SFX files plus the derived and special sounds, all synthesised.

    python3 sound/sfx_special.py    # writes the four special sounds to assets/sfx/ for auditioning

`load(name)` returns a float stereo buffer (48 kHz) for any name used in sound/cues.py:

  <file>            any assets/sfx/<file>.wav, as is
  <name>@<NOTE>     resampled so its base pitch lands on NOTE (e.g. blip@C#6, arcade-tick@E5)
  <name>@<+/-st>    resampled by semitones (e.g. shimmer@+2)
  swish-lp          low-passed swish (glass slides / folds; quieter than appearances)
  arcade-tick       the first 0.10 s of arcade-blip, for counters (no echo tail)
  boom-tight        boom.wav cut to ~0.6 s, so the name slam stays tight under the bed's own sub
  whoosh-flyby      whoosh-retro folded to mono with a Doppler pitch bend (approach up, recede down);
                    the cue's pan (a, b) then moves it with the screen
  tape-rewind       F11: tape-stop.wav reversed and stretched x1.5 (a fifth down), the wind-up only
  sine-calm         F11: one pure C#6 sine, 1.2 s, slow attack and release
  crt-off           F11: the first 0.38 s of crt-on.wav reversed (the power-off blip)
  laser-rev         F2: the laser's dive synthesised backwards and dry, 5 f: a rising zip as the line
                    retracts into its head (the inverse of a beam firing)
  hum-<N>f          soft electric hum under a beam draw, N frames long, fading out

Imports the shared toolkit ../../video/sound/dsp.py read-only (via compose.py's sys.path entry).
"""
import os
import re
import sys
from functools import lru_cache

import numpy as np
from scipy import signal
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True   # keep sound/ and ../../video free of __pycache__
sys.path.insert(0, HERE)
import compose as C  # noqa: E402  (puts ../../video/sound on sys.path)
from dsp import SR, autopan, bp, hp, lp  # noqa: E402

REEL = C.REEL
SFX_DIR = os.path.join(REEL, "assets", "sfx")
FPS = 30
S = C.S

NOTE_PC = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
F_SHARP_MINOR_PENTA = {6, 9, 11, 1, 4}  # F#, A, B, C#, E

# measured base pitch (Hz) of the tonal sounds that cues pitch-shift by note name
BASE_HZ = {
    "blip": 1800.0,               # sine blip (≈ A6 + 0.38 st)
    "blip-hi": 2800.0,            # sine blip (≈ F7)
    "arcade-blip": C.hz(85),      # C#6 -> F#6 chirp; the first note is the reference
    "arcade-tick": C.hz(85),
    "glass-tink": C.hz(90),       # F#6
    "glass-tink-2": C.hz(97),     # C#7
}


def note_midi(note):
    m = re.fullmatch(r"([A-G]#?)(-?\d)", note)
    if not m:
        raise ValueError(f"bad note {note!r}")
    return NOTE_PC[m.group(1)] + 12 * (int(m.group(2)) + 1)


def read_wav(path):
    sr, d = wavfile.read(path)
    assert sr == SR, (path, sr)
    x = d.astype(float) / (32768.0 if d.dtype == np.int16 else 1.0)
    return C.to_st(x)


def fade(x, fin=0.002, fout=0.005):
    x = x.copy()
    a, b = max(1, int(fin * SR)), max(1, int(fout * SR))
    x[:a] *= np.linspace(0, 1, a)[:, None]
    x[-b:] *= np.linspace(1, 0, b)[:, None]
    return x


def resample_semitones(x, st):
    """Tape-style pitch shift: play faster/slower by 2^(st/12) (length changes)."""
    if abs(st) < 1e-6:
        return x
    rate = 2 ** (st / 12)
    n = max(8, int(round(len(x) / rate)))
    y = signal.resample(np.vstack([x, np.zeros((S(0.01), 2))]), int(round((len(x) + S(0.01)) / rate)), axis=0)
    return y[:n]


# ------------------------------------------------------------------ derived sounds
def swish_lp():
    x = read_wav(os.path.join(SFX_DIR, "swish.wav"))
    return np.stack([lp(lp(x[:, c], 2200), 2200) for c in range(2)], 1)


def arcade_tick():
    x = read_wav(os.path.join(SFX_DIR, "arcade-blip.wav"))[: S(0.10)]
    return fade(x, 0.001, 0.015)


def boom_tight():
    x = read_wav(os.path.join(SFX_DIR, "boom.wav"))[: S(0.65)].copy()
    t = np.arange(len(x)) / SR
    x *= np.where(t < 0.15, 1.0, np.cos(np.clip((t - 0.15) / 0.5, 0, 1) * np.pi / 2) ** 2)[:, None]
    return x


def whoosh_flyby(depth=0.05, tc=0.45, w=0.09):
    x = read_wav(os.path.join(SFX_DIR, "whoosh-retro.wav")).mean(1)
    n = len(x)
    t = np.arange(n) / SR
    rate = 1 + depth * np.tanh(-(t - tc) / w)        # >1 while approaching, <1 once it has passed
    pos = np.cumsum(rate) - rate[0]
    pos = pos[pos < n - 1]
    y = np.interp(pos, np.arange(n), x)
    return C.to_st(y)  # mono in both channels; the cue's pan tuple moves it


def tape_rewind(stretch=1.5, keep=1.25):
    """F11: the bed's tape-stop played backwards and slowed: a wind-up that never quite arrives."""
    x = read_wav(os.path.join(SFX_DIR, "tape-stop.wav"))[::-1]
    y = signal.resample(x, int(len(x) * stretch), axis=0)[: S(keep)]   # x1.5 slower = a fifth down
    y = np.stack([lp(lp(y[:, c], 2600), 2600) for c in range(2)], 1)
    t = np.arange(len(y)) / SR
    y *= np.where(t < 0.7, 1.0, np.cos(np.clip((t - 0.7) / (keep - 0.7), 0, 1) * np.pi / 2) ** 2)[:, None]
    wet = C.conv(y, C.make_ir(1.6, 4000, 61, 0.02))[: len(y) + S(0.2)]
    out = np.zeros((len(wet), 2))
    out[: len(y)] += y
    out += wet * 0.35
    k = S(0.2)
    out[-k:] *= np.linspace(1, 0, k)[:, None] ** 2
    return out


def sine_calm(note="C#6", dur=1.2, att=0.38, rel=0.55):
    """F11: a single pure sine as the line goes straight. C# is the 3rd of the breakdown's Amaj9."""
    f = C.hz(note_midi(note))
    n = S(dur)
    t = np.arange(n) / SR
    env = np.ones(n)
    a, r = S(att), S(rel)
    env[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    env[-r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return C.to_st(np.sin(2 * np.pi * f * t) * env)


def crt_off(length=0.38):
    """F11: the tube switching off = the start of crt-on (thunk, zip, crackle) run backwards."""
    x = read_wav(os.path.join(SFX_DIR, "crt-on.wav"))[: S(length)][::-1]
    return fade(x, 0.004, 0.006)


def laser_rev(frames=5):
    """F2: the line retracting into its head. The laser's own recipe (sfx_retro.laser: pulse + sine diving
    from 2.7 kHz to 160 Hz) run backwards and kept dry: a zip that rises and swells for `frames` frames and is
    loudest on its last one, where it stops (12 ms release) on the flare. No echo, so nothing smears into the
    silence that follows."""
    n = S(frames / FPS)
    t = np.arange(n) / SR
    f = 160 + 2600 * np.exp(-t / 0.07)
    mod = np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.6
    x = C.pulse(f * (1 + 0.04 * mod), n, 0.5) * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4
    x = lp(x * np.exp(-t / 0.12), 8000)[::-1]
    r = S(0.012)
    x[-r:] *= np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return C.to_st(x)


def hum(frames, f0=None, seed=5):
    """Soft electric hum under a beam draw. Mains-style partial stack, but tuned to F# (46.25 Hz
    fundamental, 92.5 / 138.75 Hz carrying the buzz) instead of a literal 60 Hz, which sits a
    quarter-tone off B and would rub against F# minor. Skips the 5th and 7th partials (A#, E-ish)
    so it never fights the chords. Fades out over its second half (the line settles)."""
    f0 = f0 or C.hz(30)
    r = np.random.default_rng(seed)
    n = S(frames / FPS)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k, a in [(1, 0.35), (2, 1.0), (3, 0.6), (4, 0.42), (6, 0.22), (8, 0.12)]:
        x += a * np.sin(2 * np.pi * k * f0 * t + r.uniform(0, 2 * np.pi))
    flutter = 1 + 0.12 * np.sin(2 * np.pi * 5.3 * t) + 0.06 * np.sin(2 * np.pi * 11.9 * t + 1.0)
    x = bp(x * flutter, 60, 900)
    # faint electric crackle riding on it
    cr = np.zeros(n)
    idx = r.choice(n, max(1, int(n / SR * 26)), replace=False)
    cr[idx] = r.uniform(-1, 1, len(idx))
    cr = bp(cr, 1500, 6000) * 2.5
    x = x + cr * 0.25
    env = np.minimum(1, t / 0.12)
    p = t / t[-1]
    env *= np.where(p < 0.35, 1.0, np.cos(np.clip((p - 0.35) / 0.65, 0, 1) * np.pi / 2) ** 1.6)
    return C.to_st(x * env)


DERIVED = {
    "swish-lp": swish_lp,
    "arcade-tick": arcade_tick,
    "boom-tight": boom_tight,
    "whoosh-flyby": whoosh_flyby,
    "tape-rewind": tape_rewind,
    "sine-calm": sine_calm,
    "crt-off": crt_off,
    "laser-rev": laser_rev,
}


@lru_cache(maxsize=None)
def _base(name):
    if name in DERIVED:
        return DERIVED[name]()
    m = re.fullmatch(r"hum-(\d+)f", name)
    if m:
        return hum(int(m.group(1)))
    path = os.path.join(SFX_DIR, f"{name}.wav")
    if not os.path.exists(path):
        raise KeyError(f"unknown sound {name!r} (no {path})")
    return read_wav(path)


def pitch_of(name):
    """Semitone shift implied by a cue name, and the plain base name."""
    if "@" not in name:
        return name, 0.0
    base, tag = name.split("@", 1)
    if re.fullmatch(r"[+-]\d+(\.\d+)?", tag):
        return base, float(tag)
    if base not in BASE_HZ:
        raise KeyError(f"{base!r} has no base pitch for @{tag}")
    return base, note_midi(tag) - (69 + 12 * np.log2(BASE_HZ[base] / 440.0))


@lru_cache(maxsize=None)
def load(name):
    base, st = pitch_of(name)
    x = _base(base)
    return resample_semitones(x, st) if st else x


def write(path, x, peak_db=-1.0):
    x = C.to_st(np.asarray(x, float))
    x = x / (np.max(np.abs(x)) + 1e-12) * 10 ** (peak_db / 20)
    wavfile.write(path, SR, np.round(x * 32767).astype(np.int16))


def main():
    for name in ["tape-rewind", "sine-calm", "crt-off", "hum-80f", "whoosh-flyby"]:
        write(os.path.join(SFX_DIR, f"{name}.wav"), fade(load(name)))
    print("wrote tape-rewind, sine-calm, crt-off, hum-80f, whoosh-flyby to", SFX_DIR)


if __name__ == "__main__":
    main()
