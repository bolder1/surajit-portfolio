#!/usr/bin/env python3
"""Cross-check of the five Subtle status tints against the Alert set export on disk.

The export is a reference only and is never placed in a frame. It is 915 x 800 and
sits 1:1 on the Figma frame, so the variant rectangles are the file's own: the Subtle
column at x 17.5, rows at y 8, 173, 338, 503 and 668, each 420 x 125.

Fixed sample points per variant (x, y in export pixels), all relative to the row's top:
  container  (417, row + 110)   inside the card, bottom right, away from text and controls
  icon       darkest pixel inside the 20 px icon box at (33..53, row + 16..36)
  border     (83, row + 81)       the inner button's top edge at mid width, which is pixel
             aligned in the export (the left edge sits on a half pixel and blends); the
             button's border box is x 60..106, y row + 81..108, located once by matching
             the Positive border colour and then fixed here for every row

The container fill is an alpha colour composited over white in the export, so the script
prints both the sampled composite and the composite of the hex recorded in artefact.ts;
they must agree to within a channel step. Icon and border are solid and must match exactly.

Run from the video directory:
  python3 -I src/v6/illus/sample_tints.py <path to alert-set export png>
"""
import sys

from PIL import Image

ROWS = {"positive": 8, "negative": 173, "notice": 338, "information": 503, "neutral": 668}
X0 = 17.5

# The values recorded in artefact.ts (read with the Figma variable tool), for the cross-check.
RECORDED = {
    "positive": {"container": "#49D58452", "border": "#2FC66F", "icon": "#1F5937"},
    "negative": {"container": "#FD212152", "border": "#E61E1E", "icon": "#6A0E0E"},
    "notice": {"container": "#FD8A2152", "border": "#E67E1E", "icon": "#6A3A0E"},
    "information": {"container": "#2CAEF152", "border": "#109DE5", "icon": "#124965"},
    "neutral": {"container": "#748EA90F", "border": "#526578", "icon": "#232B33"},
}


def hex_to_rgba(h):
    h = h.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
    return r, g, b, a


def over_white(h):
    r, g, b, a = hex_to_rgba(h)
    return tuple(round(c * a + 255 * (1 - a)) for c in (r, g, b))


def hx(px):
    return "#%02x%02x%02x" % tuple(px[:3])


def darkest(im, box):
    x0, y0, x1, y1 = box
    best = None
    for x in range(x0, x1):
        for y in range(y0, y1):
            p = im.getpixel((x, y))
            s = sum(p[:3])
            if best is None or s < best[0]:
                best = (s, (x, y), p)
    return best


def main(path):
    im = Image.open(path).convert("RGBA")
    assert im.size == (915, 800), "the export is expected at 915 x 800, 1:1 with the Figma frame"
    ok = True
    for name, row in ROWS.items():
        cpt = (int(X0 + 400), row + 110)
        container = im.getpixel(cpt)
        icon = darkest(im, (int(X0 + 16), row + 16, int(X0 + 36), row + 36))
        bpt = (83, row + 81)
        border = (0, bpt, im.getpixel(bpt))
        rec = RECORDED[name]
        want_c = over_white(rec["container"])
        got_c = container[:3]
        dc = max(abs(a - b) for a, b in zip(want_c, got_c))
        same_icon = hx(icon[2]) == rec["icon"].lower()
        same_border = hx(border[2]) == rec["border"].lower()
        ok = ok and dc <= 2 and same_icon and same_border
        print(
            f"{name:12s} container@{cpt} {hx(container)} (recorded {rec['container']} over white = {hx(want_c)}, delta {dc})"
            f" | icon@{icon[1]} {hx(icon[2])} {'ok' if same_icon else 'MISMATCH'}"
            f" | border@{border[1]} {hx(border[2])} {'ok' if same_border else 'MISMATCH'}"
        )
    print("all five agree" if ok else "DISAGREEMENT: check artefact.ts")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
