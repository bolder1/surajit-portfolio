#!/usr/bin/env python3
"""Final sound mix for the designer reel: every cue in sound/cues.py on top of assets/audio/bed.wav.

    python3 sound/mix.py     # writes assets/audio/mix.wav, sound/mix-stats.txt, review/mix.png

52.000 s, 48 kHz, 16-bit stereo. Levels: each cue's peak is set relative to the bed's kick/snare
peak (see cues.py). A light shared plate send glues the SFX into the bed's space. The master is a
plain gain to about -14 LUFS integrated; a true-peak limiter (ceiling -1.3 dBTP) runs only if the
gained mix would pass -1.2 dBTP, and the stats report how much it did. Loudness and true peak are
measured with ffmpeg's ebur128 on the written file.

Everything is synthesised (numpy/scipy); ../../video/sound/dsp.py is imported read-only.
"""
import os
import re
import subprocess
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True   # keep sound/ and ../../video free of __pycache__
sys.path.insert(0, HERE)
import compose as C  # noqa: E402
import cues as Q  # noqa: E402
import sfx_special as X  # noqa: E402
from dsp import SR, autopan  # noqa: E402

REEL = C.REEL
S = C.S
FPS = 30
N = int(round(52.0 * SR))                       # 2,496,000 samples
BED = os.path.join(REEL, "assets", "audio", "bed.wav")
HITS = os.path.join(REEL, "assets", "audio", "bed-hits.json")
OUT = os.path.join(REEL, "assets", "audio", "mix.wav")
STATS = os.path.join(HERE, "mix-stats.txt")
PNG = os.path.join(REEL, "review", "mix.png")

TARGET_LUFS = -14.0
TP_CEILING = -1.3          # limiter ceiling (dBTP), only used if needed
TP_TRIGGER = -1.2          # limit only if the gained mix would exceed this
FADE_IN, FADE_OUT = 0.002, 0.005   # every cue edge (2 ms in, 5 ms out)
GUARD_FADE = 0.02          # a tail running into a silence fades out over 20 ms, ending at the silence
TAIL_FADE = (1520, 1558)   # the shimmer (and any tail) fades with the bed, digital zero after 1558

# shared plate send per sound family (the SFX sit in the bed's room, not on top of it)
SEND = [("glass-tink", 0.06), ("blip", 0.14), ("arcade", 0.10), ("synth-stab", 0.0), ("sine-calm", 0.10),
        ("shimmer", 0.0), ("key-", 0.03), ("click", 0.04), ("snap", 0.04), ("swish", 0.08),
        ("whoosh", 0.06), ("laser-rev", 0.0), ("laser", 0.06), ("hum-", 0.08), ("gated-snare", 0.0), ("boom", 0.0),
        ("crt-", 0.06), ("tape-rewind", 0.0)]
CATS = [("tonal", ("blip", "glass-tink", "arcade", "synth-stab", "sine-calm", "shimmer")),
        ("type / UI", ("key-", "click", "snap")),
        ("motion", ("swish", "whoosh", "laser", "hum-")),
        ("hits", ("gated-snare", "boom")),
        ("tube / tape", ("crt-", "tape-rewind"))]
CAT_COLORS = {"tonal": "#2a78d6", "type / UI": "#eb6834", "motion": "#1baf7a", "hits": "#e87ba4",
              "tube / tape": "#4a3aa7"}


def sx(frame):
    return int(round(frame / FPS * SR))


def db(x):
    return 20 * np.log10(max(float(x), 1e-12))


def send_of(name):
    for k, v in SEND:
        if name.startswith(k):
            return v
    return 0.05


def cat_of(name):
    for c, prefixes in CATS:
        if name.startswith(prefixes):
            return c
    return "tonal"


# --------------------------------------------------------------------------- reference level
def bed_reference(bed):
    """Median peak of the bed around its full-band kicks and backbeat snares (dBFS)."""
    import json
    hits = json.load(open(HITS))
    kicks = [k for k in hits["full_band_kicks"] if k < 1500]
    snares = [b * 60 + o for b in list(range(4, 22)) + [23] for o in (15, 45)]
    a = np.abs(bed).max(1)
    pk = [db(a[max(0, sx(f) - S(0.005)): sx(f) + S(0.04)].max()) for f in kicks + snares]
    return float(np.median(pk)), float(np.median(pk[: len(kicks)])), float(np.median(pk[len(kicks):]))


# --------------------------------------------------------------------------- one cue
PLATE = C.make_ir(1.2, 6500, seed=29, predelay=0.015, hp_f=350)


def apply_pan(x, pan):
    if isinstance(pan, (tuple, list)):
        return autopan(x.mean(1), pan[0], pan[1])
    if pan == 0:
        return x
    return x * np.array([np.sqrt(1 - pan), np.sqrt(1 + pan)])


def render_cue(c, ref_db):
    """-> (start sample, stereo buffer incl. plate send, stats dict)."""
    x = X.fade(X.load(c.name), FADE_IN, FADE_OUT)
    x = apply_pan(x, c.pan)
    pk = np.abs(x).max()
    x = x * (10 ** ((ref_db + c.gain_db) / 20) / pk)
    edge = max(np.abs(x[0]).max(), np.abs(x[-1]).max()) / (np.abs(x).max() + 1e-12)   # 0 = faded to silence
    s = send_of(c.name)
    if s > 0:
        wet = C.conv(x, PLATE) * s
        y = wet
        y[: len(x)] += x
    else:
        y = x
    i0 = sx(c.frame)
    y = y.copy()
    # guards: a tail never reaches into the silences, and everything follows the bed's fade-out
    for a, b in Q.SILENCES:
        ia = sx(a)
        if i0 < ia < i0 + len(y):
            k = ia - i0
            g = S(GUARD_FADE)
            y[max(0, k - g):k] *= np.cos(np.linspace(0, np.pi / 2, min(g, k)))[:, None] ** 2
            y[k:] = 0
    fa, fb = sx(TAIL_FADE[0]), sx(TAIL_FADE[1])
    if i0 + len(y) > fa:
        t = np.arange(i0, i0 + len(y))
        env = np.cos(np.clip((t - fa) / (fb - fa), 0, 1) * np.pi / 2) ** 2
        y *= env[:, None]
    y = y[: max(0, N - i0)]
    return i0, y, dict(edge=edge, dry_len=len(x), peak=float(np.abs(x).max()))


# --------------------------------------------------------------------------- master
def true_peak_env(y, os_=4):
    up = signal.resample_poly(y, os_, 1, axis=0)
    a = np.abs(up).max(1)
    return a[: os_ * len(y)].reshape(len(y), os_).max(1)


def tp_limit(y, ceiling_db=TP_CEILING, look=0.0015, release=0.08, blk=32):
    """Look-ahead peak limiter driven by a 4x oversampled detector (gentle; only touches overs)."""
    c = 10 ** (ceiling_db / 20)
    a = true_peak_env(y)
    la = S(look)
    pk = maximum_filter1d(a, size=2 * la + 1, mode="constant")
    g_t = np.minimum(1, c / np.maximum(pk, 1e-9))
    nb = int(np.ceil(len(y) / blk))
    gb = np.concatenate([g_t, np.ones(nb * blk - len(y))]).reshape(nb, blk).min(1)
    rel = np.exp(-blk / (release * SR))
    out = np.empty(nb)
    g = 1.0
    for i in range(nb):
        g = min(gb[i], 1 - (1 - g) * rel)
        out[i] = g
    out = np.minimum(out, np.concatenate([out[1:], [1]]))
    gs = np.repeat(out, blk)[: len(y)]
    gs = np.convolve(np.pad(gs, blk, mode="edge"), np.ones(blk) / blk, mode="same")[blk:-blk]
    gs = np.minimum(gs, g_t)
    gr = -20 * np.log10(gs)
    stats = dict(max_gr=float(gr.max()), ms_over_0_5=float((gr > 0.5).sum() / SR * 1000),
                 ms_over_0_1=float((gr > 0.1).sum() / SR * 1000))
    return y * gs[:, None], stats


def master(mix, g=1.0, refine=True):
    lim = None
    for _ in range(6 if refine else 1):
        y = mix * g
        lim = None
        if db(true_peak_env(y).max()) > TP_TRIGGER:
            y, lim = tp_limit(y)
        if not refine:
            break
        L = C.lufs(y)
        if abs(L - TARGET_LUFS) < 0.03:
            break
        g *= 10 ** ((TARGET_LUFS - L) / 20)
    y[-S(0.01):] = 0.0
    return y, g, lim


def ebur128(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-filter_complex",
                        "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    txt = r.stderr[r.stderr.rfind("Summary:"):]
    get = lambda pat: float(re.search(pat, txt, re.S).group(1))
    return dict(I=get(r"I:\s+(-?[\d.]+) LUFS"), LRA=get(r"LRA:\s+(-?[\d.]+) LU"),
                TP=get(r"True peak:.*?Peak:\s+(-?[\d.]+) dBFS"))


# --------------------------------------------------------------------------- checks
def click_suspects(y, placements, own_of=None):
    """Run on the SFX bus (the bed is a finished master). A click at a cue edge shows as a spike in the
    2nd difference right at the edge that is bigger than anything in the 10 ms of the cue next to it.
    Count edges where that happens (>1.5x). With `own_of` (index -> that cue's own rendered buffer, at y's gain),
    a flagged edge is traced: if the cue's own 2nd difference at that edge is under 10% of the spike, the spike
    belongs to another cue sounding there (typically the next key's attack) and the edge is listed as masked,
    not as a click. `worst` is the worst ratio among edges that were not traced away."""
    m = y.mean(1)
    d2 = np.abs(np.diff(m, 2))
    sus, masked, worst = [], [], 0.0
    w, body = S(0.001), S(0.010)
    starts = np.array(sorted(p[2] for p in placements))
    for idx, (f, name, i0, n) in enumerate(placements):
        for e, side in ((i0, +1), (i0 + n, -1)):
            if e - w < 0 or e + w + body >= len(d2):
                continue
            if side < 0 and np.any(np.abs(starts - e) <= 2 * w):
                continue   # another cue starts right here; its attack is not this cue's edge
            at = d2[e - w:e + w].max()
            near = d2[e + w:e + w + body].max() if side > 0 else d2[e - w - body:e - w].max()
            r = at / (near + 1e-12)
            if r > 1.5 and at > 1e-3:           # ignore edges sitting in near-silence (< -60 dBFS steps)
                if own_of is not None:
                    o = np.abs(np.diff(own_of(idx).mean(1), 2))
                    k = e - i0
                    own = o[max(0, k - w):min(len(o), k + w)].max() if len(o) else 0.0
                    if own < 0.1 * at:
                        masked.append((f, name, "start" if side > 0 else "end", round(float(r), 2),
                                       round(20 * np.log10(max(own, 1e-12) / at), 1)))
                        continue
                sus.append((f, name, "start" if side > 0 else "end", round(float(r), 2)))
            if at > 1e-3:
                worst = max(worst, r)
    return sus, worst, masked


def rms_db(y, a, b):
    seg = y[sx(a):sx(b)]
    return db(np.sqrt(np.mean(seg ** 2)))


# --------------------------------------------------------------------------- review plot
def plot(y, bus, cs, placements, path, ref_post):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.lines import Line2D

    hop = SR // 100
    nb = len(y) // hop
    env = np.abs(y[: nb * hop]).max(1).reshape(nb, hop).max(1)
    benv = np.abs(bus[: nb * hop]).max(1).reshape(nb, hop).max(1)
    fr_axis = np.arange(nb) * hop / SR * FPS
    rows = [(0, 390), (390, 780), (780, 1170), (1170, 1560)]
    fig, axes = plt.subplots(len(rows), 1, figsize=(26, 19), facecolor="#fcfcfb")
    runs = []
    for c in cs:
        kind = "keys" if c.name.startswith("key-") else "ticks" if c.name.startswith("arcade-tick") else None
        if kind:
            if runs and runs[-1][0] == kind and c.frame - runs[-1][2] <= 3:
                runs[-1][2] = c.frame
                runs[-1][3] += 1
            else:
                runs.append([kind, c.frame, c.frame, 1, cat_of(c.name)])
    for ax, (a, b) in zip(axes, rows):
        ax.set_facecolor("#fcfcfb")
        sel = (fr_axis >= a) & (fr_axis <= b)
        ax.fill_between(fr_axis[sel], -env[sel], env[sel], color="#b9b8b2", lw=0, label="final mix")
        ax.fill_between(fr_axis[sel], -benv[sel], benv[sel], color="#2a78d6", alpha=0.55, lw=0,
                        label="SFX bus (post-master)")
        for lvl in (ref_post, -ref_post):
            ax.axhline(lvl, color="#52514e", lw=0.6, ls=":")
        for s0, s1 in Q.SILENCES:
            if a <= s0 < b:
                ax.axvspan(s0, s1, color="#e34948", alpha=0.12, lw=0)
                ax.text((s0 + s1) / 2, -0.93, "silence", ha="center", fontsize=8, color="#52514e")
        for sid, s0, s1 in Q.SECTIONS:
            if a <= s0 < b:
                ax.axvline(s0, color="#0b0b0b", lw=1.0)
                ax.text(s0 + 1, 0.95, sid, fontsize=11, weight="bold", va="top", color="#0b0b0b")
        labels = {}
        for c in cs:
            if not (a <= c.frame < b):
                continue
            col = CAT_COLORS[cat_of(c.name)]
            run = c.name.startswith(("key-", "arcade-tick"))
            ax.axvline(c.frame, ymin=0.5, ymax=0.62 if run else 0.8, color=col, lw=0.7 if run else 1.1)
            if not run:
                labels.setdefault(c.frame, []).append(c.name)
        for f, names in labels.items():
            ax.text(f, 0.86, f"{f:g} " + " + ".join(names), rotation=90, fontsize=7.5, va="top", ha="right",
                    color="#0b0b0b", bbox=dict(fc="#fcfcfb", ec="none", alpha=0.7, pad=0.4))
        j = 0
        for kind, f0, f1, n, cat in runs:
            if a <= f0 < b:
                yb = -0.70 - 0.12 * (j % 2)
                ax.plot([f0, max(f1, f0 + 1)], [yb, yb], color=CAT_COLORS[cat], lw=3, solid_capstyle="butt")
                ax.text(f0, yb - 0.04, f"{kind} ×{n} {f0:g}–{f1:g}", fontsize=7.5, va="top", color="#0b0b0b")
                j += 1
        ax.set_xlim(a, b)
        ax.set_ylim(-1.0, 1.0)
        ax.set_xticks(np.arange(a, b + 1, 30))
        ax.set_xticks(np.arange(a, b + 1, 15), minor=True)
        ax.tick_params(labelsize=8, colors="#52514e")
        ax.grid(axis="x", which="major", color="#e4e3df", lw=0.6)
        for sp in ax.spines.values():
            sp.set_color("#c3c2b7")
        ax.set_ylabel("amplitude", fontsize=9, color="#52514e")
    axes[-1].set_xlabel("video frame (30 fps)", fontsize=10, color="#52514e")
    handles = [Line2D([], [], color="#b9b8b2", lw=8, label="final mix"),
               Line2D([], [], color="#2a78d6", lw=8, alpha=0.55, label="SFX bus (post-master)"),
               Line2D([], [], color="#52514e", ls=":", label="bed kick/snare peak (reference)")]
    handles += [Line2D([], [], color=CAT_COLORS[c], lw=2, label=f"cue: {c}") for c, _ in CATS]
    fig.legend(handles=handles, loc="upper right", ncol=4, fontsize=9, frameon=False, bbox_to_anchor=(0.995, 0.995))
    fig.suptitle("mix.wav: waveform with every SFX cue (label = start frame + sound; runs of keys/ticks "
                 "shown as bars)", fontsize=13, x=0.01, y=0.99, ha="left", color="#0b0b0b")
    fig.tight_layout(rect=(0, 0, 1, 0.965))
    fig.savefig(path, dpi=80, facecolor=fig.get_facecolor())
    plt.close(fig)


# --------------------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(PNG), exist_ok=True)
    probs = Q.check()
    if probs:
        print("cue sheet breaks the rules:\n  " + "\n  ".join(probs))
        return 1
    sr, d = wavfile.read(BED)
    assert sr == SR and len(d) == N, "bed.wav must be 52.000 s at 48 kHz"
    bed = d.astype(float) / 32768.0
    ref_db, kick_db, snare_db = bed_reference(bed)

    cs = Q.cues()
    bus = np.zeros((N, 2))
    placements, cue_stats = [], []
    for c in cs:
        i0, y, st = render_cue(c, ref_db)
        bus[i0:i0 + len(y)] += y
        placements.append((c.frame, c.name, i0, min(st["dry_len"], N - i0)))
        cue_stats.append((c, st))

    mix = bed + bus
    y, gain, lim = master(mix)
    C.write_wav(OUT, y)
    meas = ebur128(OUT)
    if abs(meas["I"] - TARGET_LUFS) > 0.15:          # trust ffmpeg's meter over ours
        y, gain, lim = master(mix, gain * 10 ** ((TARGET_LUFS - meas["I"]) / 20), refine=False)
        C.write_wav(OUT, y)
        meas = ebur128(OUT)

    # ---- analysis of the file as written
    sr, d = wavfile.read(OUT)
    w = d.astype(float) / 32768.0
    gdb = db(gain)
    bus_post = bus * gain
    clip_samples = int((np.abs(d.astype(int)) >= 32767).sum())
    tp_env = true_peak_env(w)
    sus, worst, masked = click_suspects(bus_post, placements, lambda i: render_cue(cs[i], ref_db)[1] * gain)
    edge_max = max(st["edge"] for _, st in cue_stats)
    sil = {f"{a}-{b}": rms_db(w, a, b) for a, b in Q.SILENCES}
    ref_post = ref_db + gdb

    lines = []
    P = lines.append
    P("designer reel: final mix stats (written by sound/mix.py)")
    P("=" * 72)
    P(f"file                 assets/audio/mix.wav  {len(w) / SR:.3f} s  {SR} Hz  16-bit stereo")
    P(f"integrated loudness  {meas['I']:.1f} LUFS   (ffmpeg ebur128; target {TARGET_LUFS:.0f}; internal meter "
      f"{C.lufs(w):.2f})")
    P(f"true peak            {meas['TP']:.1f} dBTP  (ffmpeg ebur128; ceiling -1.0)   sample peak "
      f"{db(np.abs(w).max()):.2f} dBFS")
    P(f"loudness range       {meas['LRA']:.1f} LU")
    P(f"master gain          {gdb:+.2f} dB on (bed + SFX)")
    if lim:
        P(f"true-peak limiter    ON: max gain reduction {lim['max_gr']:.2f} dB, {lim['ms_over_0_5']:.0f} ms over "
          f"0.5 dB, {lim['ms_over_0_1']:.0f} ms over 0.1 dB (of 52,000 ms)")
    else:
        P("true-peak limiter    not needed (gain alone stays under the ceiling)")
    P(f"bed reference        kick/snare peak {ref_db:.1f} dBFS pre-master (kicks {kick_db:.1f}, snares "
      f"{snare_db:.1f}); {ref_post:.1f} dBFS post-master")
    P(f"clipping             {clip_samples} samples at full scale")
    P(f"cue edges            {FADE_IN * 1000:.0f} ms fade-in / {FADE_OUT * 1000:.0f} ms fade-out on every cue; "
      f"largest first/last sample = {edge_max:.1e} of the cue's peak (0 = starts and ends in silence)")
    P(f"click scan (SFX bus) {len(sus)} suspect edges of {2 * len(placements)} (2nd-difference spike at a cue edge "
      f"> 1.5x the cue's own next 10 ms); worst ratio {worst:.2f} (edges not traced to another cue)")
    for s in sus[:20]:
        P(f"                       {s}")
    P(f"                     {len(masked)} more edges flagged on the bus but traced to another cue (this cue's own "
      f"2nd difference there is under 10% of the spike)")
    for s in masked[:20]:
        P(f"                       {s[:4]} own edge {s[4]:+.1f} dB vs the spike")
    for k, v in sil.items():
        P(f"silence {k:<12} {v:6.1f} dBFS RMS  ({'OK' if v < -40 else 'TOO LOUD'}: must stay below -40)")
    P(f"after 1505           only the shimmer tail starts; mix RMS 1505-1530 {rms_db(w, 1505, 1530):.1f} dBFS, "
      f"1530-1560 {rms_db(w, 1530, 1560):.1f} dBFS; last 10 ms digital zero: {bool(np.all(d[-S(0.01):] == 0))}")
    P("")
    P("cues per storyboard frame")
    P("-" * 72)
    tot = 0
    for sid, k in Q.counts_by_section(cs).items():
        n = sum(k.values())
        tot += n
        P(f"  {sid:<4} {n:4d}   keys {k['keys']:3d}  counter ticks {k['ticks']:3d}  other {k['other']:3d}")
    P(f"  total {tot}; at most {max(np.bincount([int(c.frame) for c in cs]))} cues start on any one frame")
    P("")
    P("per-second levels (post-master)")
    P("-" * 72)
    P("   sec    frames      sample pk   true pk    RMS       SFX-bus pk")
    for s in range(52):
        a, b = s * SR, (s + 1) * SR
        P(f"  {s:4d}  {s * 30:5d}-{s * 30 + 30:<5d}  {db(np.abs(w[a:b]).max()):7.1f}   {db(tp_env[a:b].max()):7.1f}  "
          f"{db(np.sqrt(np.mean(w[a:b] ** 2))):7.1f}   {db(np.abs(bus_post[a:b]).max()):7.1f}")
    P("")
    P("cue levels (post-master peak; 'vs ref' = against the bed's kick/snare peak)")
    P("-" * 72)
    for c, st in cue_stats:
        P(f"  {c.frame:8.2f}  {c.name:<18} peak {db(st['peak']) + gdb:6.1f} dBFS  vs ref {c.gain_db:+5.1f} dB  "
          f"{c.note}")
    with open(STATS, "w") as fh:
        fh.write("\n".join(lines) + "\n")

    plot(w, bus_post, cs, placements, PNG, 10 ** (ref_post / 20))
    print("\n".join(lines[:22]))
    print(f"wrote {OUT}\n      {STATS}\n      {PNG}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
