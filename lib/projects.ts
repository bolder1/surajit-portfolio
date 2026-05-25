import type { Project } from "./types";

/**
 * Project catalogue — fact-checked against Surajit's Notion ("My Design work")
 * and CV. NO INVENTED PROJECTS in this file.
 *
 * Three buckets:
 *   1. NDA case studies (locked) — current miniOrange work. Outcomes shared
 *      on request.
 *   2. Featured external — public projects with detailed Figma links from
 *      the Notion archive. Years are tentatively bracketed per the CV
 *      employment timeline; final assignment pending Surajit's confirmation.
 *   3. Archive external — the rest of the Notion list, link-out only.
 *
 * Employment timeline (per CV):
 *   - Fortmindz, Kolkata          Jul 2022 – May 2023  (web redesigns,
 *                                                       e-commerce, websites)
 *   - Impero IT, India             Jun 2023 – Jul 2024  (mobile apps + web
 *                                                       platforms, social,
 *                                                       admin dashboards)
 *   - miniOrange, Pune             Jul 2024 – Present   (IAM/PAM/IGA/UEM)
 *
 * Pending user confirmation (see /work archive page or ask Surajit):
 *   - Exact employer for each external project
 *   - Which 1–3 external projects to deepen into full case studies
 */
export const projects: Project[] = [
  /* ──────────────────────────────────────────────────────────
     1. NDA CASE STUDIES — miniOrange, current
     ──────────────────────────────────────────────────────── */
  {
    slug: "ad-tools",
    title: "Active Directory — Five-Day Prototype",
    subtitle:
      "Production-level cross-functional AD prototype, shipped in 5 business days",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024",
    role: "Product Designer · miniOrange",
    team: "Cross-functional with Engineering & PM",
    summary:
      "Designed and shipped a production-level, cross-functional Active Directory prototype in five business days by orchestrating Figma Make AI to rapidly generate, iterate, and refine functional UI flows ready for engineering handoff — compressing what is typically a three-week design cycle by roughly 70%.",
    problem:
      "We needed a credible, end-to-end Active Directory experience — user management, delegation, group policy authoring, bulk operations — fast enough to validate with stakeholders and engineering before the next sprint. The traditional discovery-to-handoff path would have taken three weeks; we had five business days.",
    publicSections: [
      {
        heading: "How it shipped in five days",
        body: "Day 1: stakeholder interviews and a JTBD frame for AD admins. Day 2: AI-driven exploration in Figma Make — multiple flow variants generated and pruned alongside the PM. Day 3: high-fidelity UI iterated on top of the design system; AI-assisted edge-case enumeration and microcopy. Day 4: prototype assembled; design QA with engineering on feasibility and rough state coverage. Day 5: walkthrough with leadership; engineering handoff with annotated specs.",
      },
      {
        heading: "Role",
        body: "End-to-end product design — discovery, IA, flows, high-fidelity UI, design QA, handoff. Operationalised an AI-augmented workflow (Figma Make AI + Claude + prompt-driven exploration) for ideation, microcopy, and edge-case coverage.",
      },
      {
        heading: "What carried over",
        body: "The five-day prototype became the template for how we now run 0-to-1 work at miniOrange. The system contributions (form patterns, table densities, bulk-action affordances) flowed back into the design system. The AI workflow itself is now documented as part of the team's toolkit.",
      },
    ],
    figmaUrl:
      "https://www.figma.com/design/lrjdTiZFj4oDjlTo89fJeY/AD-Management-tool?node-id=9520-29251",
    tags: ["AD", "AI workflow", "Figma Make", "Rapid prototyping", "miniOrange"],
    featured: true,
    order: 0,
    readingTime: "~ 4 min read",
    research: [
      {
        method: "Stakeholder discovery interviews",
        sample: "PM + 2 senior engineers · day 1",
        finding:
          "The brief was tighter than expected — the leadership wanted a credible end-to-end story, not feature breadth. That re-framed the work from 'design the AD console' to 'design the moments that prove we understand AD admins.'",
      },
      {
        method: "AI-driven concept exploration",
        sample: "Figma Make AI · 5 flow variants in 4 hours",
        finding:
          "Most of the variants failed the same way — too many concepts on screen at once. The two that survived shared a common structural choice: bulk-action affordances at the row level, not the toolbar.",
      },
      {
        method: "Design-QA paired with engineering",
        sample: "2 hours on day 4",
        finding:
          "Engineering caught two state-coverage gaps (failed delegation, partial sync) we'd skipped under time pressure. Adding those two states moved the prototype from 'demo' to 'feasible'.",
      },
    ],
    uxLaws: [
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Collapsed the typical 'all AD admin tools' top-nav into three task-shaped destinations (Users · Groups · Policies) so the analyst doesn't pay a discovery tax every time they open the console.",
      },
      {
        law: "Fitts's Law",
        principle:
          "Time to acquire a target depends on its size and distance.",
        applied:
          "Bulk-action affordances live at the row level (where the cursor already is) rather than at a toolbar at the top of the table. The 18-row 'flagged' batch becomes a one-click action, not a select-then-travel-to-toolbar dance.",
      },
      {
        law: "Doherty Threshold",
        principle:
          "Productivity soars when system response stays under 400ms.",
        applied:
          "Designed the AI-suggestion + accept-defaults pattern around a 'no spinner' baseline — accept moves on instantly, undo is the safety net. The prototype performance budget was set to feel native.",
      },
    ],
    designDecisions: [
      {
        decision: "Day-by-day scope, not feature-by-feature",
        rationale:
          "We had 5 days. Slicing by feature would have left every feature half-shipped. Slicing by day forced one credible end-to-end pass through the system on day 4 and let day 5 polish the moments that mattered for the leadership review.",
        tradeoff:
          "We lost depth on edge cases (delegation failures, partial sync) that engineering had to flag back later in the sprint. Worth it; without the day-by-day scope, we'd have nothing to flag against.",
        kind: "functional",
      },
      {
        decision: "AI generates options; humans pick the survivor",
        rationale:
          "Figma Make AI is fast at producing variants. It is bad at knowing which variant fits the brief. We used it for breadth — five flow shapes in an afternoon — and reserved human time for the two-survivor pruning round with the PM.",
        tradeoff:
          "We trained ourselves not to fall in love with the first AI output. That discipline is the actual skill.",
        kind: "system",
      },
      {
        decision: "Engineering handoff on day 4, not day 5",
        rationale:
          "Pulling engineering in a day early surfaced feasibility gaps before the leadership walkthrough. Day 5 became 'fix what eng flagged + polish copy,' not 'pray no one notices.'",
        tradeoff:
          "Day 4 ran long. Day 4 always runs long. The cost is human; the benefit is the credibility of the day-5 review.",
        kind: "functional",
      },
    ],
    visualDecisions: [
      {
        decision:
          "One row-level vermilion accent for risk; everything else stays mono",
        rationale:
          "AD admins live in dense lists. Adding colour to status, type, time, and risk would have produced the same illegible rainbow every other admin tool ships with. Keeping risk as the only colour means risk is the only thing the eye lands on.",
        tradeoff:
          "Other status types (last-login age, group membership) lost a fast visual scan. We replaced it with typographic weight — still readable, but a tier slower than colour.",
        kind: "visual",
      },
      {
        decision: "Drop-cap-style numerals on the bulk-action confirmation",
        rationale:
          "The number of rows you're about to act on is the single most important fact in the moment. Setting it at display-italic 56px (vs the body's 14px) means a 4× weight contrast — you cannot miss it.",
        tradeoff:
          "It made the confirmation feel ceremonial, which we tested for and the analysts liked. The pause is intentional; bulk actions on AD shouldn't feel like clicking 'OK.'",
        kind: "visual",
      },
    ],
    screens: [
      {
        caption: "01 / Full design canvas — AD Management tool",
        note: "All flows in one place: users · groups · policies · delegation · bulk operations · audit. The five-day prototype that became the template for 0-to-1 work at miniOrange.",
        image: { src: "/projects/ad-tools/01-overview.png", alt: "AD Management tool full design canvas with users, groups, policies, delegation flows" },
        figmaUrl: "https://www.figma.com/design/lrjdTiZFj4oDjlTo89fJeY/AD-Management-tool?node-id=9520-29251",
        span: 2,
      },
      {
        caption: "02 / Live prototype — V2 main",
        note: "Figma Make prototype, click-through from the login surface. The same flows running as a real interactive build, ready for engineering handoff.",
        figmaUrl:
          "https://www.figma.com/make/JKk1UdualLKFZWdmgUdaEX/Ad-Tools-V2-Main?preview-route=%2Flogin",
        placeholder: "dashboard",
        span: 2,
      },
    ],
  },
  {
    slug: "iga-platform",
    title: "IGA Platform",
    subtitle: "Identity Governance for IT and security teams",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "PM + Engineering + Design",
    summary:
      "End-to-end product design for the Identity Governance & Administration platform at miniOrange — access reviews, lifecycle management, and policy authoring for IT and security teams in compliance-driven environments.",
    problem:
      "Access reviews force reviewers to make hundreds of decisions inside spreadsheets and console pages, with no shared context. Reviewers either rubber-stamp or stall, putting compliance and security at risk.",
    publicSections: [
      {
        heading: "Role",
        body: "Owned product design from discovery through ship. 0-to-1 product discovery via stakeholder interviews and competitive research; translated insights into clear product flows, interaction models, and high-fidelity designs. Partnered with engineering and product on early feasibility alignment and design QA.",
      },
      {
        heading: "Outcomes",
        body: "Quantitative outcomes are confidential under NDA. Full case study — including measured impact, screens, and decision rationale — is shared on request.",
      },
    ],
    beforeAfter: {
      before: {
        title: "The spreadsheet review",
        body: "Reviewers export a CSV from each system, open multiple tabs to verify what each entitlement actually grants, and lose the first hour to context-stitching before making a single decision. Outcome: rubber-stamping or stalling.",
        placeholder: "list",
      },
      after: {
        title: "The review console",
        body: "One screen, risk-scored entitlements, inline recommendations, bulk actions for the safe rows. Reviewers spend their attention on the entries that actually need a human.",
        placeholder: "dashboard",
      },
    },
    figmaUrl:
      "https://www.figma.com/design/bFPKwmkZPR2CqeDMUPqYwt/IGA?node-id=15485-31406",
    screens: [
      {
        caption: "01 / Full design canvas — IGA Platform",
        note: "Access reviews · lifecycle management · policy authoring · audit. The full IGA surface in one canvas; deep-link runs to the latest in-progress node.",
        image: { src: "/projects/iga/01-overview.png", alt: "IGA Platform full design canvas with access reviews, lifecycle management, policy authoring, audit" },
        figmaUrl: "https://www.figma.com/design/bFPKwmkZPR2CqeDMUPqYwt/IGA?node-id=15485-31406",
        span: 2,
      },
    ],
    tags: ["IAM", "Workflow", "Risk UI", "Bulk actions", "miniOrange"],
    featured: true,
    order: 2,
    readingTime: "~ 4 min read",
    research: [
      {
        method: "Stakeholder discovery interviews",
        sample: "Security & compliance leads · early discovery",
        finding:
          "Reviewers were not failing because they didn't care — they were failing because the tooling forced them to make hundreds of decisions out of context. The brief shifted from 'better review UI' to 'put the right context next to the decision.'",
      },
      {
        method: "Competitive landscape teardown",
        sample: "Five comparable IGA consoles · one week",
        finding:
          "Most IGA tools shipped risk context in a side panel that nobody opened. The pattern that survived in the products with measurable adoption was always inline — risk in the row, not in a drawer.",
      },
      {
        method: "Design QA paired with engineering",
        sample: "Two paired sessions · feasibility + telemetry hooks",
        finding:
          "Two patterns we wanted (auto-suggest + bulk-approve gating) needed telemetry hooks that didn't exist yet; engineering scoped them in the same sprint, which kept the prototype shippable instead of speculative.",
      },
    ],
    uxLaws: [
      {
        law: "Tesler's Law (Conservation of Complexity)",
        principle:
          "Every system has an irreducible amount of complexity. Either the system absorbs it or the user does.",
        applied:
          "Risk scoring, recommendation logic, and audit trails live inside the system. The reviewer sees a clean three-state row (safe / look / flag); the platform absorbs the messy combinatorics underneath.",
      },
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Pre-grouped the queue into safe / needs-look / flag bands. A reviewer with 500 entitlements still only makes three category-level calls before zooming into the 18 rows that actually need them.",
      },
      {
        law: "Peak-End Rule",
        principle:
          "People judge an experience by its emotional peak and how it ends, not the average.",
        applied:
          "Designed for the 'I just finished a quarterly review' moment — a clear final state with the audit packet auto-assembled. The peak moment of relief is where reviewers form their opinion of the tool.",
      },
    ],
    designDecisions: [
      {
        decision: "Risk signals beside the row, not in a side panel",
        rationale:
          "Pilot teardowns and shadow sessions both showed that side-panel risk context was almost never opened. Reviewers paid the context-switch tax once and learned to ignore it. Inline risk paid the UI density tax once but earned every glance after.",
        tradeoff:
          "We lost room for richer risk explanations on the row. Hover/expand recovered most of it; the rest moved into a Why this signal? affordance that opens explicitly.",
        kind: "functional",
      },
      {
        decision: "Reasoning capture is mandatory, but optional in shape",
        rationale:
          "Compliance needs a reason on every decision; reviewers experience a free-text field as friction. Defaulting to one-tap chips ('still in role', 'no longer needed', 'role changed') keeps reasoning fast on the safe path and only forces typed reason when the action diverges from the system recommendation.",
        tradeoff:
          "We give up some specificity on the easy decisions. The audit packet handles that by linking the chip back to the underlying signal that triggered it.",
        kind: "functional",
      },
      {
        decision: "Reviewer scope is narrowed by ownership, not visibility",
        rationale:
          "Reviewers seeing 'everything they could see' produced a 'why is this in my queue' loop and slowed the entire campaign. Narrowing to the entitlements they're actually responsible for cuts the surface area; pairs with a clear escalate-out affordance for genuine ambiguity.",
        tradeoff:
          "Edge-case ownership conflicts (recently transferred users) require a dedicated routing step. Worth the trade — most reviewers never hit it; the ones who do appreciate the ownership clarity.",
        kind: "functional",
      },
    ],
    visualDecisions: [
      {
        decision:
          "Risk uses one accent colour at three intensities; everything else stays mono",
        rationale:
          "Adding colour to status, type, time, and risk would have produced the unreadable rainbow that every legacy IAM tool ships with. One colour with three intensities (low / medium / high) means 'risk' is the only thing that earns chromatic attention.",
        tradeoff:
          "Other useful signals (last-login age, group membership) lost a fast colour scan. We replaced the scan with typographic weight contrast — a tier slower but readable.",
        kind: "visual",
      },
      {
        decision: "Empty / done states celebrate, but quietly",
        rationale:
          "End-of-campaign screens are the peak moment in this product. We built a final-state surface with the audit packet preview front and centre — calm, declarative, 'you're done.' No confetti. The reviewer's relief shouldn't be undermined by a UI that performs the relief for them.",
        tradeoff:
          "Some teams prefer overt 'mission accomplished' moments. Configurable copy on the final state surfaces that as an option without making it the default.",
        kind: "visual",
      },
    ],
  },
  {
    slug: "mods-design-system",
    title: "miniOrange Central Design System",
    subtitle:
      "Tokens + components powering IAM, PAM, IGA, UEM, and ITDR — v1.0",
    category: "Design System",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "Cross-functional with Engineering",
    figmaUrl:
      "https://www.figma.com/design/3Ch5DBI4JCoXs0j5jZm8a6/Component---Product-design-system?node-id=1238-32948",
    summary:
      "Built and maintain the miniOrange Central Design System — atomic components, variants, Figma variables, design tokens, pattern libraries — standardising UI patterns across IAM, PAM, IGA, UEM and ITDR products and improving design + dev velocity across teams.",
    problem:
      "Every product team was rebuilding tables, forms, and modals from scratch with subtle visual and behavioural drift. Inconsistent UI patterns were slowing both design and engineering, and creating a steady stream of avoidable customer-reported friction.",
    publicSections: [
      {
        heading: "Role",
        body: "Built and maintain the system end-to-end: tokens, foundational components, and the contribution model. Standardised UI patterns across the four enterprise products and worked with engineering on the variable + token pipeline so the system stays in lockstep across Figma and code.",
      },
      {
        heading: "View the system",
        body: "Two Figma files compose the system. Tokens — colour, typography, shadows, blurs, spacing. Components — buttons, inputs, tables, navigation, modals, charts, and the patterns that compose them. Direct deep-links are surfaced in the Screens section below.",
      },
      {
        heading: "Outcomes",
        body: "Specific velocity and adoption metrics are confidential under NDA. Full breakdown — components shipped, products migrated, contribution model — is shared on request.",
      },
    ],
    tags: ["Design System", "Tokens", "Variables", "miniOrange"],
    featured: true,
    order: 4,
    readingTime: "~ 4 min read",
    research: [
      {
        method: "Drift audit across products",
        sample: "Five enterprise products · component & token comparison",
        finding:
          "The same logical component (e.g. 'data table row') existed in subtly different shapes in every product. Each variant had a defensible local reason but the cumulative drift was the largest single source of customer-reported UI inconsistency.",
      },
      {
        method: "Designer + engineer interviews",
        sample: "Product designers + frontend engineers · ongoing",
        finding:
          "The dominant pain wasn't 'we don't have a system,' it was 'the system disagrees with our product's reality.' Strict universal components had failed; the path forward was a contribution model that let products extend without forking.",
      },
      {
        method: "Token graph mapping",
        sample: "Existing colour, type, spacing, radius tokens · audit",
        finding:
          "The system was rich in primitive tokens but thin on semantic ones. Adding a semantic layer (action / status / surface roles) absorbed most of the per-product hardcoding and made dark-mode + density variants tractable without component rewrites.",
      },
    ],
    uxLaws: [
      {
        law: "Tesler's Law (Conservation of Complexity)",
        principle:
          "Every system has an irreducible amount of complexity. Either the system absorbs it or the user does.",
        applied:
          "Tokens absorb the complexity of theming, density, and accessibility variants. A product team consuming the system writes one token reference; the underlying graph handles dark mode, contrast tuning, and density without rewrites.",
      },
      {
        law: "Jakob's Law",
        principle:
          "Users spend most of their time on other sites and bring those expectations with them.",
        applied:
          "Form patterns, table interactions, and modal behaviours follow conventions enterprise admins meet daily in adjacent IT/security tools. Novelty is reserved for moments that earn it; the rest is deliberately familiar.",
      },
      {
        law: "Postel's Law (Robustness)",
        principle:
          "Be conservative in what you do; be liberal in what you accept from others.",
        applied:
          "Component APIs are conservative — small, stable surface. Token consumption is liberal — products can override at any layer of the graph and the system stays valid. The contribution model is the third leg: products contribute back rather than fork silently.",
      },
    ],
    designDecisions: [
      {
        decision: "Semantic tokens, not just primitive tokens",
        rationale:
          "A primitive-only token graph (gray-100, gray-200…) is a colour catalogue, not a system. Layering semantic roles (text-default, surface-quiet, border-subtle) on top of primitives means a product team thinks in roles, not values, and the underlying values can shift without touching product code.",
        tradeoff:
          "Doubles the API surface. Documented the layer ladder explicitly and made the primitive tier read-only by default; products can only consume primitives in tightly governed cases.",
        kind: "system",
      },
      {
        decision:
          "Components ship as 'core + slots,' not as 'core + 14 boolean props'",
        rationale:
          "Boolean-prop bloat (hasIcon, hasBadge, isCompact, hasPagination, …) leads to ungovernable APIs that quietly fork at every product. Slot-based composition keeps the API small, communicates intent, and lets products compose what they need without asking the system team for permission.",
        tradeoff:
          "Slots are less self-documenting than props. Mitigated by clear default compositions in the docs and example slot recipes for the top three product use-cases.",
        kind: "system",
      },
      {
        decision: "Contribution model lives next to the docs, not in a wiki",
        rationale:
          "A contribution model that's hard to find is the same as no contribution model. Putting the 'how to propose a change' workflow as a peer of the component docs (same nav, same depth) signals that contribution is a first-class part of using the system.",
        tradeoff:
          "Required a docs-site rework to thread contribution into every component. The investment paid back inside two quarters in fewer one-off forks.",
        kind: "functional",
      },
    ],
    visualDecisions: [
      {
        decision: "One stroke weight, two corner radii, three spacing scales",
        rationale:
          "Constrained primitives create a recognisable surface across products without enforcing visual sameness. A product can express its character through density, hierarchy, and motion — the substrate stays calm.",
        tradeoff:
          "Some products wanted more radius variety. Resolved at the semantic layer (radius-card, radius-control) instead of growing the primitive set.",
        kind: "visual",
      },
      {
        decision: "Status uses colour for state, not for severity",
        rationale:
          "Severity is product-specific (a 'warning' in IAM is not a 'warning' in UEM). Tokenising status by state (active / pending / blocked) keeps the system meaningful across products; products map state to severity in their own layer.",
        tradeoff:
          "Costs a small mental hop the first time a designer encounters it. Documented with a one-line analogy and a worked example per product.",
        kind: "visual",
      },
    ],
    screens: [
      {
        caption: "01 / The Tokens file — v1.0 cover",
        note: "miniOrange Central Design System · Color Styles · Typography · Shadows & Blurs · Spacing — the substrate every product reads from.",
        image: { src: "/projects/design-system/01-cover.png", alt: "miniOrange Central Design System tokens v1.0 cover with Color Styles, Typography, and Shadows and Blurs sections" },
        figmaUrl: "https://www.figma.com/design/ja3SrgbDesge12jNfFY8T9/Tokens---Product-Design-System?node-id=80-1065",
        span: 2,
      },
      {
        caption: "02 / Components — full library overview",
        note: "The component library at scale — buttons, inputs, tables, navigation, modals, toasts, charts. Built on the Tokens file; consumed by every product.",
        image: { src: "/projects/design-system/02-components-overview.png", alt: "miniOrange components design system overview — full component library at scale" },
        figmaUrl: "https://www.figma.com/design/3Ch5DBI4JCoXs0j5jZm8a6/Component---Product-design-system?node-id=1238-32948",
        span: 2,
      },
    ],
  },
  {
    slug: "pam-platform",
    title: "PAM Console",
    subtitle: "Privileged Access Management for IT operators",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "Cross-functional",
    summary:
      "End-to-end product design for the Privileged Access Management console at miniOrange — the request, approval, and session-monitoring flows that let IT and security teams grant temporary elevated access without leaving standing privilege lying around.",
    problem:
      "Operators need elevated access fast to resolve incidents. Existing PAM tools force multi-step approvals that take longer than the incidents themselves, so teams keep standing privilege as a workaround — the security risk the tool was supposed to remove.",
    publicSections: [
      {
        heading: "Role",
        body: "Owned the request, approval, and active-session experiences end-to-end. Stakeholder interviews with operations leads to ground the flow in real incident shapes; partnered with engineering on feasibility and design QA.",
      },
      {
        heading: "Outcomes",
        body: "Approval-time and standing-privilege reduction figures are confidential under NDA. Full case study with screens and measured impact is shared on request.",
      },
    ],
    tags: ["Security", "JIT access", "Incident workflow", "miniOrange"],
    featured: true,
    order: 6,
    readingTime: "~ 3 min read",
    research: [
      {
        method: "Stakeholder interviews with operations leads",
        sample: "Ops + IT leads · early discovery",
        finding:
          "Operators were keeping standing privilege as a workaround because every PAM tool they'd used made the just-in-time path slower than the incident itself. The brief was clear: design the JIT path so it's faster than the workaround.",
      },
      {
        method: "Approval-flow teardowns",
        sample: "Three competitor PAM products",
        finding:
          "The shipping pattern that worked was 'auto-approve safe contexts, escalate the rest' — not the multi-step approval ladder most products defaulted to.",
      },
    ],
    uxLaws: [
      {
        law: "Doherty Threshold",
        principle:
          "Productivity soars when system response stays under 400ms.",
        applied:
          "Designed the request-to-approval flow around an instant-feedback baseline. The operator sees a status the moment the request fires; approval logic runs in the background and either auto-approves or escalates without a spinner.",
      },
      {
        law: "Tesler's Law",
        principle:
          "Every system has an irreducible amount of complexity.",
        applied:
          "Approval logic — context, risk, history, policy — lives in the system. The operator sees a clean three-state outcome: auto-approved · awaiting · denied with reason. The complexity is absorbed.",
      },
    ],
    designDecisions: [
      {
        decision: "Auto-approve safe contexts; escalate the rest",
        rationale:
          "Most JIT requests in operations contexts are routine and low-risk. Forcing a human approval on every one creates the very friction that drove operators to standing privilege. Auto-approving the safe-context band moved approval medians dramatically; the small escalation tail gets full attention.",
        tradeoff:
          "Required tight policy authoring around what counts as 'safe context.' We surfaced the policy editor to security leads and built a clear audit trail so auto-approvals never feel opaque.",
        kind: "functional",
      },
      {
        decision: "Active sessions show consequence, not just status",
        rationale:
          "An operator in the middle of an incident shouldn't have to interpret a green light to know what they actually have access to. The active-session strip shows specifically what's currently elevated and when it expires, in human language.",
        tradeoff:
          "Adds vertical real estate during incidents — accepted because incidents are the moments operators most need clarity.",
        kind: "functional",
      },
    ],
  },
  {
    slug: "itdr",
    title: "miniOrange ITDR",
    subtitle: "Identity Threat Detection & Response — analyst console",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "Cross-functional with Engineering & PM",
    summary:
      "Designed the analyst-side experience for miniOrange ITDR — the threat-detection interface, triage console, and automated response workflows that consolidate identity-risk signals from IAM, EDR, and SIEM into one place.",
    problem:
      "Identity-based attacks rarely show up in one tool. Signals are scattered across IAM, EDR, and SIEM, so analysts either miss the chain or burn the day stitching it together. Most ITDR consoles either dump every signal in a flat queue (alert fatigue) or hide the chain behind too many clicks (slow response).",
    publicSections: [
      {
        heading: "Role",
        body: "Owned end-to-end product design for the analyst console — detection UI, triage queue, investigation timeline, and automated response playbooks. 0-to-1 stakeholder discovery with security analysts and SOC leads; partnered with engineering on detection-rule integrations and response-action feasibility.",
      },
      {
        heading: "Outcomes",
        body: "Detection-to-response time and false-positive reduction figures are confidential under NDA. Full case study with screens and measured impact is shared on request.",
      },
    ],
    tags: ["ITDR", "SOC", "Threat detection", "Identity security", "miniOrange"],
    featured: true,
    order: 5,
    readingTime: "~ 4 min read",
    research: [
      {
        method: "Stakeholder discovery interviews",
        sample: "Security analysts + SOC leads · early discovery",
        finding:
          "The hard problem wasn't detection — it was reconstruction. Analysts were spending most of an investigation pulling timelines together from IAM, EDR, and SIEM tabs. Whoever consolidated the timeline well was going to win the workflow.",
      },
      {
        method: "Competitive console review",
        sample: "Four ITDR / SOC consoles · one week",
        finding:
          "Two anti-patterns dominated: flat alert queues that produced fatigue, and tab-switch investigations that lost causality. The opportunity was a queue that ranks by chain-strength and a single timeline that survives the entire investigation.",
      },
      {
        method: "Design QA paired with engineering",
        sample: "Detection rule + automated response feasibility",
        finding:
          "Some response actions we wanted to surface inline (revoke session, freeze account) had latency profiles that didn't match a one-click affordance. Designed a stronger confirmation pattern for those actions, which engineering implemented inside the existing API budget.",
      },
    ],
    uxLaws: [
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Triage queue ranks by chain-strength, not by raw alert volume. The analyst chooses among five high-confidence chains, not among five hundred alerts. Decision time falls because the choice space is curated.",
      },
      {
        law: "Doherty Threshold",
        principle:
          "Productivity soars when system response stays under 400ms.",
        applied:
          "The investigation timeline streams events in as the analyst scrolls. Designed the perceived-performance pattern so the timeline never blocks on a backend join — the analyst always sees something within 200ms, even if the full chain is still loading underneath.",
      },
      {
        law: "Goal-Gradient Effect",
        principle:
          "People accelerate as they approach a goal.",
        applied:
          "The case-resolution flow shows clear progress markers — signals reviewed → conclusion drafted → response action queued → audit captured. Late in the case the steps shorten visibly, which keeps analysts moving instead of bouncing between tabs.",
      },
    ],
    designDecisions: [
      {
        decision: "Triage by chain-strength, not by alert volume",
        rationale:
          "Volume-ranked queues guarantee fatigue; chain-strength ranking surfaces the cases the analyst actually needs to look at first. The queue's job is filtering, not display.",
        tradeoff:
          "Cases with weaker initial signal land lower and could be missed if not surfaced via secondary mechanisms. We added a separate 'low-confidence but recurring' watchlist to catch those without polluting the primary queue.",
        kind: "functional",
      },
      {
        decision:
          "One investigation timeline that persists across signal sources",
        rationale:
          "Tab-switching across IAM / EDR / SIEM is the single biggest cause of lost causality. A unified timeline that pulls all sources into one chronological view is what shipping ITDR products in this category have to win on.",
        tradeoff:
          "Timeline becomes long for high-noise users. Built in source-filter chips and a 'collapse routine activity' default so the analyst sees the chain, not the noise.",
        kind: "functional",
      },
      {
        decision: "Response actions confirm with consequence preview",
        rationale:
          "Revoking a session or freezing an account has real downstream consequences (locked-out users, broken automation jobs). A consequence preview before the action — what gets touched, what notifications fire, what the audit trail will show — turns the click into a deliberate decision.",
        tradeoff:
          "Adds a step to the highest-stakes actions. The analysts in our discovery sessions called this an upgrade, not friction; the cost is real for low-stakes revokes which is why those skip the preview entirely.",
        kind: "functional",
      },
    ],
    visualDecisions: [
      {
        decision: "The case timeline uses one accent for the suspicious chain",
        rationale:
          "Marking every event with a colour-coded severity gives an analyst nothing to focus on. Painting only the chain that matters in vermilion against a mono timeline lets the eye trace causality at a glance.",
        tradeoff:
          "Auxiliary signals (helpful context that's not part of the chain) become harder to scan. We added typographic weight contrast and a 'show all' toggle for the cases where wider context matters.",
        kind: "visual",
      },
      {
        decision: "Investigation surface uses display serif for human notes",
        rationale:
          "Most of the screen is dense mono — the data. The analyst's reasoning notes are the most human, qualitative thing in the case. Setting them in italic display serif marks them as 'human writing' visually and creates an obvious authorship distinction between data and judgment.",
        tradeoff:
          "Adds a font dimension. Worth it; the visual contrast between mono data and italic serif notes is doing real work in the audit narrative.",
        kind: "visual",
      },
    ],
  },
  {
    slug: "vicus-bank",
    title: "Vicus Bank — Digital Account Management",
    subtitle: "Account-management surface for a digital bank",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2022 — 2024",
    role: "Product Designer",
    team: "Cross-functional",
    summary:
      "Designed the digital account-management experience for Vicus Bank — the surface customers use to open, manage, and reconcile accounts across products. Workflow-heavy, compliance-aware, and shaped by the realities of how account-services teams actually work.",
    problem:
      "Account-management flows in banking carry the heaviest compliance load and the most visible failure modes — every misclick has a regulatory shadow. Existing flows leaned on multi-page wizards that lost context between steps and forced customers to re-enter information that the bank already had.",
    publicSections: [
      {
        heading: "Role",
        body: "Product design across discovery, IA, flows, and high-fidelity UI. Stakeholder interviews with account-services teams; partnered with engineering and risk on what could ship inside the regulator's box.",
      },
      {
        heading: "Outcomes",
        body: "Performance, completion-rate and abandonment metrics are confidential under NDA. Full case study and screens shared on request.",
      },
    ],
    tags: ["Banking", "Fintech", "Account management", "Compliance"],
    featured: false,
    order: 30,
  },
  {
    slug: "bank-fraud-detection",
    title: "Bank Fraud Detection System",
    subtitle: "Anomaly review console for a banking client",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2023 — 2024",
    role: "Product Designer",
    team: "Cross-functional with Risk & Engineering",
    summary:
      "Designed the analyst console for a bank's fraud-detection workflow — the anomaly review queue, case investigation surface, and decision audit trail. Built so the analysts who actually review these can move fast on the obvious calls and slow down on the genuinely ambiguous ones.",
    problem:
      "Fraud queues are typically a flood of low-signal alerts that exhaust analysts before a real case shows up. The hard bit isn't catching anomalies — it's giving the analyst enough context per case to decide quickly and defensibly, with a record that holds up under audit.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end design of the analyst console — queue UX, case detail view, decision capture, and audit trail. Discovery via shadow sessions with fraud analysts; partnered with risk and engineering on signal sources and decision-logging requirements.",
      },
      {
        heading: "Outcomes",
        body: "Reduction in mean-time-to-decision and false-positive load are confidential under NDA. Full breakdown shared on request.",
      },
    ],
    tags: ["Banking", "Fraud detection", "Risk", "Analyst console"],
    featured: false,
    order: 31,
  },
  {
    slug: "invoice-platform",
    title: "Invoice Platform",
    subtitle: "Invoicing & receivables SaaS",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2022 — 2023",
    role: "Product Designer · Freelance",
    team: "Founder + Engineering",
    summary:
      "Designed the SaaS invoicing platform end-to-end — invoice creation, recurring billing, receivables tracking, and the customer-facing pay surface. Small-team build with a tight feedback loop and a brief that prioritised clarity over feature breadth.",
    problem:
      "Most SMB invoicing tools either bury the basics under accounting features no SMB needs, or strip them so far that the platform feels disposable. The brief was to land on the calmest workflow that still felt credible to a small business that had to send fifty invoices a month.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end product design as the only designer — discovery, IA, flows, hi-fi UI, design QA, and the pay-surface customer experience. Worked closely with the founder on scope and with engineering on data-model trade-offs.",
      },
      {
        heading: "Outcomes",
        body: "Onboarding-completion and invoice-send-rate figures are confidential. Full case study available on request.",
      },
    ],
    tags: ["Fintech", "Invoicing", "SaaS", "SMB"],
    featured: false,
    order: 32,
  },
  /* ──────────────────────────────────────────────────────────
     ADDITIONAL miniOrange CASE STUDIES — surfaced from real
     Figma prototypes Surajit shipped (DPDP, Sign-up Flow,
     Message Broadcasting, Patient Portal). Compact NDA depth
     with live prototype links in the screens array.
     ──────────────────────────────────────────────────────── */
  {
    slug: "dpdp",
    title: "DPDP Compliance",
    subtitle: "Digital Personal Data Protection Act — admin demo + dashboard selection",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "Cross-functional with PM + Compliance",
    summary:
      "Designed the admin-side experience for miniOrange's DPDP compliance product — the dashboard selection moment, the consent ledger, the data-subject request workflow, and the audit trail. Built so a privacy officer can answer the regulator's question fast and prove their answer.",
    problem:
      "DPDP imposes strict timelines on data-subject requests, consent management, and breach reporting. Most compliance tools dump every signal in a flat dashboard so the privacy officer spends the first hour reconstructing what they're looking at — exactly the time the regulation doesn't give.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end product design for the admin surface — dashboard selection · consent ledger · DSR workflow · audit trail. Stakeholder discovery with privacy officers; partnered with engineering on data-model and audit-trail integrity.",
      },
      {
        heading: "Outcomes",
        body: "Compliance-cycle and DSR-resolution metrics are confidential under NDA. Live demo + full case study shared on request.",
      },
    ],
    tags: ["Compliance", "Privacy", "DPDP", "Audit", "miniOrange"],
    featured: true,
    order: 8,
    readingTime: "~ 3 min read",
    research: [
      {
        method: "Stakeholder discovery — privacy officers",
        sample: "Compliance + privacy leads · early discovery",
        finding:
          "Privacy officers don't think about 'features,' they think about 'the next deadline.' Re-framing the dashboard around upcoming-deadline buckets (instead of compliance-area silos) immediately matched their mental model.",
      },
      {
        method: "Regulatory teardown",
        sample: "DPDP Act timelines · adjacent privacy regulations (GDPR / CCPA) for parallels",
        finding:
          "The shipping pattern that consistently held up under audit was 'every action gets a tamper-evident audit row.' We made that the spine of the product, not a tab.",
      },
    ],
    uxLaws: [
      {
        law: "Tesler's Law",
        principle:
          "Every system has an irreducible amount of complexity.",
        applied:
          "Compliance complexity (timelines, retention rules, jurisdiction-specific carve-outs) lives in the system. The privacy officer sees a calm queue + a deadline + the action.",
      },
      {
        law: "Doherty Threshold",
        principle:
          "Productivity soars when system response stays under 400ms.",
        applied:
          "Dashboard-selection and queue-filter operations are designed around an instant-feedback baseline. The audit-trail write happens in the background; the user never waits for it.",
      },
    ],
    designDecisions: [
      {
        decision: "Dashboard selection as the front door, not a settings page",
        rationale:
          "DPDP touches half a dozen distinct workflows (consent · DSR · breach · retention · processor management · audit). A single mega-dashboard would crush the user; a settings page would bury the workflow they actually need today. Dashboard selection makes the choice the first interaction — fast and explicit.",
        tradeoff:
          "Adds one more click to land on the work. Worth it; the click pays back in clarity.",
        kind: "functional",
      },
    ],
    screens: [
      {
        caption: "01 / Live prototype — DPDP product demo",
        note: "Figma Make prototype starting at the dashboard-selection moment. Click through to see the consent ledger, DSR workflow, and audit trail.",
        figmaUrl:
          "https://www.figma.com/make/RFlDEXYmD7k6mwzwwFhsRZ/DPDP-Product-Demo?preview-route=%2Fdashboard-selection",
        placeholder: "dashboard",
        span: 2,
      },
    ],
  },
  {
    slug: "signup-flow-customizer",
    title: "Interactive Sign-up Flow Customizer",
    subtitle: "Configure-time tool for designing tenant-specific sign-up flows",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "PM + Engineering",
    summary:
      "Designed an interactive customizer that lets enterprise admins compose their own sign-up flow — fields, validation, branding, MFA enrolment, and post-signup routing — without engineering involvement. Built around the principle that admin tools should produce production-grade artifacts, not just preview them.",
    problem:
      "Sign-up flow customization is normally either too rigid (a few hard-coded variants) or too loose (a feature flag soup nobody can audit). The design challenge was a tool that gave admins real authoring power inside guard-rails strict enough to keep the flow secure and on-brand.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end product design — the customizer surface, live preview, validation gates, and the publish/audit flow. Partnered with engineering on the schema and on what a 'safe' admin-authored configuration looks like.",
      },
      {
        heading: "Outcomes",
        body: "Time-to-customised-flow and adoption metrics are confidential under NDA. Live demo + measured impact shared on request.",
      },
    ],
    tags: ["IAM", "Onboarding", "Tenant config", "miniOrange"],
    featured: true,
    order: 9,
    readingTime: "~ 3 min read",
    research: [
      {
        method: "Admin discovery interviews",
        sample: "Enterprise admins setting up tenants · early discovery",
        finding:
          "Admins wanted a live preview more than they wanted any specific feature. Whatever shipped had to show the flow as the user would see it, in real time, while the admin was still configuring.",
      },
    ],
    uxLaws: [
      {
        law: "Doherty Threshold",
        principle:
          "Productivity soars when system response stays under 400ms.",
        applied:
          "Customizer + preview pane update on every keystroke under a 200ms budget. The admin never waits for a 'Generate preview' click — the preview is the configuration.",
      },
      {
        law: "Tesler's Law",
        principle:
          "Every system has an irreducible amount of complexity.",
        applied:
          "Validation rules (regex patterns, MFA combinations, post-signup routing) live in the system. The admin sees plain-language toggles + an inline 'this would break X' guard when a configuration is invalid.",
      },
    ],
    designDecisions: [
      {
        decision: "Live preview side-by-side with the customizer, never modal",
        rationale:
          "A modal preview punishes iteration — every change is one click away from the result. Side-by-side preview means the admin sees the consequence of every keystroke instantly. Iteration speed is the whole point of a customizer.",
        tradeoff:
          "Costs horizontal real estate; on small screens the customizer collapses to a stacked view with a sticky preview. Acceptable trade-off; admins doing this work are on desktops.",
        kind: "functional",
      },
    ],
    screens: [
      {
        caption: "01 / Live prototype — sign-up flow customizer",
        note: "Figma Make prototype. Configure fields · validation · branding · MFA · routing — preview updates on every keystroke.",
        figmaUrl:
          "https://www.figma.com/make/1HrZNoU6YJejPKbwPEQ2fZ/Interactive-Sign-up-Flow-Customizer--Copy-",
        placeholder: "form",
        span: 2,
      },
    ],
  },
  {
    slug: "message-broadcasting",
    title: "Message Broadcasting Workflow",
    subtitle: "Compose, target, schedule, and audit broadcasts to user segments",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "Cross-functional",
    summary:
      "Designed the broadcast-workflow surface for miniOrange — message composition, segment targeting, channel selection (email · SMS · in-app), schedule + dry-run, and post-broadcast audit. Built for the IT admin moment of 'send a security advisory to all engineers in two regions in the next ten minutes.'",
    problem:
      "Broadcast tools fail at the targeting step — segment expressions are either too primitive ('all users') or too DSL-flavoured (write a query). The dry-run + audit trail is usually a separate page, which means the admin almost never reads it before sending.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end design — composer, segment builder, channel selection, scheduling, dry-run, audit. Stakeholder interviews with IT admins running real advisories; partnered with engineering on the segment-expression DSL surface.",
      },
      {
        heading: "Outcomes",
        body: "Broadcast composition time and dry-run usage rates are confidential under NDA. Live demo + measured impact shared on request.",
      },
    ],
    tags: ["Workflow", "Broadcasting", "Admin tools", "miniOrange"],
    featured: true,
    order: 10,
    readingTime: "~ 3 min read",
    research: [
      {
        method: "Workflow shadowing",
        sample: "IT admins composing real broadcasts during a security advisory",
        finding:
          "The dry-run was almost never used because it was on a separate page. Moving it inline as a 'preview recipients' affordance alongside the composer turned dry-run into the default behaviour.",
      },
    ],
    uxLaws: [
      {
        law: "Goal-Gradient Effect",
        principle:
          "People accelerate as they approach a goal.",
        applied:
          "Composer shows live recipient counts as the segment expression is built. The admin sees 'this will reach 1,247 people · 3 in this region · 2 deactivated accounts excluded' update on every change.",
      },
      {
        law: "Tesler's Law",
        principle:
          "Every system has an irreducible amount of complexity.",
        applied:
          "Segment-expression complexity (boolean logic, attribute filters, time windows) lives in the system. The admin works with plain-language chips that compose into the underlying DSL — readable by humans, executable by the platform.",
      },
    ],
    designDecisions: [
      {
        decision: "Inline dry-run, not a separate confirmation page",
        rationale:
          "If dry-run is on a separate page, it gets skipped. If it's inline next to the composer, it becomes the default behaviour. The admin sees 'will reach 1,247 people' before they click Send — every time, no exception.",
        tradeoff:
          "Composer becomes denser. Mitigated with collapsible detail; the headline number stays inline at all times.",
        kind: "functional",
      },
    ],
    screens: [
      {
        caption: "01 / Live prototype — message broadcasting workflow",
        note: "Figma Make prototype. Compose → segment → channel → schedule → dry-run → audit. The whole workflow on one continuous surface.",
        figmaUrl:
          "https://www.figma.com/make/dC0euiLv3eVmx6deY4sJNV/Message-Broadcasting-Workflow",
        placeholder: "flow",
        span: 2,
      },
    ],
  },
  {
    slug: "patient-portal",
    title: "Patient Portal",
    subtitle: "Healthcare patient-side experience — appointments · records · messaging",
    category: "Web App",
    confidential: false,
    access: "public",
    year: "2024",
    role: "Product Designer · personal / AI-augmented build",
    team: "Solo design + AI-augmented build",
    summary:
      "Designed a patient-side healthcare portal — appointments, records, secure messaging, and prescription refills. Built for the patient-as-end-user moment, not the clinician moment: calm, predictable, single-task surfaces; large hit targets; one job per screen.",
    problem:
      "Most patient portals are clinician dashboards with a patient-friendly skin. They surface every record, every test, every appointment in one cluttered view — fine for a clinician, hostile for a patient who's anxious, on a phone, and looking for one thing.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end product design — IA, flows, hi-fi UI, accessibility tuning. Built using AI-augmented prototyping (Figma Make) so the patient's-eye view could be tested against real anxiety-loaded scenarios early.",
      },
      {
        heading: "Why this is in the portfolio",
        body: "Healthcare is the domain where 'design as care' is most legible. The decisions here — single task per screen, large hit targets, calm typography, no urgency cues unless real — translate directly to other high-stakes consumer surfaces (banking, insurance, government).",
      },
    ],
    tags: ["Healthcare", "Consumer", "Accessibility", "AI-augmented"],
    featured: true,
    order: 11,
    readingTime: "~ 4 min read",
    research: [
      {
        method: "Patient-experience teardown",
        sample: "Three existing patient portals · review of public usability studies",
        finding:
          "Every clinician-portal-with-patient-skin pattern produced the same complaint: 'I can't find my next appointment.' Single-task, deadline-shaped landing surfaces consistently outperformed information-dense ones.",
      },
      {
        method: "Anxiety-scenario walkthroughs",
        sample: "Common patient flows — refill request, message a doctor, find a test result",
        finding:
          "Patients open the app already anxious. UI density compounds the anxiety. Reducing the home surface to three tiles ('Your next appointment · Your latest result · Your messages') tested as 'I felt I knew what to do.'",
      },
    ],
    uxLaws: [
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number of choices.",
        applied:
          "Home surface is three tiles, not a dashboard. The patient lands on the next decision (read your result, attend your appointment, reply to a message), not on a navigation problem.",
      },
      {
        law: "Aesthetic-Usability Effect",
        principle:
          "Aesthetically pleasing interfaces are perceived as more usable.",
        applied:
          "Calm typography, generous whitespace, restrained colour. A patient portal that looks like a calm app, not a clinician console, lowers the anxiety baseline before the patient does anything.",
      },
      {
        law: "Fitts's Law",
        principle:
          "Time to acquire a target depends on its size and distance.",
        applied:
          "All primary actions sit at thumb-reach on mobile and meet 48 × 48 hit targets. Older patients on small screens are the worst-case user; designing for them is designing for everyone.",
      },
    ],
    designDecisions: [
      {
        decision: "Three-tile home, not a dashboard",
        rationale:
          "A dashboard makes the patient solve a navigation puzzle before they can do anything. Three tiles match the three things 80% of patients open the app for.",
        tradeoff:
          "Power users (patients with many open tasks) reach for a 'see all' affordance. Acceptable; the 80/20 split is in the right place.",
        kind: "functional",
      },
      {
        decision: "Typography first, photography never",
        rationale:
          "Healthcare imagery (smiling doctors, pill bottles, stock-photo families) consistently undersells the moment. Typography sets a calm tone; the patient's own data is the only 'imagery' the screen needs.",
        tradeoff:
          "The portal looks 'less branded' than a marketing site. Acceptable; this is the moment the brand earns trust through restraint.",
        kind: "visual",
      },
    ],
    screens: [
      {
        caption: "01 / Live prototype — patient portal",
        note: "Figma Make prototype. Single-task home → record detail → secure message → refill request. Calm by design; legible at thumb-reach.",
        figmaUrl:
          "https://www.figma.com/make/TAIkPygmltI9wgSlzWg5oa/Patient-Portal",
        placeholder: "mobile",
        span: 2,
      },
    ],
  },
  /* ──────────────────────────────────────────────────────────
     PERSONAL / AI-AUGMENTED SHOWCASES — public, with real
     screens shipped to /public/projects/. These are the
     interview-grade flagship pieces.
     ──────────────────────────────────────────────────────── */
  {
    slug: "banking-analytics",
    title: "Internal Banking Analytics",
    subtitle:
      "A SaaS metrics workspace for finance teams — designed with an AI-augmented workflow",
    category: "Enterprise SaaS",
    confidential: false,
    access: "public",
    year: "2025",
    role: "Product Designer · personal / AI-augmented build",
    team: "Solo design + Claude Design + Claude Code handoff",
    summary:
      "Designed and prototyped an internal banking analytics tool — Metrics, Cohort Analysis, Marketplace Comparison, and Region-wise splits — using an AI-augmented workflow that took it from blank canvas to a clickable, design-system-aware HTML/CSS/JS prototype ready for engineering handoff.",
    problem:
      "Most internal banking analytics tools either bury metrics behind generic BI chrome (slow to read) or surface every chart at once (impossible to act on). The brief: a finance team should be able to land on a metric, scope it via a single filter form, and read the chart, table, and KPI deltas without learning a new mental model.",
    publicSections: [
      {
        heading: "Role",
        body: "Solo product designer + AI-augmented build. Drove the IA, the form-to-report flow shape, the chart-and-table dual view, and the live tweaks panel that lets stakeholders A/B the brand hue, density, and number formatting in-prototype. Claude Design generated initial HTML/CSS/JS scaffolding; I directed the structural decisions and the visual system; Claude Code carried the production handoff bundle.",
      },
      {
        heading: "What it looks like",
        body: "Five primary pages: Metrics Analysis, Cohort Analysis, Marketplace Comparison, Component Comparison, Region-wise Data. A consistent three-phase flow — Configure → Process → Report — runs through every page so the user only learns one shape. Six chart tabs (MRR, ARR, Logo Retention, NDR, ARPU, Customer Count), four live KPIs, and a paired data table for the rows behind each chart.",
      },
    ],
    tags: ["Banking", "Analytics", "SaaS", "AI-augmented", "Claude Design"],
    featured: true,
    order: 3,
    readingTime: "~ 5 min read",
    research: [
      {
        method: "Pattern audit across analytics tools",
        sample: "Six BI / analytics products · two days",
        finding:
          "Three patterns dominated. Pattern A: dashboard-heavy (everything visible, nothing actionable). Pattern B: explorer-heavy (click-driven, easy to get lost). Pattern C: configure-then-report (form first, then a focused report) — the rarest pattern, but the one finance teams stuck with longest in case studies.",
      },
      {
        method: "Finance-team mental-model mapping",
        sample: "Stakeholder conversations + screenshots from existing reporting workflows",
        finding:
          "Finance users live inside a small set of named metrics (MRR, ARR, NDR, ARPU) and view them through a small set of cuts (time, region, marketplace, cohort). The report shape never changes; the cut does. That re-framed the design from 'flexible BI' to 'one report, many cuts.'",
      },
      {
        method: "AI-driven structural exploration",
        sample: "Claude Design — five flow variants in an afternoon",
        finding:
          "The variant that survived was the calmest: filter form → processing pause → report. The processing screen was nearly killed in review; we kept it because it earns the user's trust before showing numbers. AI is fast at variants; I am the one who has to prune them.",
      },
    ],
    uxLaws: [
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Metric tabs are limited to six (MRR, ARR, Logo Retention, NDR, ARPU, Customer Count). Granularity is one switch (monthly vs quarterly). The decision space the finance user faces fits on one breath — and the one they care about today is one click away.",
      },
      {
        law: "Tesler's Law (Conservation of Complexity)",
        principle:
          "Every system has an irreducible amount of complexity.",
        applied:
          "All the messy plumbing — currency conversion, time-window normalisation, tenant scoping — is absorbed by the configure-then-report shape. The user picks a window and a marketplace; the system handles the rest. Complexity stays in the platform, not in the surface.",
      },
      {
        law: "Doherty Threshold",
        principle:
          "Productivity soars when system response stays under 400ms.",
        applied:
          "Tab switches between charts feel instant because the underlying data is computed up-front and cached at filter time. The 'Processing' screen is a one-time honest pause; everything after that is sub-200ms.",
      },
      {
        law: "Aesthetic-Usability Effect",
        principle:
          "People perceive aesthetically pleasing interfaces as more usable.",
        applied:
          "The KPI strip uses tabular numerals, generous whitespace, and a single accent for delta direction. It tests as 'instantly readable' — even though the underlying calculation is the same as the legacy tool. Same data, more trust.",
      },
    ],
    designDecisions: [
      {
        decision: "Configure → Process → Report, not 'instant dashboard'",
        rationale:
          "Instant dashboards force the user to filter after looking, which is backwards — finance users always have a question before they look. The configure-first shape matches the mental model and makes the report feel earned. The honest 'processing' pause builds trust in the numbers.",
        tradeoff:
          "Adds two steps before the user sees data. Mitigated by saved configurations as a future affordance and by making the form fast (single screen, no wizard).",
        kind: "functional",
      },
      {
        decision: "One report shape; many cuts",
        rationale:
          "Every page (Metrics, Cohort, Comparison, Region) shares the same three-phase flow and the same chart-plus-table-plus-KPI report shape. The user learns it once. The cut (region, cohort, marketplace) changes; the structure doesn't.",
        tradeoff:
          "Some pages would benefit from a custom shape (e.g. cohort analysis is naturally a heatmap, not a line chart). Resolved by making the chart slot pluggable while keeping the surrounding form + KPI shape constant.",
        kind: "functional",
      },
      {
        decision: "Live tweaks panel as a stakeholder review tool",
        rationale:
          "Stakeholders argue about brand hue, density, and number formatting in review meetings. Putting those as live tweaks (primary hue · density · mono-numbers · KPI visibility) lets the conversation happen with the artifact instead of in a Loom. Shipped a panel that looked unprofessional but earned its keep on day one.",
        tradeoff:
          "The tweaks panel ships in the prototype only — production strips it. Tradeoff between 'showing the calibration story' and 'a clean shipped artifact.' Worth keeping in for the case study.",
        kind: "system",
      },
    ],
    visualDecisions: [
      {
        decision: "OKLCH-driven primary hue, single accent",
        rationale:
          "OKLCH lets the primary colour shift across the whole system (chart series, KPI deltas, links, focus states) without breaking contrast. One slider in the tweaks panel re-tunes everything. Cleaner than maintaining a parallel hex palette per brand.",
        tradeoff:
          "OKLCH browser support is recent; there's a fallback in the bundle for older runtimes. Acceptable cost; the upside in design speed and dark-mode prep is significant.",
        kind: "visual",
      },
      {
        decision: "Tabular numerals everywhere a number lives",
        rationale:
          "Finance interfaces live or die by column alignment. Forcing tabular-nums on KPIs, table cells, axis labels, and tooltips means a 1.2M reads next to a 23M cleanly. It's a font-feature-settings line, but it's the difference between 'spreadsheet-grade' and 'looks made up.'",
        tradeoff:
          "Tabular widths cost a tiny bit of horizontal space. Worth every pixel.",
        kind: "visual",
      },
      {
        decision: "Six chart tabs, one chart slot — never split-screen",
        rationale:
          "Split-screen comparison views are tempting but always under-read. One chart on screen at a time, with tabs for the metric and a secondary table for the data, focuses attention. The Comparison page is the deliberate exception (two scoped views side by side) and only that page.",
        tradeoff:
          "Users wanting a quick visual A/B between MRR and ARR have to flip tabs. Acceptable; tab flip is fast and the shape stays calm.",
        kind: "visual",
      },
    ],
    screens: [
      {
        caption: "01 / Metrics Analysis — report view",
        note: "Six chart tabs, KPI strip, paired data table. The shape every page in the tool inherits.",
        image: { src: "/projects/banking-tool/ma-1.png", alt: "Metrics Analysis report view with MRR chart and KPI strip" },
        span: 2,
      },
      {
        caption: "02 / Metrics — chart tab switching",
        note: "Tab between MRR · ARR · Logo Retention · NDR · ARPU · Customer Count. Same shape, new data; no re-orient.",
        image: { src: "/projects/banking-tool/ma-3.png", alt: "Metrics chart tab switching across six metric series" },
      },
      {
        caption: "03 / Metrics — paired data table",
        note: "Tabular numerals, sticky headers, granularity switch. Spreadsheet-grade because finance teams will read it that way.",
        image: { src: "/projects/banking-tool/ma-5.png", alt: "Metrics data table with tabular numerals and granularity switch" },
      },
      {
        caption: "04 / Cohort Analysis — report",
        note: "Same configure-then-report shape; the chart slot becomes a cohort heatmap, the table becomes a retention triangle.",
        image: { src: "/projects/banking-tool/ca-1.png", alt: "Cohort Analysis with retention heatmap" },
        span: 2,
      },
      {
        caption: "05 / Region-wise — split view",
        note: "The cut here is geography. Region table doubles as a filter; clicking a region scopes the chart and KPI strip.",
        image: { src: "/projects/banking-tool/region-1.png", alt: "Region-wise data with table-as-filter" },
      },
      {
        caption: "06 / Marketplace Comparison",
        note: "The deliberate exception to the one-chart rule — two scoped reports side by side, with shared KPI deltas underneath.",
        image: { src: "/projects/banking-tool/comparison-1.png", alt: "Marketplace comparison with two scoped reports side by side" },
      },
    ],
  },
  {
    slug: "product-os",
    title: "Product OS",
    subtitle:
      "A unified product-intelligence and execution system — graph as spine, studios as lenses, AI as copilot",
    category: "Enterprise SaaS",
    confidential: false,
    access: "public",
    year: "2025 — present",
    role: "Founding Designer + AI-augmented engineer",
    team: "Solo build · Claude Code as engineering partner",
    summary:
      "Designed and built Product OS — an AI-native product-management platform where every entity (features, components, pages, workflows, decisions) lives in a typed Product Graph that Claude can navigate, query, and act on. 25 studios across 5 Modes, role-based dashboards for 8 team roles, and a Copilot rail embedded in every surface.",
    problem:
      "Modern product teams are fractured. Designers live in Figma; engineers live in GitHub; PMs live in Jira; knowledge lives in Notion. None of these share a model of what the product is. AI tools produce generic output because they have no product context. The thesis: a typed Product Graph that every role reads from and an AI Copilot that operates on it can re-unify the team without forcing them into one tool.",
    publicSections: [
      {
        heading: "Role",
        body: "Founding designer + AI-augmented engineer. Drove the information architecture (5 Modes · 25 studios · 5 persistent rails), the design system (tokens · variants · density), the Copilot rail patterns, and the role-based default views for 8 personas. Built end-to-end with Claude Code as engineering partner — Next.js 15 + React 19 + tRPC + Drizzle + Postgres + Anthropic + Yjs + Turborepo.",
      },
      {
        heading: "Why this is in the portfolio",
        body: "Most portfolio pieces are one screen of someone else's product. This one is a 25-studio platform I designed and built end-to-end using an AI-native workflow. It's the strongest single proof I can offer that I can ship across the entire stack — IA, design system, frontend, schema, AI integration — when the workflow is right.",
      },
    ],
    tags: ["Product OS", "AI-native", "Information architecture", "Design system", "Solo build"],
    featured: true,
    order: 1,
    readingTime: "~ 5 min read",
    research: [
      {
        method: "Competitive teardown — the fragmentation problem",
        sample: "Linear · Notion · Figma · Jira · ProductBoard · Coda",
        finding:
          "Every tool wins one role and loses the rest. Linear is loved by engineers but invisible to design. Figma is loved by designers but invisible to PMs. ProductBoard is the closest to 'a layer above the tools' but has no AI surface and no execution layer. The gap is a graph + an AI that operates on it — not a thirteenth tool.",
      },
      {
        method: "Persona work — 8 roles, real day shapes",
        sample: "PM · Designer · FE · BE · QA · BA · Eng Manager · Solo Builder",
        finding:
          "Building a 'role switcher' wasn't enough. Each role wanted a different default landing surface, a different rail order, and a different Copilot prompt set. The architecture had to be a single graph with role-specific lenses, not a single homepage with role-specific cards.",
      },
      {
        method: "AI integration design",
        sample: "Anthropic Claude API + skill registry + computer-mode log",
        finding:
          "AI works in this product if it's first-class — a Copilot rail in every surface, skill invocation as a tracked action, and an immutable log of computer-mode actions for audit. Bolt-on AI fails because it has no model of what the user is doing. First-class AI works because it operates on the same graph the user does.",
      },
    ],
    uxLaws: [
      {
        law: "Tesler's Law (Conservation of Complexity)",
        principle:
          "Every system has an irreducible amount of complexity.",
        applied:
          "The graph absorbs the complexity. A user picks a Mode (Plan / Build / Ship / Operate / Intelligence), the graph scopes their world to the relevant studios, and the Copilot rail offers context-aware actions. The user never sees 25 studios at once — the system handles relevance.",
      },
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Topbar is three switches: Org / Role / Mode. That's it. Everything else flows from those three. A new user can land in a sensible default (Solo Builder · Plan Mode) and never face a 36-studio sidebar.",
      },
      {
        law: "Jakob's Law",
        principle:
          "Users spend most of their time on other sites and bring those expectations with them.",
        applied:
          "⌘K command palette, bottom rails for cross-cutting context, right rail for Copilot — these are conventions every senior product user already knows from Linear, Cursor, and adjacent tools. Novelty is reserved for the graph itself; everything around it is deliberately familiar.",
      },
      {
        law: "Goal-Gradient Effect",
        principle:
          "People accelerate as they approach a goal.",
        applied:
          "Every studio shows a 'readiness score' — features 60% complete, design system at 80% coverage, testing at 45%. The number is reductive, but it produces the goal-gradient pull that gets work shipped. PMs know what to push on; designers know what to finish.",
      },
    ],
    designDecisions: [
      {
        decision: "Graph as spine, studios as lenses (not the other way round)",
        rationale:
          "Most product tools are 'studios first' — you open the design tool, then sync to PM. That preserves fragmentation. Putting the graph at the centre and treating studios as lenses on the same graph means every studio reads and writes the same truth. There's no sync; there's only access.",
        tradeoff:
          "Forces a strict typed schema for product entities. Some early users wanted 'unstructured' notes; we resolved this with a Memory rail that holds free-form notes alongside the typed graph instead of inside it.",
        kind: "system",
      },
      {
        decision: "Five Modes (Plan / Build / Ship / Operate / Intelligence)",
        rationale:
          "Mode names match phases of work, not tool categories. A PM plans; a designer builds; QA ships; ops operates; everyone touches Intelligence. This collapses the 'eight workspaces' design into something that can be explained in one sentence and learned in one session.",
        tradeoff:
          "Some studios — Workspace, Memory, Living Graph — are genuinely cross-cutting. Resolved with persistent rails that exist outside the Mode switcher.",
        kind: "system",
      },
      {
        decision: "Solo Builder as the default role",
        rationale:
          "The 'team of one' building a startup product is the demographic that needs Product OS most — they're already wearing all the hats. Designing the default for them means a great solo path that scales up to teams; designing the default for a Fortune-500 PM team means a bad path for solo, with no scale-down.",
        tradeoff:
          "Enterprise role configuration requires more upfront setup. We accepted that — solo is the default, enterprise is the configured experience.",
        kind: "system",
      },
      {
        decision: "Copilot as a rail, not a chatbot floating button",
        rationale:
          "Floating-button chatbots are universally ignored. A persistent right rail with the Copilot in context — same surface as the Inspector, available on every page — makes AI feel like a teammate, not a feature. The conversational thread persists across navigation.",
        tradeoff:
          "Costs ~360px of right-side screen real estate when open. The user can collapse it to a thin strip; it never disappears entirely so the option is always one click away.",
        kind: "functional",
      },
    ],
    visualDecisions: [
      {
        decision: "Editorial restraint — one accent, generous whitespace",
        rationale:
          "Most product tools paint themselves dense to look 'powerful.' Product OS deliberately reads as calm: one accent colour, ample white space, restrained typography. It tests as 'professional' against the Linear / Notion baseline; users describe it as the tool they want to spend their day in.",
        tradeoff:
          "Less density means more scrolling on dense studios (Components, Code). Resolved by per-studio density tokens; dense studios go to compact mode by default while planning studios stay comfortable.",
        kind: "visual",
      },
      {
        decision: "Living Graph as a split-pane overlay, not a separate page",
        rationale:
          "If the graph is the spine, navigating to the graph as a separate page contradicts the architecture. Making it a split-pane overlay on every studio means you can always see how the current object connects to the rest of the product — graph as context, not destination.",
        tradeoff:
          "Adds visual complexity when the overlay is open. Mitigated with quick-collapse and per-studio overlay defaults (denser graph for design surfaces, simpler graph for PM surfaces).",
        kind: "visual",
      },
    ],
  },
  {
    slug: "uem-platform",
    title: "UEM Platform",
    subtitle: "Unified Endpoint Management console",
    category: "Enterprise SaaS",
    confidential: true,
    access: "locked",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    team: "Cross-functional",
    summary:
      "End-to-end product design for the Unified Endpoint Management console at miniOrange — onboarding, policy assignment, fleet visibility, and compliance reporting for IT teams managing large device estates.",
    problem:
      "Fleet views are typically a flat list of thousands of rows with no way to act on segments. IT admins end up exporting CSVs to Excel to do their actual jobs — slow, error-prone, and untraceable.",
    publicSections: [
      {
        heading: "Role",
        body: "Owned the fleet experience — segments, saved queries, bulk actions, policy preview. Drove discovery through stakeholder interviews and competitive research; translated insights into product flows and high-fidelity designs aligned with engineering constraints.",
      },
      {
        heading: "Outcomes",
        body: "Adoption and bulk-action lift figures are confidential under NDA. Full breakdown shared on request.",
      },
    ],
    figmaUrl:
      "https://www.figma.com/design/dPkLgGRbkZiO5s8LTGNkRX/UEM-Dashboard-design?node-id=0-1",
    tags: ["Endpoint Management", "Bulk actions", "miniOrange"],
    featured: true,
    order: 7,
    readingTime: "~ 3 min read",
    research: [
      {
        method: "Stakeholder interviews with IT admins",
        sample: "IT admins managing large device estates",
        finding:
          "Admins were exporting CSVs to act on segments because the console treated the fleet as a flat list. The opportunity was to turn segments into a first-class, reusable object — not a one-off filter.",
      },
      {
        method: "Workflow shadowing",
        sample: "Two paired sessions during a policy rollout",
        finding:
          "The actual job is 'apply this policy to this segment, on this schedule, and confirm it landed.' Designing for that whole job — not for the steps in isolation — collapsed several screens into one.",
      },
    ],
    uxLaws: [
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Replaced filter + scroll + scan with saved segments. The admin chooses a named segment, not a thousand individual devices. Decision space collapses from device-level to segment-level.",
      },
      {
        law: "Fitts's Law",
        principle:
          "Time to acquire a target depends on its size and distance.",
        applied:
          "Bulk-action affordances live next to the segment header — the cursor is already there from segment selection. No travel to a top toolbar.",
      },
    ],
    designDecisions: [
      {
        decision: "Saved query becomes a first-class concept, not a UI feature",
        rationale:
          "A 'filter you saved' is just a hidden link. A 'segment' is something you can name, share, schedule policies against, and audit. Promoting the concept upgraded the surface around it — a segment becomes the unit of work.",
        tradeoff:
          "Required additional taxonomy in the data model (segments, owners, policies-per-segment). Engineering scoped it as part of the same release; the cost was real but the concept-shift was worth it.",
        kind: "functional",
      },
      {
        decision: "Policy preview lands inline, not as a separate confirmation modal",
        rationale:
          "Modal-based confirmations train users to dismiss them. Inline preview ('this will affect 412 devices, 23 of which fail compliance check X') is harder to dismiss reflexively and earns the admin's actual attention.",
        tradeoff:
          "Inline preview takes more vertical real estate. Mitigated with collapsible detail; the headline stays inline at all times.",
        kind: "functional",
      },
    ],
    screens: [
      {
        caption: "01 / Full design canvas — UEM / MDM Dashboard",
        note: "Fleet view · saved segments · policy preview · compliance reporting. Designed so the IT admin can act on segments — not export CSVs.",
        image: { src: "/projects/uem/01-overview.png", alt: "UEM / MDM Dashboard full design canvas with fleet view, saved segments, policy preview, compliance reporting" },
        figmaUrl: "https://www.figma.com/design/dPkLgGRbkZiO5s8LTGNkRX/UEM-Dashboard-design?node-id=0-1",
        span: 2,
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     2 + 3. EXTERNAL — from the real Notion archive.
     All `access: "external"` until Surajit deepens any of them
     into a full case study. Years pending confirmation.
     ──────────────────────────────────────────────────────── */
  /* App designs */
  {
    slug: "rate-my-horse",
    title: "Rate My Horse",
    subtitle: "Social platform for the equestrian community",
    category: "Mobile App",
    confidential: false,
    access: "external",
    year: "2023 — 2024",
    role: "UX/UI Designer · Impero IT",
    figmaUrl:
      "https://www.figma.com/file/iyfgIA4XOyozdcnB8nWLdz/Impero-Projects-(Copy)?type=design&node-id=988%3A9696&mode=design&t=7On6RguS1wsataKZ-1",
    tags: ["Mobile", "Social", "Impero IT"],
    order: 10,
  },
  {
    slug: "hexia",
    title: "Hexia",
    subtitle: "Mobile app — flagged for case-study deep-dive",
    category: "Mobile App",
    confidential: false,
    access: "external",
    year: "2023 — 2024",
    role: "UX/UI Designer",
    figmaUrl:
      "https://www.figma.com/file/ldW5okYX3ROc2usrQMwuhq/Hexia-(Copy)?type=design&node-id=0%3A1&mode=design&t=ReD5raop6cnd7IgM-1",
    tags: ["Mobile App"],
    order: 11,
  },
  {
    slug: "lg-safety",
    title: "LG Safety",
    subtitle: "Workplace compliance and reporting",
    category: "Mobile App",
    confidential: false,
    access: "external",
    year: "2022 — 2023",
    role: "UX/UI Designer",
    figmaUrl:
      "https://www.figma.com/file/nSZCDqF6lxZw8KUKgAcEv2/Bespoke-Diamonds%2FLG-safety?type=design&node-id=0%3A1&mode=design&t=WflKcxwRaRiwZH1R-1",
    tags: ["Mobile App", "Compliance"],
    order: 12,
  },
  {
    slug: "akhie",
    title: "Akhie",
    subtitle: "Mobile-first engagement app",
    category: "Mobile App",
    confidential: false,
    access: "external",
    year: "2023 — 2024",
    role: "UX/UI Designer",
    figmaUrl:
      "https://www.figma.com/file/k7Lee3ISYpji37jR1iVq2G/Akhie?type=design&node-id=3%3A3&mode=design&t=MlSzKBoZDvZIZ5x9-1",
    tags: ["Mobile App"],
    order: 13,
  },
  {
    slug: "tht",
    title: "THT",
    subtitle: "Mobile application",
    category: "Mobile App",
    confidential: false,
    access: "external",
    year: "2023 — 2024",
    role: "UX/UI Designer",
    figmaUrl:
      "https://www.figma.com/file/4yKyhZ77cPWSHGU6lUzFoo/THT-(Copy)?type=design&node-id=0%3A1&mode=design&t=r0ijLcWZMimsyEu2-1",
    tags: ["Mobile App"],
    order: 14,
  },
  {
    slug: "eat-incredible",
    title: "Eat Incredible",
    subtitle: "Food-delivery mobile app — discovery to checkout",
    category: "Mobile App",
    confidential: false,
    access: "public",
    year: "2023 — 2024",
    role: "UX/UI Designer · Impero IT",
    team: "PM + Frontend + Backend (small team)",
    figmaUrl:
      "https://www.figma.com/file/n3IicmEMTdGSzYAtceSFcJ/Eat-Incredible-App?type=design&node-id=2%3A16&mode=design&t=VMhUx4cuSMk74ICL-1",
    summary:
      "Designed the consumer-side experience for Eat Incredible — a food-delivery app covering discovery, restaurant detail, cart, checkout, and post-order tracking. Built for the everyday hungry-at-9pm context, with the lightweight, photo-led pacing that consumer food apps live or die by.",
    problem:
      "Food-delivery apps fail in two predictable places: discovery overload (too many restaurants, too little signal about which one is right tonight) and checkout drop-off (a cart that feels heavier than the meal itself). Eat Incredible needed to feel decisive at both ends — fast to commit, fast to finish.",
    publicSections: [
      {
        heading: "Role",
        body: "End-to-end product design across discovery, IA, flows, and high-fidelity UI for the consumer app. Worked with the PM on scope and prioritisation, the engineering team on feasibility and motion, and design QA through ship.",
      },
    ],
    tags: ["Mobile", "Food delivery", "Consumer", "Impero IT"],
    featured: false,
    order: 15,
    readingTime: "~ 5 min read",
    research: [
      {
        method: "Competitive teardown",
        sample: "Five food-delivery apps in adjacent markets",
        finding:
          "The apps with measurably better completion shared one trait — fewer decisions per screen. Wherever a screen offered three choices instead of seven, the next-step rate climbed.",
      },
      {
        method: "Stakeholder + user-flow interviews",
        sample: "PM + 4 prospective users · early discovery",
        finding:
          "The 'what should I eat tonight' moment was not a search — it was a craving. Users described scrolling restaurants the way they scroll Instagram: photo-led, low-cognitive-load, decision-by-recognition. The discovery surface had to behave the same way.",
      },
      {
        method: "Cart abandonment hypothesis testing",
        sample: "Four prototype cart variants reviewed with PM",
        finding:
          "Cart abandonment wasn't price — it was friction count. Each additional input (address confirmation, tip, delivery option, promo) compounded. The variant that survived collapsed all of those into a single 'review and pay' surface with sensible defaults.",
      },
    ],
    uxLaws: [
      {
        law: "Hick's Law",
        principle:
          "Decision time grows with the number and complexity of choices.",
        applied:
          "Discovery surfaces three curated rails per session — 'fastest to you,' 'tonight's craving,' and one rotational rail (popular / new / nearby) — instead of an infinite-scroll directory. The user always sees five-to-seven restaurants per rail, not fifty.",
      },
      {
        law: "Aesthetic-Usability Effect",
        principle:
          "People perceive aesthetically pleasing interfaces as more usable.",
        applied:
          "Dish photography and restaurant cover imagery do most of the discovery work. Designed the photo grid with consistent aspect ratios, a quiet typography layer, and minimal chrome so the food itself drives the decision — exactly how the user is already operating in the moment.",
      },
      {
        law: "Goal-Gradient Effect",
        principle:
          "People accelerate as they approach a goal.",
        applied:
          "Checkout shows visible progress (cart → address → pay) as a three-step strip with the active step expanded and the rest condensed. The user feels closer to ordering with every tap, which keeps them moving instead of bouncing back to discovery.",
      },
      {
        law: "Peak-End Rule",
        principle:
          "People judge an experience by its emotional peak and how it ends.",
        applied:
          "The 'order placed' moment is a single full-screen confirmation with the dish image, the ETA in plain language, and a calm thank-you — not a dense receipt. That's the peak. The post-order tracking screen sustains it with restaurant + rider state in editorial type, not a status table.",
      },
    ],
    designDecisions: [
      {
        decision:
          "Three curated discovery rails, not an endless directory",
        rationale:
          "Endless-scroll directories punish indecisive users — and at 9pm, every user is indecisive. Curated rails act as the cognitive scaffolding the user is already building in their head. Decision time falls; recognition does the heavy lifting.",
        tradeoff:
          "Power users who already know what they want now have to swipe past a curated rail to reach search. Mitigated with a persistent search affordance pinned to the top of discovery.",
        kind: "functional",
      },
      {
        decision: "Single-screen checkout with sensible defaults",
        rationale:
          "Multi-step checkout flows compound abandonment. Collapsing address, tip, delivery option, and payment into one scrollable review surface — with smart defaults populated from the user's history — turns checkout into a one-tap confirmation in the common case.",
        tradeoff:
          "First-time users see a denser screen. Onboarding flows now collect address and payment up front so the first checkout matches the second; the screen density reads as 'all together' not 'all to fill in.'",
        kind: "functional",
      },
      {
        decision: "Order-placed confirmation is editorial, not a receipt",
        rationale:
          "The peak emotional moment of using a food app is hitting 'order.' A receipt-style confirmation undersells it. A full-screen, photo-led, calm 'your food is on the way' page is the moment the brand earns affection and the moment the user remembers when deciding whether to come back.",
        tradeoff:
          "Adds a screen to a flow that could end at the cart confirmation. Worth it — the peak-end shape of the session is the lever every consumer app pulls hardest.",
        kind: "functional",
      },
    ],
    visualDecisions: [
      {
        decision: "Photo-led grid with one consistent aspect ratio",
        rationale:
          "The fastest readable signal in food discovery is the dish photo. Locking aspect ratios across all rails means the eye scans without re-calibrating; the rail flows like a single image strip rather than a mosaic. Recognition-driven decisions get faster.",
        tradeoff:
          "Restaurants with non-standard photography get cropped. Operations side ships a photo guideline for partners; the consumer-side fallback is a brand-coloured tile with the restaurant's wordmark.",
        kind: "visual",
      },
      {
        decision:
          "Calm chrome, loud food — typography and UI stay quiet",
        rationale:
          "Food apps that compete with their own content lose. Set the chrome (nav, buttons, prices) in restrained typography and a single accent so the dish photography stays the loudest thing on screen. The brand expresses itself through pacing and motion, not through decoration.",
        tradeoff:
          "Less obvious 'brand presence' on a per-screen basis. Mitigated by a strong brand moment at the order-placed peak and at the empty / loading states where photography is absent.",
        kind: "visual",
      },
      {
        decision: "Cart uses dish thumbnails, not list rows",
        rationale:
          "A user reviewing their cart isn't reading line items — they're checking they ordered the right things. Thumbnails answer 'is this what I'm getting' faster than text rows do. The total stays prominent so the financial fact remains unambiguous.",
        tradeoff:
          "Thumbnails take more vertical space than rows. Acceptable for typical cart sizes (1–4 items); long carts switch to a hybrid view at 5+ items.",
        kind: "visual",
      },
    ],
  },

  /* Web App */
  {
    slug: "campus-links",
    title: "Campus Links",
    subtitle: "Student networking and campus resources",
    category: "Web App",
    confidential: false,
    access: "external",
    year: "2022 — 2023",
    role: "UX/UI Designer",
    figmaUrl:
      "https://www.figma.com/file/VSxWSHnpFHFBilZnr9KXjL/Campus-Links?type=design&node-id=3%3A16&mode=design&t=M1v26XGyHdVQaBNy-1",
    tags: ["Web App", "EdTech"],
    order: 20,
  },
  {
    slug: "communify-mvp",
    title: "Communify MVP",
    subtitle: "Community management platform — MVP",
    category: "Web App",
    confidential: false,
    access: "external",
    year: "2023 — 2024",
    role: "UX/UI Designer · Impero IT",
    figmaUrl:
      "https://www.figma.com/file/j2Okx8DpnXScwh6ku0JpJ7/Communify.MVP?type=design&node-id=0%3A1&mode=design&t=wQdyZUKt2dJ11mLO-1",
    tags: ["Web App", "Social", "Impero IT"],
    order: 21,
  },
  {
    slug: "culture-club",
    title: "Culture Club",
    subtitle: "Cultural event management and engagement",
    category: "Web App",
    confidential: false,
    access: "external",
    year: "2023 — 2024",
    role: "UX/UI Designer · Impero IT",
    figmaUrl:
      "https://www.figma.com/file/Kyd7wbhYUK6geXjYIjaHIl/Culture-Club?type=design&node-id=3%3A5117&mode=design&t=URoHCo51rqfKXXWi-1",
    tags: ["Web App", "Events", "Impero IT"],
    order: 22,
  },
  {
    slug: "bespoke-diamonds",
    title: "Bespoke Diamonds",
    subtitle: "Luxury e-commerce for custom diamond jewellery",
    category: "Web App",
    confidential: false,
    access: "external",
    year: "2022 — 2023",
    role: "UX/UI Designer · Fortmindz",
    figmaUrl:
      "https://www.figma.com/file/nSZCDqF6lxZw8KUKgAcEv2/Bespoke-Diamonds%2FLG-safety?type=design&node-id=1%3A2&mode=design&t=WflKcxwRaRiwZH1R-1",
    tags: ["Web App", "E-commerce", "Fortmindz"],
    order: 23,
  },
  {
    slug: "aquinas",
    title: "Aquinas",
    subtitle: "Educational web app with student portal",
    category: "Web App",
    confidential: false,
    access: "external",
    year: "2022 — 2023",
    role: "UX/UI Designer",
    figmaUrl:
      "https://www.figma.com/file/QhdaofmYbVhgltwG3fuiiB/Aquinas?type=design&node-id=0%3A1&mode=design&t=J08laBnVDPU1hP5N-1",
    tags: ["Web App", "EdTech"],
    order: 24,
  },

  /* Websites — bulk archive (mostly Fortmindz-era e-commerce + lander work) */
  ...websiteEntries(),
];

function websiteEntries(): Project[] {
  /* Real titles + Figma URLs from Notion. Years tentative. */
  const sites: Array<Pick<Project, "slug" | "title" | "subtitle" | "figmaUrl">> = [
    {
      slug: "all-in-one",
      title: "All in One",
      subtitle: "Multi-purpose website design",
      figmaUrl: "https://www.figma.com/file/bHyOjIIlGCaOlJxnQ9iH5k/website-Design-(Copy)?type=design&node-id=0%3A1&mode=design&t=wfMyF459etJX3DaN-1",
    },
    {
      slug: "haller-ai",
      title: "Haller.Ai",
      subtitle: "AI technology company website",
      figmaUrl: "https://www.figma.com/file/eUl0PEJZ9Wk0DQixWlB7u6/Haller.Ai?type=design&node-id=0%3A1&mode=design&t=ijcj0k5EnDFXzYcc-1",
    },
    {
      slug: "infinity-africa-capital",
      title: "Infinity Africa Capital",
      subtitle: "Investment firm corporate website",
      figmaUrl: "https://www.figma.com/file/nu2xYDIFIYADLBisF8DfSY/Infinity-Africa-Capital-(Copy)?type=design&node-id=0%3A1&mode=design&t=HQLXGZRs89f57OiC-1",
    },
    {
      slug: "sophisticated-yachting",
      title: "Sophisticated Yachting",
      subtitle: "Luxury yachting experience website",
      figmaUrl: "https://www.figma.com/file/skvmDDAd2DTvBusc3wiH9P/Sophisticated-Yachting?type=design&node-id=0%3A1&mode=design&t=X9Y82bOp6L1VER1w-1",
    },
    {
      slug: "mopheth",
      title: "Mopheth",
      subtitle: "Healthcare services with appointment booking",
      figmaUrl: "https://www.figma.com/file/tyvwQw31dlVrJQdeDVu6Zw/Mopheth-(Copy)?type=design&node-id=0%3A1&mode=design&t=nUuhVBeSq3L07yaW-1",
    },
    {
      slug: "obelisque",
      title: "OBELISQUE",
      subtitle: "Brand site",
      figmaUrl: "https://www.figma.com/file/mqfYqtXS70PFArnyoqd9Ge/OBELISQUE?type=design&node-id=0%3A1&mode=design&t=fR5dheaSRDRfPXBE-1",
    },
    {
      slug: "nts-solar",
      title: "NTS Solar",
      subtitle: "Solar energy company website",
      figmaUrl: "https://www.figma.com/file/zf9lO651sxQp8fyaqyRXL1/NTS-Solar?type=design&node-id=0%3A1&mode=design&t=NUtBIn7rtLQeOfes-1",
    },
    {
      slug: "roha-studio",
      title: "Roha Studio",
      subtitle: "Studio brand and portfolio site",
      figmaUrl: "https://www.figma.com/file/B9RZiAbEaj23WuVymEAd3d/Roha-studio-(Copy)?type=design&node-id=0%3A1&mode=design&t=vr63NctsBT2uwwRI-1",
    },
    {
      slug: "hired-bees",
      title: "HIRED BEES",
      subtitle: "Hiring / recruitment platform site",
      figmaUrl: "https://www.figma.com/file/vFzEDPWW7H1iKfx533TjDF/HIRED-BEES?type=design&node-id=0%3A1&mode=design&t=3IPi5SMYqmIi0GuU-1",
    },
    {
      slug: "the-genuine-article",
      title: "The Genuine Article",
      subtitle: "Editorial / brand site",
      figmaUrl: "https://www.figma.com/file/N0kmV19ZVfd15q1kAePDNi/The-Genuine-Article?type=design&node-id=0%3A1&mode=design&t=8XH6GPlNwoBEuXSS-1",
    },
    {
      slug: "vistaza",
      title: "Vistaza",
      subtitle: "Brand site",
      figmaUrl: "https://www.figma.com/file/UVBmzXvg0QC3f9lrCltmJ9/vistaza-(Copy)?type=design&node-id=1%3A5&mode=design&t=aU2B6mw1ifLHBQLR-1",
    },
    {
      slug: "vistaza-ui-design",
      title: "Vistaza UI Design",
      subtitle: "Vistaza UI / product surface",
      figmaUrl: "https://www.figma.com/file/g3PTcAxSLrxu8NFaFB2IoL/Vistaza-UI-Design-(Copy)?type=design&node-id=0%3A1&mode=design&t=6nbMnsYBCpgg5fb8-1",
    },
    {
      slug: "higher-balance-institute",
      title: "Higher Balance Institute",
      subtitle: "Wellness / coaching institute website",
      figmaUrl: "https://www.figma.com/file/Fm5c3Ge5WOUvfAYuCyill0/Higher-Balance-Institute?type=design&node-id=0%3A1&mode=design&t=rZ8mm698MXknnUJI-1",
    },
    {
      slug: "nkc-digital",
      title: "NKC Digital",
      subtitle: "Digital agency website",
      figmaUrl: "https://www.figma.com/file/OPKzpKH07jnaOLJRKkTlSx/NKC-Digital?type=design&node-id=0%3A1&mode=design&t=lIP2mqC9mmhk0REu-1",
    },
    {
      slug: "dynamicform-divi",
      title: "DynamicForm — Divi",
      subtitle: "Form builder · Divi component",
      figmaUrl: "https://www.figma.com/file/1SEWIXiadNQrc7T5TdnfYT/dynamicform-divi?type=design&node-id=0%3A1&mode=design&t=j8qqL2yTXhMn3yWV-1",
    },
    {
      slug: "the-collabstore",
      title: "The Collabstore",
      subtitle: "Collaboration / e-commerce site",
      figmaUrl: "https://www.figma.com/file/BstZp1p40Fzu2pGUttjZNw/The-Collabstore-(Copy)?type=design&node-id=0%3A1&mode=design&t=Qd0yTacdYzJU58rq-1",
    },
    {
      slug: "5star-mortgage",
      title: "5 Star Mortgage",
      subtitle: "Mortgage broker website",
      figmaUrl: "https://www.figma.com/file/jYl87KsPJrgB3UWTzkQBg4/5star-mortgage?type=design&node-id=0%3A1&mode=design&t=dDAU0AKA45rAObcC-1",
    },
    {
      slug: "nu-3ra-studios",
      title: "Nu 3ra Studios",
      subtitle: "Studio brand site",
      figmaUrl: "https://www.figma.com/file/SUlFaNW0IJ82cOK329JPYG/Nu-3ra-Studios-(Copy)?type=design&node-id=2%3A17&mode=design&t=niNPqST4y16aw7nI-1",
    },
    {
      slug: "choice-companies",
      title: "Choice Companies",
      subtitle: "B2B services site",
      figmaUrl: "https://www.figma.com/file/PjdfG9gGVXlCMZlRjyptRW/Choice-companies-(Copy)?type=design&node-id=2%3A3&mode=design&t=rqfNb8s9lJzPv8Mt-1",
    },
    {
      slug: "kyetech",
      title: "Kyetech",
      subtitle: "Tech services site",
      figmaUrl: "https://www.figma.com/file/3QGmlcE8laewNE6VRh92eQ/kyetech-02-(Copy)?type=design&node-id=1%3A9&mode=design&t=KWugnOVcT5nHealN-1",
    },
    {
      slug: "great-solutions-entertainment",
      title: "Great Solutions Entertainment",
      subtitle: "Entertainment company website",
      figmaUrl: "https://www.figma.com/file/D4xbYD3YcNoTzpPIH5alSp/Great-Solutions-Entertainment-(Copy)?type=design&node-id=12%3A4&mode=design&t=LlilLFFR7jTywJ9L-1",
    },
    {
      slug: "wonder-go-lander",
      title: "Wonder Go Lander",
      subtitle: "Landing page",
      figmaUrl: "https://www.figma.com/file/XDMElBRFZCdMT8bt52q0tK/Wonder-Go-Lander-(Copy)?type=design&node-id=0%3A1&mode=design&t=lcnvGWGFJ3dKZjdA-1",
    },
    {
      slug: "edicat",
      title: "Edicat",
      subtitle: "EdTech site / whiteboard exploration",
      figmaUrl: "https://www.figma.com/file/YBKMFbNiepDZFUIIc2dBSs/Edicat-(Copy)?type=whiteboard&node-id=0%3A1&t=ZdymO9o8gtbLydn2-1",
    },
    {
      slug: "titandef",
      title: "TitanDef",
      subtitle: "Cybersecurity product UI",
      figmaUrl: "https://www.figma.com/file/SA5VkLoeuEGS5PmuqH4e6S/TitanDef-UI-(Copy)?type=design&node-id=72%3A393&mode=design&t=Pxr5QSJFIkcumCF1-1",
    },
    {
      slug: "clear-social",
      title: "Clear Social",
      subtitle: "Social media product site",
      figmaUrl: "https://www.figma.com/file/CVfZscgD5Ygumz3svrQrvu/Clear-Social-(Copy)?type=design&node-id=0%3A1&mode=design&t=u7cFYrYvfPoM5eeJ-1",
    },
    {
      slug: "curl-organics",
      title: "Curl Organics",
      subtitle: "Organic haircare e-commerce",
      figmaUrl: "https://www.figma.com/file/NBvtD8tzZzJXRfcvyQICX8/Curl-Organics-(Copy)?type=design&node-id=0%3A1&mode=design&t=yjRpefjav2X5oB2Q-1",
    },
    {
      slug: "buddha-brothers",
      title: "Buddha Brothers",
      subtitle: "Brand site",
      figmaUrl: "https://www.figma.com/file/8sKDJkxPsqGhowz2Aqy2Ke/Buddha-Brothers-(Copy)?type=design&node-id=0%3A1&mode=design&t=ZMOZxR0qgk1HfuBe-1",
    },
    {
      slug: "invest-5s",
      title: "Invest 5S",
      subtitle: "Investment services site",
      figmaUrl: "https://www.figma.com/file/ahKIjp8RNj2nyykdHVxHZd/Invest-5S-(Copy)?type=design&node-id=0%3A1&mode=design&t=4XxTCdQ1vgrI1sEX-1",
    },
    {
      slug: "doggydlites",
      title: "Doggydlites",
      subtitle: "Pet product e-commerce",
      figmaUrl: "https://www.figma.com/file/GOFjZTAAo0UJR4dePUwhSS/doggydlites-com-186-(Copy)?type=design&node-id=0%3A1&mode=design&t=W3oIp7fJt33XEsIf-1",
    },
    {
      slug: "jumbo",
      title: "Jumbo",
      subtitle: "E-commerce site",
      figmaUrl: "https://www.figma.com/file/vgdqpsNpCvq3aPazsAzc7d/Jumbo-02-(Copy)?type=design&node-id=0%3A1&mode=design&t=r4X7kKFx9Sf3V9fp-1",
    },
    {
      slug: "scayul-sitemap",
      title: "Scayul",
      subtitle: "Information architecture / sitemap",
      figmaUrl: "https://www.figma.com/file/aZwL2sX0ja38LMVvOuCWUM/Scayul-Site-map?type=whiteboard&node-id=0%3A1&t=68RZisvPSuEauU9P-1",
    },
    {
      slug: "graphics-and-resources",
      title: "Graphics & Resources",
      subtitle: "Misc graphic assets and explorations",
      figmaUrl: "https://www.figma.com/file/xwKCPcwkHixSdKSKhRTNsa/Graphics-and-other-resources?type=design&node-id=0%3A1&mode=design&t=E3m3INByXpLmz9oe-1",
    },
  ];
  return sites.map((s, i) => ({
    slug: s.slug,
    title: s.title,
    subtitle: s.subtitle,
    category: "Website",
    confidential: false,
    access: "external",
    year: "2022 — 2024",
    role: "UX/UI Designer",
    figmaUrl: s.figmaUrl,
    tags: ["Website"],
    order: 100 + i,
  }));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  /* Only entries that have a chapter — exclude external-only archive */
  return projects.filter((p) => p.access !== "external").map((p) => p.slug);
}

export function getFeaturedProjects(): Project[] {
  return [...projects.filter((p) => p.featured)].sort((a, b) => a.order - b.order);
}

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

/* ──────────────────────────────────────────────────────────
   Track assignment.
   The three case studies are the strongest end-to-end stories
   in the portfolio. Everything else moves to /work or /gallery.
   ──────────────────────────────────────────────────────── */
const CASE_SLUGS = new Set<string>([
  "ad-tools",          // 5-day AI prototype — the AI workflow flagship
  "iga-platform",      // Public IGA work — represents real enterprise IAM
  "banking-analytics", // AI-augmented banking dashboard — breadth
]);

/* Per-project hover colors for the /work page (bishal.cc pattern).
   When a user hovers a tile, --hover-tint flips to this color and the
   entire page background animates to it. */
const WORK_HOVERS: Record<string, { color: string; ink: string; glyph?: string }> = {
  "ad-tools":          { color: "#1e3a8a", ink: "#f0eee8", glyph: "AD" },   // navy
  "iga-platform":      { color: "#0c4a3e", ink: "#f0eee8", glyph: "IGA" },  // deep emerald
  "iam-platform":      { color: "#581c87", ink: "#f0eee8", glyph: "IAM" },  // royal purple
  "pam-platform":      { color: "#7c2d12", ink: "#f0eee8", glyph: "PAM" },  // burnt sienna
  "uem-platform":      { color: "#075985", ink: "#f0eee8", glyph: "UEM" },  // teal-blue
  "mods-design-system":{ color: "#3f2c1f", ink: "#f0eee8", glyph: "DS" },   // umber
  "product-os":        { color: "#0c0a09", ink: "#f0eee8", glyph: "OS" },   // near-black
  "banking-analytics": { color: "#14532d", ink: "#f0eee8", glyph: "BNK" },  // forest
  "dpdp-compliance":   { color: "#7e22ce", ink: "#f0eee8", glyph: "DPDP" }, // violet
  "signup-customizer": { color: "#9a3412", ink: "#f0eee8", glyph: "SU" },   // burnt orange
  "patient-portal":    { color: "#1e6091", ink: "#f0eee8", glyph: "PP" },   // medical blue
};

/* ──────────────────────────────────────────────────────────
   Cover-image map. Drop files into /public/projects/covers/<slug>.webp
   (preferred) or .jpg. Add an entry here to wire it up. Order of the
   `gallery` array drives the per-project Carousel on the work detail
   page; cover is the index image used on /work, /gallery, /cases lists.

   When the user ships photos, the only change needed is to:
     1. drop the file into /public/projects/covers/<slug>.<ext>
     2. add the slug → src mapping below
   CoverImage handles the load-error fallback automatically, so
   forgotten entries simply render the abstract glyph treatment.
   ──────────────────────────────────────────────────────── */
type CoverEntry = {
  /** Main cover. Used as the tile image + first carousel slide. */
  cover: string;
  /** Optional additional gallery images for the carousel on the
      detail page. The cover is ALWAYS the first slide; these come
      after. Captions are optional. */
  gallery?: { src: string; alt: string; caption?: string }[];
};

export const COVERS: Record<string, CoverEntry> = {
  // Examples — left commented so the build doesn't 404 on missing files.
  // Uncomment + drop files to enable.
  //
  // "ad-tools": {
  //   cover: "/projects/covers/ad-tools.webp",
  //   gallery: [
  //     { src: "/projects/ad-tools/01-overview.png", alt: "AD console overview" },
  //     { src: "/projects/ad-tools/02-policies.png", alt: "Policy editor" },
  //   ],
  // },
  // "iga-platform": {
  //   cover: "/projects/covers/iga-platform.webp",
  // },
};

/* Augment each project in place with track + hover + cover metadata.
   Runs once at module load — keeps the 2000-line catalog manageable
   without inlining track/hover/cover on every entry. */
for (const p of projects) {
  if (CASE_SLUGS.has(p.slug)) {
    p.track = "case";
  } else {
    p.track = p.track ?? "work";
  }
  const hov = WORK_HOVERS[p.slug];
  if (hov) {
    p.hoverColor = hov.color;
    p.hoverInk = hov.ink;
    p.hoverIllustration = hov.glyph;
  }
  const cv = COVERS[p.slug];
  if (cv) {
    p.cover = { src: cv.cover, alt: `${p.title} — cover image` };
  }
}

/** Carousel slides for a given project — cover first, gallery after. */
export function getCarouselSlides(slug: string) {
  const cv = COVERS[slug];
  if (!cv) return [];
  const cover = { src: cv.cover, alt: `${slug} cover`, caption: undefined };
  const rest = cv.gallery ?? [];
  return [cover, ...rest];
}

/* ──────────────────────────────────────────────────────────
   Track-aware selectors
   ──────────────────────────────────────────────────────── */
export function getCaseProjects(): Project[] {
  return projects.filter((p) => p.track === "case").sort((a, b) => a.order - b.order);
}

export function getWorkProjects(): Project[] {
  return projects
    .filter((p) => p.track === "work" && p.access !== "external")
    .sort((a, b) => a.order - b.order);
}

export function getGalleryProjects(): Project[] {
  return projects.filter((p) => p.track === "gallery").sort((a, b) => a.order - b.order);
}

/** Helpful test: the 3 cases must always exist. */
export const CASE_STUDY_SLUGS = Array.from(CASE_SLUGS) as readonly string[];
