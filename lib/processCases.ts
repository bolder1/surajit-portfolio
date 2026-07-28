/**
 * Process case studies — the deep-dive layer behind /process.
 *
 * Sanitized, no screenshots, and deliberately PROCESS-first, not
 * product-first: every case is told as problem → constraint → decision
 * → outcome, where "decision" is the actual engagement loop (stakeholder
 * discussions → own research/PRD → a production-level prototype →
 * event/client showcase → Figma + developer hand-off → shipped product).
 *
 * The differentiator threaded through every case: the prototype is a
 * working system, not a picture of one — it has to survive the same
 * technical complexity (data joins, audit integrity, financial
 * correctness) the shipped product will face. That's the gap between
 * "looks right" and "is right," and it's what most design deliverables
 * never attempt.
 *
 * No client names beyond miniOrange (already public across this site).
 * No screenshots — every artifact below is diagram data, rendered by
 * components/v5/diagrams/*.
 */

export interface FunnelStage {
  label: string;
  note: string;
}

export interface JourneyStage {
  stage: string;
  /** -2 (worst) .. +2 (best) */
  emotion: -2 | -1 | 0 | 1 | 2;
  note: string;
}

export interface EmpathyMap {
  persona: string;
  says: string[];
  thinks: string[];
  does: string[];
  feels: string[];
}

export interface FlowStep {
  label: string;
}

export interface FlowBranch {
  question: string;
  yes: string;
  no: string;
}

export interface UserFlow {
  before: FlowStep[];
  branch: FlowBranch;
  after: string;
}

export interface ProcessStageNote {
  title: string;
  body: string;
}

export interface ProcessCaseStudy {
  slug: string;
  no: string;
  tag: string;
  name: string;
  oneLiner: string;
  domain: string;
  year: string;
  role: string;
  deliverables: string[];

  /** Cold open — the scene, before any framing. Set large, sets the stakes. */
  hook: string;
  /** The thesis, sharpened into one line. Runs as a full-width pull quote. */
  pullQuote: string;
  /** Timeline compression, in the site's established framing. */
  compression: { theirs: string; mine: string; note: string };

  differentiator: string;

  problem: { headline: string; body: string };
  constraint: { headline: string; body: string; points: string[] };
  decision: { headline: string; body: string; stages: ProcessStageNote[] };
  outcome: { headline: string; body: string; funnel: FunnelStage[]; metrics: { label: string; value: string }[] };

  journeyMap: { persona: string; stages: JourneyStage[] };
  empathyMap: EmpathyMap;
  userFlow: UserFlow;
}

export const processCases: ProcessCaseStudy[] = [
  {
    slug: "itdr",
    no: "C-01",
    tag: "SECURITY",
    name: "ITDR",
    oneLiner: "Identity threat detection & response — one timeline instead of three tabs.",
    domain: "Enterprise security · SOC",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    deliverables: ["STAKEHOLDER DISCUSSIONS", "OWN PRD", "PRODUCTION PROTOTYPE", "EVENT DEMO", "FIGMA + CODE HANDOFF"],

    hook: "An identity attack never announces itself in one place. It leaves one trace in IAM, one in EDR, one in SIEM — and an analyst with three tabs open, rebuilding a timeline that already happened.",
    pullQuote:
      "Anyone can draw the console. The question is whether the thing you drew can survive three systems disagreeing about what happened, and in what order.",
    compression: {
      theirs: "WEEKS — MONTHS",
      mine: "≈ 2 DAYS",
      note: "Prototype-to-demo, not design-to-ship.",
    },

    differentiator:
      "The prototype had to solve the real IAM / EDR / SIEM data-join problem, live, not just look like it did. That's the gap between a comp and a working system — and it's why engineering inherited a validated model instead of an open question.",

    problem: {
      headline: "Identity attacks don't show up in one tool",
      body: "Signals are scattered across IAM, EDR, and SIEM, so analysts either miss the chain or burn the day stitching it together by hand. Most ITDR consoles make this worse in one of two ways: dump every signal into a flat queue (alert fatigue) or hide the chain behind too many clicks (slow response). Whoever consolidates the timeline well wins the workflow.",
    },
    constraint: {
      headline: "The complexity was real, not decorative",
      body: "Three constraints made this a design-plus-engineering problem from day one, not a design problem handed to engineering after the fact.",
      points: [
        "Signals arrive from three disconnected systems with different schemas and latencies — a unified timeline has to tolerate partial data landing out of order.",
        "Response actions (revoke session, freeze account) carry real operational consequence and have latency profiles that don't fit a naive one-click affordance.",
        "No dedicated frontend engineer on the first pass — the prototype had to be functionally real enough to test the actual join problem, not just resemble a solution to it.",
      ],
    },
    decision: {
      headline: "The engagement loop, stage by stage",
      body: "Same loop every time — the difference each case makes is what stage 3 actually has to survive.",
      stages: [
        { title: "Stakeholder discussions", body: "Sat directly with security analysts and SOC leads, not a PM brief once removed. The hard problem wasn't detection — it was reconstruction." },
        { title: "Research → my own PRD", body: "Torn down four ITDR / SOC consoles, mapped the two failure patterns (volume-ranked fatigue vs. tab-switch causality loss), and wrote the PRD around chain-strength ranking and one persistent timeline." },
        { title: "Production-level prototype", body: "Built the triage queue and investigation timeline against representative multi-source data so the prototype had to solve the same ordering and join problem the shipped product would face — not a static comp of it." },
        { title: "Event showcase", body: "Demoed the working console live at security-audience events. Analysts clicked through a real investigation, not a walkthrough deck." },
        { title: "Figma + developer hand-off", body: "Once the interaction model held up under real signal timing, it became full Figma files — tokens, states, edge cases — shipped alongside the working reference implementation." },
        { title: "Team velocity", body: "Engineering started from a validated data model and interaction pattern, not an open interpretation problem — which is where most hand-offs actually lose their time." },
      ],
    },
    outcome: {
      headline: "From alert fatigue to a console analysts trust",
      body: "The live demo is what turned interest into conversations — a prospect watching an actual chain resolve in real time isn't evaluating a mockup, they're evaluating whether this holds up in their SOC.",
      funnel: [
        { label: "Live event demo", note: "A working console, clicked through in front of a security audience" },
        { label: "Qualified conversations", note: "Buyers evaluating a system, not a deck" },
        { label: "Engineering hand-off", note: "Spec + working reference, not spec alone" },
        { label: "Shipped analyst console", note: "Revenue from a product that already proved itself live" },
      ],
      metrics: [
        { label: "Investigation model", value: "One timeline, not three tabs" },
        { label: "Hand-off artifact", value: "Spec + working reference" },
        { label: "Result", value: "Event demo → client conversations opened" },
      ],
    },
    journeyMap: {
      persona: "Security analyst, mid-incident",
      stages: [
        { stage: "Alert fires", emotion: -1, note: "Another entry in an already-long queue." },
        { stage: "Starts reconstructing", emotion: -2, note: "Opens IAM, EDR, SIEM in separate tabs to rebuild what happened." },
        { stage: "Loses the thread", emotion: -2, note: "By the third tab-switch, causality is gone — guesses at the order of events." },
        { stage: "Opens the ITDR console", emotion: 0, note: "A chain-ranked queue puts five real cases in front of five hundred alerts." },
        { stage: "Reads one timeline", emotion: 1, note: "IAM, EDR, and SIEM events resolve into a single causal chain — no tab-switching." },
        { stage: "Takes the response action", emotion: 2, note: "A consequence preview appears before revoke or freeze — a confident, deliberate call." },
      ],
    },
    empathyMap: {
      persona: "Security analyst, mid-incident",
      says: ["“I don’t have time to rebuild the timeline by hand again.”", "“Which of these alerts is actually real?”"],
      thinks: ["“If I miss the chain, that’s the incident that gets through.”", "“I need the story, not just the events.”"],
      does: ["Switches between IAM, EDR, and SIEM tabs mid-investigation", "Triages by alert volume, not by actual risk"],
      feels: ["Overloaded by alert volume", "Anxious about missing a real chain in the noise"],
    },
    userFlow: {
      before: [
        { label: "Signal enters from IAM / EDR / SIEM" },
        { label: "Queue ranks by chain-strength, not volume" },
        { label: "Analyst opens the persistent investigation timeline" },
      ],
      branch: { question: "Response action needed?", yes: "Consequence preview shown", no: "Mark reviewed → case closed" },
      after: "Action executes → audit row captured automatically",
    },
  },

  {
    slug: "dpdp-compliance",
    no: "C-02",
    tag: "COMPLIANCE",
    name: "DPDP Compliance",
    oneLiner: "India's DPDP Act, productized — a deadline clock the privacy officer can actually trust.",
    domain: "RegTech · Privacy",
    year: "2024 — present",
    role: "Product Designer · miniOrange",
    deliverables: ["STAKEHOLDER DISCUSSIONS", "REGULATORY RESEARCH", "OWN PRD", "PRODUCTION PROTOTYPE", "EVENT DEMO", "FIGMA + CODE HANDOFF"],

    hook: "A regulator asks one question: show me. The privacy officer has the answer somewhere — across a consent tool, an export log, and a folder of screenshots assembled after the fact.",
    pullQuote:
      "A compliance tool that looks compliant is a liability. This one had to write the audit row while the buyer watched — because that is the only version a regulator accepts.",
    compression: {
      theirs: "WEEKS — MONTHS",
      mine: "≈ 2 DAYS",
      note: "Statutory logic validated before engineering started.",
    },

    differentiator:
      "The audit trail had to actually write a tamper-evident row on every action, live, in the room — not get described in a spec. Most design deliverables stop at “looks compliant”; this one behaved compliant, in front of the buyer.",

    problem: {
      headline: "The regulation doesn't give back the hour you lose to confusion",
      body: "DPDP imposes strict timelines on consent management, data-subject requests, and breach reporting. Most compliance tools dump every signal into one flat dashboard, so the privacy officer spends the first hour reconstructing what they're even looking at — time the Act doesn't grant.",
    },
    constraint: {
      headline: "Statutory, not stylistic, constraints",
      body: "This wasn't a dashboard-layout problem. Three constraints came directly from the regulation, not from taste.",
      points: [
        "Statutory clocks are non-negotiable — the current deadline had to be functionally impossible to miss, not just documented in a report.",
        "Every action needed a tamper-evident audit row; a bolted-on export log would not survive a regulator's actual question.",
        "Jurisdiction-specific carve-outs meant the same 'compliant' action could differ by data category — the interaction model had to absorb that variability without turning the privacy officer into a lawyer.",
      ],
    },
    decision: {
      headline: "The engagement loop, stage by stage",
      body: "The same six-stage loop as every case here — grounded, this time, in statute rather than a competitive teardown.",
      stages: [
        { title: "Stakeholder discussions", body: "Sat with compliance and privacy leads. The reframe was immediate: they don't think in features, they think in 'what's due next.'" },
        { title: "Regulatory research → my own PRD", body: "Read the DPDP Act's actual timelines directly, cross-referenced GDPR/CCPA for structurally similar patterns, and wrote the PRD around deadline-first dashboard selection instead of compliance-area silos." },
        { title: "Production-level prototype", body: "Built the dashboard-selection flow, consent ledger, DSR workflow, and audit trail as a real click-through product, so the audit-row-per-action behavior could be demonstrated actually happening — not described." },
        { title: "Event / client showcase", body: "Demoed the working compliance flow directly to prospective compliance buyers. Watching the audit trail update live was the credibility moment a static screen can't produce." },
        { title: "Figma + developer hand-off", body: "Once the flow held up in front of real privacy officers, it became full Figma files with the audit and timeline logic specified precisely enough for engineering to ship the real data model without re-deriving the compliance logic." },
        { title: "Team velocity", body: "Retention rules and jurisdiction carve-outs were already validated in the prototype — engineering's job was implementation, not reinterpretation." },
      ],
    },
    outcome: {
      headline: "A compliance story clients could actually click",
      body: "Compliance sales are usually a trust problem before they're a feature problem. Watching an audit row appear in real time, unprompted, answers the trust question faster than any slide can.",
      funnel: [
        { label: "Live demo", note: "A real audit trail, updating in front of the buyer" },
        { label: "Compliance-buyer conversations", note: "Trust established before the pitch ends" },
        { label: "Engineering hand-off", note: "Statutory logic pre-validated, not re-derived" },
        { label: "Shipped compliance product", note: "Revenue from a story that already proved itself" },
      ],
      metrics: [
        { label: "Audit model", value: "Every action, tamper-evident by construction" },
        { label: "Buyer moment", value: "Watched the deadline clock, not read about it" },
        { label: "Result", value: "Compliance story clients could actually click" },
      ],
    },
    journeyMap: {
      persona: "Privacy officer, deadline approaching",
      stages: [
        { stage: "DSR request lands", emotion: -1, note: "One more entry in a flat dashboard of mixed signal types." },
        { stage: "Hunts for the clock", emotion: -2, note: "Cross-references the request date against the Act's timeline by hand." },
        { stage: "Assembles the audit trail by hand", emotion: -2, note: "Screenshots and exports, hoping it's complete if the regulator asks." },
        { stage: "Opens the deadline-first dashboard", emotion: 0, note: "Sees what's due, not a wall of undated signals." },
        { stage: "Works the queue with a visible clock", emotion: 1, note: "Each item shows the actual regulatory deadline, not just a status." },
        { stage: "Regulator asks the question", emotion: 2, note: "The audit trail is already there, tamper-evident, per action." },
      ],
    },
    empathyMap: {
      persona: "Privacy officer, deadline approaching",
      says: ["“What's actually due this week?”", "“Can I prove this if I'm asked?”"],
      thinks: ["“Every dashboard I've used organizes by area, not by deadline.”", "“An audit trail I assembled after the fact isn't a real audit trail.”"],
      does: ["Cross-references request dates against the Act by hand", "Exports screenshots as after-the-fact evidence"],
      feels: ["Under constant statutory time pressure", "Uneasy about audit completeness"],
    },
    userFlow: {
      before: [
        { label: "Consent / DSR / breach event occurs" },
        { label: "System selects the dashboard by deadline proximity, not silo" },
        { label: "Privacy officer opens the queue: what's due, in order" },
      ],
      branch: { question: "Action taken on the item?", yes: "Action logged with context", no: "Deadline clock keeps counting, escalation surfaces" },
      after: "Tamper-evident audit row written automatically",
    },
  },

  {
    slug: "function-os",
    no: "C-03",
    tag: "AI · FINANCE",
    name: "Function OS",
    oneLiner: "An internal AI finance OS — the proof that the process holds up on real stakes, not just demos.",
    domain: "AI · Finance (internal)",
    year: "Internal build",
    role: "Product Designer · miniOrange",
    deliverables: ["INTERNAL STAKEHOLDER DISCUSSIONS", "OWN PRD", "CLAUDE-CODE-ORCHESTRATED BUILD", "INTERNAL ROLLOUT", "FIGMA + CODE REFERENCE"],

    hook: "Every prospective client asks the same question before they buy: does this actually work, or does it just demo well? The honest answer required building something our own finance team would have to trust with real numbers.",
    pullQuote:
      "A demo gets forgiven for cutting corners. A tool the finance team runs every month does not. That is the whole reason this one exists.",
    compression: {
      theirs: "WEEKS — MONTHS",
      mine: "≈ 2 DAYS",
      note: "Built by one designer, adopted the same week.",
    },

    differentiator:
      "Financially sensitive automation doesn't get a 'looks right' pass — it has to compute and route correctly from day one. Orchestrating that build myself, end to end, is the same skill that makes the client-facing prototypes credible: shipping production code, not a picture of it.",

    problem: {
      headline: "Every finance-ops request was a bespoke spreadsheet exercise",
      body: "The internal finance operations team ran on a scatter of spreadsheets and disconnected dashboards for reporting, workflows, and automations. There was no internal reference for the exact question every prospective client asks before buying in: can design plus AI-orchestrated engineering actually replace this, fast, without breaking anything.",
    },
    constraint: {
      headline: "Internal, but no lower stakes",
      body: "An internal tool is usually where corners get cut. Here they couldn't be, for three reasons.",
      points: [
        "This had to be a real tool people used daily, not a proof-of-concept that quietly gets abandoned — adoption was the test of whether the process holds up, not the demo.",
        "No dedicated engineering team was assigned up front — the same AI-orchestrated build process used for client-facing prototypes had to hold up for a financially sensitive internal tool, where numbers have to be right, not just look right.",
        "It needed to double as the internal reference case for 'this is what our process produces' when the same pitch is later made to prospective clients.",
      ],
    },
    decision: {
      headline: "The engagement loop, stage by stage",
      body: "Same loop, aimed inward — the audience was the finance ops team, not a prospect, and the bar was correctness, not persuasion.",
      stages: [
        { title: "Internal stakeholder discussions", body: "Sat with the finance ops team to find where the actual week got lost: report assembly, workflow chasing, manual automation checks." },
        { title: "My own PRD", body: "Scoped Function OS as one surface for dashboards, workflows, and automations, instead of three separate internal tools stitched together by hand." },
        { title: "Production-level prototype, orchestrated with Claude Code", body: "Built the actual working dashboards and automation flows, not mockups of them. For a financial tool, 'looks right' isn't good enough — it has to compute and route correctly from day one." },
        { title: "Internal rollout as the showcase", body: "Instead of an external event, the demo was the team adopting it for real operational work immediately." },
        { title: "Figma + reference hand-off", body: "The same discipline used on client work — Figma files plus generated code — applied here too. That discipline is what makes Function OS usable as a reference case, not just a nice internal tool." },
        { title: "Team velocity", body: "Because it shipped as a real, used tool rather than a pitch deck, it became the go-to internal reference when explaining the process to prospective clients." },
      ],
    },
    outcome: {
      headline: "The internal proof that the process works on real stakes",
      body: "A demo can be forgiven for cutting corners. A tool the finance team runs every day cannot. That's the point — Function OS is the evidence that the same fast process produces something correct enough to actually operate on.",
      funnel: [
        { label: "Internal need", note: "Scattered spreadsheets, no single source of truth" },
        { label: "Working OS, Claude-Code-orchestrated", note: "Real dashboards and automations, not mockups" },
        { label: "Daily internal adoption", note: "The team runs it, not just trials it" },
        { label: "Reference case for client pitches", note: "Proof the process survives real financial stakes" },
      ],
      metrics: [
        { label: "Adoption", value: "Internal tool the team runs day-to-day" },
        { label: "Accuracy bar", value: "Financially sensitive — correct, not just credible" },
        { label: "Second life", value: "Same build process, now the proof point in new-client conversations" },
      ],
    },
    journeyMap: {
      persona: "Finance ops lead, mid-month close",
      stages: [
        { stage: "Monthly report requested", emotion: -1, note: "Pulls numbers from four disconnected spreadsheets." },
        { stage: "Manually reconciles automations", emotion: -2, note: "Chases down which automation actually ran and which silently failed." },
        { stage: "Rebuilds the dashboard from scratch", emotion: -2, note: "The same report, rebuilt by hand, every cycle." },
        { stage: "Opens Function OS", emotion: 0, note: "Dashboards, workflows, and automations live in one surface." },
        { stage: "Automations run visibly", emotion: 1, note: "Sees what ran, what's pending, what needs a human." },
        { stage: "Ships the report same-day", emotion: 2, note: "What used to take most of a week now closes same-day." },
      ],
    },
    empathyMap: {
      persona: "Finance ops lead, mid-month close",
      says: ["“Why am I rebuilding this dashboard every month?”", "“Did that automation actually run?”"],
      thinks: ["“This should be one surface, not three tools stitched together.”", "“If it's financial, it has to be right, not just fast.”"],
      does: ["Manually stitches spreadsheets into a report each cycle", "Chases automation status by asking around"],
      feels: ["Frustrated by repeated manual assembly", "Cautious — financially sensitive work leaves no room for 'close enough'"],
    },
    userFlow: {
      before: [
        { label: "Finance data enters from source systems" },
        { label: "Function OS routes it through the relevant workflow" },
        { label: "Automation attempts the routine action" },
      ],
      branch: { question: "Automation confident?", yes: "Executes, dashboard updates live", no: "Routed to a human for review" },
      after: "Report available same-day, audit-ready",
    },
  },
];

export function getProcessCase(slug: string): ProcessCaseStudy | undefined {
  return processCases.find((c) => c.slug === slug);
}

export function getAllProcessCaseSlugs(): string[] {
  return processCases.map((c) => c.slug);
}
