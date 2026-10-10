#!/usr/bin/env python3
"""The bed for V1 KEY LIGHT. Every sample is synthesised here in numpy/scipy; nothing is sampled or generated.

199.2 s, 48 kHz 16-bit stereo, 100 BPM at 30 fps (beat = 18 f, bar = 72 f), 83 bars, F# minor.
The arrangement is data: SECTIONS, CHORD_BY_BAR, HOOK and the per-bar plan in plan() follow the
bar map in v6/V1-DIRECTION.md section 6.2. Every event sits on the frames that map gives.

    python3 sound/compose_v6.py            # writes public/music/bed-v6.wav and bed-v6-hits.json
    python3 sound/compose_v6.py --png DIR  # also writes DIR/bed-v6.png, the envelope plot

Synth code (oscillators, drums, bass, pluck, pad, lead, riser, limiter, loudness meter) is carried over
from the earlier reels' compose scripts; the snare here is dry, the arp is quarter notes, and the whole
thing is slower and calmer. The output is left at about -17 LUFS integrated: the film is mastered after
the render with loudnorm, not here.
"""
import json
import os
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dsp import SR, bp, hp, lp, sat, sweep_filter  # noqa: E402

VIDEO = os.path.dirname(HERE)
MUSIC_DIR = os.path.join(VIDEO, "public", "music")

FPS = 30
BPM = 100
BEAT = 60 / BPM          # 0.6 s = 18 frames
BAR = 4 * BEAT           # 2.4 s = 72 frames
STEP = BEAT / 4          # one 16th = 0.15 s = 4.5 frames
BARS = 83
DUR_F = BARS * 72        # 5976 frames
DUR = DUR_F / FPS        # 199.2 s
N = int(round(DUR * SR))  # 9 561 600 samples
TAIL = int(5 * SR)       # room for note releases past the end before the crop

R = np.random.default_rng(2026)


def S(t):
    return int(round(t * SR))


def fr(f):
    return f / FPS


def bt(bar, beat=0.0):
    return bar * BAR + beat * BEAT


def bf(bar, beat=0.0):
    """Frame of a bar and beat."""
    return bar * 72 + beat * 18


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def wn(n):
    return R.uniform(-1, 1, n)


# ------------------------------------------------------------------ oscillators
def _blep(ph, dt):
    y = np.zeros_like(ph)
    m = ph < dt
    x = ph[m] / dt[m]
    y[m] = 2 * x - x * x - 1
    m = ph > 1 - dt
    x = (ph[m] - 1) / dt[m]
    y[m] = x * x + 2 * x + 1
    return y


def _phase(f, n, ph0):
    f = np.asarray(f, float)
    if f.ndim == 0:
        f = np.full(n, float(f))
    dt = f / SR
    ph = (ph0 + np.cumsum(dt) - dt[0]) % 1.0
    return ph, dt


def saw(f, n=None, ph0=0.0):
    ph, dt = _phase(f, n, ph0)
    return 2 * ph - 1 - _blep(ph, dt)


def pulse(f, n=None, w=0.5, ph0=0.0):
    ph, dt = _phase(f, n, ph0)
    ph2 = (ph + w) % 1.0
    return (2 * ph - 1 - _blep(ph, dt)) - (2 * ph2 - 1 - _blep(ph2, dt))


def rbj_lp(fc, q):
    w0 = 2 * np.pi * fc / SR
    c, al = np.cos(w0), np.sin(w0) / (2 * q)
    b = np.array([(1 - c) / 2, 1 - c, (1 - c) / 2])
    a = np.array([1 + al, -2 * c, 1 - al])
    return b / a[0], a / a[0]


def lp_sweep(x, fc_fn, q=0.9, block=64):
    """Resonant low-pass with a moving cutoff. fc_fn(seconds array) -> Hz."""
    n = len(x)
    out = np.empty(n)
    zi = np.zeros(2)
    starts = np.arange(0, n, block)
    fcs = np.clip(fc_fn(starts / SR), 30, SR * 0.45)
    for s, fc in zip(starts, fcs):
        b, a = rbj_lp(fc, q)
        out[s:s + block], zi = signal.lfilter(b, a, x[s:s + block], zi=zi)
    return out


def lp_static(x, fc, q=0.707):
    b, a = rbj_lp(fc, q)
    return signal.lfilter(b, a, x, axis=0)


def to_st(x, pan=0.0):
    if x.ndim == 2:
        return x
    return np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1) * np.sqrt(2)


# ------------------------------------------------------------------ space
def make_ir(seconds, tone=6000, seed=3, predelay=0.012, hp_f=180):
    r = np.random.default_rng(seed)
    n = S(seconds)
    tt = np.arange(n) / SR
    env = np.exp(-tt / (seconds / 6.9))
    ir = r.normal(0, 1, (n, 2)) * env[:, None]
    ir = np.stack([hp(lp(ir[:, c], tone), hp_f) for c in range(2)], 1)
    ramp = S(0.004)
    ir[:ramp] *= np.linspace(0, 1, ramp)[:, None]
    ir /= np.sqrt((ir ** 2).sum(0))
    return np.vstack([np.zeros((S(predelay), 2)), ir])


def conv(x, ir):
    st = to_st(x)
    return np.stack([signal.fftconvolve(st[:, c], ir[:, c]) for c in range(2)], 1)


def pingpong(st, d=0.45, fb=0.4, reps=6, tone=3200):
    """Wet-only ping-pong delay. 0.45 s is a dotted eighth at 100 BPM."""
    mono = to_st(st).mean(1)
    out = np.zeros((len(mono) + S(d * reps) + 1, 2))
    tap = mono
    for k in range(1, reps + 1):
        tap = lp(tap, tone) * fb
        i = S(d * k)
        out[i:i + len(tap), (k - 1) % 2] += tap
    return out


# ------------------------------------------------------------------ drums
def mk_kick():
    n = S(0.5)
    tt = np.arange(n) / SR
    f = 48 + 90 * np.exp(-tt / 0.03) + 150 * np.exp(-tt / 0.004)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.55 * np.exp(-tt / 0.2) + 0.45 * np.exp(-tt / 0.07))
    click = hp(wn(n), 2500) * np.exp(-tt / 0.0025) * 0.18
    x = sat(body * 1.3 + click, 1.6)
    x *= np.minimum(1, (n - np.arange(n)) / S(0.04))
    return hp(x, 28)


ROOM = make_ir(0.16, 5500, 21, 0.004, 300)


def mk_snare(tone=192, seed=0):
    """A dry snare: a pitched body, a short noise crack, a hint of a small room. No gated reverb."""
    r = np.random.default_rng(100 + seed)
    n = S(0.2)
    tt = np.arange(n) / SR
    f = tone * (1 + 0.3 * np.exp(-tt / 0.01))
    body = (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.04) * 0.9
            + np.sin(2 * np.pi * np.cumsum(f * 1.6) / SR) * np.exp(-tt / 0.025) * 0.3)
    nz = r.uniform(-1, 1, n)
    sn = bp(nz, 1400, 7000) * np.exp(-tt / 0.06) * 0.9 + bp(nz, 250, 1400) * np.exp(-tt / 0.03) * 0.3
    dry = sat(body + sn, 1.3) * np.minimum(1, tt / 0.0006)
    wet = conv(dry, ROOM)
    out = np.zeros((len(wet), 2))
    out[:n] += to_st(dry)
    return out + wet * 0.25


HAT_F = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]


def metal(n, scale=1.0, seed=0):
    r = np.random.default_rng(seed)
    tt = np.arange(n) / SR
    return sum(signal.square(2 * np.pi * f * scale * tt + r.uniform(0, 6.28)) for f in HAT_F) / 6


def mk_hat(open_=False, seed=0):
    n = S(0.3 if open_ else 0.065)
    tt = np.arange(n) / SR
    x = 0.55 * metal(n, 1.0, seed) + 0.6 * wn(n)
    x = lp(hp(x, 7000, 2), 11000, 2)
    return x * np.exp(-tt / (0.08 if open_ else 0.012)) * np.minimum(1, tt / 0.0008)


def mk_crash(d=2.8, seed=5):
    n = S(d)
    tt = np.arange(n) / SR
    chans = []
    for c in range(2):
        x = 0.45 * metal(n, 1.37 + 0.02 * c, seed + c) + 0.8 * wn(n)
        x = lp(hp(x, 3000, 2), 10500, 2)
        chans.append(x * (0.75 * np.exp(-tt / 0.65) + 0.25 * np.exp(-tt / 0.08)) * np.minimum(1, tt / 0.002))
    return np.stack(chans, 1)


def sub_boom(d=1.6, f0=72, f1=34):
    n = S(d)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt / 0.25)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.45) * np.minimum(1, tt / 0.003)
    return sat(x, 1.3)


def sub_pulse(m, d=1.4):
    """A soft sub on a chord root for the breakdown's bar lines."""
    n = S(d)
    tt = np.arange(n) / SR
    f = hz(m) * (1 + 0.25 * np.exp(-tt / 0.03))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.38) * np.minimum(1, tt / 0.004)
    return sat(x, 1.2)


# ------------------------------------------------------------------ synths
_cache = {}


def bass_note(m, dur, cut=900, env_amt=2.0):
    key = ("b", m, round(dur, 4), int(cut))
    if key in _cache:
        return _cache[key]
    n = S(dur)
    tot = n + S(0.012)
    tt = np.arange(tot) / SR
    f = hz(m)
    osc = 0.5 * saw(f * 1.003, tot) + 0.5 * saw(f * 0.997, tot, 0.37) + 0.3 * pulse(f, tot, 0.5, 0.1)
    x = lp_sweep(osc, lambda s: cut * (1 + env_amt * np.exp(-s / 0.055)), q=1.15)
    x += np.sin(2 * np.pi * f * tt) * (0.3 if f < 60 else 0.5)
    amp = np.minimum(1, tt / 0.003) * (0.8 + 0.2 * np.exp(-tt / 0.08))
    amp[n:] *= np.linspace(1, 0, tot - n)
    x = hp(sat(x * amp, 1.5), 34, 2)
    _cache[key] = x
    return x


def pluck(m, cut=2600, dur=BEAT * 0.9, decay=0.16):
    """The quarter-note arp voice: a plucked saw pair with a fast filter envelope."""
    key = ("p", m, int(cut / 50) * 50, round(dur, 4), decay)
    if key in _cache:
        return _cache[key]
    n = S(dur) + S(0.05)
    tt = np.arange(n) / SR
    f = hz(m)
    osc = 0.5 * saw(f * 1.003, n) + 0.5 * saw(f * 0.997, n, 0.5) + 0.3 * pulse(f, n, 0.3, 0.2)
    x = lp_sweep(osc, lambda s: key[2] * (0.45 + 1.8 * np.exp(-s / 0.035)), q=1.4)
    amp = np.minimum(1, tt / 0.002) * np.exp(-tt / decay)
    g = S(dur)
    amp[g:] *= np.linspace(1, 0, n - g)
    x = x * amp
    _cache[key] = x
    return x


def pad_chord(notes, dur, cut=1800, att=0.25, rel=0.9, voices=5, cents=14, seed=0):
    r = np.random.default_rng(seed)
    n = S(dur)
    tot = n + S(rel)
    tt = np.arange(tot) / SR
    L = np.zeros(tot)
    Rr = np.zeros(tot)
    for m in notes:
        f = hz(m)
        for v in range(voices):
            c = cents * (v - (voices - 1) / 2) / ((voices - 1) / 2)
            drift = 1 + 0.0007 * np.sin(2 * np.pi * r.uniform(0.1, 0.3) * tt + r.uniform(0, 6))
            s = saw(f * 2 ** (c / 1200) * drift, tot, r.uniform())
            p = (v / (voices - 1)) * 2 - 1
            L += s * np.sqrt(0.5 * (1 - 0.8 * p))
            Rr += s * np.sqrt(0.5 * (1 + 0.8 * p))
    st = np.stack([L, Rr], 1) / (len(notes) * voices) * 2.2
    st = lp_static(lp_static(st, cut, 0.6), cut * 1.4, 0.6)
    env = np.minimum(1, tt / max(att, 1e-3))
    env = env ** 1.6
    env[n:] *= np.exp(-np.arange(tot - n) / SR / (rel / 5))
    return st * env[:, None]


def lead_line(events, total, cut=3000, glide=0.03, oct_shift=0):
    """Monophonic lead with glide and delayed vibrato. events: (start_s, dur_s, midi), start relative."""
    n = S(total) + S(0.6)
    tt = np.arange(n) / SR
    pitch = np.full(n, np.nan)
    amp = np.zeros(n)
    fenv = np.zeros(n)
    vib = np.zeros(n)
    for s, d, m in events:
        a, b = S(s), S(s + d)
        pitch[a:b] = m + oct_shift
        L = n - a
        lt = np.arange(L) / SR
        e = np.minimum(1, lt / 0.008) * (0.72 + 0.28 * np.exp(-lt / 0.22))
        g = b - a
        rel = np.exp(-np.arange(L - g) / SR / 0.08)
        e[g:] = e[g - 1] * rel
        amp[a:] = np.maximum(amp[a:], e)
        fenv[a:] = np.maximum(fenv[a:], np.exp(-lt / 0.12))
        vib[a:b] = np.clip((lt[:g] - 0.18) / 0.3, 0, 1)
    first = np.nanmin(np.where(np.isnan(pitch), np.inf, pitch)) if np.any(~np.isnan(pitch)) else 69
    idx = np.where(~np.isnan(pitch), np.arange(n), 0)
    np.maximum.accumulate(idx, out=idx)
    pitch = np.where(np.isnan(pitch[idx]), first, pitch[idx])
    al = 1 - np.exp(-1 / (glide * SR))
    pitch, _ = signal.lfilter([al], [1, al - 1], pitch, zi=[pitch[0] * (1 - al)])
    pitch = pitch + vib * 0.12 * np.sin(2 * np.pi * 5.4 * tt)
    f = 440 * 2 ** ((pitch - 69) / 12)
    osc = 0.5 * saw(f * 2 ** (7 / 1200), n) + 0.5 * saw(f * 2 ** (-7 / 1200), n, 0.33) + 0.32 * pulse(f, n, 0.35, 0.6)
    x = lp_sweep(osc, lambda s: cut * (1 + 0.9 * fenv[np.minimum((s * SR).astype(int), n - 1)]), q=1.05)
    return sat(x * amp * 0.8, 1.3)


# ------------------------------------------------------------------ fx
def noise_riser(d, f0=250, f1=8000, curve=2.2, seed=0):
    n = S(d)
    p = np.arange(n) / n
    r = np.random.default_rng(seed)
    chans = []
    for c in range(2):
        x = sweep_filter(r.uniform(-1, 1, n), f0, f1, q=2.2, blocks=160)
        chans.append(x / (np.max(np.abs(x)) + 1e-9))
    st = np.stack(chans, 1) * (p ** curve)[:, None]
    ff = 92 * (6 ** p)
    up = lp(saw(ff, n) * 0.5 + saw(ff * 1.5, n) * 0.3, 2600) * (p ** 2.6) * 0.3
    return st + to_st(up)


# ------------------------------------------------------------------ loudness
def lufs(x):
    """ITU-R BS.1770-4 integrated loudness at 48 kHz."""
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585]
    b2, a2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621]
    y = signal.lfilter(b2, a2, signal.lfilter(b1, a1, x, axis=0), axis=0)
    blk, hop = S(0.4), S(0.1)
    ms = np.array([np.mean(y[i:i + blk] ** 2, 0).sum() for i in range(0, len(y) - blk + 1, hop)])
    lk = -0.691 + 10 * np.log10(ms + 1e-12)
    g1 = ms[lk > -70]
    rel = -0.691 + 10 * np.log10(g1.mean()) - 10
    g2 = ms[(lk > -70) & (lk > rel)]
    return -0.691 + 10 * np.log10(g2.mean())


def limiter(x, ceiling_db=-1.5, look=0.002, release=0.09, blk=32):
    c = 10 ** (ceiling_db / 20)
    a = np.abs(x).max(1)
    la = S(look)
    pk = maximum_filter1d(a, size=2 * la + 1, mode="constant")
    g_t = np.minimum(1, c / np.maximum(pk, 1e-9))
    nb = int(np.ceil(len(x) / blk))
    pad = np.concatenate([g_t, np.ones(nb * blk - len(x))])
    gb = pad.reshape(nb, blk).min(1)
    rel = np.exp(-blk / (release * SR))
    out = np.empty(nb)
    g = 1.0
    for i in range(nb):
        g = min(gb[i], 1 - (1 - g) * rel)
        out[i] = g
    out = np.minimum(out, np.concatenate([out[1:], [1]]))
    gs = np.repeat(out, blk)[: len(x)]
    gs = np.convolve(gs, np.ones(blk) / blk, mode="same")
    gs = np.minimum(gs, g_t)
    return np.clip(x * gs[:, None], -c, c)


def glue(x, thr_db=-18, ratio=1.8, att=0.012, rel=0.18, blk=240):
    nb = len(x) // blk
    m = (x[: nb * blk] ** 2).mean(1).reshape(nb, blk).mean(1)
    lvl = 10 * np.log10(m + 1e-12)
    over = np.maximum(0, lvl - thr_db)
    tgt = -over * (1 - 1 / ratio)
    ga, gr = np.exp(-blk / (att * SR)), np.exp(-blk / (rel * SR))
    g = np.empty(nb)
    cur = 0.0
    for i in range(nb):
        k = ga if tgt[i] < cur else gr
        cur = tgt[i] + (cur - tgt[i]) * k
        g[i] = cur
    gs = np.interp(np.arange(len(x)), np.arange(nb) * blk + blk / 2, 10 ** (g / 20))
    return x * gs[:, None]


def write_wav(path, x):
    d = (R.uniform(-1, 1, x.shape) + R.uniform(-1, 1, x.shape)) / 2 / 32767
    d[np.abs(x) < 1e-9] = 0.0   # the silences stay digital zero
    y = np.clip(np.round((x + d) * 32767), -32768, 32767).astype(np.int16)
    wavfile.write(path, SR, y)


# ------------------------------------------------------------------ harmony (data)
CH = {
    "F#m": dict(root=30, pad=[54, 61, 66, 69], arp=[66, 69, 73, 78, 81], bd=[42, 54, 61, 66, 68, 73]),
    "D": dict(root=38, pad=[50, 62, 66, 69], arp=[62, 66, 69, 74, 78], bd=[38, 50, 57, 61, 66, 69]),
    "A": dict(root=33, pad=[57, 61, 64, 69], arp=[64, 69, 73, 76, 81], bd=[45, 57, 61, 64, 68, 71]),
    "E": dict(root=40, pad=[52, 59, 64, 68], arp=[64, 68, 71, 76, 80], bd=[40, 52, 59, 64, 66, 68]),
    "F#m add9": dict(root=30, pad=[42, 54, 57, 61, 66, 68, 73]),
}
LOOP = ["F#m", "D", "A", "E"]


def _chords():
    """One chord per bar for the whole film. The loop restarts on each hit so every hit lands on F#m."""
    c = {}
    for b in range(4, 18):        # drop and origin: F#m D A E ... ends on D (bar 17)
        c[b] = LOOP[(b - 4) % 4]
    for b in range(18, 27):       # range: starts again on F#m, ends on F#m (bar 26)
        c[b] = LOOP[(b - 18) % 4]
    c[27], c[28], c[29] = "D", "A", "E"          # build leans on the dominant
    for b in range(30, 34):       # turn
        c[b] = LOOP[(b - 30) % 4]
    c[34], c[35], c[36] = "F#m", "D", "E"        # the stop lands on E, unresolved
    for k, b in enumerate(range(37, 59, 2)):     # breakdown: one chord per two bars
        c[b] = c[b + 1] = LOOP[k % 4]
    c[59] = c[60] = c[61] = "E"                  # held three bars into the riser
    for b in range(62, 75):       # payoff and craft
        c[b] = LOOP[(b - 62) % 4]
    c[75], c[76], c[77] = "D", "A", "E"          # end part 1
    for b in range(78, 83):
        c[b] = "F#m add9"
    return c


CHORD_BY_BAR = _chords()

# The hook, 4 bars over F#m D A E. (bar, 16th step, length in 16ths, midi)
HOOK = [
    (0, 0, 4, 73), (0, 4, 2, 76), (0, 6, 6, 78), (0, 12, 4, 76),
    (1, 0, 6, 81), (1, 6, 2, 78), (1, 8, 6, 76), (1, 14, 2, 74),
    (2, 0, 4, 73), (2, 4, 2, 76), (2, 6, 6, 81), (2, 12, 4, 80),
    (3, 0, 6, 78), (3, 6, 2, 80), (3, 8, 8, 76),
]

ARP_Q = [0, 1, 2, 3]                       # quarter notes: one bar
ARP_8 = [0, 2, 1, 3, 2, 4, 3, 1]           # eighths: the doubled arp under the list
ARP_BD = [0, 1, 2, 3, 4, 3, 2, 1]          # quarter notes over a two-bar chord in the breakdown

SECTIONS = [
    ("open", "Open", 0, 288, 1),
    ("drop", "Drop (HIT 1)", 288, 504, 2),
    ("origin", "Origin", 504, 1296, 3),
    ("range", "Range", 1296, 1944, 4),
    ("build", "Build", 1944, 2160, 5),
    ("turn", "Turn (HIT 2)", 2160, 2448, 5),
    ("filter", "Filter down", 2448, 2664, 5),
    ("breakdown", "Breakdown", 2664, 4464, 6),
    ("payoff", "Payoff (HIT 3)", 4464, 4608, 6),
    ("craft", "Craft", 4608, 5400, 7),
    ("end1", "End, part 1", 5400, 5616, 8),
    ("end2", "End, part 2", 5616, 5976, 8),
]

HITS = [(288, "HIT 1, the drop: crash, sub, full band, the hook"),
        (2160, "HIT 2, the turn: crash, full band, the hook"),
        (4464, "HIT 3, the payoff: crash, full band, the hook returns")]
NEAR_SILENCE = [(278, 288), (2148, 2160), (4456, 4464)]
STOP = 2664
TRUE_SILENCE = (2664, 2682)
LOWPASS = (2592, 2664)
RISERS = [(2088, 2148), (4416, 4456)]
FINAL_CHORD = 5616
SILENT_BY = 5960


# ------------------------------------------------------------------ the per-bar plan (data)
def plan():
    """What plays in each bar. kick: list of beats; snare: list of beats; hats, bass, pad, arp: modes or None."""
    p = {}

    def put(bars, **kw):
        for b in bars:
            d = p.setdefault(b, dict(kick=[], snare=[], hats=None, bass=None, pad=None, arp=None))
            d.update(kw)

    # drop, bars 4 to 6: kick 1 and 3, snare 2 and 4, octave bass, pad, lead (lead is placed separately)
    put(range(4, 7), kick=[0, 2], snare=[1, 3], hats="8", bass="oct8", pad="band", arp=None)
    # origin, bars 7 to 17: thinner. kick, bass, pad, closed hats
    put(range(7, 11), kick=[0, 2], snare=[1, 3], hats="8", bass="root8", pad="band")
    put(range(11, 15), kick=[0, 2], snare=[], hats="8", bass="root8", pad="band")       # snare out 792 to 1080
    put(range(15, 18), kick=[], snare=[], hats="8", bass="root8", pad="band")           # pad, bass, hats only
    # range, bars 18 to 26: groove with the quarter-note arp; doubled to eighths under the list
    put(range(18, 23), kick=[0, 2], snare=[1, 3], hats="8", bass="oct8", pad="band", arp="q")
    put(range(23, 27), kick=[0, 2], snare=[1, 3], hats="8", bass="oct8", pad="band", arp="8")
    for b in (19, 21, 25):
        p[b]["kick"] = [0, 2, 3.5]      # a pickup on the and of four
    # build, bars 27 to 29
    put(range(27, 29), kick=[0, 2], snare=[1, 3], hats="8", bass="oct8", pad="band", arp="q")
    put([29], kick=[0, 2], snare=[], hats=None, bass="pedal", pad="band", arp=None)
    # turn, bars 30 to 33, then filter down 34 to 36
    put(range(30, 37), kick=[0, 2], snare=[1, 3], hats="8", bass="oct8", pad="band", arp="q")
    for b in (31, 33, 35):
        p[b]["kick"] = [0, 2, 3.5]
    # breakdown, bars 37 to 61: handled as its own layer (no kick, no snare, no hats)
    # payoff and craft, bars 62 to 73
    put(range(62, 74), kick=[0, 2], snare=[1, 3], hats="8", bass="oct8", pad="band", arp="q")
    for b in (63, 65, 67, 69, 71, 73):
        p[b]["kick"] = [0, 2, 3.5]
    put([74], kick=[0], snare=[1], hats=None, bass="root8", pad="band", arp="fade")     # thinning 5328 to 5400
    # end part 1, bars 75 to 77: pad and bass only
    put(range(75, 78), kick=[], snare=[], hats=None, bass="whole", pad="soft", arp=None)
    return p


# ------------------------------------------------------------------ the arrangement
def compose():
    buses = {}
    kicks = []          # (time, depth) for the sidechain
    ev = dict(kicks=[], snares=[], snare_build=[], crashes=[], arp=[], sub_pulses=[], hats=[], lead=[])

    def bus(name):
        if name not in buses:
            buses[name] = np.zeros((N + TAIL, 2))
        return buses[name]

    def put(name, x, t, gain=1.0, pan=0.0):
        b = bus(name)
        x = to_st(x, pan)
        i = S(t)
        if i >= len(b):
            return
        L = min(len(x), len(b) - i)
        b[i:i + L] += x[:L] * gain

    KICK = mk_kick()
    SNARES = [mk_snare(192, s) for s in range(3)]
    HATS = [mk_hat(False, s) for s in range(4)]
    OHAT = mk_hat(True, 9)

    def kick(frame, g=1.0, depth=1.0):
        put("kick", KICK, fr(frame), g)
        kicks.append((fr(frame), depth))
        ev["kicks"].append(round(frame, 2))

    def snare(frame, g=1.0, k=0, build=False):
        put("snare", SNARES[k % 3], fr(frame), g)
        ev["snare_build" if build else "snares"].append(round(frame, 2))

    def crash(frame, g):
        put("crash", mk_crash(2.8, int(frame)), fr(frame), g)
        ev["crashes"].append(frame)

    def chord(bar):
        return CH[CHORD_BY_BAR[bar]]

    def bass_bar(bar, mode, g=1.0):
        ch = chord(bar)
        lo, hi = ch["root"], ch["root"] + 12
        t0 = bt(bar)
        if mode == "oct8":
            for k in range(8):
                put("bass", bass_note(lo if k % 2 == 0 else hi, BEAT / 2 * 0.82, 900), t0 + k * BEAT / 2, g)
        elif mode == "root8":
            for k in range(8):
                put("bass", bass_note(lo, BEAT / 2 * 0.8, 520), t0 + k * BEAT / 2, g * (1.0 if k % 2 == 0 else 0.8))
        elif mode == "pedal":
            for k in range(8):
                put("bass", bass_note(lo, BEAT / 2 * 0.8, 400 + 90 * k), t0 + k * BEAT / 2, g * (0.8 + 0.03 * k))
        elif mode == "whole":
            put("bass", bass_note(lo, BAR * 0.96, 380, 0.6), t0, g * 0.9)

    def arp_bar(bar, mode, g=1.0):
        tones = chord(bar)["arp"]
        if mode in ("q", "fade"):
            for k in range(4):
                f = bf(bar, k)
                acc = (1.0 if k == 0 else 0.82) * (1 - 0.22 * k if mode == "fade" else 1)
                put("arp", pluck(tones[ARP_Q[k]], 2600), fr(f), g * acc)
                ev["arp"].append(f)
        elif mode == "8":
            for k in range(8):
                f = bf(bar, k / 2)
                acc = 1.0 if k % 2 == 0 else 0.72
                put("arp", pluck(tones[ARP_8[k]], 2800, BEAT / 2 * 0.9, 0.12), fr(f), g * acc)
                ev["arp"].append(round(f, 2))

    def pad_bar(bar, mode, g=1.0):
        if mode == "band":
            put("pad", pad_chord(chord(bar)["pad"], BAR, 1900, 0.22, 0.9, seed=bar), bt(bar), g)
        elif mode == "soft":
            put("pad", pad_chord(chord(bar)["pad"], BAR, 1300, 0.6, 1.4, seed=bar), bt(bar), g * 0.9)

    def hats_bar(bar, g=1.0, skip_from=16):
        for k in range(0, min(16, skip_from), 2):
            f = bf(bar, k / 4)
            v = 0.95 if k % 4 == 2 else 0.6
            v *= 1 + 0.1 * (R.uniform() - 0.5)
            put("hats", HATS[(k // 2) % 4], fr(f), g * v, 0.18)
            ev["hats"].append(round(f, 2))

    def lead(events, bar0, g=1.0, double=0.0, cut=3000):
        evs = [((b * 16 + s) * STEP, d * STEP * 0.96, m) for b, s, d, m in events]
        total = max(e[0] + e[1] for e in evs)
        put("lead", lead_line(evs, total, cut), bt(bar0), g)
        if double:
            put("lead", lead_line(evs, total, cut * 0.7, oct_shift=-12), bt(bar0), g * double)
        ev["lead"].append([bar0 * 72, round(bar0 * 72 + total * FPS, 2)])

    # ---- open, bars 0 to 3: one low pad note from 72, swelling through bar 3, out by 278
    low = pad_chord([30, 42, 49], fr(278 - 72) - 1.0, 520, 4.2, 1.0, voices=4, cents=9, seed=1)
    put("pad", low, fr(72), 0.9)

    # ---- the band, from the plan
    P = plan()
    for bar in sorted(P):
        d = P[bar]
        for k in d["kick"]:
            kick(bf(bar, k), 1.0 if k in (0, 2) else 0.72, 1.0 if k in (0, 2) else 0.5)
        for k in d["snare"]:
            snare(bf(bar, k), 0.9 if bar != 74 else 0.5, bar + int(k))
        if d["hats"]:
            hats_bar(bar, 1.0, 12 if bar == 17 else 16)
        if d["bass"]:
            bass_bar(bar, d["bass"], 1.0 if bar not in (74, 75, 76, 77) else 0.85)
        if d["pad"]:
            pad_bar(bar, d["pad"], 1.0)
        if d["arp"]:
            arp_bar(bar, d["arp"], 0.9)

    # soft fill at the end of bar 17 (from 1269), into the groove at 1296
    for k in range(6):
        snare(1269 + 4.5 * k, 0.22 + 0.06 * k, k, build=True)

    # ---- hit 1 at 288: crash, sub, the hook over bars 4 to 7
    crash(288, 1.15)
    put("fx", sub_boom(1.8), fr(288), 1.05)
    kick(288, 0.6, 0.0)      # an accent on top of the bar-line kick
    lead(HOOK, 4, 1.0)

    # ---- build: snare build from 2064 (eighths, then sixteenths), riser 2088 to 2148, everything out at 2148
    f = 2064.0
    k = 0
    while f < 2148:
        snare(f, 0.3 + 0.6 * (f - 2064) / 84, k, build=True)
        f += 9 if f < 2112 else 4.5
        k += 1
    put("fx", noise_riser(fr(2148 - 2088), 300, 8000, 2.4, 1), fr(2088), 0.22)

    # ---- hit 2 at 2160: crash, sub, the hook over bars 30 to 33
    crash(2160, 1.15)
    put("fx", sub_boom(1.8), fr(2160), 1.05)
    kick(2160, 0.6, 0.0)
    lead(HOOK, 30, 1.0)

    # ---- breakdown, bars 37 to 61: pad from 2688 (one chord per two bars), arp quarter notes from 2808,
    #      soft sub pulses on bar lines, no kick, no snare. The arp rests under the quote (4168 to 4326).
    first = True
    for bar in range(37, 62):
        name = CHORD_BY_BAR[bar]
        if first or name != CHORD_BY_BAR[bar - 1]:
            start = fr(2688) if first else bt(bar)
            nxt = bar + 1
            while nxt < 62 and CHORD_BY_BAR[nxt] == name:
                nxt += 1
            end = min(bt(nxt), fr(4456))
            put("bdpad", pad_chord(CH[name]["bd"], end - start, 1150, 1.4 if first else 0.5, 1.2,
                                   voices=5, cents=11, seed=200 + bar), start, 1.0)
            first = False
        if bar >= 38:
            put("sub", sub_pulse(CH[name]["root"]), bt(bar), 0.8)
            ev["sub_pulses"].append(bar * 72)
    bd_bar = 39
    while True:
        base = bd_bar * 72
        if base >= 4416:
            break
        tones = CH[CHORD_BY_BAR[bd_bar]]["arp"]
        pair_start = bd_bar - (bd_bar - 37) % 2
        for k in range(4):
            f = base + 18 * k
            if f >= 4416 or 4168 <= f < 4326:
                continue
            step = (bd_bar - pair_start) * 4 + k
            m = tones[ARP_BD[step % 8]] + 12
            put("bdarp", pluck(m, 2100, BEAT * 0.85, 0.2), fr(f), 0.9 if k == 0 else 0.75)
            ev["arp"].append(f)
        bd_bar += 1
    put("fx", noise_riser(fr(4456 - 4416), 350, 7500, 2.2, 2), fr(4416), 0.26)

    # ---- hit 3 at 4464: crash, sub, the hook over bars 62 to 65; the hook again, doubled, over 70 to 73
    crash(4464, 1.15)
    put("fx", sub_boom(1.8), fr(4464), 1.05)
    kick(4464, 0.6, 0.0)
    lead(HOOK, 62, 1.0)
    lead(HOOK, 70, 0.95, double=0.42)
    # craft: a crash on each card cut
    crash(4824, 0.5)
    crash(5040, 0.5)
    crash(5220, 0.45)

    # ---- the final chord at 5616: F#m add9, a long decay, silent by 5960
    fin = CH["F#m add9"]
    put("final", pad_chord(fin["pad"], 2.6, 1700, 0.03, 6.0, voices=6, cents=12, seed=78), fr(FINAL_CHORD), 1.15)
    put("final", to_st(bass_note(fin["root"], 2.2, 420, 0.8)), fr(FINAL_CHORD), 0.55)
    put("fx", sub_boom(2.0, 62, 31), fr(FINAL_CHORD), 0.5)

    for key in ev:
        if key != "lead":
            ev[key] = sorted(set(ev[key]))
    return buses, kicks, ev


def duck_env(kicks, depth, rel=0.13, att=0.004):
    d = np.ones(N + TAIL)
    L = S(0.4)
    a = S(att)
    shape = np.exp(-np.arange(L) / SR / rel)
    shape[:a] = np.linspace(0, 1, a)
    for t, k in kicks:
        if k <= 0:
            continue
        i = S(t)
        seg = 1 - depth * k * shape
        j = min(len(d), i + L)
        d[i:j] = np.minimum(d[i:j], seg[: j - i])
    return d[:, None]


def mixdown(buses, kicks):
    z = lambda name: buses.get(name, np.zeros((N + TAIL, 2)))  # noqa: E731
    g = {"kick": 0.42, "snare": 0.60, "crash": 0.40, "hats": 0.50, "bass": 0.30, "pad": 0.58,
         "arp": 0.30, "lead": 0.26, "fx": 0.55, "bdpad": 0.62, "bdarp": 0.26, "sub": 0.42, "final": 0.6}
    st = {k: z(k) * v for k, v in g.items()}

    st["bass"] *= duck_env(kicks, 0.6, 0.11)
    st["pad"] *= duck_env(kicks, 0.5, 0.16)
    st["arp"] *= duck_env(kicks, 0.35, 0.12)
    st["lead"] *= duck_env(kicks, 0.15, 0.1)

    hall = make_ir(2.4, 5200, 3, 0.02)
    plate = make_ir(1.0, 6500, 4, 0.008)
    arp_dly = pingpong(st["arp"], 0.45, 0.38, 5, 3000)[: N + TAIL] * 0.5
    lead_dly = pingpong(st["lead"], 0.45, 0.34, 5, 3400)[: N + TAIL] * 0.42
    send = (st["pad"] * 0.35 + st["arp"] * 0.3 + st["lead"] * 0.35 + st["snare"] * 0.08
            + arp_dly * 0.4 + lead_dly * 0.4)
    hall_band = conv(send, hall)[: N + TAIL] * 0.55
    plate_band = conv(st["snare"] * 0.1 + st["lead"] * 0.2, plate)[: N + TAIL] * 0.4
    hall_band *= duck_env(kicks, 0.35, 0.18)
    band = (st["kick"] + st["snare"] + st["crash"] + st["hats"] + st["bass"] + st["pad"] + st["arp"]
            + st["lead"] + arp_dly + lead_dly + hall_band + plate_band)

    # the breakdown in a bigger room, the arp through a dotted-eighth ping-pong
    bd = st["bdpad"] + st["bdarp"] + st["sub"]
    bd_dly = pingpong(st["bdarp"], 0.45, 0.45, 7, 2600)[: N + TAIL] * 0.6
    bd_hall = conv(st["bdpad"] * 0.5 + st["bdarp"] * 0.7 + bd_dly * 0.5, make_ir(3.2, 4500, 8, 0.03))[: N + TAIL] * 0.7
    air = bd + bd_dly + bd_hall

    fin = st["final"]
    fin_hall = conv(fin, make_ir(3.8, 5000, 12, 0.02))[: N + TAIL] * 0.6
    fx_hall = conv(st["fx"], plate)[: N + TAIL] * 0.25

    mix = (band + air + fin + fin_hall + st["fx"] + fx_hall)[:N]
    stems = {k: v[:N] for k, v in st.items()}
    stems["band_total"] = band[:N]
    return mix, stems


def gate(x, a, b, level, ramp=0.004):
    i, j, r = S(fr(a)), S(fr(b)), S(ramp)
    g = np.ones(len(x))
    g[i:j] = level
    g[i - r:i] = np.linspace(1, level, r)
    g[j:j + r] = np.linspace(level, 1, r)
    return x * g[:, None]


def close_lowpass(x, a, b, f0=18000, f1=110):
    """The filter closing over bar 36: an exponential sweep from open to shut, per channel."""
    i, j = S(fr(a)), S(fr(b))
    n = j - i
    fc = lambda s: f0 * (f1 / f0) ** np.clip(s / (n / SR), 0, 1)  # noqa: E731
    for c in range(2):
        x[i:j, c] = lp_sweep(x[i:j, c], fc, q=1.1)
    return x


def hard_stop(x, a, b):
    """Dead at frame a: a 2 ms ramp to zero, then digital silence until frame b."""
    i, j, r = S(fr(a)), S(fr(b)), S(0.002)
    x[i - r:i] *= np.linspace(1, 0, r)[:, None]
    x[i:j] = 0.0
    return x


def master(mix, target=-17.0, ceiling=-1.5):
    x = np.stack([hp(mix[:, c], 30, 2) for c in range(2)], 1)
    x = 0.75 * x + 0.25 * lp_static(x, 7500, 0.6)
    for a, b in NEAR_SILENCE:
        x = gate(x, a, b, 10 ** (-45 / 20))
    x = close_lowpass(x, *LOWPASS)
    x = hard_stop(x, STOP, 2688)
    x = glue(x)
    gain = 1.0
    y = x
    for _ in range(6):
        y = limiter(x * gain, ceiling)
        L = lufs(y)
        if abs(L - target) < 0.1:
            break
        gain *= 10 ** ((target - L) / 20)
    # the end: the chord decays on its own, a cosine fade finishes it, zero from 5960
    a, b = S(fr(5890)), S(fr(SILENT_BY))
    p = np.linspace(0, 1, b - a)
    y[a:b] *= (np.cos(p * np.pi / 2) ** 2)[:, None]
    y[b:] = 0.0
    y = hard_stop(y, STOP, 2688)      # keep the stop exact after the limiter
    y[: S(fr(72))] = 0.0              # nothing before the first pad note
    return y, gain


# ------------------------------------------------------------------ report
def per_frame(y):
    hopf = SR // FPS
    nf = len(y) // hopf
    rms = np.sqrt((y[: nf * hopf] ** 2).mean(1).reshape(nf, hopf).mean(1))
    pk = np.abs(y[: nf * hopf]).max(1).reshape(nf, hopf).max(1)
    return 20 * np.log10(rms + 1e-9), 20 * np.log10(pk + 1e-9)


def analyse(y, stems, ev, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    rms, pk = per_frame(y)
    nf = len(rms)
    fig, ax = plt.subplots(2, 1, figsize=(22, 9), sharex=True, gridspec_kw=dict(height_ratios=[1.6, 1.2]))
    ax[0].plot(np.arange(nf), rms, lw=0.8, label="RMS per frame")
    ax[0].plot(np.arange(nf), pk, lw=0.5, alpha=0.6, label="peak per frame")
    ax[0].axhline(-1.5, color="r", lw=0.6, ls="--")
    ax[0].set_ylim(-80, 0)
    ax[0].set_ylabel("dBFS")
    ax[0].set_title("bed-v6.wav: envelope per frame (30 fps, 100 BPM, bar = 72 f)")
    for f, _ in HITS:
        ax[0].axvline(f, color="y", lw=1.2)
    for f in ev["crashes"]:
        ax[0].axvline(f, color="orange", lw=0.5, alpha=0.6)
    ax[0].axvline(STOP, color="k", lw=1.2)
    ax[0].axvline(FINAL_CHORD, color="m", lw=1.0)
    ax[0].legend(loc="lower left", fontsize=8)
    hopf = SR // FPS
    for name, col in [("kick", "k"), ("snare", "tab:purple"), ("bass", "tab:blue"), ("pad", "tab:green"),
                      ("arp", "tab:orange"), ("lead", "tab:red"), ("bdpad", "tab:cyan"), ("bdarp", "tab:olive"),
                      ("sub", "tab:brown"), ("final", "m")]:
        s = stems[name][: nf * hopf]
        r = np.sqrt((s ** 2).mean(1).reshape(nf, hopf).mean(1))
        ax[1].plot(np.arange(nf), 20 * np.log10(r + 1e-9), lw=0.7, label=name, color=col)
    ax[1].set_ylim(-70, -5)
    ax[1].set_ylabel("stem RMS, pre-master")
    ax[1].legend(loc="lower left", ncol=10, fontsize=8)
    for a in ax:
        for _, name, s, e, _ in SECTIONS:
            a.axvline(s, color="c", lw=0.7, alpha=0.7)
        a.set_xlim(0, DUR_F)
    for _, name, s, e, _ in SECTIONS:
        ax[0].text(s + 4, -4, name, color="c", fontsize=8)
    ax[1].set_xlabel("frame")
    ax[1].set_xticks(np.arange(0, DUR_F + 1, 288))
    fig.tight_layout()
    fig.savefig(path, dpi=80)
    plt.close(fig)


def section_of(frame):
    for sid, name, s, e, _ in SECTIONS:
        if s <= frame < e:
            return sid
    return "end2"


def main():
    png_dir = None
    if "--png" in sys.argv:
        png_dir = sys.argv[sys.argv.index("--png") + 1]
    os.makedirs(MUSIC_DIR, exist_ok=True)
    buses, kicks, ev = compose()
    mix, stems = mixdown(buses, kicks)
    del buses
    y, gain = master(mix)
    assert len(y) == N, (len(y), N)
    write_wav(os.path.join(MUSIC_DIR, "bed-v6.wav"), y)

    hits = dict(
        fps=FPS, bpm=BPM, beat_frames=18, bar_frames=72, bars=BARS, duration_frames=DUR_F, duration_seconds=DUR,
        sample_rate=SR, key="F# minor",
        progression="F#m D A E (i VI III VII), one chord per bar in the band sections, one per two bars in the "
                    "breakdown, F#m add9 at the end; the loop restarts on each hit so every hit is on F#m",
        sections=[dict(id=a, name=b, start=c, end=d, chapter=e) for a, b, c, d, e in SECTIONS],
        hits=[dict(frame=f, what=w) for f, w in HITS],
        stop=STOP,
        true_silence=list(TRUE_SILENCE),
        near_silence=[list(p) for p in NEAR_SILENCE],
        lowpass_close=list(LOWPASS),
        risers=[list(p) for p in RISERS],
        snare_build=ev["snare_build"],
        chord=dict(frame=FINAL_CHORD, name="F#m add9", midi=CH["F#m add9"]["pad"], silent_by=SILENT_BY),
        crashes=ev["crashes"],
        kicks=ev["kicks"],
        snares=ev["snares"],
        arp=ev["arp"],
        sub_pulses=ev["sub_pulses"],
        lead=ev["lead"],
        chords_by_bar=[dict(bar=b, start=b * 72, chord=CHORD_BY_BAR.get(b)) for b in range(BARS)],
    )
    with open(os.path.join(MUSIC_DIR, "bed-v6-hits.json"), "w") as fh:
        json.dump(hits, fh, indent=1)

    if png_dir:
        os.makedirs(png_dir, exist_ok=True)
        analyse(y, stems, ev, os.path.join(png_dir, "bed-v6.png"))

    L = lufs(y)
    print(f"bed-v6.wav {len(y) / SR:.3f} s  {len(y)} samples  peak {20 * np.log10(np.abs(y).max()):.2f} dBFS  "
          f"integrated {L:.2f} LUFS  gain {20 * np.log10(gain):+.1f} dB")
    rms, pk = per_frame(y)
    print("\nRMS per bar (dBFS), peak per bar, section")
    for b in range(BARS):
        s, e = b * 72, (b + 1) * 72
        seg = y[S(fr(s)):S(fr(e))]
        r = 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)
        p = 20 * np.log10(np.abs(seg).max() + 1e-9)
        print(f"  bar {b:>2}  f {s:>4}-{e:<4}  rms {r:6.1f}  peak {p:6.1f}  {section_of(s):<9} {CHORD_BY_BAR.get(b, '')}")
    print("\nchecks")
    for f in (288, 2160, 4464):
        win = pk[f:f + 6].max()
        print(f"  peak around {f}: {win:6.2f} dBFS (frame peaks {f}..{f + 5})")
    ts = y[S(fr(2664)):S(fr(2682))]
    print(f"  2664-2682 max abs {np.abs(ts).max():.3g} (true silence)")
    for a, b in NEAR_SILENCE:
        print(f"  near-silence {a}-{b}: rms {20 * np.log10(np.sqrt(np.mean(y[S(fr(a)):S(fr(b))] ** 2)) + 1e-9):6.1f} dBFS")
    print(f"  5960-5976 max abs {np.abs(y[S(fr(5960)):]).max():.3g}")
    top = np.argsort(pk)[::-1][:12]
    print("  loudest frames by peak:", sorted(int(i) for i in top))


if __name__ == "__main__":
    main()
