"""Small DSP toolkit for synthesising the reel's sound design (48 kHz stereo)."""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(42)


def t(dur):
    return np.arange(int(dur * SR)) / SR


def env_exp(n, decay):
    return np.exp(-np.arange(n) / SR / decay)


def adsr(n, a=0.005, r=0.05):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def noise(n):
    return rng.uniform(-1, 1, n)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, fc, order=2):
    sos = signal.butter(order, fc, btype="low", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def hp(x, fc, order=2):
    sos = signal.butter(order, fc, btype="high", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def sweep_filter(x, f_start, f_end, q=4.0, blocks=200, curve=None):
    """Time-varying band-pass via block processing (state carried)."""
    n = len(x)
    out = np.zeros(n)
    edges = np.linspace(0, n, blocks + 1).astype(int)
    zi = None
    for i in range(blocks):
        p = i / blocks
        if curve is not None:
            fc = curve(p)
        else:
            fc = f_start * (f_end / f_start) ** p
        fc = float(np.clip(fc, 40, SR / 2 - 2000))
        bw = fc / q
        b, a = signal.iirpeak(fc, fc / bw, fs=SR)
        if zi is None:
            zi = signal.lfilter_zi(b, a) * 0
        seg = x[edges[i]:edges[i + 1]]
        y, zi = signal.lfilter(b, a, seg, zi=zi)
        out[edges[i]:edges[i + 1]] = y
    return out


def sine_glide(dur, f0, f1, curve="exp"):
    tt = t(dur)
    if curve == "exp":
        f = f0 * (f1 / f0) ** (tt / dur)
    else:
        f = f0 + (f1 - f0) * tt / dur
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph)


def reverb(x, seconds=1.6, mix=0.25, tone=6000, seed=3):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    ir = r.normal(0, 1, (n, 2)) * np.exp(-np.arange(n) / SR / (seconds / 5))[:, None]
    ir = np.stack([lp(ir[:, 0], tone), lp(ir[:, 1], tone)], 1)
    ir /= np.sqrt((ir ** 2).sum(0))
    st = fade(stereo(x), 0.0, 0.04)
    wet = np.stack([signal.fftconvolve(st[:, c], ir[:, c]) for c in range(2)], 1)
    dry = np.vstack([st, np.zeros((len(wet) - len(st), 2))])
    return dry * (1 - mix) + wet * mix


def stereo(x, pan=0.0, width=0.0):
    if x.ndim == 2:
        return x
    l = x * np.sqrt(0.5 * (1 - pan))
    r = x * np.sqrt(0.5 * (1 + pan))
    if width:
        d = int(width * SR / 1000)
        r = np.concatenate([np.zeros(d), r[:-d]]) if d else r
    return np.stack([l, r], 1) * np.sqrt(2)


def autopan(x, start=-0.8, end=0.8):
    n = len(x)
    p = np.linspace(start, end, n)
    return np.stack([x * np.sqrt(0.5 * (1 - p)), x * np.sqrt(0.5 * (1 + p))], 1) * np.sqrt(2)


def sat(x, drive=1.5):
    return np.tanh(x * drive) / np.tanh(drive)


def norm(x, peak_db=-1.0):
    m = np.max(np.abs(x)) + 1e-9
    return x / m * 10 ** (peak_db / 20)


def fade(x, fin=0.002, fout=0.01):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)[:, None] if x.ndim == 2 else np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)[:, None] if x.ndim == 2 else np.linspace(1, 0, b)
    return x


def write(path, x, peak_db=-1.0):
    x = stereo(x) if x.ndim == 1 else x
    x = norm(x, peak_db)
    wavfile.write(path, SR, (x * 32767).astype(np.int16))
