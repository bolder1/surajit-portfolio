# Bake S8 portrait layers from public/img/portrait-cut.png
import sys, numpy as np
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
SC = float(sys.argv[3]) if len(sys.argv) > 3 else 0.9
im = Image.open(src).convert("RGBA")
W0, H0 = im.size
a = np.array(im).astype(np.float32) / 255.0
rgb, al = a[..., :3], a[..., 3]

# --- remove the ghost temple band artefact (rows ~690-860, outside the head) ---
yy, xx = np.mgrid[0:H0, 0:W0]
band = np.clip((100 - np.abs(yy - 775)) / 18.0, 0, 1)  # rows ~675..875, feathered
left_cut = np.clip((xx - 395) / 25.0, 0, 1)  # keep x > ~420
right_cut = np.clip((1092 - xx) / 20.0, 0, 1)  # keep x < ~1080
keep = 1 - band * (1 - left_cut * right_cut)
al = al * keep

# --- luminance + duotone (ink -> cream), moody curve ---
lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
lum = np.clip((lum - 0.03) / 0.75, 0, 1) ** 1.15
ink = np.array([13, 10, 7]) / 255.0
cream = np.array([243, 236, 222]) / 255.0
duo = ink + (cream - ink) * lum[..., None]

# --- red light map (the photo's own vermilion rim light) ---
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
red = np.clip((r - np.maximum(g, b) * 1.05) / 0.35, 0, 1) * np.clip(r / 0.55, 0, 1)
red = red ** 1.2

def save(arr_rgb, arr_a, name):
    o = np.dstack([arr_rgb, arr_a])
    img = Image.fromarray((np.clip(o, 0, 1) * 255).astype(np.uint8), "RGBA")
    img = img.resize((round(W0 * SC), round(H0 * SC)), Image.LANCZOS)
    img.save(f"{out}/{name}.png", optimize=True)
    print(name, img.size)

save(duo, al, "portrait")
verm = np.zeros_like(rgb); verm[...] = np.array([255, 59, 31]) / 255.0
# rim: light-facing edge only (light from upper-left, toward the type), inside the silhouette
A = Image.fromarray((al * 255).astype(np.uint8))
ab = np.array(A.filter(ImageFilter.GaussianBlur(10))).astype(np.float32) / 255.0
gy, gx = np.gradient(ab)
mag = np.sqrt(gx * gx + gy * gy) + 1e-6
nx, ny = -gx / mag, -gy / mag  # outward normal
L = np.array([-0.88, -0.47])
facing = np.clip(nx * L[0] + ny * L[1], 0, 1) ** 1.5
er = np.array(A.filter(ImageFilter.MinFilter(17))).astype(np.float32) / 255.0
edge = np.clip(al - er, 0, 1)
edge = np.array(Image.fromarray((edge * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4.5))).astype(np.float32) / 255.0
fb = np.array(Image.fromarray((facing * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255.0
rim = np.clip(edge * fb * 1.7, 0, 1)
rim *= np.clip((1260 - yy) / 300.0, 0, 1)  # head + neck only, fading down the neck
# avoid the straight cut where the ghost band was removed
rim *= 1 - np.clip((100 - np.abs(yy - 775)) / 30.0, 0, 1) * (xx < 470)
inner = red * al * np.clip((r - 0.5) / 0.35, 0, 1)  # the photo's own red highlights on the cheek
save(verm, np.clip(np.maximum(rim, inner * 0.4), 0, 1), "rim")
