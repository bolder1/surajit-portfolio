/*
  Showcase products — the reel behind the desk scene on the home page.

  Each product owns a signature background wash (`color`) so company
  dashboards read differently from the fun builds while everything stays
  in one immersive flow. Screens live at:
    public/showcase/<slug>-d.jpg   desktop (1280w, tall)
    public/showcase/<slug>-m.jpg   mobile  (390w, tall)
  Regenerate them from the LIVE products with:
    node scripts/capture-showcase.mjs
*/

export type ShowcaseTag = "COMPANY" | "LAB" | "FUN";

export type ShowcaseProduct = {
  slug: string;
  name: string;
  url: string;
  tag: ShowcaseTag;
  kind: string;
  /** stage background wash while this product is on screen */
  color: string;
  blurb: string;
};

export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    slug: "uem-mobile",
    name: "UEM Mobile",
    url: "https://uem-mobile-app.vercel.app/",
    tag: "COMPANY",
    kind: "ENDPOINT MGMT · MOBILE",
    color: "#0e3f3a",
    blurb: "Unified endpoint management, pocket-sized — device fleet in one hand.",
  },
  {
    slug: "uem-discovery",
    name: "UEM Data Discovery",
    url: "https://uem-data-discovery.vercel.app/data-discovery",
    tag: "COMPANY",
    kind: "ENDPOINT MGMT · DASHBOARD",
    color: "#1d2a5c",
    blurb: "Sensitive-data discovery across the endpoint estate, visualized.",
  },
  {
    slug: "financeos",
    name: "FinanceOS",
    url: "https://financeos-by-miniorange.vercel.app/signin",
    tag: "COMPANY",
    kind: "AI FINANCE · PLATFORM",
    color: "#611010",
    blurb: "The AI finance OS — the internal money brain, sign-in to ledger.",
  },
  {
    slug: "financeos-payroll",
    name: "FinanceOS · Payroll",
    url: "https://financeos-by-miniorange.vercel.app/chanakya/payroll/anomalies",
    tag: "COMPANY",
    kind: "AI FINANCE · ANOMALIES",
    color: "#79300e",
    blurb: "Chanakya payroll anomaly detection — the dashboard that catches drift.",
  },
  {
    slug: "mods-docs",
    name: "MODS Web Docs",
    url: "https://mods-web-docs.vercel.app/",
    tag: "COMPANY",
    kind: "DESIGN SYSTEM · DOCS",
    color: "#3a1c5c",
    blurb: "The MODS design system, documented — tokens to components.",
  },
  {
    slug: "academy",
    name: "Orange Academy",
    url: "https://orange-academy-next.vercel.app/course/c-claude-foundations/lesson/cf-1-1",
    tag: "COMPANY",
    kind: "LEARNING · PLATFORM",
    color: "#1c3350",
    blurb: "Claude foundations, taught in-house — course platform with lessons.",
  },
  {
    slug: "claude-session",
    name: "Claude Session 26",
    url: "https://claude-session-26.vercel.app/",
    tag: "LAB",
    kind: "AI WORKFLOW · LAB",
    color: "#123f2e",
    blurb: "A working session with Claude, kept live — process as an artifact.",
  },
  {
    slug: "sb-pr",
    name: "SB · PR",
    url: "https://sb-pr.vercel.app/",
    tag: "LAB",
    kind: "PRODUCT LAB",
    color: "#22303c",
    blurb: "Lab build — shipped fast, kept running.",
  },
  {
    slug: "cma",
    name: "Creative Marketing Agency",
    url: "https://creative-marketing-agency-six.vercel.app/",
    tag: "FUN",
    kind: "WEB · AGENCY",
    color: "#57123a",
    blurb: "Agency site with attitude — a weekend of taste, deployed.",
  },
  {
    slug: "cheese",
    name: "Cheese",
    url: "https://cheese-website.vercel.app/",
    tag: "FUN",
    kind: "WEB · BRAND",
    color: "#6b4e0e",
    blurb: "A cheese brand site, because craft is craft.",
  },
  {
    slug: "mosaic",
    name: "Mosaic",
    url: "https://mosaic-eight-chi.vercel.app/",
    tag: "FUN",
    kind: "WEB · EXPERIMENT",
    color: "#43173a",
    blurb: "Grid experiment turned product page.",
  },
  {
    slug: "family-tree",
    name: "Family Tree Builder",
    url: "https://family-tree-builder-gilt.vercel.app/tree/tree-mrw6owzr-383ua",
    tag: "FUN",
    kind: "APP · GRAPH",
    color: "#28421c",
    blurb: "Interactive family graphs — generations, drawn live.",
  },
];
