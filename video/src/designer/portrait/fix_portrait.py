#!/usr/bin/env python3
"""Retouch the portrait for the designer reel and bake its layers.

The original (public/v5/portrait.png) carries a motion-ghost: a blurred duplicate of the ear and the
glasses arm on the left, a smeared arm and a ghost outline on the right. This script removes only
those artefacts (it never touches his face), then writes:

  public/img/d/portrait-clean.png   natural-colour cut-out, 1500x1800 RGBA
  public/img/d/portrait-duo.png     the same, graded ink -> cream (the film's look)
  public/img/d/portrait-rim.png     a vermilion rim-light layer from the silhouette

Run from video/:  python3 -I src/designer/portrait/fix_portrait.py [--debug DIR]
"""
import sys
import numpy as np
import cv2
from PIL import Image, ImageFilter
from rembg import new_session, remove

SRC = "../public/v5/portrait.png"
OUT = "public/img/d"
DEBUG = sys.argv[sys.argv.index("--debug") + 1] if "--debug" in sys.argv else None

W0, H0 = 3776, 4532                  # original size; every coordinate below is in original pixels
S = 0.7945                           # working scale (3000 x 3600), downsampled to 1500 x 1800 at the end
W, H = round(W0 * S), round(H0 * S)

src = Image.open(SRC).convert("RGB").resize((W, H), Image.LANCZOS)
rgb = np.array(src)

# --- subject matte ---
import os
CACHE = os.environ.get("PORTRAIT_MATTE_CACHE")
if CACHE and os.path.exists(CACHE):
    alpha = np.load(CACHE)
else:
    sess = new_session("bria-rmbg")
    matte = remove(src, session=sess, only_mask=True, post_process_mask=True)
    alpha = np.array(matte).astype(np.float32) / 255.0
    if CACHE:
        np.save(CACHE, alpha)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
ox, oy = xx / S, yy / S              # original-pixel coordinates of every working pixel


def soft_box(x0, x1, y0, y1, f=8.0):
    """1 inside the box (original px), feathered by f px."""
    return (
        np.clip((ox - x0) / f + 0.5, 0, 1) * np.clip((x1 - ox) / f + 0.5, 0, 1)
        * np.clip((oy - y0) / f + 0.5, 0, 1) * np.clip((y1 - oy) / f + 0.5, 0, 1)
    )


def poly_mask(pts, grow=0.0):
    m = np.zeros((H, W), np.uint8)
    cv2.fillPoly(m, [np.round(np.array(pts, np.float32) * S).astype(np.int32)], 255)
    if grow:
        k = int(abs(grow) * S) * 2 + 1
        m = cv2.dilate(m, np.ones((k, k), np.uint8)) if grow > 0 else cv2.erode(m, np.ones((k, k), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 3).astype(np.float32) / 255.0


# --- 1. left ghost: a blurred double of the ear and the glasses arm sits left of the real ear ---
# kill everything left of the real hair edge and the real outer-ear rim (traced on the original, rim kept by erosion)
left_kill = poly_mask(
    [(560, 1700), (1013, 1700), (1013, 1760), (1018, 1780), (1030, 1794), (1050, 1802), (1072, 1805), (1087, 1803),
     (1063, 1827), (1037, 1880), (1022, 1927), (1020, 1960),
     (1027, 2007), (1040, 2060), (1060, 2113), (1080, 2160), (1100, 2200), (1127, 2240), (1167, 2287), (1207, 2320),
     (1267, 2337), (1267, 2470), (560, 2470)],
    grow=-7,
)
alpha *= 1 - left_kill

# --- 2. right ghost: a ghost head outline, the smeared far arm and streaks beyond the cheek and the lens ---
# keep the face, the real right lens frame and its hinge; everything right of that boundary goes
right_kill = poly_mask(
    [(2600, 1440), (2640, 1550), (2655, 1650), (2657, 1700), (2697, 1698), (2797, 1735), (2832, 1795), (2880, 1795),
     (2880, 1865), (2838, 1865), (2835, 1895), (2817, 1983), (2770, 2070), (2717, 2105), (2705, 2117), (2703, 2300),
     (3300, 2300), (3300, 1440)],
    grow=-6,
)
alpha *= 1 - right_kill

# the glass beyond the face edge shows the ghost through the lens: make the lens nearly clear
lens_poly = poly_mask(
    [(2657, 1700), (2697, 1698), (2797, 1735), (2832, 1795), (2835, 1895), (2817, 1983), (2770, 2070), (2717, 2105), (2707, 2117)],
    grow=-12,
)
face_edge = poly_mask([(2400, 1690), (2655, 1690), (2657, 1777), (2707, 2117), (2400, 2117)], grow=4)
glass_beyond_face = lens_poly * (1 - face_edge)
alpha *= 1 - 0.88 * glass_beyond_face

# --- 3. the temple smear that crosses the hair and the top of the ear: re-cover it with neighbouring texture ---
# (clone-stamp: hair from just above for the strip over the hair, ear interior from just below for the strip under it;
# Telea inpainting smears the red ghost into the repair and leaves a visible band)
def clone(img, box, dy_orig, f=5.0):
    m = soft_box(*box, f=f)[..., None]
    shifted = np.roll(img, int(round(dy_orig * S)), axis=0)  # shifted[y] = img[y - dy]
    return img * (1 - m) + shifted * m


rgbf0 = rgb.astype(np.float32)
# (the strips cover the streak's glow too; the ear's top rim at x 1063-1087, y >= 1803 is left untouched)
rgbf0 = clone(rgbf0, (1000, 1200, 1738, 1801), +80, f=12)   # strip over the hair
rgbf0 = clone(rgbf0, (1100, 1200, 1797, 1840), -48, f=10)   # strip over the top of the ear
rgb = np.clip(rgbf0, 0, 255).astype(np.uint8)

# soft hair edge on the left side of the head (hair is soft; a hard cut reads as a stair-step)
hair_zone = soft_box(850, 1150, 1100, 1840, f=24)
alpha_blur = cv2.GaussianBlur(alpha, (0, 0), 9.0)
alpha = alpha * (1 - hair_zone) + np.minimum(alpha, alpha_blur * 1.12 + 0.0) * hair_zone

# same softening where the hair meets the forehead on the right (removes a small stair-step)
fore_zone = soft_box(2540, 2720, 1300, 1640, f=24)
alpha_blur2 = cv2.GaussianBlur(alpha, (0, 0), 8.0)
alpha = alpha * (1 - fore_zone) + np.minimum(alpha, alpha_blur2 * 1.1) * fore_zone

# --- 4. clean the matte: remove specks, soften the edge by ~1.5 px ---
a8 = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats((a8 > 24).astype(np.uint8), connectivity=8)
keep = np.zeros(n, bool)
keep[1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])] = True
a8 = np.where(keep[lab], a8, 0).astype(np.uint8)
a8 = cv2.GaussianBlur(a8, (0, 0), 1.1)
alpha = a8.astype(np.float32) / 255.0

# --- outputs ---
OW, OH = 1500, 1800


def save_rgba(arr_rgb01, arr_a01, name):
    o = np.dstack([np.clip(arr_rgb01, 0, 1), np.clip(arr_a01, 0, 1)])
    img = Image.fromarray((o * 255).astype(np.uint8), "RGBA").resize((OW, OH), Image.LANCZOS)
    img.save(f"{OUT}/{name}.png", optimize=True)
    print(name, img.size)
    return img


rgbf = rgb.astype(np.float32) / 255.0
save_rgba(rgbf, alpha, "portrait-clean")

# duotone: ink -> cream with a moody curve (same grade as the Access Granted end card)
lum = 0.2126 * rgbf[..., 0] + 0.7152 * rgbf[..., 1] + 0.0722 * rgbf[..., 2]
lum = np.clip((lum - 0.03) / 0.75, 0, 1) ** 1.15
ink, cream = np.array([13, 10, 7]) / 255.0, np.array([243, 236, 222]) / 255.0
save_rgba(ink + (cream - ink) * lum[..., None], alpha, "portrait-duo")

# vermilion rim: only the light-facing silhouette edge (light from upper left), hair and jaw
A = Image.fromarray((alpha * 255).astype(np.uint8))
ab = np.array(A.filter(ImageFilter.GaussianBlur(10 * S / 0.9))).astype(np.float32) / 255.0
gy, gx = np.gradient(ab)
mag = np.sqrt(gx * gx + gy * gy) + 1e-6
nx, ny = -gx / mag, -gy / mag
facing = np.clip(nx * -0.88 + ny * -0.47, 0, 1) ** 1.5
er = np.array(A.filter(ImageFilter.MinFilter(int(17 * S / 0.9) | 1))).astype(np.float32) / 255.0
edge = np.array(Image.fromarray((np.clip(alpha - er, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4.5 * S / 0.9))).astype(np.float32) / 255.0
fb = np.array(Image.fromarray((facing * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6 * S / 0.9))).astype(np.float32) / 255.0
thin = edge * fb
wide = np.array(Image.fromarray((np.clip(thin, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(16 * S / 0.9))).astype(np.float32) / 255.0
rim = np.clip(thin * 0.75 + wide * 2.4, 0, 1)
rim *= np.clip((2560 - oy) / 650.0, 0, 1)  # hair + jaw only; fades out above the neck
r, g, b = rgbf[..., 0], rgbf[..., 1], rgbf[..., 2]
red = np.clip((r - np.maximum(g, b) * 1.05) / 0.35, 0, 1) * np.clip(r / 0.55, 0, 1)
inner = (red ** 1.2) * alpha * np.clip((r - 0.5) / 0.35, 0, 1)
verm = np.zeros_like(rgbf)
verm[...] = np.array([255, 106, 26]) / 255.0
save_rgba(verm, np.maximum(rim, inner * 0.4), "portrait-rim")

if DEBUG:
    import os
    os.makedirs(DEBUG, exist_ok=True)
    for name, bg in (("dark", (14, 11, 9)), ("red", (60, 14, 10))):
        for layer in ("clean", "duo"):
            p = Image.open(f"{OUT}/portrait-{layer}.png")
            b = Image.new("RGBA", p.size, bg + (255,))
            b.alpha_composite(p)
            b.convert("RGB").save(f"{DEBUG}/{layer}-{name}.jpg", quality=90)
    print("debug previews in", DEBUG)
