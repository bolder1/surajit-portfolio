#!/usr/bin/env python3
"""Retrowave bed for the designer reel. Every sample is synthesised here in numpy/scipy.

52.0 s, 48 kHz stereo, 120 BPM (beat = 15 f, bar = 60 f at 30 fps), F# minor.
Progression i-VI-III-VII (F#m - D - A - E), one chord per bar, cadence VI-VII-i at the end.

    python3 sound/compose.py            # writes assets/audio/bed.wav, bed-hits.json, review/bed.png

Imports the reel toolkit from ../../video/sound/dsp.py (read-only, not edited).
"""
import json
import os
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.dirname(HERE)
TOOLKIT = os.path.abspath(os.path.join(REEL, "..", "..", "video", "sound"))
sys.path.insert(0, TOOLKIT)
from dsp import SR, bp, hp, lp, sat, stereo, sweep_filter  # noqa: E402

AUDIO_DIR = os.path.join(REEL, "assets", "audio")
REVIEW_DIR = os.path.join(REEL, "review")

FPS = 30
BPM = 120
BEAT = 60 / BPM          # 0.5 s = 15 frames
BAR = 4 * BEAT           # 2.0 s = 60 frames
STEP = BEAT / 4          # 16th = 3.75 frames
DUR = 52.0
N = int(round(DUR * SR))
TAIL = int(4 * SR)

R = np.random.default_rng(1983)


def S(t):
    return int(round(t * SR))


def fr(f):
    return f / FPS


def bt(bar, beat=0.0):
    return bar * BAR + beat * BEAT


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
    """Band-limited (polyBLEP) saw."""
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
    """Resonant low-pass with a time-varying cutoff, fc_fn(seconds array) -> Hz."""
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


def gated_ir(length=0.26, seed=7, tone=7500):
    """80s non-linear 'gated' reverb: dense, flat, then slammed shut."""
    r = np.random.default_rng(seed)
    n = S(length)
    tt = np.arange(n) / SR
    shape = np.minimum(1, tt / 0.006) * (1 - 0.35 * tt / length)
    k = S(0.03)
    shape[-k:] *= np.linspace(1, 0, k) ** 2
    ir = r.normal(0, 1, (n, 2)) * shape[:, None]
    ir = np.stack([lp(hp(ir[:, c], 250), tone) for c in range(2)], 1)
    ir /= np.sqrt((ir ** 2).sum(0))
    return ir


def conv(x, ir):
    st = to_st(x)
    return np.stack([signal.fftconvolve(st[:, c], ir[:, c]) for c in range(2)], 1)


def pingpong(st, d=0.375, fb=0.4, reps=6, tone=3200):
    """Wet-only ping-pong delay (dotted 8th by default)."""
    mono = to_st(st).mean(1)
    out = np.zeros((len(mono) + S(d * reps) + 1, 2))
    tap = mono
    for k in range(1, reps + 1):
        tap = lp(tap, tone) * fb
        i = S(d * k)
        out[i:i + len(tap), (k - 1) % 2] += tap
    return out


def chorus(x, base=0.011, depth=0.0022, rate=0.55, mix=0.55):
    n = len(x)
    idx = np.arange(n, dtype=float)
    chans = []
    for ph in (0.0, np.pi):
        d = (base + depth * np.sin(2 * np.pi * rate * idx / SR + ph)) * SR
        chans.append(x + mix * np.interp(idx - d, idx, x, left=0.0))
    return np.stack(chans, 1) * 0.75


GATED = gated_ir()
GATED_TOM = gated_ir(0.32, seed=11, tone=6000)


# ------------------------------------------------------------------ drums
def mk_kick():
    n = S(0.5)
    tt = np.arange(n) / SR
    f = 50 + 95 * np.exp(-tt / 0.03) + 160 * np.exp(-tt / 0.004)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.55 * np.exp(-tt / 0.19) + 0.45 * np.exp(-tt / 0.07))
    click = hp(wn(n), 2500) * np.exp(-tt / 0.0025) * 0.22
    x = sat(body * 1.3 + click, 1.6)
    x *= np.minimum(1, (n - np.arange(n)) / S(0.04))
    return hp(x, 28)


def mk_snare(tone=188, seed=0):
    n = S(0.22)
    tt = np.arange(n) / SR
    f = tone * (1 + 0.35 * np.exp(-tt / 0.01))
    body = (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.045) * 0.9
            + np.sin(2 * np.pi * np.cumsum(f * 1.72) / SR) * np.exp(-tt / 0.03) * 0.35)
    sn = bp(wn(n), 1500, 7500) * np.exp(-tt / 0.07) * 0.9 + bp(wn(n), 300, 1500) * np.exp(-tt / 0.03) * 0.35
    dry = sat(body + sn, 1.3)
    wet = conv(dry, GATED)
    out = np.zeros((len(wet), 2))
    out[:n] += to_st(dry) * 0.6
    out += wet * 0.9
    return out


def mk_clap():
    n = S(0.32)
    x = np.zeros(n)
    for k, o in enumerate([0, 0.009, 0.018, 0.027]):
        i = S(o)
        L = n - i
        tt = np.arange(L) / SR
        x[i:] += bp(wn(L), 1000, 6000) * np.exp(-tt / (0.006 if k < 3 else 0.08)) * (0.8 if k < 3 else 1.0)
    wet = conv(x, GATED)
    out = np.zeros((len(wet), 2))
    out[:n] += stereo(x, width=0.6) * 0.6
    return out + wet * 0.5


HAT_F = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]


def metal(n, scale=1.0, seed=0):
    r = np.random.default_rng(seed)
    tt = np.arange(n) / SR
    return sum(signal.square(2 * np.pi * f * scale * tt + r.uniform(0, 6.28)) for f in HAT_F) / 6


def mk_hat(open_=False, seed=0):
    n = S(0.34 if open_ else 0.07)
    tt = np.arange(n) / SR
    x = 0.55 * metal(n, 1.0, seed) + 0.6 * wn(n)
    x = lp(hp(x, 6800, 2), 11000, 2)
    return x * np.exp(-tt / (0.085 if open_ else 0.013)) * np.minimum(1, tt / 0.0008)


def mk_shaker():
    n = S(0.09)
    tt = np.arange(n) / SR
    x = lp(hp(wn(n), 5500), 10000)
    return x * np.minimum(1, tt / 0.012) * np.exp(-tt / 0.03)


def mk_crash(d=2.6, seed=5):
    n = S(d)
    tt = np.arange(n) / SR
    chans = []
    for c in range(2):
        x = 0.45 * metal(n, 1.37 + 0.02 * c, seed + c) + 0.8 * wn(n)
        x = lp(hp(x, 3200, 2), 10500, 2)
        chans.append(x * (0.75 * np.exp(-tt / 0.6) + 0.25 * np.exp(-tt / 0.08)) * np.minimum(1, tt / 0.002))
    return np.stack(chans, 1)


def mk_tom(f0, pan=0.0):
    n = S(0.4)
    tt = np.arange(n) / SR
    f = f0 * (1 + 0.5 * np.exp(-tt / 0.02))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.16)
    hit = bp(wn(n), 200, 3000) * np.exp(-tt / 0.01) * 0.4
    dry = sat(body + hit, 1.4)
    wet = conv(dry, GATED_TOM)
    out = np.zeros((len(wet), 2))
    out[:n] += to_st(dry, pan) * 0.75
    return out + wet * 0.55


def sub_boom(d=1.6, f0=72, f1=34):
    n = S(d)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt / 0.25)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.45) * np.minimum(1, tt / 0.003)
    return sat(x, 1.3)


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


def arp_note(m, cut, dur=STEP * 0.92):
    key = ("a", m, int(cut / 25) * 25, round(dur, 4))
    if key in _cache:
        return _cache[key]
    n = S(dur) + S(0.04)
    tt = np.arange(n) / SR
    f = hz(m)
    osc = 0.5 * saw(f * 1.004, n) + 0.5 * saw(f * 0.996, n, 0.5) + 0.35 * pulse(f, n, 0.3, 0.2)
    x = lp_sweep(osc, lambda s: key[2] * (0.55 + 1.6 * np.exp(-s / 0.045)), q=1.5)
    amp = np.minimum(1, tt / 0.002) * np.exp(-tt / 0.11)
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


def stab(notes, dur=0.38, cut=2600, seed=1):
    r = np.random.default_rng(seed)
    n = S(dur) + S(0.1)
    tt = np.arange(n) / SR
    L = np.zeros(n)
    Rr = np.zeros(n)
    for m in notes:
        for v, c in enumerate((-11, -4, 4, 11)):
            s = saw(hz(m) * 2 ** (c / 1200), n, r.uniform())
            (L if v % 2 == 0 else Rr)[:] += s
    fenv = lambda s: cut * (0.35 + 2.4 * np.exp(-s / 0.06))
    st = np.stack([lp_sweep(L, fenv, 1.2), lp_sweep(Rr, fenv, 1.2)], 1) / (len(notes) * 2)
    amp = np.minimum(1, tt / 0.002) * np.exp(-tt / 0.22)
    amp[S(dur):] *= np.linspace(1, 0, n - S(dur))
    st *= amp[:, None]
    wet = conv(st.mean(1), GATED_TOM)
    out = np.zeros((len(wet), 2))
    out[:n] += st
    return out + wet * 0.35


def bell(m, d=1.4):
    n = S(d)
    tt = np.arange(n) / SR
    f = hz(m)
    idx = 2.2 * np.exp(-tt / 0.18)
    x = np.sin(2 * np.pi * f * tt + idx * np.sin(2 * np.pi * f * 3.5 * tt))
    x += 0.25 * np.sin(2 * np.pi * f * 2.0 * tt) * np.exp(-tt / 0.3)
    return x * np.exp(-tt / 0.5) * np.minimum(1, tt / 0.002)


def lead_line(events, total, cut=3600, glide=0.03, oct_shift=0):
    """Monophonic lead with glide + delayed vibrato. events: (start_s, dur_s, midi), start relative."""
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
        e = np.minimum(1, lt / 0.006) * (0.72 + 0.28 * np.exp(-lt / 0.22))
        g = b - a
        rel = np.exp(-np.arange(L - g) / SR / 0.07)
        e[g:] = e[g - 1] * rel
        amp[a:] = np.maximum(amp[a:], e)
        fenv[a:] = np.maximum(fenv[a:], np.exp(-lt / 0.12))
        vib[a:b] = np.clip((lt[:g] - 0.16) / 0.25, 0, 1)
    first = np.nanmin(np.where(np.isnan(pitch), np.inf, pitch)) if np.any(~np.isnan(pitch)) else 69
    idx = np.where(~np.isnan(pitch), np.arange(n), 0)
    np.maximum.accumulate(idx, out=idx)
    pitch = np.where(np.isnan(pitch[idx]), first, pitch[idx])
    al = 1 - np.exp(-1 / (glide * SR))
    pitch, _ = signal.lfilter([al], [1, al - 1], pitch, zi=[pitch[0] * (1 - al)])
    pitch = pitch + vib * 0.13 * np.sin(2 * np.pi * 5.6 * tt)
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
        x = sweep_filter(r.uniform(-1, 1, n), f0, f1, q=2.2, blocks=240)
        chans.append(x / (np.max(np.abs(x)) + 1e-9))
    st = np.stack(chans, 1) * (p ** curve)[:, None]
    ff = 110 * (8 ** p)
    up = lp(saw(ff, n) * 0.5 + saw(ff * 1.5, n) * 0.3, 3000) * (p ** 2.6) * 0.35
    return st + to_st(up)


def reverse_cymbal(d=1.0, seed=9):
    c = mk_crash(d + 0.2, seed)[: S(d)][::-1]
    p = np.linspace(0, 1, len(c))
    return c * (p ** 1.5)[:, None]


def tape_stop(x, t0, t1, curve=1.6):
    i0, i1 = S(t0), S(t1)
    n = i1 - i0
    p = np.arange(n) / n
    pos = i0 + np.cumsum((1 - p) ** curve)
    src = np.arange(len(x), dtype=float)
    y = np.stack([np.interp(pos, src, x[:, c]) for c in range(2)], 1)
    x[i0:i1] = y * ((1 - p) ** 0.6)[:, None]
    return x


# ------------------------------------------------------------------ loudness / mastering
def lufs(x):
    """ITU-R BS.1770-4 integrated loudness (48 kHz)."""
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


def limiter(x, ceiling_db=-2.2, look=0.002, release=0.09, blk=32):
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


def glue(x, thr_db=-17, ratio=2.0, att=0.01, rel=0.15, blk=240):
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
    d[np.abs(x) < 1e-9] = 0.0   # keep true digital silence where the master is silent
    y = np.clip(np.round((x + d) * 32767), -32768, 32767).astype(np.int16)
    wavfile.write(path, SR, y)


# ------------------------------------------------------------------ harmony
CH = {
    "F#m": dict(root=30, pad=[54, 61, 66, 69], arp=[66, 69, 73, 76, 78], stab=[54, 61, 66, 69, 73]),
    "D": dict(root=38, pad=[50, 62, 66, 69], arp=[62, 66, 69, 73, 74], stab=[50, 57, 62, 66, 69]),
    "A": dict(root=33, pad=[57, 61, 64, 69], arp=[61, 64, 69, 71, 73], stab=[57, 61, 64, 69, 73]),
    "E": dict(root=40, pad=[52, 59, 64, 68], arp=[59, 64, 68, 71, 76], stab=[52, 59, 64, 68, 71]),
    "Amaj9": dict(root=33, pad=[57, 61, 64, 68, 71], arp=[61, 64, 68, 71, 73]),
    "Dadd9": dict(root=38, pad=[50, 62, 64, 66, 69], arp=[62, 66, 69, 73, 74],
                  stab=[38, 50, 57, 62, 64, 66, 69, 74]),
    "F#m9": dict(root=30, pad=[42, 49, 57, 64, 68, 73], stab=[42, 49, 57, 64, 68, 73]),
}
PROG = ["F#m", "D", "A", "E"]


def chord_of(bar):
    return {22: "Amaj9", 23: "Dadd9", 24: "E", 25: "F#m9"}.get(bar, PROG[bar % 4])


# Lead hook: 8 bars over F#m D A E F#m D A E. (bar, 16th step, length in 16ths, midi)
HOOK = [
    (0, 0, 3, 73), (0, 3, 3, 76), (0, 6, 6, 78), (0, 12, 2, 76), (0, 14, 2, 78),
    (1, 0, 6, 81), (1, 6, 2, 78), (1, 8, 4, 76), (1, 12, 2, 74), (1, 14, 2, 73),
    (2, 0, 3, 73), (2, 3, 3, 76), (2, 6, 6, 78), (2, 12, 2, 76), (2, 14, 2, 78),
    (3, 0, 6, 80), (3, 6, 2, 78), (3, 8, 8, 76),
    (4, 0, 3, 73), (4, 3, 3, 76), (4, 6, 6, 78), (4, 12, 2, 76), (4, 14, 2, 78),
    (5, 0, 6, 81), (5, 6, 2, 78), (5, 8, 4, 76), (5, 12, 2, 74), (5, 14, 2, 73),
    (6, 0, 3, 73), (6, 3, 3, 76), (6, 6, 6, 81), (6, 12, 2, 80), (6, 14, 2, 81),
    (7, 0, 4, 83), (7, 4, 4, 80), (7, 8, 7, 78),
]
# Final lift: same opening cell over D, climb over E, land on A5 (3rd of F#m) with the last chord.
ENDING = [
    (0, 0, 3, 73), (0, 3, 3, 76), (0, 6, 6, 78), (0, 12, 2, 76), (0, 14, 2, 78),
    (1, 0, 6, 80), (1, 6, 2, 78), (1, 8, 4, 76), (1, 12, 2, 78), (1, 14, 2, 80),
    (2, 0, 14, 81),
]

ARP_PAT = {
    "updown": [0, 1, 2, 3, 4, 3, 2, 1] * 2,
    "pedal": [0, 4, 1, 4, 2, 4, 3, 4] * 2,
    "climb": [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 3, 2, 1, 0, 1],
}


# ------------------------------------------------------------------ the arrangement
def compose():
    buses = {}
    kicks = []          # (time, depth) for the sidechain
    hits = []           # (frame, label) for the README map

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

    def hit(frame, label):
        hits.append((round(frame, 2), label))

    KICK = mk_kick()
    SNARES = [mk_snare(188, s) for s in range(3)]
    CLAP = mk_clap()
    HATS = [mk_hat(False, s) for s in range(4)]
    OHAT = mk_hat(True, 9)
    SHAKER = mk_shaker()
    TOMS = [mk_tom(f, p) for f, p in [(196, 0.45), (147, 0.15), (123, -0.15), (98, -0.45)]]

    KICK_F = lp(KICK, 220, 2) * 1.3

    def kick(t, g=1.0, depth=1.0, filtered=False):
        put("kick", KICK_F if filtered else KICK, t, g)
        kicks.append((t, depth))

    def snare(t, g=1.0, k=0):
        put("snare", SNARES[k % 3], t, g)

    def crash(frame, g, label=None):
        put("crash", mk_crash(2.6, int(frame)), fr(frame), g)
        if label:
            hit(frame, label)

    def tom_fill(t0, steps, g=0.7):
        for k in range(steps):
            put("snare", TOMS[min(3, k * 4 // steps)], t0 + k * STEP, g * (0.8 + 0.2 * k / steps))

    def bass_bar(bar, mode, cut=950, g=1.0):
        ch = CH[chord_of(bar)]
        lo, hi = ch["root"], ch["root"] + 12
        t0 = bt(bar)
        if mode == "root8":
            for k in range(8):
                put("bass", bass_note(lo, BEAT / 2 * 0.8, cut), t0 + k * BEAT / 2, g)
        elif mode == "oct8":
            for k in range(8):
                put("bass", bass_note(lo if k % 2 == 0 else hi, BEAT / 2 * 0.82, cut), t0 + k * BEAT / 2, g)
        elif mode == "oct16":
            for k in range(16):
                m = lo if k % 2 == 0 else hi
                put("bass", bass_note(m, STEP * 0.8, cut), t0 + k * STEP, g * (1.0 if k % 4 == 0 else 0.85))

    def arp_bar(bar, pat, cut_fn, g=1.0, oct_=0, busname="arp", steps=16):
        tones = CH[chord_of(bar)]["arp"]
        for k in range(steps):
            t = bt(bar) + k * STEP
            m = tones[ARP_PAT[pat][k]] + oct_
            acc = 1.0 if k % 4 == 0 else (0.8 if k % 2 == 0 else 0.7)
            put(busname, arp_note(m, cut_fn(t)), t, g * acc)

    def pad_bar(bar, g=1.0, cut=1900, att=0.22, dur=BAR, busname="pad", rel=0.9):
        put(busname, pad_chord(CH[chord_of(bar)]["pad"], dur, cut, att, rel, seed=bar), bt(bar), g)

    def hats_bar(bar, mode, g=1.0, skip_from=16):
        for k in range(min(16, skip_from)):
            t = bt(bar) + k * STEP
            if mode == "off8" and k % 4 == 2:
                put("hats", HATS[k % 4], t, g * 0.9, 0.2)
            elif mode == "16":
                v = 1.0 if k % 4 == 2 else (0.55 if k % 2 == 0 else 0.4)
                v *= 1 + 0.12 * (R.uniform() - 0.5)
                put("hats", HATS[k % 4], t, g * v, 0.18)
                if k % 4 == 2:
                    put("hats", OHAT, t, g * 0.55, -0.15)

    def lead(events, bar0, g=1.0, double=0.0, cut=3600):
        evs = [((b * 16 + s) * STEP, d * STEP * 0.96, m) for b, s, d, m in events]
        total = max(e[0] + e[1] for e in evs)
        x = lead_line(evs, total, cut)
        put("lead", x, bt(bar0), g)
        if double:
            put("lead", lead_line(evs, total, cut * 0.7, oct_shift=-12), bt(bar0), g * double)

    # ============ F1-F2 intro: bars 0-3 (frames 0-240) ============
    hit(0, "F1 start: pad fades up from silence with a filtered 16th arp")
    intro_cut = lambda t: 420 * (3400 / 420) ** np.clip(t / 7.7, 0, 1)
    for b in range(4):
        pad_bar(b, g=1.05 if b < 2 else 0.55, cut=900 + 300 * b, att=1.6 if b == 0 else 0.35)
        arp_bar(b, "updown", intro_cut, g=(0.55, 0.7, 0.72, 0.8)[b])
    # F2 (bar 2): soft four-on-the-floor + offbeat hats + filtered root bass
    hit(120, "F2: filtered kick, offbeat hats and root bass enter; white-noise riser starts")
    put("fx", reverse_cymbal(1.0), fr(120) - 1.0, 0.35)
    for k in range(4):
        kick(bt(2, k), 0.6, 0.45, filtered=True)
    for k in range(2):
        kick(bt(3, k), 0.7, 0.5, filtered=True)
    hats_bar(2, "off8", 0.45)
    hats_bar(3, "16", 0.42, skip_from=8)
    bass_bar(2, "root8", 260, 0.45)
    bass_bar(3, "root8", 420, 0.55)
    # bar 3: snare 8ths crescendo (frames 180-202.5) then a high-to-low tom fill (210-228.75)
    for k in range(4):
        snare(bt(3, k * 0.5), 0.28 + 0.1 * k, k)
    tom_fill(bt(3, 2), 6, 0.62)
    hit(180, "build: 8th-note snares crescendo")
    hit(210, "tom fill, 16ths high to low (210-229)")
    put("fx", noise_riser(fr(232) - fr(120), 250, 9000, 2.6, 1), fr(120), 0.2)
    hit(232, "near-silence gap 232-240 (everything cut to -40 dB)")

    # ============ grooves: bars 4-21 ============
    groove = {
        # bar: (bass, arp pattern, arp cut, hats, claps, shaker)
        4: ("oct8", "updown", 2600, "16", False, False),
        5: ("oct8", "updown", 2600, "16", False, False),
        6: ("oct8", "updown", 2600, "16", False, False),
        7: ("oct8", "updown", 2700, "16", False, False),
        8: ("oct8", "pedal", 2900, "16", True, True),
        9: ("oct8", "pedal", 2900, "16", True, True),
        10: ("oct16", "pedal", 3000, "16", True, True),
        11: ("oct16", "pedal", 3000, "16", True, True),
        12: ("oct16", "updown", 3000, "16", False, True),
        13: ("oct8", "climb", 3100, "16", False, False),
        14: ("oct8", "climb", 3100, "16", True, False),
        15: ("oct8", "climb", 3200, "16", True, False),
        16: ("oct16", "updown", 3200, "16", True, True),
        17: ("oct16", "updown", 3200, "16", True, True),
        18: ("oct16", "pedal", 3200, "16", True, True),
        19: ("oct16", "pedal", 3200, "16", True, True),
        20: ("oct16", "climb", 3300, "16", True, True),
        21: ("oct16", "climb", 3300, "16", True, True),
    }
    fills = {7: "snare4", 9: "snare4", 12: "tom8", 15: "roll", 17: "snare4", 19: "tom8"}
    for bar, (bmode, pat, acut, hmode, claps, shaker) in groove.items():
        fill = fills.get(bar)
        last = 16 if fill is None else (12 if fill == "snare4" else 8)
        for k in range(4):
            if fill in ("tom8",) and k == 3:
                continue
            kick(bt(bar, k), 1.0, 1.0)
        for k in (1, 3):
            if k == 3 and fill in ("tom8", "roll"):
                continue
            snare(bt(bar, k), 1.0, bar + k)
            if claps:
                put("snare", CLAP, bt(bar, k) + 0.004, 0.55)
        hats_bar(bar, hmode, 1.0, skip_from=last)
        if shaker:
            for k in range(last):
                put("hats", SHAKER, bt(bar) + k * STEP, 0.32 * (1.0 if k % 2 else 0.6), 0.5)
        bass_bar(bar, bmode, 1000 if bar < 13 else 1150)
        arp_bar(bar, pat, lambda t, c=acut: c, 0.8)
        pad_bar(bar, 0.8, 2000)
        if fill == "snare4":
            for k in range(4):
                snare(bt(bar, 3) + k * STEP, 0.35 + 0.1 * k, k)
        elif fill == "tom8":
            tom_fill(bt(bar, 2), 8, 0.62)
        elif fill == "roll":
            for k in range(8):
                snare(bt(bar, 2) + k * STEP, 0.22 + 0.06 * k, k)

    # drop + section accents
    hit(240, "DROP (F3): crash + sub boom + full band + lead hook")
    put("fx", sub_boom(1.8), fr(240), 0.75)
    crash(240, 0.9)
    crash(360, 0.55, "F4: crash, hook continues (answer phrase)")
    hit(465, "16th snare pickup fill into F5 (465-480)")
    crash(480, 0.65, "F5: crash, claps + shaker join, arp switches to pedal pattern")
    hit(585, "16th snare pickup fill into F6 (585-600)")
    put("fx", reverse_cymbal(1.0, 3), fr(600) - 1.0, 0.45)
    crash(600, 0.7, "F6: crash, bass goes to 16th octaves (more drive)")
    put("stab", stab(CH["F#m"]["stab"]), fr(720), 0.75)
    hit(720, "synth stab, lead rests for a bar")
    hit(750, "tom fill into F7 (750-780)")
    crash(780, 0.8, "F7: crash + sub, arp climbs, glass-bell counter-melody")
    put("fx", sub_boom(1.2, 66, 36), fr(780), 0.45)
    put("stab", stab(CH["E"]["stab"]), fr(900), 0.7)
    crash(900, 0.5, "F7 accent: synth stab + crash (lock the stat landing here)")
    for i, (bar, steps) in enumerate([(13, [(0, 81), (6, 78), (12, 74)]), (14, [(0, 85), (6, 81), (12, 76)]),
                                      (15, [(0, 83), (6, 80)])]):
        for s, m in steps:
            put("bell", bell(m), bt(bar) + s * STEP, 0.5)
    hit(930, "16th snare roll + riser into F8 (930-960)")
    put("fx", noise_riser(1.5, 400, 7000, 2.0, 2), fr(915), 0.22)
    crash(960, 0.8, "F8: crash, lead hook returns (octave-doubled)")
    put("fx", sub_boom(1.2, 66, 36), fr(960), 0.4)
    hit(1050, "16th snare pickup fill into F9 (1050-1080)")
    crash(1080, 0.6, "F9: crash, hook answer phrase")
    hit(1170, "tom fill into F10 (1170-1200)")
    crash(1200, 0.7, "F10: crash, lead out, counter stabs")
    for f, c in [(1230, "F#m"), (1245, "F#m"), (1260, "D"), (1275, "D")]:
        put("stab", stab(CH[c]["stab"], 0.3), fr(f), 0.62)
        hit(f, "counter stab")
    hit(1305, "tape-stop on the whole band (1305-1320)")

    # lead hook placements
    lead(HOOK, 4, 1.0)
    lead(HOOK[:18], 16, 1.0, double=0.42)

    # ============ F11 breakdown: bar 22 (1320-1380) ============
    hit(1320, "F11 BREAKDOWN: Amaj9 pad + arp only, filter closing")
    bd_cut = lambda t: 500 + 1500 * np.clip(1 - (t - bt(22)) / 0.9, 0, 1)
    put("bd", pad_chord(CH["Amaj9"]["pad"], BAR, 1500, 0.08, 1.2, seed=22), bt(22), 1.15)
    arp_bar(22, "updown", bd_cut, 0.75, busname="bd")
    put("fx", noise_riser(fr(1377) - fr(1335), 300, 8000, 2.6, 3), fr(1335), 0.26)
    for k in range(11):
        t = bt(22, 2) + k * STEP * (8 / 12)
        put("fx", SNARES[k % 3], t, 0.12 + 0.03 * k)
    hit(1350, "short riser + snare roll into F12 (1350-1377)")
    hit(1377, "breath gap 1377-1380")

    # ============ F12 final lift: bars 23-24, final chord bar 25 ============
    hit(1380, "FINAL LIFT (F12): crash + sub boom + big D(add9) chord + full band + lead")
    put("fx", sub_boom(1.8), fr(1380), 0.75)
    crash(1380, 0.95)
    put("stab", stab(CH["Dadd9"]["stab"], 0.6, 2400, 7), fr(1380), 0.75)
    for bar in (23, 24):
        for k in range(4):
            if bar == 24 and k == 3:
                continue
            kick(bt(bar, k), 1.0, 1.0)
        for k in (1, 3):
            if bar == 24 and k == 3:
                continue
            snare(bt(bar, k), 1.0, k)
            put("snare", CLAP, bt(bar, k) + 0.004, 0.55)
        hats_bar(bar, "16", 1.0, skip_from=16 if bar == 23 else 8)
        for k in range(16 if bar == 23 else 8):
            put("hats", SHAKER, bt(bar) + k * STEP, 0.32 * (1.0 if k % 2 else 0.6), 0.5)
        bass_bar(bar, "oct16", 1200)
        arp_bar(bar, "updown", lambda t: 3300, 0.8)
        pad_bar(bar, 0.95, 2300)
        put("pad", pad_chord([m + 12 for m in CH[chord_of(bar)]["pad"][1:]], BAR, 3000, 0.15, 0.9, seed=40 + bar),
            bt(bar), 0.38)
        arp_bar(bar, "updown", lambda t: 2400, 0.3, oct_=12)
    tom_fill(bt(24, 2), 8, 0.7)
    hit(1470, "big tom fill into the final chord (1470-1500)")
    lead(ENDING, 23, 1.15, double=0.5)

    hit(1500, "FINAL CHORD F#m9: last kick + crash + sub, band stops, tail fades to silence")
    kick(fr(1500), 1.0, 0.0)
    crash(1500, 0.8)
    put("fx", sub_boom(2.0, 60, 30), fr(1500), 0.6)
    put("final", pad_chord(CH["F#m9"]["pad"], 1.7, 2300, 0.02, 1.4, voices=6, seed=25), fr(1500), 1.2)
    put("final", stab(CH["F#m9"]["stab"], 0.9, 2600, 9), fr(1500), 0.6)
    put("final", to_st(bass_note(30, 1.6, 600)), fr(1500), 0.55)
    hit(1560, "end: silence")

    return buses, kicks, sorted(hits)


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
    z = lambda name: buses.get(name, np.zeros((N + TAIL, 2)))
    g = {"kick": 0.40, "snare": 0.74, "crash": 0.42, "hats": 0.80, "bass": 0.30, "pad": 0.60,
         "arp": 0.31, "lead": 0.27, "stab": 0.42, "bell": 0.14, "fx": 0.55, "bd": 0.30, "final": 0.55}
    st = {k: z(k) * v for k, v in g.items()}

    st["bass"] *= duck_env(kicks, 0.62, 0.11)
    st["pad"] *= duck_env(kicks, 0.55, 0.16)
    st["arp"] *= duck_env(kicks, 0.35, 0.12)
    st["lead"] *= duck_env(kicks, 0.15, 0.1)

    # space
    hall = make_ir(2.4, 5200, 3, 0.02)
    plate = make_ir(1.1, 6500, 4, 0.008)
    arp_dly = pingpong(st["arp"], 0.375, 0.42, 6, 3000)[: N + TAIL] * 0.55
    lead_dly = pingpong(st["lead"], 0.375, 0.36, 5, 3400)[: N + TAIL] * 0.45
    bell_dly = pingpong(st["bell"], 0.375, 0.45, 6, 4000)[: N + TAIL] * 0.6
    send = (st["pad"] * 0.35 + st["arp"] * 0.3 + st["lead"] * 0.35 + st["stab"] * 0.4
            + st["bell"] * 0.8 + st["snare"] * 0.12 + arp_dly * 0.4 + lead_dly * 0.4)
    hall_band = conv(send, hall)[: N + TAIL] * 0.55
    plate_band = conv(st["snare"] * 0.15 + st["lead"] * 0.2, plate)[: N + TAIL] * 0.4
    hall_band *= duck_env(kicks, 0.35, 0.18)

    band = (st["kick"] + st["snare"] + st["crash"] + st["hats"] + st["bass"] + st["pad"] + st["arp"] + st["lead"]
            + st["stab"] + st["bell"] + arp_dly + lead_dly + bell_dly + hall_band + plate_band)

    # bar 21 beat 4: tape-stop the band, then band silent through the breakdown
    band = tape_stop(band, fr(1305), fr(1320))
    i0, i1 = S(fr(1320)), S(fr(1380))
    band[i0:i1] = 0.0

    bd = st["bd"]
    bd_dly = pingpong(bd, 0.375, 0.45, 6, 2500)[: N + TAIL] * 0.5
    bd_hall = conv(bd * 0.6 + bd_dly * 0.5, make_ir(3.2, 4500, 8, 0.03))[: N + TAIL] * 0.7
    air = bd + bd_dly + bd_hall

    fin = st["final"]
    fin_hall = conv(fin, make_ir(3.6, 5000, 12, 0.02))[: N + TAIL] * 0.6
    fx_hall = conv(st["fx"], plate)[: N + TAIL] * 0.25

    mix = band + air + fin + fin_hall + st["fx"] + fx_hall
    mix = mix[:N]
    stems = {k: v[:N] for k, v in st.items()}
    stems["band_total"] = band[:N]
    return mix, stems


def gate(x, a, b, level, ramp=0.004):
    i, j, r = S(a), S(b), S(ramp)
    g = np.ones(len(x))
    g[i:j] = level
    g[i - r:i] = np.linspace(1, level, r)
    g[j:j + r] = np.linspace(level, 1, r)
    return x * g[:, None]


def master(mix, target=-16.0, ceiling=-2.2):
    x = np.stack([hp(mix[:, c], 30, 2) for c in range(2)], 1)
    # gentle high-shelf style smoothing: blend a low-passed copy so nothing above ~10 kHz bites
    x = 0.72 * x + 0.28 * lp_static(x, 7500, 0.6)
    x = gate(x, fr(232), fr(240), 10 ** (-40 / 20))
    x = gate(x, fr(1377), fr(1380), 10 ** (-26 / 20), 0.003)
    x = glue(x)
    gain = 1.0
    for _ in range(6):
        y = limiter(x * gain, ceiling)
        L = lufs(y)
        if abs(L - target) < 0.1:
            break
        gain *= 10 ** ((target - L) / 20)
    # tail: final chord rings from 1500, fades to true silence by 1560
    n = len(y)
    a = S(fr(1512))
    p = np.linspace(0, 1, n - a)
    y[a:] *= (np.cos(p * np.pi / 2) ** 2)[:, None]
    y[-S(0.01):] = 0.0
    return y, gain


def analyse(y, stems, hits, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    mono = y.mean(1)
    f, tt, Sx = signal.spectrogram(mono, SR, nperseg=4096, noverlap=4096 - 1024)
    fig, ax = plt.subplots(3, 1, figsize=(18, 11), gridspec_kw=dict(height_ratios=[3, 1.4, 1.4]), sharex=True)
    ax[0].pcolormesh(tt * FPS, f, 10 * np.log10(Sx + 1e-14), shading="auto", cmap="magma", vmin=-130, vmax=-40)
    ax[0].set_yscale("log")
    ax[0].set_ylim(30, 16000)
    ax[0].set_ylabel("Hz")
    ax[0].set_title("bed.wav: spectrogram (x axis = video frames @30fps)")
    hopf = SR // FPS
    nf = len(mono) // hopf
    rms = np.sqrt((y[: nf * hopf] ** 2).mean(1).reshape(nf, hopf).mean(1))
    pk = np.abs(y[: nf * hopf]).max(1).reshape(nf, hopf).max(1)
    ax[1].plot(np.arange(nf), 20 * np.log10(rms + 1e-9), lw=1, label="RMS / frame")
    ax[1].plot(np.arange(nf), 20 * np.log10(pk + 1e-9), lw=0.6, alpha=0.6, label="peak / frame")
    ax[1].axhline(-2, color="r", lw=0.6, ls="--")
    ax[1].set_ylim(-70, 0)
    ax[1].set_ylabel("dBFS")
    ax[1].legend(loc="lower left", fontsize=8)
    for name, col in [("kick", "k"), ("bass", "tab:blue"), ("pad", "tab:green"), ("arp", "tab:orange"),
                      ("lead", "tab:red"), ("snare", "tab:purple"), ("bd", "tab:cyan")]:
        s = stems[name][: nf * hopf]
        r = np.sqrt((s ** 2).mean(1).reshape(nf, hopf).mean(1))
        ax[2].plot(np.arange(nf), 20 * np.log10(r + 1e-9), lw=0.8, label=name, color=col)
    ax[2].set_ylim(-60, -5)
    ax[2].set_ylabel("stem RMS (pre-master)")
    ax[2].legend(loc="lower left", ncol=7, fontsize=8)
    sections = [(0, "F1"), (120, "F2"), (240, "F3 DROP"), (360, "F4"), (480, "F5"), (600, "F6"), (780, "F7"),
                (960, "F8"), (1080, "F9"), (1200, "F10"), (1320, "F11"), (1380, "F12"), (1500, "out")]
    for a in ax:
        for fnum, lab in sections:
            a.axvline(fnum, color="c", lw=0.8, alpha=0.8)
        a.set_xlim(0, 1560)
    for fnum, lab in sections:
        ax[0].text(fnum + 3, 12000, lab, color="w", fontsize=9)
    for fnum, lab in hits:
        ax[1].axvline(fnum, color="y", lw=0.5, alpha=0.5)
    ax[2].set_xlabel("frame")
    ax[2].set_xticks(np.arange(0, 1561, 60))
    fig.tight_layout()
    fig.savefig(path, dpi=90)
    plt.close(fig)


def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    os.makedirs(REVIEW_DIR, exist_ok=True)
    buses, kicks, hits = compose()
    mix, stems = mixdown(buses, kicks)
    y, gain = master(mix)
    path = os.path.join(AUDIO_DIR, "bed.wav")
    write_wav(path, y)
    sections = [
        ("F1", "Origin", 0, 120), ("F2", "Thesis", 120, 240), ("F3", "Name (DROP)", 240, 360),
        ("F4", "Fortmindz 2022", 360, 480), ("F5", "Impero IT 2023", 480, 600),
        ("F6", "miniOrange 2024-now", 600, 780), ("F7", "Five days", 780, 960), ("F8", "What I do", 960, 1080),
        ("F9", "How I work", 1080, 1200), ("F10", "Numbers", 1200, 1320),
        ("F11", "Make complex feel calm (breakdown)", 1320, 1380), ("F12", "Invitation", 1380, 1560),
    ]
    kick_frames = sorted({round(t * FPS, 2) for t, k in kicks if k >= 1.0 or t >= fr(1500) - 1e-6})
    with open(os.path.join(AUDIO_DIR, "bed-hits.json"), "w") as fh:
        json.dump(dict(fps=FPS, bpm=BPM, beat_frames=15, bar_frames=60, duration_frames=1560, key="F# minor",
                       progression="F#m - D - A - E (i-VI-III-VII), cadence D - E - F#m at the end",
                       sections=[dict(id=a, name=b, start=c, end=d) for a, b, c, d in sections],
                       hits=[dict(frame=f, what=w) for f, w in hits],
                       full_band_kicks=kick_frames), fh, indent=1)
    analyse(y, stems, hits, os.path.join(REVIEW_DIR, "bed.png"))
    L = lufs(y)
    print(f"bed.wav {len(y) / SR:.3f}s  peak {20 * np.log10(np.abs(y).max()):.2f} dBFS  "
          f"integrated {L:.2f} LUFS  master gain {20 * np.log10(gain):+.1f} dB")
    seg = lambda a, b: 20 * np.log10(np.sqrt(np.mean(y[S(fr(a)):S(fr(b))] ** 2)) + 1e-9)
    for a, b in [(0, 120), (120, 232), (232, 240), (240, 360), (600, 780), (960, 1080), (1200, 1305),
                 (1320, 1377), (1380, 1500), (1500, 1530), (1530, 1560), (1554, 1560)]:
        print(f"  RMS frames {a:>4}-{b:<4} {seg(a, b):6.1f} dBFS")
    m = y[S(fr(240)):S(fr(1320))].mean(1)
    F, P = signal.welch(m, SR, nperseg=8192)
    tot = P.sum()
    for lo, hi in [(20, 60), (60, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000),
                   (4000, 8000), (8000, 12000), (12000, 20000)]:
        sel = (F >= lo) & (F < hi)
        print(f"  band {lo:>5}-{hi:<5} Hz {10 * np.log10(P[sel].sum() / tot):6.1f} dB of total")
    for k, v in stems.items():
        s = v[S(fr(240)):S(fr(480))]
        print(f"  stem {k:<10} drop RMS {20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-9):6.1f} dB")


if __name__ == "__main__":
    main()
