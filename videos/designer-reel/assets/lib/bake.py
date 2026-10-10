#!/usr/bin/env python3
"""Deterministic offline asset treatments for the designer reel (frame.md, Asset treatment).

Runtime WebGL grading (data-color-grading) costs ~6.6 s per frame on this machine's SwiftShader
renderer, so the film bakes its two treatments into image files instead. Nothing here is generative:
both are plain per-pixel curves on his real screenshots and photo.

  python3 -I assets/lib/bake.py lift <in.jpg> <out.jpg>          # captures: exposure-only lift (UI Fidelity)
  python3 -I assets/lib/bake.py portrait <in.png> <out-prefix>   # portrait: phosphor print, writes
                                                                 #   <out-prefix>-dither.png and <out-prefix>-duo.png
Run from the project root. Requires Pillow.
"""
import sys
from PIL import Image

# film inks (frame.md tokens)
VOID = (0x0B, 0x07, 0x16)
HAZE = (0x3B, 0x1E, 0x6E)
BEAM = (0xFF, 0x2E, 0x97)
CORE = (0xFF, 0xD9, 0xEC)
INKS = [VOID, HAZE, BEAM, CORE]
BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def lift(src, dst, gamma=1.22, gain=1.16):
    """Exposure-only lift for the dark concept renders. Same curve on R, G and B, so UI hues hold."""
    im = Image.open(src).convert("RGB")
    lut = [min(255, round(255 * ((i / 255) ** (1 / gamma)) * gain)) for i in range(256)]
    im.point(lut * 3).save(dst, quality=94)


def _luma(im):
    return im.convert("L")


def _mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def _ramp(v):
    """Gradient map 0..1 -> void, haze, beam, core at stops 0, 0.32, 0.68, 1."""
    stops = [(0.0, VOID), (0.32, HAZE), (0.68, BEAM), (1.0, CORE)]
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        if v <= p1:
            return _mix(c0, c1, (v - p0) / (p1 - p0))
    return CORE


def portrait(src, prefix, height=1200, cell=4, gamma=0.9):
    im = Image.open(src).convert("RGB")
    w = round(im.width * height / im.height)
    im = im.resize((w, height), Image.LANCZOS)
    L = _luma(im)
    # smooth duotone (the resolved state)
    lut = [_ramp(((i / 255) ** gamma)) for i in range(256)]
    duo = Image.merge("RGB", [L.point([c[ch] for c in lut]) for ch in range(3)])
    duo.save(prefix + "-duo.png")
    # 4-ink ordered dither on a coarse cell grid (the raster print)
    sw, sh = w // cell, height // cell
    small = L.resize((sw, sh), Image.BOX)
    px = small.load()
    out = Image.new("RGB", (sw, sh))
    op = out.load()
    for y in range(sh):
        for x in range(sw):
            v = (px[x, y] / 255) ** gamma * 3.0  # position across the 4 inks
            base = int(v)
            frac = v - base
            t = (BAYER4[y % 4][x % 4] + 0.5) / 16
            idx = min(3, base + (1 if frac > t else 0))
            op[x, y] = INKS[idx]
    out.resize((sw * cell, sh * cell), Image.NEAREST).save(prefix + "-dither.png")


if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[1] not in ("lift", "portrait"):
        sys.exit(__doc__)
    (lift if sys.argv[1] == "lift" else portrait)(sys.argv[2], sys.argv[3])
