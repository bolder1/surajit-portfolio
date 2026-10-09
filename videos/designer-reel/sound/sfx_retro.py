#!/usr/bin/env python3
"""Retro SFX for the designer reel, all synthesised (no samples, no AI).

    python3 sound/sfx_retro.py      # writes assets/sfx/*.wav (48 kHz stereo, peak -1 dBFS)

Pitched sounds are tuned to the bed's key (F# minor) so they sit inside the music.
Also copies the useful sounds from ../../video/public/sfx and re-normalises them to -1 dBFS.
"""
import os
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import compose as C  # noqa: E402  (also puts the reel toolkit dsp.py on sys.path)
from dsp import SR, autopan, bp, hp, lp, sat, stereo, sweep_filter  # noqa: E402

OUT = os.path.join(C.REEL, "assets", "sfx")
LIB = os.path.abspath(os.path.join(C.REEL, "..", "..", "video", "public", "sfx"))
COPY = ["click", "key-0", "key-1", "key-2", "key-3", "key-4", "key-5", "blip", "blip-hi", "blip-up",
        "swish", "whoosh", "riser", "impact", "boom", "snap", "shimmer"]
R = np.random.default_rng(77)
S, hz, to_st = C.S, C.hz, C.to_st


def tt(n):
    return np.arange(n) / SR


def crush(x, bits=6, hold=3):
    """Lo-fi: sample-and-hold + bit reduction, the 8-bit console flavour."""
    y = np.repeat(x[::hold], hold)[: len(x)]
    q = 2 ** (bits - 1)
    return np.round(y * q) / q


def arcade_blip():
    # two-note square chirp C#6 -> F#6 (a 4th up, inside F# minor)
    n = S(0.32)
    f = np.where(tt(n) < 0.05, hz(85), hz(90))
    x = C.pulse(f, n, 0.25) * 0.5
    amp = np.where(tt(n) < 0.05, 1.0, np.exp(-(tt(n) - 0.05) / 0.07))
    amp *= np.minimum(1, tt(n) / 0.001)
    x = crush(x * amp, 7, 2)
    x = lp(lp(x, 7000), 7000)
    echo = np.zeros(n)
    d = S(0.09)
    echo[d:] = x[:-d] * 0.28
    return stereo(x, width=0) * 0.9 + to_st(echo, 0.4)


def laser():
    n = S(0.5)
    t = tt(n)
    f = 160 + 2600 * np.exp(-t / 0.07)
    mod = np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.6
    x = C.pulse(f * (1 + 0.04 * mod), n, 0.5) * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4
    x *= np.exp(-t / 0.12) * np.minimum(1, t / 0.0015) * np.minimum(1, (t[-1] - t) / 0.08)
    x = lp(x, 8000)
    wet = C.pingpong(x, 0.085, 0.35, 4, 4000)
    out = np.zeros((max(len(wet), n), 2))
    out[:n] += to_st(x)
    out[: len(wet)] += wet * 0.8
    return out


def crt_on():
    n = S(1.7)
    t = tt(n)
    # relay thunk + sub (F#1)
    thunk = np.sin(2 * np.pi * np.cumsum(46 + 40 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.2)
    thunk += bp(R.uniform(-1, 1, n), 300, 3000) * np.exp(-t / 0.006) * 0.6
    # degauss "bwoom": F#2 hum with a wobble that settles
    env = np.minimum(1, np.maximum(0, t - 0.04) / 0.08) * np.exp(-np.maximum(0, t - 0.12) / 0.3)
    wob = 1 + 0.5 * np.exp(-t / 0.35) * np.sin(2 * np.pi * 9 * t)
    hum = sum(np.sin(2 * np.pi * hz(42) * k * t) / k ** 1.2 for k in range(1, 7))
    hum = lp(hum * wob * env, 1800) * 0.55
    # static crackle across the tube
    cr = np.zeros(n)
    idx = R.choice(S(0.7), 260, replace=False)
    cr[idx] = R.uniform(-1, 1, len(idx))
    cr = hp(cr, 1800) * np.exp(-t / 0.3) * 1.4
    hiss = hp(R.uniform(-1, 1, n), 4000) * np.exp(-t / 0.18) * 0.08
    # picture "zip" as the beam spreads
    zip_ = np.sin(2 * np.pi * np.cumsum(1800 + 4200 * np.clip((t - 0.05) / 0.25, 0, 1)) / SR)
    zip_ *= np.clip((t - 0.05) / 0.05, 0, 1) * np.exp(-np.maximum(0, t - 0.1) / 0.12) * 0.07
    x = thunk * 0.8 + hum + cr + hiss + zip_
    return C.conv(x, C.make_ir(0.6, 5000, 21, 0.004))[:n] * 0.5 + stereo(x, width=0.4)[:n] * 0.6


def tape_stop():
    # one beat of the bed's vocabulary (kick + F# octave bass + F#m stab), then the tape slows to a halt
    pre, stop = 0.25, 0.85
    n = S(pre + stop + 0.3)
    mus = np.zeros((n, 2))
    mus[: len(C.mk_kick())] += to_st(C.mk_kick()) * 0.7
    for k, m in enumerate([30, 42, 30, 42, 30, 42, 30, 42]):
        b = C.bass_note(m, 0.11, 1000)
        i = S(k * 0.125)
        mus[i:i + len(b)] += to_st(b[: n - i]) * 0.35
    st = C.stab([54, 61, 66, 69, 73], 0.9, 2600, 3)
    mus[: min(n, len(st))] += st[:n] * 0.5
    i0, i1 = S(pre), S(pre + stop)
    p = np.arange(i1 - i0) / (i1 - i0)
    pos = i0 + np.cumsum((1 - p) ** 1.5)
    src = np.arange(n, dtype=float)
    y = mus.copy()
    y[i0:i1] = np.stack([np.interp(pos, src, mus[:, c]) for c in range(2)], 1) * ((1 - p) ** 0.6)[:, None]
    y[i1:] = 0
    return np.stack([hp(y[:, c], 30) for c in range(2)], 1)[:i1 + S(0.02)]


def gated_snare_hit():
    x = C.mk_snare(188, 1)
    pl = C.conv(x.mean(1), C.make_ir(0.5, 6000, 5, 0.006))[: len(x) + S(0.1)]
    out = np.zeros((len(pl), 2))
    out[: len(x)] += x
    return out + pl * 0.12


def synth_stab():
    st = C.stab([42, 54, 61, 66, 69, 73], 0.45, 2800, 4)
    dly = C.pingpong(st, 0.375, 0.32, 3, 3000)
    n = max(len(st), len(dly))
    out = np.zeros((n, 2))
    out[: len(st)] += st
    out[: len(dly)] += dly * 0.5
    hall = C.conv(out.mean(1), C.make_ir(1.4, 5000, 13, 0.01))[:n]
    return out + hall * 0.25


def glass_tink(f0=hz(90)):
    # bright inharmonic ping (free-bar partial ratios), slight L/R detune for a liquid shimmer
    n = S(1.4)
    t = tt(n)
    chans = []
    for c, det in enumerate((1.0, 1.0014)):
        x = np.zeros(n)
        for ratio, dec, g in [(1.0, 0.55, 1.0), (2.756, 0.22, 0.42), (5.404, 0.09, 0.18)]:
            f = f0 * ratio * det
            if f < 14000:
                x += np.sin(2 * np.pi * f * t + c * 0.3) * np.exp(-t / dec) * g
        chans.append(x)
    x = np.stack(chans, 1) * np.minimum(1, t / 0.0006)[:, None]
    tap = hp(R.uniform(-1, 1, S(0.004)), 3000) * np.linspace(1, 0, S(0.004)) * 0.35
    x[: len(tap)] += tap[:, None]
    x = np.stack([lp(x[:, c], 12000) for c in range(2)], 1)
    wet = C.conv(x.mean(1), C.make_ir(1.3, 9000, 31, 0.015, hp_f=1200))[:n]
    return x * 0.85 + wet * 0.3


def whoosh_retro():
    n = S(0.85)
    t = tt(n)
    p = t / t[-1]
    shape = lambda q: 300 * (6000 / 300) ** (q / 0.6) if q < 0.6 else 6000 * (800 / 6000) ** ((q - 0.6) / 0.4)
    nz = sweep_filter(R.uniform(-1, 1, n), 300, 6000, q=2.8, curve=shape)
    nz /= np.max(np.abs(nz)) + 1e-9
    f = 140 * (9 ** np.sin(np.pi * p * 0.5))
    tone = lp(C.saw(f, n) * 0.5, 2500)
    # flanger comb on the tone for that analogue sweep
    d = (0.0015 + 0.0012 * np.sin(2 * np.pi * 1.3 * t)) * SR
    idx = np.arange(n, dtype=float)
    tone = tone + np.interp(idx - d, idx, tone, left=0)
    env = np.sin(np.pi * p) ** 1.6
    x = (nz * 0.8 + tone * 0.35) * env
    return autopan(x, -0.85, 0.85)


GEN = {
    "arcade-blip": arcade_blip,
    "laser": laser,
    "crt-on": crt_on,
    "tape-stop": tape_stop,
    "gated-snare-hit": gated_snare_hit,
    "synth-stab": synth_stab,
    "glass-tink": lambda: glass_tink(hz(90)),      # F#6
    "glass-tink-2": lambda: glass_tink(hz(97)),    # C#7, a fifth up, for a second panel
    "whoosh-retro": whoosh_retro,
}


def write_norm(path, x, peak_db=-1.0):
    x = to_st(np.asarray(x, float))
    x = x / (np.max(np.abs(x)) + 1e-12) * 10 ** (peak_db / 20)
    fl = min(S(0.003), len(x) // 4)
    x[-fl:] *= np.linspace(1, 0, fl)[:, None]
    wavfile.write(path, SR, np.round(x * 32767).astype(np.int16))


def review_sheet(path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 3, figsize=(15, 9))
    for a, name in zip(ax.flat, GEN):
        sr, d = wavfile.read(os.path.join(OUT, f"{name}.wav"))
        f, t, Sx = signal.spectrogram(d.mean(1) / 32768, sr, nperseg=1024, noverlap=896)
        a.pcolormesh(t, f, 10 * np.log10(Sx + 1e-14), shading="auto", cmap="magma", vmin=-120, vmax=-40)
        a.set_yscale("log")
        a.set_ylim(30, 16000)
        a.set_title(name)
    fig.tight_layout()
    fig.savefig(path, dpi=70)
    plt.close(fig)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in GEN.items():
        write_norm(os.path.join(OUT, f"{name}.wav"), fn())
    for name in COPY:
        sr, d = wavfile.read(os.path.join(LIB, f"{name}.wav"))
        assert sr == SR
        x = d.astype(float) / 32768.0
        write_norm(os.path.join(OUT, f"{name}.wav"), x)
    os.makedirs(os.path.join(C.REEL, "review"), exist_ok=True)
    review_sheet(os.path.join(C.REEL, "review", "sfx.png"))
    print("wrote", len(GEN), "synthesised +", len(COPY), "copied sfx to", OUT)


if __name__ == "__main__":
    main()
