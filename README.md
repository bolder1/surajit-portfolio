# Surajit Dutta — Portfolio

Personal portfolio site rebuilt in **Next.js 15 (App Router) + Tailwind CSS + TypeScript**, replacing the previous Figma Make site.

## Stack

- Next.js 15 / React 19 / TypeScript
- Tailwind CSS 3 with a small custom design token layer (CSS variables)
- Fonts: Instrument Serif (display), Geist (body), Geist Mono (annotations)
- No backend — "request access" on locked case studies opens a pre-filled mailto

## Run locally

> First-time only: there's a stale partial `node_modules/` folder from the scaffold step. Delete it before installing:
>
> ```powershell
> # Windows PowerShell
> Remove-Item -Recurse -Force node_modules
> ```

```bash
npm install
npm run dev
# open http://localhost:3000
```

The site has been verified to build and serve successfully — `npm run build` produces 11 static routes at ~110 KB first-load JS.

## Build

```bash
npm run build
npm start
```

## Type / lint check

```bash
npm run typecheck
npm run lint
```

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. On [vercel.com](https://vercel.com), `Add New… → Project`, import the repo.
3. Vercel auto-detects Next.js — accept defaults and deploy.
4. Add a custom domain (e.g. `surajit.design`) in Project Settings → Domains.

The whole site is statically renderable; case study pages are pre-built via `generateStaticParams`.

## Editing content

| What you want to change | File |
| --- | --- |
| Project list, summaries, outcomes | `lib/projects.ts` |
| Hero copy | `components/Hero.tsx` |
| About copy + principles | `components/About.tsx` |
| Skills / tools / process | `components/Skills.tsx` |
| Experience timeline | `components/Experience.tsx` |
| Contact channels | `components/Contact.tsx` |
| Stats strip | `components/StatsStrip.tsx` |
| Colors / fonts | `app/globals.css` (CSS variables) + `tailwind.config.ts` |

### Adding a new case study

Add a new entry to the `projects` array in `lib/projects.ts`. The homepage list and `/work/[slug]` page render automatically from this data.

### Resume PDF

Drop `resume.pdf` into `public/` — the contact section and footer link to `/resume.pdf`.

## Design notes

- **Editorial direction.** Cream paper (`#f1ece2`), deep ink (`#141210`), single vermilion accent (`#ff3d2e`). Instrument Serif italics provide the personality; Geist + Geist Mono carry the workhorse typography.
- **Light + dark.** Theme toggle in the nav writes to `localStorage` with a no-flash inline script in `app/layout.tsx`.
- **Motion.** `Reveal` component fades content in on scroll. Honors `prefers-reduced-motion`.
- **NDA-safe.** Confidential projects (`access: "locked"`) show summary + outcomes publicly; full case study sits behind a `mailto:` request.

## Folder map

```
app/
  layout.tsx          # Root layout, fonts, metadata
  page.tsx            # Homepage composition
  globals.css         # Design tokens + base styles
  not-found.tsx       # Site-wide 404
  work/[slug]/
    page.tsx          # Case study template
    not-found.tsx     # Case-study-specific 404
components/           # Section components (Hero, About, FeaturedWork, …)
lib/
  projects.ts         # Project catalog (source of truth)
  types.ts            # TypeScript types
public/               # Static assets (resume.pdf, favicon, og.png)
```
