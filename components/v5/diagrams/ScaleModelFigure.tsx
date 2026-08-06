import type { ScaleMetric } from "@/lib/processCases";

/**
 * ScaleModelFigure — instruments, not readings.
 *
 * The other cases close on a compression ruler because what they compressed
 * was a timeline. This one compressed a dependency, which cannot be drawn to
 * scale — and the adoption figures that would prove it are under NDA. Rather
 * than invent them, the figure publishes the measurement model: what to
 * count, which way is good, and what a bad reading means. The "bad" column
 * is the useful one; a metric whose failure mode you can't name isn't
 * instrumented, it's decoration.
 *
 * The empty gauge track is honest on purpose — there is deliberately no fill,
 * because a fill would imply a reading this case does not publish.
 */
export function ScaleModelFigure({
  metrics,
  curve,
}: {
  metrics: ScaleMetric[];
  curve: string;
}) {
  return (
    <figure className="v5-pcd v5-sm">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 05 — THE INSTRUMENT SET
        <span className="v5-sm-caveat">NO READINGS PUBLISHED</span>
      </figcaption>

      <div className="v5-sm-table" role="table" aria-label="Measurement model">
        <div className="v5-sm-head" role="row">
          <span role="columnheader">METRIC</span>
          <span role="columnheader">INSTRUMENT</span>
          <span role="columnheader">READS WELL WHEN</span>
          <span role="columnheader">A BAD READING MEANS</span>
        </div>

        {metrics.map((m, i) => (
          <div className="v5-sm-row" role="row" key={m.name}>
            <span className="v5-sm-name" role="cell">
              <i className="v5-sm-tick" aria-hidden />
              {m.name}
              <em className="v5-sm-i">{String(i + 1).padStart(2, "0")}</em>
            </span>
            <span className="v5-sm-inst" role="cell">
              {m.instrument}
            </span>
            <span className="v5-sm-good" role="cell">
              {m.good}
            </span>
            <span className="v5-sm-bad" role="cell">
              {m.bad}
            </span>
          </div>
        ))}
      </div>

      <p className="v5-sm-curve">
        <span className="v5-sm-curve-k">THE ONE THAT DECIDES IT</span>
        {curve}
      </p>
    </figure>
  );
}
