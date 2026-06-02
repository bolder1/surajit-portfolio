# Portfolio Product — Concept & Execution Plan

A self-initiated product to anchor the portfolio: an interactive prototype plus a written
case study. Built for a **prosumer / designer-team** audience, scoped as a **medium
multi-feature web app**, and chosen to spotlight three things at once — **end-to-end
product thinking, UI craft, and complex-workflow IA**.

Constraints this plan respects:
- Buildable in Claude Code today as a Next.js (App Router) + Tailwind + TypeScript app.
- No real backend required — mock data + local persistence is enough for a prototype.
- Reuses the existing portfolio brand language (Sora display, Inter body, #2563eb accent).

---

## The problem space (what the research said)

Three pains kept surfacing across designer/team tooling discussion in 2026, and they are
worth designing against because they are *felt every week*, not hypothetical:

1. **Feedback fragmentation.** Feedback on a design arrives through Figma comments, Slack
   threads, email, usability sessions, and calls. Knowledge workers lose 1–2 hours a day
   to this context-switching, and "revision creep" — three revisions becoming seven —
   is traced directly to feedback scattered across channels.

2. **Lost design rationale.** Teams re-debate settled questions and reverse good
   decisions because nobody recorded *why*. When designers move teams or leave, the
   reasoning leaves with them; successors repeat costly mistakes.

3. **The documentation dilemma.** The obvious fix — "just document everything" — fails.
   Documenting every decision kills momentum; existing tools go unadopted because they
   demand extra effort and interrupt creative flow.

The product insight worth building on: **feedback and decisions are the same lifecycle,
but every tool splits them.** Feedback tools capture the input and forget the outcome.
Decision-record tools ask you to write documentation as a separate chore nobody does.
If resolving a piece of feedback *is* how a decision gets recorded, capture becomes free.

---

## Recommended concept — "Throughline"

> Working name. Alternatives: Crux, Tracer, Verdict, Margin. Pick one you like.

**One-liner:** The shared memory of a design team — where scattered feedback becomes
triaged, resolved, and permanently traceable to the decision it produced.

**Who it's for:** product designers and small design teams (2–8 people) who own
multiple surfaces and drown in feedback channels.

**The loop that makes it a product, not a feature:**

```
Capture feedback  →  Triage in one inbox  →  Resolve a thread
      ↑                                            ↓
      └──────  Decision log (the "why")  ←─  Resolving writes the record
```

Because the decision record is a *byproduct of resolving feedback*, the documentation
dilemma dissolves — there is no separate documentation step to skip.

### Why this is a strong portfolio piece

- **Instantly legible.** Any designer interviewer nods within ten seconds — they live
  this pain. No setup explanation needed.
- **Has a real insight.** "Feedback and decisions are one lifecycle" is a genuine
  product-thinking claim you can defend in an interview. That is the thing portfolios
  usually lack.
- **Extends your existing story.** It is adjacent to your MODS design-system work —
  design-system teams are the people most desperate for decision records ("why is the
  radius 6px?"). It makes the portfolio feel like one coherent practice.
- **Dense enough for UI craft.** Triage inboxes, status systems, filtering, timelines,
  and detail panes give you real surfaces to show pixel-level execution and motion.
- **Distinctive.** Feedback tools and research repos are crowded; a focused
  feedback-to-decision loop is not something interviewers have seen a hundred times.

### Feature set — four connected surfaces (medium scope)

1. **Triage Inbox.** Every feedback item in one list. Each item carries a *source tag*
   (Figma comment / Slack / email / usability test / stakeholder call), a *status*
   (new → triaged → in discussion → resolved → won't do), a *priority*, and the
   *project/screen* it belongs to. Bulk actions, keyboard-first triage, smart grouping.

2. **Item Detail + Resolve flow.** Open a thread: see the original feedback, who raised
   it, discussion notes, and attached design references. The **Resolve** action is the
   heart of the product — a short, low-friction form: *what we decided*, *what we
   considered and rejected*, *who decided*. Completing it moves the item to the log.

3. **Decision Log.** The institutional memory. A searchable, filterable timeline of every
   resolved decision with its rationale. Filter by project, person, date, or tag. This is
   the screen a new hire reads on day one to understand *why the product is the way it is*.

4. **Project / Screen view + Digest.** Feedback and decisions pinned to a specific
   surface. A "what changed and why" digest view, good for standups and onboarding — the
   payoff that makes the capture worth it.

A fifth, optional surface if you want more depth: a lightweight **dashboard** (open
threads, aging items, decisions this week) — good for an extra hero shot.

### What this lets you show in the case study

- **Product thinking:** the lifecycle insight, the documentation-dilemma framing, scope
  cuts you made and why, success metrics you'd track (time-to-resolve, % decisions with
  recorded rationale, onboarding ramp).
- **Workflow & IA:** how five entity types (feedback, thread, decision, project, screen)
  relate; how triage state flows; how one inbox serves capture *and* retrieval.
- **UI craft:** the status system, the keyboard triage interactions, the Resolve form
  designed to take 20 seconds, empty states, motion on state transitions.

---

## Two alternative concepts (if Throughline doesn't grab you)

### Concept B — "Critique" — a structured design-review facilitator

Most design critiques are unstructured and forgettable: people talk, nothing is captured,
action items evaporate. Critique runs the *meeting itself*. Set an agenda of screens,
a per-screen timer, structured feedback capture (keep / change / question) tied to each
screen, and an auto-generated action-item list at the end. Surfaces: session setup,
live critique mode, per-screen feedback capture, post-session summary.
**Pros:** novel, fun to design, strong "live mode" hero moment. **Cons:** narrower use
case, the real-time element is slightly more code.

### Concept C — "Handoff" — a design-to-dev readiness tracker

Design erosion — products drifting from design intent through hundreds of small
implementation compromises — starts at a sloppy handoff. Handoff is a pre-handoff
checklist + readiness score per screen: states covered (empty/loading/error), tokens
vs. hardcoded values, responsive specs, accessibility notes, edge cases. Surfaces:
project overview with readiness scores, per-screen checklist, a spec/annotation view,
a shareable dev-facing summary.
**Pros:** ties directly to your design-systems strength; genuinely underserved.
**Cons:** the value is less emotionally vivid than feedback pain.

All three fit the same tech stack and scope, so the execution plan below applies to
whichever you choose.

---

## Tech approach

- **Framework:** Next.js (App Router) + TypeScript — same stack as the portfolio rebuild.
- **Styling:** Tailwind, with an explicit design-token layer (`tokens.ts` or CSS
  variables) so the token system itself becomes a case-study artifact.
- **Data:** mock data in typed TS/JSON seed files. Persist user changes to
  `localStorage` so the prototype feels real across reloads. No server, no auth, no DB —
  this is a prototype, and that is the correct scope.
- **Motion:** Framer Motion for state-transition and layout animation (the UI-craft
  moments). Keep it restrained — it should feel enterprise-credible, not flashy.
- **Nice-to-have:** a Command-K palette for triage actions — cheap to build, reads as
  craft.
- **Deploy:** Vercel. Live URL links straight from the portfolio case study.

Keep it a standalone app in its own folder (e.g. `Projects/Throughline`), separate from
the portfolio codebase. The portfolio links out to the live demo and hosts the writeup.

---

## Claude Code execution plan

Sequenced so each step ends with something runnable. Treat each numbered block as one
working session.

**Step 0 — Foundation.** Scaffold Next.js + TS + Tailwind. Define the design-token layer
(color, type scale, spacing, radius, shadow, motion durations) up front. Build the
primitive components first: Button, Badge/Tag, Input, Select, Card, Modal/Sheet,
Toast. This *is* your design-system showcase — do it deliberately, document each
component's variants and states.

**Step 1 — Data model + seed.** Define TypeScript types for FeedbackItem, Thread,
Decision, Project, Screen, Person. Write a rich seed file — 3–4 realistic projects,
~30 feedback items across all statuses and sources, ~12 resolved decisions. Good fake
data is what makes a prototype feel like a product; invest here.

**Step 2 — Triage Inbox.** The list view: rows with source tag, status, priority,
project. Filtering, sorting, grouping. Keyboard navigation and bulk actions. Empty state.

**Step 3 — Item Detail + Resolve flow.** The detail pane/route: feedback, discussion,
references. Build the Resolve form and the state transition into the Decision Log. This
is the product's core moment — spend craft budget here.

**Step 4 — Decision Log.** The timeline view of resolved decisions with rationale.
Search and filters (project / person / date / tag). Decision detail.

**Step 5 — Project/Screen view + Digest.** Surface-scoped feedback and decisions; the
"what changed and why" digest. Optional dashboard if you want a fifth hero shot.

**Step 6 — Polish pass.** Empty/loading/error states everywhere, responsive behavior,
dark mode (reuse portfolio toggle), Command-K palette, motion review, accessibility
pass (focus order, contrast, keyboard reachability).

**Step 7 — Case study.** Write the narrative on the portfolio: problem framing and
research, the lifecycle insight, IA and flow diagrams, key screens with annotations,
scope decisions and trade-offs, what you'd measure, what you'd do next. Capture clean
screen recordings of the triage and resolve flows.

A realistic pace is one to two steps per focused day — roughly a week of evenings to a
polished, demoable state, which matches the "medium multi-feature" scope you picked.

---

## Suggested first message to Claude Code

> "Scaffold a Next.js App Router + TypeScript + Tailwind app called Throughline. Set up a
> design-token layer (CSS variables for color, type scale, spacing, radius, shadow,
> motion) using Sora for display and Inter for body, with #2563eb as the accent on a
> near-white background, plus a dark theme. Then build the primitive component library:
> Button, Tag, Input, Select, Card, Sheet, Modal, Toast — each with documented variants
> and states. Don't build app screens yet."

Then proceed step by step through the plan above.
