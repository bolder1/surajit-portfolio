# Project cover images

Drop cover images here, named **by project slug**, then add the slug → path
mapping to the `COVERS` block in `lib/projects.ts`.

## Naming convention

```
public/projects/covers/<slug>.webp      ← preferred (smaller, sharper)
public/projects/covers/<slug>.jpg       ← acceptable fallback
public/projects/covers/<slug>.png       ← only when transparency needed
```

Use the project slug exactly as it appears in `lib/projects.ts`. Slugs are
kebab-case (e.g. `ad-tools`, `iga-platform`, `mods-design-system`).

## Recommended specs

- **Aspect**: 16:10 (1280×800) for tile + carousel use.
- **Format**: WebP at quality 85; fallback to JPG quality 80.
- **Max width**: 1600px (we never display larger than 800px @1x · 1600px @2x).
- **File size**: aim for under 200 KB. The site is image-light by design.

## Adding a cover

1. Save the file at `public/projects/covers/<slug>.webp`.
2. Open `lib/projects.ts`, scroll to the `COVERS` block.
3. Uncomment / add the entry:

   ```ts
   "ad-tools": {
     cover: "/projects/covers/ad-tools.webp",
     gallery: [
       { src: "/projects/ad-tools/01-overview.png", alt: "Console overview" },
       { src: "/projects/ad-tools/02-policies.png", alt: "Policy editor" },
     ],
   },
   ```

That's all. The cover appears on:

- The home page **cases** list (inline 80×60 thumbnail)
- The **/work** black-tile grid (full-tile background, with hover tint overlay)
- The **/gallery** infinite plane (per-frame image)
- The **/work/[slug]** detail page hero + the Carousel of additional images

The `CoverImage` component has a built-in `onError` fallback to the abstract
glyph treatment, so a missing or 404 file degrades gracefully — your tile
just falls back to the brand color + project shortcode until the file lands.

## What lives in this folder vs. the parent

```
public/projects/
├── covers/              ← THIS folder. Index/tile images by slug.
│   ├── ad-tools.webp
│   └── iga-platform.webp
└── <slug>/              ← Per-project gallery images (already in place).
    ├── 01-overview.png
    ├── 02-policies.png
    └── ...
```

Existing per-project gallery folders are unchanged — they continue to feed
the case-study screen sections. Covers are a thin new layer.
