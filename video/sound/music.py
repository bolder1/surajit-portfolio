"""120 BPM dark/futuristic bed, arranged to the reel's section map (50 s, 25 bars)."""
import os
import numpy as np
from scipy import signal
from dsp import SR, adsr, bp, env_exp, hp, lp, noise, norm, reverb, sat, stereo, write

BPM = 120
BEAT = 60 / BPM          # 0.5 s
BAR = 4 * BEAT           # 2 s
DUR = 50.0
N = int(DUR * SR)
out = np.zeros((N, 2))

def at(t):
    return int(round(t * SR))

def add(x, t, gain=1.0):
    x = stereo(x) if x.ndim == 1 else x
    i = at(t)
    if i >= N:
        return
    L = min(len(x), N - i)
    out[i:i + L] += x[:L] * gain

def hz(note):  # MIDI → Hz
    return 440.0 * 2 ** ((note - 69) / 12)

# ---------- instruments ----------
def kick():
    d = 0.45
    tt = np.arange(int(d * SR)) / SR
    f = 42 + 110 * np.exp(-tt / 0.035)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(len(tt), 0.16)
    x[: int(0.004 * SR)] += hp(noise(int(0.004 * SR)), 2000) * 0.5
    return sat(x, 2.0)

def clap():
    d = 0.35
    n = int(d * SR)
    x = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR)
        x[i:] += bp(noise(n - i), 900, 5000) * env_exp(n - i, 0.012 if k < 2 else 0.12)
    return reverb(x * 0.8, 0.9, 0.25)[:n + int(0.3 * SR)]

def hat(open_=False):
    d = 0.25 if open_ else 0.06
    n = int(d * SR)
    return hp(noise(n), 7000) * env_exp(n, 0.07 if open_ else 0.012)

def saw_voice(f, d, detune=0.12, cutoff=900, voices=3):
    n = int(d * SR)
    tt = np.arange(n) / SR
    x = sum(signal.sawtooth(2 * np.pi * f * (1 + detune / 100 * (v - (voices - 1) / 2)) * tt + v) for v in range(voices)) / voices
    return lp(x, cutoff, 2)

def pad(notes, d, cutoff=1400, gain=0.22):
    n = int(d * SR)
    l = np.zeros(n)
    r = np.zeros(n)
    for k, m in enumerate(notes):
        f = hz(m)
        l += saw_voice(f, d, 0.25, cutoff, 3)
        r += saw_voice(f * 1.0015, d, 0.25, cutoff, 3)
    e = adsr(n, 0.35, 0.6)
    st = np.stack([l, r], 1) * e[:, None] * gain / len(notes)
    return st

def bass_note(m, d, cutoff=500):
    n = int(d * SR)
    tt = np.arange(n) / SR
    f = hz(m)
    x = np.sin(2 * np.pi * f * tt) * 0.8 + lp(signal.square(2 * np.pi * f * tt), cutoff) * 0.35
    return sat(x * adsr(n, 0.004, 0.03), 1.4)

def pluck(m, d=0.22, cutoff=3000):
    n = int(d * SR)
    tt = np.arange(n) / SR
    f = hz(m)
    x = signal.square(2 * np.pi * f * tt, 0.3) * 0.5 + np.sin(2 * np.pi * f * 2 * tt) * 0.3
    return lp(x, cutoff) * env_exp(n, 0.07)

def drone(d):
    n = int(d * SR)
    tt = np.arange(n) / SR
    x = saw_voice(hz(33), d, 0.4, 240, 4) + saw_voice(hz(40), d, 0.4, 260, 4) * 0.6
    x *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.11 * tt)
    return stereo(x, width=14)

def heart():
    d = 0.6
    n = int(d * SR)
    x = np.zeros(n)
    for o, g in [(0, 1.0), (0.2, 0.65)]:
        i = int(o * SR)
        x[i:] += np.sin(2 * np.pi * 47 * np.arange(n - i) / SR) * env_exp(n - i, 0.08) * g
    return sat(x, 1.6)

# ---------- arrangement ----------
# chord roots (MIDI): Am – F – C – G, two bars each
PROG = [(45, [57, 60, 64, 67, 71]), (41, [53, 57, 60, 64, 69]), (48, [55, 60, 64, 67, 72]), (43, [55, 59, 62, 67, 71])]
SIL = [(13.733, 14.0), (39.733, 40.0)]  # near-silence before the two big hits

def bar_t(b):
    return b * BAR

# drone: bars 0–6, and the breakdown bar 18–19 lightly
add(drone(14.2), 0, 0.17)
add(drone(4.0), bar_t(18), 0.18)

# heartbeat sub on downbeats bars 0–3, every beat 1 and 3 in bars 4–6
for b in range(0, 4):
    add(heart(), bar_t(b), 0.42)
for b in range(4, 7):
    for k in (0, 2):
        add(heart(), bar_t(b) + k * BEAT, 0.36)

# hats: 8ths bars 2–3, 16ths bars 4–6 (quiet), full groove later
for b in range(2, 4):
    for k in range(8):
        add(hat(), bar_t(b) + k * BEAT / 2 + (0.012 if k % 2 else 0), 0.06)
for b in range(4, 7):
    for k in range(16):
        add(hat(), bar_t(b) + k * BEAT / 4, 0.04 + 0.03 * (k % 4 == 2))

# pulse bass bars 2–6 (A), filter opening
for b in range(2, 7):
    steps = 8 if b < 4 else 16
    for k in range(steps):
        t = bar_t(b) + k * BAR / steps
        cut = 300 + (t - 4.0) / 10.0 * 1600
        add(bass_note(33, BAR / steps * 0.8, max(300, cut)), t, 0.16 + 0.08 * (t - 4.0) / 10.0)

GROOVE = list(range(7, 18)) + [20, 21, 22]
for b in GROOVE:
    chord = PROG[((b - 7) // 2) % 4]
    for k in range(4):
        t = bar_t(b) + k * BEAT
        if b == 22 and k >= 2:
            continue
        add(kick(), t, 0.9)
        if k in (1, 3):
            add(clap(), t, 0.38)
    for k in range(16):
        t = bar_t(b) + k * BEAT / 4
        add(hat(open_=(k % 4 == 2)), t, 0.09 if k % 4 == 2 else 0.06)
    # sub bass: offbeat 8ths (pumping) on chord root
    for k in range(8):
        t = bar_t(b) + k * BEAT / 2
        add(bass_note(chord[0] - 12 + 12, BEAT / 2 * 0.85, 600), t + (BEAT / 4 if k % 2 == 0 else 0) * 0, 0.36 if k % 2 else 0.22)
    if (b - 7) % 2 == 0:
        add(pad(chord[1], 2 * BAR + 0.6, 1600 if b < 20 else 2400, 0.26 if b < 20 else 0.32), bar_t(b), 1.0)
    # arp from bar 11
    if b >= 11:
        notes = chord[1] + [chord[1][0] + 12, chord[1][2] + 12]
        for k in range(16):
            m = notes[(k * 3) % len(notes)] + 12
            add(pluck(m, 0.2, 2600 if b < 20 else 4200), bar_t(b) + k * BEAT / 4, 0.07)

# breakdown bar 18 (chaos): gated glitch stutter on the pad, no kick
rng = np.random.default_rng(3)
chaos = pad([57, 58, 63, 64, 70], BAR, 2600, 0.5)
gate = np.repeat((rng.random(32) > 0.45).astype(float), int(BAR / 32 * SR) + 1)[: len(chaos)]
add(chaos * gate[:, None], bar_t(18), 0.6)
for k in range(16):
    if rng.random() > 0.5:
        add(hat(), bar_t(18) + k * BEAT / 4, 0.12)
# calm bar 19: clean pad Fmaj9, soft
add(pad([53, 57, 60, 64, 67], BAR + 1.0, 1200, 0.3), bar_t(19), 1.0)

# outro bars 23–24: final chord swells & fades
fin = pad([45, 52, 57, 60, 64, 71], 6.5, 1800, 0.34)
add(fin, bar_t(22) + BEAT * 2, 1.0)
add(heart(), bar_t(23), 0.7)

# ---------- sidechain duck on kicks ----------
duck = np.ones(N)
for b in GROOVE:
    for k in range(4):
        i = at(bar_t(b) + k * BEAT)
        L = int(0.22 * SR)
        seg = 1 - 0.45 * np.exp(-np.arange(L) / SR / 0.06)
        duck[i:i + L] = np.minimum(duck[i:i + L], seg[: max(0, min(L, N - i))])
# keep kick itself un-ducked: re-render kicks after duck (simple approach: duck everything, kicks are short transients)
out *= duck[:, None]

# master glue
out = reverb(out, 1.2, 0.12, tone=6000)[:N]
for a, b in SIL:
    i, j = at(a), at(b)
    ramp = int(0.03 * SR)
    out[i - ramp:i] *= np.linspace(1, 0.03, ramp)[:, None]
    out[i:j] *= 0.03
# final fade
fl = at(4.0)
out[-fl:] *= np.linspace(1, 0, fl)[:, None] ** 1.5
out = np.tanh(out * 1.1)

os.makedirs("../public/music", exist_ok=True)
write("../public/music/bed.wav", out, peak_db=-2.0)
rms = np.sqrt(np.mean(out ** 2))
print("bed.wav", out.shape, "rms dBFS (pre-norm):", 20 * np.log10(rms + 1e-9))
