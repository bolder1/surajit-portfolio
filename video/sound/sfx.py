"""Generate the SFX library into ../public/sfx (all synthesised, royalty-free)."""
from scipy import signal
import os
import numpy as np
from dsp import *

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(OUT, exist_ok=True)
lib = {}


def sub_boom(dur=2.2, f0=90, f1=28):
    x = sine_glide(dur, f0, f1) * env_exp(int(dur * SR), 0.55)
    click = lp(noise(int(0.012 * SR)), 3000) * np.linspace(1, 0, int(0.012 * SR))
    x[: len(click)] += click * 0.8
    return sat(x, 2.2)


def impact(dur=2.6, bright=1.0):
    n = int(dur * SR)
    boom = sub_boom(dur)
    crack = hp(noise(n), 1500) * env_exp(n, 0.035) * 0.9 * bright
    body = bp(noise(n), 120, 900) * env_exp(n, 0.18) * 0.6
    ring = sum(np.sin(2 * np.pi * f * t(dur)) * env_exp(n, d) * g for f, d, g in [(311, 0.9, 0.12), (1130, 0.5, 0.06), (2310, 0.3, 0.04)])
    x = boom + crack + body + ring * bright
    return reverb(sat(x, 1.6), seconds=2.4, mix=0.22, tone=4500)


def whoosh(dur=0.7, f0=250, f1=5000, pan=(-0.9, 0.9), peak=0.6):
    n = int(dur * SR)
    e = np.sin(np.pi * np.clip(np.arange(n) / n / 1.0, 0, 1)) ** 2
    shape = lambda p: f0 * (f1 / f0) ** min(1, p / peak) if p < peak else f1 * (f1 / 900) ** (-(p - peak) / (1 - peak))
    x = sweep_filter(noise(n), f0, f1, q=3.2, curve=shape) * e
    x = x + lp(noise(n), 300) * e * 0.12
    return autopan(x / (np.max(np.abs(x)) + 1e-9), *pan)


def riser(dur=2.0):
    n = int(dur * SR)
    tt = t(dur)
    p = tt / dur
    nz = sweep_filter(noise(n), 300, 9000, q=3)
    saw = signal.sawtooth(2 * np.pi * np.cumsum(180 * (8 ** p)) / SR) * 0.25
    saw = lp(saw, 5000)
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(4 + 26 * p ** 2) / SR)
    x = (nz + saw) * (p ** 2.2) * trem
    return stereo(x, width=12)


def reverse_swell(dur=1.4):
    n = int(dur * SR)
    x = (bp(noise(n), 800, 9000) * env_exp(n, 0.35) + sine_glide(dur, 220, 220) * env_exp(n, 0.5) * 0.2)
    x = x[::-1]
    return reverb(x, 1.2, 0.3)[:n]


def glitch(dur=0.32, seed=1):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    x = np.zeros(n)
    i = 0
    while i < n:
        L = int(r.uniform(0.008, 0.04) * SR)
        kind = r.integers(0, 4)
        tt = np.arange(L) / SR
        if kind == 0:
            seg = signal.square(2 * np.pi * r.uniform(80, 1800) * tt) * 0.6
        elif kind == 1:
            seg = noise(L)
            seg = np.round(seg * 4) / 4
        elif kind == 2:
            seg = np.sin(2 * np.pi * r.uniform(2000, 7000) * tt) * 0.5
        else:
            seg = np.zeros(L)
        x[i:i + L] = seg[: n - i] * (r.uniform(0.3, 1.0))
        i += L
    x = np.round(x * 12) / 12  # bitcrush
    return stereo(hp(x, 120), pan=r.uniform(-0.4, 0.4), width=4)


def click(f=4200, dur=0.03):
    n = int(dur * SR)
    x = bp(noise(n), f * 0.6, min(f * 1.6, 20000)) * env_exp(n, 0.0025)
    x += np.sin(2 * np.pi * (f / 2) * t(dur)) * env_exp(n, 0.004) * 0.4
    return x


def key(seed):
    r = np.random.default_rng(seed)
    dur = 0.09
    n = int(dur * SR)
    x = bp(noise(n), r.uniform(1800, 2600), r.uniform(5000, 8000)) * env_exp(n, r.uniform(0.006, 0.011))
    thump = np.sin(2 * np.pi * r.uniform(110, 160) * t(dur)) * env_exp(n, 0.012) * 0.6
    tail = bp(noise(n), 3000, 6000) * env_exp(n, 0.02) * 0.08
    second = np.zeros(n)
    d = int(r.uniform(0.018, 0.03) * SR)
    second[d:] = bp(noise(n - d), 2500, 7000) * env_exp(n - d, 0.004) * 0.35
    return stereo(x + thump + tail + second, pan=r.uniform(-0.25, 0.25))


def blip(f=1800, dur=0.09, glide=1.0):
    x = sine_glide(dur, f, f * glide) * env_exp(int(dur * SR), 0.025)
    x += sine_glide(dur, f * 2, f * 2 * glide) * env_exp(int(dur * SR), 0.012) * 0.25
    return fade(x, 0.001, 0.01)


def data_chatter(dur=1.0, seed=5, density=22):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for k in range(int(dur * density)):
        s = int(r.uniform(0, dur - 0.06) * SR)
        b = stereo(blip(r.choice([1200, 1600, 2400, 3200, 4800]), 0.04), pan=r.uniform(-0.7, 0.7)) * r.uniform(0.3, 0.9)
        out[s:s + len(b)] += b[: n - s]
    return out


def scan(dur=1.6):
    n = int(dur * SR)
    tt = t(dur)
    f = 300 + 900 * (0.5 - 0.5 * np.cos(2 * np.pi * tt / dur * 1.0))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR) * 0.15
    trem = 0.7 + 0.3 * np.sin(2 * np.pi * 18 * tt)
    hum = np.sin(2 * np.pi * 60 * tt) * 0.25 + np.sin(2 * np.pi * 120 * tt) * 0.1
    x = (tone * trem + hum) * adsr(n, 0.08, 0.3)
    return reverb(stereo(x, width=8), 1.0, 0.25)


def granted(dur=2.6):
    n = int(dur * SR)
    out = np.zeros(n)
    for i, (f, st) in enumerate([(659.25, 0.0), (987.77, 0.11), (1318.5, 0.22)]):
        s = int(st * SR)
        L = n - s
        tt = np.arange(L) / SR
        tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt) + 0.12 * np.sin(2 * np.pi * f * 3.01 * tt))
        out[s:] += tone * env_exp(L, 0.6) * adsr(L, 0.004, 0.2) * (0.8 - i * 0.1)
    return reverb(out, 2.2, 0.38, tone=7000)


def lock_clunk(dur=1.2):
    n = int(dur * SR)
    thunk = np.sin(2 * np.pi * 70 * t(dur)) * env_exp(n, 0.09)
    metal = sum(np.sin(2 * np.pi * f * t(dur)) * env_exp(n, d) * g for f, d, g in [(523, 0.25, 0.25), (1377, 0.12, 0.15), (2871, 0.06, 0.1)])
    clack = bp(noise(n), 1500, 6000) * env_exp(n, 0.01)
    x = thunk + metal + clack
    x2 = np.zeros(n)
    d = int(0.07 * SR)
    x2[d:] = (bp(noise(n - d), 2000, 7000) * env_exp(n - d, 0.006)) * 0.7
    return reverb(sat(x + x2, 1.4), 1.0, 0.2)


def dial_ticks(dur=1.0, count=14):
    n = int(dur * SR)
    out = np.zeros(n)
    for k in range(count):
        s = int((k / count) ** 1.3 * (dur - 0.05) * SR)
        c = click(3000 + 300 * (k % 3), 0.03) * (0.5 + 0.5 * (k % 2))
        out[s:s + len(c)] += c[: n - s]
    return stereo(out, width=3)


def power_down(dur=0.9):
    n = int(dur * SR)
    x = signal.sawtooth(2 * np.pi * np.cumsum(np.linspace(400, 30, n)) / SR) * env_exp(n, 0.4)
    return stereo(lp(x, 2500) * 0.7)


def heartbeat(dur=1.0):
    n = int(dur * SR)
    out = np.zeros(n)
    for s in (0.0, 0.22):
        i = int(s * SR)
        L = n - i
        out[i:] += np.sin(2 * np.pi * 48 * np.arange(L) / SR) * env_exp(L, 0.09) * (1 if s == 0 else 0.7)
    return sat(out, 1.8)


def snap_tick(dur=0.06):
    n = int(dur * SR)
    x = hp(noise(n), 3000) * env_exp(n, 0.004) + np.sin(2 * np.pi * 900 * t(dur)) * env_exp(n, 0.006) * 0.5
    return x


def tape_stop(dur=0.8):
    n = int(dur * SR)
    tt = t(dur)
    f = 220 * (1 - tt / dur) ** 2 + 20
    x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * 0.5 + bp(noise(n), 100, 1200) * 0.3
    return stereo(lp(x, 1800) * np.linspace(1, 0, n))


def shimmer(dur=1.8):
    n = int(dur * SR)
    out = np.zeros(n)
    r = np.random.default_rng(9)
    for k in range(18):
        f = r.choice([1318.5, 1567.98, 1975.5, 2637.0, 3135.9])
        s = int(r.uniform(0, dur * 0.6) * SR)
        L = n - s
        out[s:] += np.sin(2 * np.pi * f * np.arange(L) / SR) * env_exp(L, 0.25) * 0.15
    return reverb(out, 2.0, 0.5, tone=9000)


GEN = {
    "boom": lambda: sub_boom(),
    "impact": lambda: impact(),
    "impact-soft": lambda: impact(2.0, bright=0.35) * 0.8,
    "whoosh": lambda: whoosh(0.7),
    "whoosh-long": lambda: whoosh(1.3, 180, 3800, peak=0.7),
    "whoosh-rev": lambda: whoosh(0.6, 5000, 300, pan=(0.9, -0.9), peak=0.4),
    "swish": lambda: whoosh(0.32, 1200, 9000, pan=(-0.5, 0.6), peak=0.5),
    "riser": lambda: riser(2.0),
    "riser-long": lambda: riser(4.0),
    "swell": lambda: reverse_swell(),
    "glitch-1": lambda: glitch(0.3, 1),
    "glitch-2": lambda: glitch(0.22, 2),
    "glitch-3": lambda: glitch(0.45, 3),
    "click": lambda: stereo(click(4200)),
    "click-lo": lambda: stereo(click(2200, 0.04)),
    "blip": lambda: stereo(blip(1800)),
    "blip-hi": lambda: stereo(blip(2800, 0.07)),
    "blip-up": lambda: stereo(blip(1200, 0.14, 1.8)),
    "blip-down": lambda: stereo(blip(2400, 0.14, 0.55)),
    "chatter": lambda: data_chatter(1.0),
    "chatter-long": lambda: data_chatter(2.2, 8, 26),
    "scan": lambda: scan(),
    "granted": lambda: granted(),
    "lock": lambda: lock_clunk(),
    "dial": lambda: dial_ticks(),
    "power-down": lambda: power_down(),
    "heartbeat": lambda: heartbeat(),
    "snap": lambda: stereo(snap_tick()),
    "tape-stop": lambda: tape_stop(),
    "shimmer": lambda: shimmer(),
}
for i in range(6):
    GEN[f"key-{i}"] = (lambda s: (lambda: key(s)))(i + 10)

if __name__ == "__main__":
    for name, fn in GEN.items():
        write(os.path.join(OUT, f"{name}.wav"), fn(), peak_db=-1.0)
    print("wrote", len(GEN), "sfx")
