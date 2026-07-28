import type { UserFlow } from "@/lib/processCases";

/**
 * UserFlowDiagram — the product's own interaction model, as a small
 * flowchart: linear steps into a decision diamond (the site's existing
 * hollow-diverge glyph), branching Yes/No, converging on one outcome.
 */

export function UserFlowDiagram({ flow }: { flow: UserFlow }) {
  return (
    <div className="v5-pc-diagram v5-uflow">
      <p className="v5-pc-diagram-label">
        <span className="v5-pc-diagram-glyph" aria-hidden />
        USER FLOW — WHAT THE PRODUCT ACTUALLY DOES
      </p>

      <div className="v5-uflow-row">
        {flow.before.map((step, i) => (
          <div className="v5-uflow-step-wrap" key={step.label}>
            {i > 0 && <span className="v5-uflow-arrow" aria-hidden>→</span>}
            <span className="v5-uflow-step">{step.label}</span>
          </div>
        ))}
        <span className="v5-uflow-arrow" aria-hidden>→</span>
        <span className="v5-uflow-diamond">
          <i aria-hidden />
          <b>{flow.branch.question}</b>
        </span>
      </div>

      <div className="v5-uflow-branches">
        <div className="v5-uflow-branch">
          <span className="v5-uflow-branch-tag no">NO</span>
          <span className="v5-uflow-arrow" aria-hidden>→</span>
          <span className="v5-uflow-step">{flow.branch.no}</span>
        </div>
        <div className="v5-uflow-branch">
          <span className="v5-uflow-branch-tag yes">YES</span>
          <span className="v5-uflow-arrow" aria-hidden>→</span>
          <span className="v5-uflow-step">{flow.branch.yes}</span>
        </div>
      </div>

      <div className="v5-uflow-converge">
        <span className="v5-uflow-arrow down" aria-hidden>↓</span>
        <span className="v5-uflow-step is-final">{flow.after}</span>
      </div>
    </div>
  );
}
