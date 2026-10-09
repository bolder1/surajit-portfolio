# Portfolio reel

27s, 1920×1080, 30fps kinetic-type intro in the Folio style. Output: `public/video/folio-reel.mp4`.

- `index.html` holds every scene; `render(t)` sets the whole frame for time `t` (seconds), so rendering is deterministic.
- `render.mjs` steps through each frame with Playwright and pipes PNGs into ffmpeg.
- `assets/silhouette-path.txt` is the outline traced from `public/v5/portrait.png` (background removed, then the contour vectorised).

```bash
node video/render.mjs                    # full render -> public/video/folio-reel.mp4
STILLS=4,11.8,24 node video/render.mjs /tmp/st   # quick PNG stills at given seconds
```

Needs `playwright` and `ffmpeg` on PATH. Edit copy in the `WORDS`, `PILLS` and `CHIPS` arrays.
