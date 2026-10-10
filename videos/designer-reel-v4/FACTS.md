# FACTS-v4 — claims sheet for the v4 portfolio reel

Every factual claim the film makes must trace to a line in this file. Each line names its source. Sources are
repo paths unless marked otherwise. `c7fa26c` means the original site copy (commit c7fa26c, `app/about/page.tsx`),
removed from the live site in the v5 rebuild (7584e9b) but still his copy.

Tags used below:
- **[OK]** usable on screen as-is.
- **[NO-AI]** the source line mentions AI tooling. Hard constraint: no AI talk on screen. Use only the stripped
  form given, or not at all.
- **[DERIVED]** a number or phrase inferred from sourced facts; say so if challenged.
- **[CHAT]** given by him in chat / the brief; not in the repo.
- **[HIS WORDS]** a slot where one sentence from him is missing; see §7.

Checked on 2026-10-10 against: `videos/designer-reel/FACTS.md` (v3), `lib/projects.ts` (58 entries, counted by
script), `lib/showcase.ts`, `components/v5/*.tsx`, `PRODUCT.md`, `public/resume.pdf` (pdftotext), git history.

---

## 1. Identity and contact

| Fact | Value | Source |
|---|---|---|
| Name | Surajit Dutta | resume.pdf; `components/v5/MastheadHeroV5.tsx` |
| Title | Product Designer (UX / UI / Product Design) | resume.pdf header |
| Positioning | Product designer for IT, identity & security teams | `MastheadHeroV5.tsx` tagline; `AboutPortraitV5.tsx` bio |
| Status | "Open to senior roles & select freelance" | `InfoPageV5.tsx` META |
| Status (variant) | "Open to roles & select freelance" · "/ open to work — 2026" | `ContactPageV5.tsx`; `FooterV5.tsx` |
| Reply time | "Usually within a day" | `ContactPageV5.tsx` META |
| Email | surajit3255@gmail.com | resume.pdf; `ContactPageV5.tsx` |
| Site | surajit-dutta.vercel.app | `app/layout.tsx:40` |
| LinkedIn | linkedin.com/in/surajit3255 | resume.pdf; `FooterV5.tsx` |
| Dribbble | dribbble.com/surajit3255 | `ContactPageV5.tsx`, `FooterV5.tsx` |
| GitHub | **none** — site links to bare `https://github.com` (placeholder). Do not show. | `MastheadHeroV5.tsx`, `FooterV5.tsx` |
| Phone | in the resume. **Leave it out** (v3 rule, keep it). | resume.pdf |
| Based in | **Conflict.** Resume header: Pune, India. Site: "Kolkata, India · IST" (`InfoPageV5`, `ContactPageV5`, `CapabilitiesBentoV5` "Kolkata, India · Designing for teams everywhere · GMT+5:30"). miniOrange is in Pune. Safe on screen: "India · GMT+5:30" or nothing. Ask him. | resume.pdf; `components/v5/*` |
| Years of experience | **5 years — his number, use it** (task brief). Resume says "3+ years"; site stat tile says "3+ Years in product design"; v3 FACTS said 4; dated employment runs Jul 2022 → now (≈ 4y 3m). Do not "correct" the 5 to 3+. Suggest confirming before final render. | brief [CHAT]; resume.pdf; `CapabilitiesBentoV5.tsx` STATS |

---

## 2. The timeline (dates from the resume)

| When | What | Where | Notes (sourced) |
|---|---|---|---|
| 2016 – 2018 | Diploma, Electronics & Telecommunications Engineering | Purulia Polytechnic | CGPA 7.2 / 10 (resume) |
| 2019 – 2022 | B.Tech, Information Technology | Netaji Subhash Engineering College | CGPA 8.8 / 10 (resume). His line: "The systems thinking came from here. The design fluency came later." (c7fa26c) |
| Jul 2022 – May 2023 | UX/UI Designer | Fortmindz, Kolkata | Redesigned websites and applications; optimised e-commerce checkout flows and product pages; partnered with developers to ship on time (resume). His line: "First proper job; learned to ship on a deadline alongside developers, and learned that the best design call is often the one that makes the engineer's life easier." (c7fa26c) |
| Jun 2023 – Jul 2024 | UX/UI Designer | Impero IT, India (city not stated) | Mobile apps for food delivery, healthcare, events; web platforms for social media and admin dashboards; standardised component libraries (resume). His line: "Started building component libraries seriously and felt the pull toward enterprise — the work where systems matter most." (c7fa26c) |
| Jul 2024 – now | Product Designer | miniOrange, Pune | Enterprise identity & security: Active Directory, PAM, IGA, UEM (resume) + ITDR, DPDP, sign-up customizer, broadcasting (`lib/projects.ts`). Built and maintains the design system ("miniOrange Central Design System", MODS). Shipped the AD prototype in 5 business days. Runs 0-to-1 discovery: stakeholder interviews, competitive research → flows, interaction models, hi-fi. Partners with engineering and PMs on feasibility and design QA (resume). |
| 2024 | Patient Portal (lab, public) | personal | `lib/projects.ts` patient-portal, year "2024" |
| 2025 | Internal Banking Analytics (lab, public) | personal | `lib/projects.ts` banking-analytics, year "2025" |
| 2025 – now | Product OS (lab, public, "Founding Designer") | personal | `lib/projects.ts` product-os |
| undated | Weekend builds: Creative Marketing Agency, Cheese, Mosaic, Family Tree Builder | personal | `lib/showcase.ts` tag FUN |

Caveat: the v5 site says "Three years across IAM, PAM, IGA and UEM at miniOrange" (`AboutPortraitV5`, `InfoPageV5`).
By the resume dates the miniOrange tenure is ≈ 2 years 3 months. Don't put a tenure number on screen.

Companies: 3 (Fortmindz, Impero IT, miniOrange) [OK, resume]. Cities: Kolkata and Pune are named; Impero's city is
not [DERIVED, so "2 cities" is only "two named cities"].

---

## 3. Sector map (titles only, from `lib/projects.ts` unless noted; no outcomes)

Catalogue total **58** (`WorkPageV5` prints `{all.length}` = 58; counted by script):
**13 Enterprise SaaS · 1 Design System · 6 Mobile App · 6 Web App · 32 Website.**
Of the 13 Enterprise SaaS: 8 miniOrange (NDA), 3 banking/fintech (employer not stated), 2 lab builds.

**Enterprise IT, identity & security (miniOrange, 2024 → now, all NDA)** — 9 titles
- Active Directory — Five-Day Prototype (2024)
- IGA Platform
- PAM Console
- miniOrange ITDR
- UEM Platform
- DPDP Compliance
- Interactive Sign-up Flow Customizer
- Message Broadcasting Workflow
- miniOrange Central Design System (category: Design System; "Tokens + components powering IAM, PAM, IGA, UEM, and ITDR — v1.0")
- Live company builds (`lib/showcase.ts`, tag COMPANY): UEM Mobile, UEM Data Discovery, MODS Web Docs
- Website: TitanDef ("Cybersecurity product UI")

**Fintech / banking** — 4 catalogue titles + 2 live builds + 3 sites
- Vicus Bank — Digital Account Management (2022 — 2024, NDA)
- Bank Fraud Detection System (2023 — 2024, NDA)
- Invoice Platform (2022 — 2023, freelance, NDA)
- Internal Banking Analytics (2025, lab, public; real screens in repo)
- Live builds (COMPANY): FinanceOS, FinanceOS · Payroll ("AI finance" in their blurbs — [NO-AI] for the blurb, title OK)
- Websites: 5 Star Mortgage, Invest 5S, Infinity Africa Capital

**Healthcare** — 1 catalogue title + 1 site + 2 named elsewhere
- Patient Portal (2024, lab, public)
- Website: Mopheth ("Healthcare services with appointment booking")
- "Doctor App" (`ProcessShowcaseV5.tsx` CASES, "Healthcare application for practitioners") — title only, not in the catalogue
- Impero-era healthcare mobile app (resume bullet; no title given)

**Food delivery** — 1
- Eat Incredible (Mobile App, 2023 — 2024, Impero IT, public)

**Events** — 1 + 1
- Culture Club (Web App, 2023 — 2024, Impero IT, "Cultural event management and engagement")
- Impero-era events mobile app (resume bullet; no title)

**Social / community** — 2 + 1
- Rate My Horse (Mobile App, 2023 — 2024, Impero IT, "Social platform for the equestrian community")
- Communify MVP (Web App, 2023 — 2024, Impero IT, "Community management platform — MVP")
- Website: Clear Social ("Social media product site")

**E-commerce / retail** — 1 + 4
- Bespoke Diamonds (Web App, 2022 — 2023, Fortmindz, "Luxury e-commerce for custom diamond jewellery")
- Websites: Curl Organics, Doggydlites, Jumbo, The Collabstore
- Fortmindz checkout-flow and product-page work (resume bullet; no titles)

**Education / EdTech** — 2 + 1 + 1
- Campus Links (Web App, 2022 — 2023, "Student networking and campus resources")
- Aquinas (Web App, 2022 — 2023, "Educational web app with student portal")
- Website: Edicat
- Live build (COMPANY): Orange Academy (learning platform; its blurb names Claude, [NO-AI] for the blurb)

**Workplace compliance** — 1
- LG Safety (Mobile App, 2022 — 2023, "Workplace compliance and reporting")

**Mobile, sector not stated** — 3
- Hexia, Akhie, THT (Mobile Apps, 2023 — 2024)

**Product tooling (lab)** — 1
- Product OS (Enterprise SaaS, 2025 — now, "Founding Designer"). Subtitle mentions "AI as copilot" [NO-AI]; title OK.

**Brand, corporate, agency and landing sites (Website, 2022 — 2024, mostly Fortmindz era)** — the remaining 21 of 32
All in One · Haller.Ai · Sophisticated Yachting · OBELISQUE · NTS Solar · Roha Studio · HIRED BEES · The Genuine
Article · Vistaza · Vistaza UI Design · Higher Balance Institute · NKC Digital · DynamicForm — Divi · Nu 3ra Studios ·
Choice Companies · Kyetech · Great Solutions Entertainment · Wonder Go Lander · Buddha Brothers · Scayul ·
Graphics & Resources
(`lib/projects.ts` `websiteEntries()`: year "2022 — 2024", role "UX/UI Designer", Figma links from his Notion; "Years tentative".)

**Weekend / lab builds (`lib/showcase.ts`)** — 12 live products in total: 6 COMPANY, 2 LAB, 4 FUN
- FUN: Creative Marketing Agency, Cheese, Mosaic, Family Tree Builder
- LAB: SB · PR; "Claude Session 26" [NO-AI: name]

Sector count sentence that is safe on screen [DERIVED from the above]: "e-commerce, food delivery, healthcare,
events, social, fintech and banking, enterprise IT and security, education" (8 sectors, every one has at least one
titled project above).

---

## 4. Verbatim lines that could be on screen (with source)

### 4a. His lines and principles [OK]
1. "I make complex software feel simple." — `components/v5/KineticV5.tsx` (WORDS array)
2. "I design for the operator after the operator — turning dense, high-stakes systems into product people trust." — `CapabilitiesBentoV5.tsx` cap-lead
3. "I design for the operator who inherits the dashboard — their time, their context, their audit trail." — `InfoPageV5.tsx` body (the sentence after it mentions AI; this one is clean)
4. "Product designer for IT, identity & security teams. I turn complex enterprise systems — IAM, PAM, IGA, UEM — into calm, usable software that survives audits, scale, and the second year." — `MastheadHeroV5.tsx` tagline
5. "Building UX that earns its second year." — `InfoPageV5.tsx` lead
6. "I write specs that survive implementation and ship flows that survive use." — `CapabilitiesBentoV5.tsx` cap-quote, second sentence (first sentence is "Research-led, decision-first, AI-native." → use the stripped "Research-led, decision-first." as v3 did)
7. "Make complex feel calm." · "Systems then surfaces." · "Ship then sharpen." — `PRODUCT.md` "Strategic principles (written by Surajit)"
8. Long forms of the principles (c7fa26c PRINCIPLES):
   - "Enterprise software fails when it asks users to hold the system in their head. My job is to put the right thing on screen at the right moment, and to leave everything else off."
   - "Tokens, components, and patterns first. Screens get faster to design and easier to change when the system underneath is doing real work. The cost of a system pays back on year two."
   - "The first version is for learning. I'd rather get a flow into reviewers' hands in week three and iterate than polish a hypothesis to perfection in Figma for a quarter."
   - "Research is a teammate. I do my own when I have to and pair with researchers when I can. The features that mattered on every project I've shipped came out of listening, not workshops."
9. "The systems thinking came from here. The design fluency came later." — c7fa26c PATH[0]
10. "A non-linear road into product design." — c7fa26c section heading
11. "Three chapters, more or less. Each one taught a different thing. I keep going back to the first one when the work starts feeling abstract." — c7fa26c
12. "First proper job; learned to ship on a deadline alongside developers, and learned that the best design call is often the one that makes the engineer's life easier." — c7fa26c PATH[1]
13. "Started building component libraries seriously and felt the pull toward enterprise — the work where systems matter most." — c7fa26c PATH[2]
14. "As a creative Builder, I craft tailor-made product experiences, blending technical precision and emotion." — `AboutPortraitV5.tsx`
15. "Obsessed with systems, interaction and detail" — `InfoPageV5.tsx` (fragment; rest of the sentence is AI talk)
16. "Calm software for complex systems." — [CHAT] v3 FACTS "his own lines" and the v4 brief; not in the repo or git history. Allowed by the brief.
17. "Let's build something that lasts." — `ContactPageV5.tsx`, `FooterV5.tsx`
18. "Senior product design roles and selective freelance. The work starts with a conversation — start one here." — `ContactPageV5.tsx`
19. "You've seen the work, the process, the way I think. What you can't see yet is what we'd build together." — `KineticOutroV5.tsx`
20. "Everything I've shipped." — `WorkPageV5.tsx` · "Case studies, told in depth." — `CaseListV5.tsx`
21. "From brief to shipped — start to finish." — `ProcessV5.tsx`
22. "Boardroom to working build — in days, not quarters." — `RealtimeBannerV5.tsx` (speed claim is fine; the mechanism behind it on the site is Claude Code, so do not explain *how*)
23. "One designer. Seven stages. Days, not quarters." — `ProcessShowcaseV5.tsx`
24. "Designing for teams everywhere · GMT+5:30" — `CapabilitiesBentoV5.tsx`
25. "Every product begins with a walk to the desk." — `DeskShowcaseV5.tsx` caption (site copy, not a personal quote)

### 4b. Case-study voice lines (site copy fact-checked against his Notion/CV; good for point of view) [OK]
- "Keeping risk as the only colour means risk is the only thing the eye lands on." — ad-tools, visualDecisions
- "Bulk actions on AD shouldn't feel like clicking 'OK.'" — ad-tools
- "Users · Groups · Policies" (three task-shaped destinations instead of an all-tools nav) — ad-tools, uxLaws
- "Put the right context next to the decision." / "Risk in the row, not in a drawer." — iga-platform, research
- "No confetti. The reviewer's relief shouldn't be undermined by a UI that performs the relief for them." — iga-platform
- "A primitive-only token graph is a colour catalogue, not a system." — mods-design-system
- "One stroke weight, two corner radii, three spacing scales." — mods-design-system, visualDecisions
- "Design the JIT path so it's faster than the workaround." — pam-platform
- "The queue's job is filtering, not display." — itdr
- "Three-tile home, not a dashboard." / "Typography first, photography never." — patient-portal
- "Older patients on small screens are the worst-case user; designing for them is designing for everyone." — patient-portal
- "Single-screen checkout with sensible defaults." / "Order-placed confirmation is editorial, not a receipt." — eat-incredible
- "One report shape; many cuts." / "Configure → Process → Report, not 'instant dashboard'." — banking-analytics
- Process-page stage titles: "Requirements, from the room" · "Research → my own PRD" · "Prototype, with full Figma files" · "Demo that sells" · "Real product, real revenue" — `ProcessShowcaseV5.tsx` (stage 04 "The two-day build, with Claude Code" and 06 "handoff, with code" are [NO-AI])

### 4c. Lines that contain AI talk — DO NOT put on screen [NO-AI]
- "Research-led, decision-first, AI-native." (use "Research-led, decision-first.")
- "AI generates options; humans pick the survivor." — ad-tools
- "AI doesn't make me a designer. It lets me be the designer who ships in days what used to take weeks — same taste, more reps." — `AIOrchestrationV5.tsx`
- "I orchestrate. Models execute." — `AIOrchestrationV5.tsx`, `AIWorkflowV5.tsx`
- "Orchestrate with AI — Claude + Figma Make AI chained into a repeatable workflow — variants in hours, the taste stays human." — `ProcessV5.tsx` step 04
- "~70% AI-driven cycle compression" (stat label), "Prototyping (AI-augmented)", "AI-Augmented Workflows", "AI Orchestration" (discipline names) — `CapabilitiesBentoV5.tsx`
- Product OS subtitle ("…AI as copilot"); showcase names/blurbs "Claude Session 26", Orange Academy ("Claude foundations…"), FinanceOS ("The AI finance OS…")
- Tool names: Figma Make AI, Claude, Claude Code, Cursor, ChatGPT, Cowork, Lovable, Bolt, Antigravity, Imagen, Sora, NotebookLM

House style for on-screen copy (advisory): no em dashes in on-screen text (`PRODUCT.md`, v3 brief). The verbatim lines above keep their dashes; rebreak them as line breaks on screen.

---

## 5. Every true number, with source

| Number | Claim | Source | Note |
|---|---|---|---|
| 5 | years designing | brief (his number) [CHAT] | see §1 conflict; use his number |
| 58 | projects in the catalogue | `lib/projects.ts` (26 explicit + 32 `websiteEntries()`), `WorkPageV5` | counted |
| 13 · 6 · 6 · 32 · 1 | Enterprise SaaS · Mobile apps · Web apps · Websites · Design system | `lib/projects.ts` category field | counted |
| 12+ | enterprise products shipped | `CapabilitiesBentoV5.tsx` STATS | site stat tile |
| 3 | companies | resume.pdf | Fortmindz, Impero IT, miniOrange |
| 2 | named cities | resume.pdf [DERIVED] | Kolkata, Pune; Impero's city unknown |
| 5 business days | Active Directory prototype, production-level, cross-functional | resume.pdf; `lib/projects.ts` ad-tools | instead of "a typical 3-week design cycle" |
| 3 weeks | the typical cycle it replaced | resume.pdf; ad-tools | |
| ~70% | cycle compression, 3 weeks → 5 days | resume.pdf; ad-tools summary; `InfoPageV5` ("roughly 70%"); `AIWorkflowV5` | source attributes it to AI tooling. v3 precedent: show as a design-speed fact without naming the tool [NO-AI for the attribution] |
| D1–D5 | D1 stakeholder interviews + JTBD · D2 flow variants pruned with the PM · D3 hi-fi on the design system · D4 prototype + design QA with engineering · D5 leadership walkthrough + handoff | ad-tools publicSections | D2 on the site says "AI-driven exploration in Figma Make" [NO-AI]; "flow variants" is fine |
| 5 in 4 h | 5 flow variants in 4 hours (AD, day 2) | ad-tools research sample | credited to Figma Make AI on the site; if shown, show without the tool (v3 did) |
| 2 | state gaps engineering caught on day 4 (failed delegation, partial sync) | ad-tools research | |
| 3 | task-shaped destinations: Users · Groups · Policies | ad-tools uxLaws | |
| 1 / 2 / 3 | one stroke weight, two corner radii, three spacing scales (design system) | mods-design-system visualDecisions | |
| 5 | products the design system powers: IAM, PAM, IGA, UEM, ITDR | mods-design-system subtitle | |
| 2 | Figma files compose the system (Tokens, Components) | mods-design-system publicSections | |
| ≈ 2 days | "Boardroom to working build" | `ProcessShowcaseV5.tsx` | mechanism is Claude Code → do not explain how [NO-AI]; the "days, not quarters" line is OK |
| 7 | stages in his real-time loop | `ProcessShowcaseV5.tsx` | two stages are AI-dependent |
| 5 | products that went through that loop: ITDR, CARE, DPDP Compliance, Function OS, Doctor App | `ProcessShowcaseV5.tsx` CASES, `RealtimeBannerV5.tsx` | CARE, Function OS, Doctor App are not in the catalogue; titles only |
| 12 | live builds on the desk reel: 6 company, 2 lab, 4 fun | `lib/showcase.ts` | names in §3 |
| 5 · 25 · 5 | Product OS: 5 Modes · 25 studios · 5 persistent rails | product-os Role body | solo lab build |
| 5 | primary pages in Internal Banking Analytics (Metrics, Cohort, Marketplace Comparison, Component Comparison, Region-wise) | banking-analytics "What it looks like" | real screens exist |
| 16 | real banking-tool screens in the repo | `public/projects/banking-tool/` | see §8 |
| 8.8 / 10 · 7.2 / 10 | CGPA, B.Tech · Diploma | resume.pdf | |
| within a day | reply time | `ContactPageV5.tsx` | |
| 2016 · 2019 · 2022 · 2023 · 2024 | the five dated chapter starts | resume.pdf | |

Never claim: testimonials, awards, talks, certifications, client logos, revenue, team size, adoption/velocity metrics
(all NDA, "shared on request" in every miniOrange entry), number of components in the design system, the number of
users of anything.

---

## 6. His process (what each step says)

Six steps on the site, `components/v5/ProcessV5.tsx` STEPS, verbatim bodies. Lead line: "Research-led, decision-first, AI-native." → on screen "Research-led, decision-first."

1. **Discover & frame** — "Stakeholder interviews, JTBD, and the constraints that actually bind — before a single pixel."
2. **Research & test** — "User interviews, usability testing, journey mapping — evidence over opinion, the whole way through."
3. **Define the system** — "Flows, IA, and the primitives. Decide what to ship and, harder, what not to."
4. ~~Orchestrate with AI~~ — omitted per brief [NO-AI].
5. **Design & refine** — "High-fidelity, production-ready screens — tokens, states, edge cases, the audit trail."
6. **Deliver & support** — "Spec that survives implementation, handoff that holds, iteration once it meets real use."

"JTBD" = jobs-to-be-done; "IA" = information architecture. Both are jargon: spell them out or drop them on screen
(constraint: no unexplained jargon).

The /process page also describes a seven-stage client loop (`ProcessShowcaseV5.tsx`): requirements from the room →
research and his own PRD → Figma prototype with full files → (build) → demo → handoff → shipped product. Usable as
"he writes the brief himself, prototypes with real files, demos the real thing"; stages 04/06 are AI-dependent.

Research methods he actually lists per case (`lib/projects.ts` research[].method): stakeholder discovery interviews,
competitive landscape teardown, approval-flow teardowns, drift audit across products, designer + engineer
interviews, token graph mapping, workflow shadowing, shadow sessions with fraud analysts, regulatory teardown,
patient-experience teardown, anxiety-scenario walkthroughs, design QA paired with engineering. This is the
sourced basis for "system research".

Skills he wants highlighted, mapped to sources: **system research** → the methods above + resume "stakeholder
discovery, competitive research"; **prototyping** → resume skills, `InfoPageV5` Design column, Figma Make
prototypes (tool name [NO-AI]); **product strategy** → "Design strategy" (`CapabilitiesBentoV5` DISCIPLINES),
resume "MVP scoping, design-led product definition", "Research → my own PRD"; **product design** → everywhere.

Disciplines safe on screen (`CapabilitiesBentoV5` DISCIPLINES minus the AI ones): Product Design · Interaction
Design · Design Systems · UX Research · Prototyping · Information Architecture · Usability Testing · Design Strategy.
`InfoPageV5` SKILLS: Design (Figma, Design systems, Prototyping, Interaction design, Auto-layout) · Research (User
interviews, Usability testing, Journey mapping, Heuristic eval) · Domains (IAM · PAM, IGA · UEM, Enterprise SaaS,
Fintech, Healthcare). Non-AI tools (resume + `CapabilitiesBentoV5` TOOLS): Figma, FigJam, Framer, Notion, Jira,
Illustrator, Photoshop, Lottie, basic HTML/CSS, video editing.

---

## 7. What is NOT known — do not invent

- **Day-to-day routine.** Not provided. The record only gives role-level verbs (resume): leads end-to-end design,
  runs stakeholder interviews and competitive research, builds and maintains the design system, partners with
  engineering and PMs on feasibility and design QA. No hours, rituals, meetings, tools-of-the-morning, or habits.
- **Personal point of view** beyond the principles in §4a. No opinions on the industry, no influences, no "why I
  design", no origin moment.
- **Team size** at any company. Only "PM + Engineering", "Cross-functional" (`lib/projects.ts` team field).
- **Awards, talks, certifications, testimonials, press:** none exist.
- **Hobbies / life outside work:** nothing in the repo (the site's "beyond work" section was planned in
  `PRODUCT.md`, never written). The "weekend builds" are the only personal-time evidence.
- **Why he moved from electronics to design, from Kolkata to Pune, from agencies to enterprise:** not stated
  beyond "felt the pull toward enterprise — the work where systems matter most".
- **Client names for the three banking projects**, the employer for Vicus Bank / Bank Fraud Detection, and which
  city Impero IT was in.
- **Any measured outcome** of miniOrange work (NDA).

### [HIS WORDS] slots — one sentence from him makes it personal (5 slots, 3 minimum)

| Slot | Where it would sit in the story | Prompt question for Surajit |
|---|---|---|
| [HIS WORDS 1: origin] | after "The systems thinking came from here" | "What was the moment you realised you wanted to design the thing instead of wiring it? One sentence." |
| [HIS WORDS 2: a day] | the "what I do day to day" beat | "Walk me through yesterday: the first file you opened, the one decision you made, and who you argued with about it." |
| [HIS WORDS 3: point of view] | before "Make complex feel calm" | "Finish this in one line: 'Most enterprise software is bad because…'" |
| [HIS WORDS 4: the proud screen] | over the real work (banking screens or the design-system cover) | "If a stranger could see only one screen you've made, which one, and what would you say while they look at it?" |
| [HIS WORDS 5: what's next] | the invitation / end card | "What do you want the next five years to be about: which problem, which kind of team?" |

Until he answers, the film must stand without these; the slots are marked in the storyboard as optional lines,
not placeholders on screen.

---

## 8. Image assets: real and legible, real but not legible, concept renders

Dimensions measured with PIL; video with ffprobe.

### Real and legible (use at full frame)
| Path | Size | What it is |
|---|---|---|
| `public/v5/portrait.png` | 3776 × 4532 PNG, 12.7 MB | His real portrait: dark background, warm red rim light, glasses. Suits a dark theme without regrading. (v3 FACTS lists a cut-out at `video/public/img/portrait-cut.png`; not re-checked here.) |
| `public/projects/design-system/01-cover.png` | 1600 × 960 PNG | Real Figma cover: "MINIORANGE CENTRAL DESIGN SYSTEM · Design System Tokens/Variables · V1.0 · Color Styles · Typography · Shadows and Blurs" with token cards. Light theme. The single most legible board. |
| `public/projects/banking-tool/*.png` (16 files: ma-1…7, ca-1…4, comparison-1…2, region-1…3) | ≈ 1900 × 865 PNG each | Real captures of the "Financial Metrics Analysis" prototype (Internal Banking Analytics, 2025). Light theme, readable at 1080p: sidebar (Metrics Analysis, Cohort Analysis Chart, Churn, Comparison Charts, Marketplace Wise, Component Wise, Active Customer Analysis, Search Transactions, Pivot Data, Region Wise Data, Data Management), filter form, and in `ma-6.png`/`ma-7.png` an MRR/ARR data table with chart tabs. **Caveats:** the top-right user chip reads "aniket" (not him) — crop or cover it; vendor names (Shopify, Atlassian, Drupal, Joomla, WordPress) are visible in the filters. |

### Real but not legible (texture, far canvas, or a deliberate macro zoom only)
| Path | Size | What it is |
|---|---|---|
| `public/projects/design-system/02-components-overview.png` | 1700 × 2000 PNG | Component library at canvas scale; tiles are ~60 px wide. Reads as "a lot of components", not as UI. |
| `public/projects/iga/01-overview.png` | 2000 × 1276 PNG | IGA Figma canvas; frames are thumbnails on grey. |
| `public/projects/uem/01-overview.png` | 2000 × 1839 PNG | UEM canvas; the "COMPONENTS" and "DESIGNED SCREENS" section banners are readable, the frames are not. |
| `public/projects/ad-tools/01-overview.png` | 2000 × 1847 PNG | AD canvas; thumbnails on grey. (`02-policies.png`, referenced in `public/projects/covers/README.md`, does not exist.) |

### Concept renders — NOT real UI, avoid as "his work"
`public/showcase/*-d.jpg` (1280 × 2800, 12 files) and `*-m.jpg` (390 × 1800, 12 files), slugs: uem-mobile,
uem-discovery, financeos, financeos-payroll, mods-docs, academy, claude-session, sb-pr, cma, cheese, mosaic,
family-tree. All desktop files share one synthetic dark-dashboard template (identical layout, only the accent
colour changes); the mobile files likewise (cheese-m shows a "Cheese" title card). They are placeholders for the
desk reel, not captures. v3 FACTS called them "real product captures" — that was wrong.

### 3D loops and renders (not AI, not UI; optional accents)
| Path | Spec |
|---|---|
| `public/v5/robot-hand-alpha.webm` | VP9 1000 × 1000 (alpha variant) |
| `public/v5/keycaps-loop.webm` | VP9 1080 × 1080 |
| `public/v5/skate-wheel-alpha.webm` | VP9 800 × 800 (alpha variant) |
| `public/v5/step-video.mp4` | H.264 1080 × 700, 6.03 s |
| `public/v5/orb-torus.png` | 2944 × 2944 PNG, 5.1 MB (transparent torus) |
| `public/v5/img-a.avif`, `img-b.avif` | 2048 × 922, 2048 × 1755 (site hero object) |
v3 chose not to use them ("they read as a different, rendered world"); advisory.

### Missing / do not rely on
- `public/projects/covers/` holds only a README; no cover images exist.
- No screens in the repo for PAM, ITDR, DPDP, Sign-up Customizer, Message Broadcasting, Patient Portal, Product OS,
  any Impero or Fortmindz project, or any website (Figma / Figma Make links only; several are NDA).
- `public/cv.pdf` (linked from the site) does not exist; `public/resume.pdf` does.
- Figma Make prototypes are referenced in `lib/projects.ts` (ad-tools, dpdp, signup-flow-customizer,
  message-broadcasting, patient-portal); any capture of them would need to be taken fresh and would carry the tool's
  branding [NO-AI].

---

## 9. Conflicts and caveats, in one place

1. Years: 5 (him) vs 3+ (resume, site) vs 4 (v3). Use 5; confirm.
2. Base city: Pune (resume) vs Kolkata (site). Avoid or ask.
3. miniOrange tenure: "three years" on the site vs ≈ 2y 3m by the dates. Don't show.
4. "2 cities": Impero's city unknown.
5. Every speed number (5 days, ~70%, 5 variants in 4 h, ≈2 days) is credited to AI tooling at its source. On
   screen they stay design-speed facts with no tool named (v3 precedent, confirmed by the brief).
6. v3 FACTS mislabelled the showcase JPEGs as real captures. They are concept renders.
7. The website years ("2022 — 2024") are marked tentative in the catalogue; don't date a specific site on screen.
8. CARE, Function OS, Doctor App exist only as names on the /process page.
9. GitHub and `cv.pdf` links on the site are placeholders / missing.
