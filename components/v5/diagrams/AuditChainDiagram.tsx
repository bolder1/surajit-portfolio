/**
 * AuditChainDiagram — the DPDP Compliance hero artifact.
 *
 * Every action writes a linked, tamper-evident row. Each block carries
 * the previous block's seal, so a missing or altered link is visible
 * rather than deniable — the property a regulator's question actually
 * tests. Above it runs the statutory clock: the deadline the Act sets
 * and the tool has to make impossible to miss.
 *
 * Vermilion is spent once, on the live deadline segment — the thing the
 * privacy officer is actually racing.
 */

const BLOCKS = [
  { x: 40, label: "CONSENT", meta: "GRANTED" },
  { x: 218, label: "ACCESS", meta: "DSR OPENED" },
  { x: 396, label: "EXPORT", meta: "DATA MAPPED" },
  { x: 574, label: "ERASURE", meta: "EXECUTED" },
  { x: 752, label: "CLOSE", meta: "SEALED" },
];

const BLOCK_W = 146;
const BLOCK_H = 76;
const BLOCK_Y = 118;
const CLOCK_Y = 52;

export function AuditChainDiagram() {
  return (
    <figure className="v5-pcd">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 01 — THE STATUTORY CLOCK, OVER A SEALED CHAIN
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox="0 0 940 260"
          className="v5-pcd-svg"
          role="img"
          aria-label="A statutory deadline bar runs above a chain of linked, tamper-evident audit blocks: consent, access, export, erasure, close."
        >
          {/* statutory clock */}
          <text x={0} y={CLOCK_Y - 18} className="v5-pcd-note-quiet">
            STATUTORY WINDOW
          </text>
          <line x1={40} y1={CLOCK_Y} x2={898} y2={CLOCK_Y} className="v5-pcd-rail-quiet" />
          {[40, 254, 468, 682, 898].map((x) => (
            <line
              key={x}
              x1={x}
              y1={CLOCK_Y - 6}
              x2={x}
              y2={CLOCK_Y + 6}
              className="v5-pcd-tick-quiet"
            />
          ))}
          {/* elapsed — the one hot element */}
          <line x1={40} y1={CLOCK_Y} x2={640} y2={CLOCK_Y} className="v5-pcd-rail-hot" />
          <circle cx={640} cy={CLOCK_Y} r={6} className="v5-pcd-terminal" />
          <text x={648} y={CLOCK_Y - 12} className="v5-pcd-note-hot">
            NOW
          </text>
          <text x={898} y={CLOCK_Y - 12} className="v5-pcd-note-end">
            DUE
          </text>

          {/* chain */}
          {BLOCKS.map((b, i) => (
            <g key={b.label}>
              {i > 0 && (
                <>
                  <line
                    x1={b.x - 32}
                    y1={BLOCK_Y + BLOCK_H / 2}
                    x2={b.x}
                    y2={BLOCK_Y + BLOCK_H / 2}
                    className="v5-pcd-rail-quiet"
                  />
                  {/* the seal carried forward from the previous block */}
                  <rect
                    x={b.x - 24}
                    y={BLOCK_Y + BLOCK_H / 2 - 8}
                    width={16}
                    height={16}
                    className="v5-pcd-seal"
                    transform={`rotate(45 ${b.x - 16} ${BLOCK_Y + BLOCK_H / 2})`}
                  />
                </>
              )}
              <rect
                x={b.x}
                y={BLOCK_Y}
                width={BLOCK_W}
                height={BLOCK_H}
                className="v5-pcd-block"
              />
              {/* registration ticks — the printer's mark, carried into the diagram */}
              <rect x={b.x + 7} y={BLOCK_Y + 7} width={5} height={5} className="v5-pcd-regmark" />
              <rect
                x={b.x + BLOCK_W - 12}
                y={BLOCK_Y + BLOCK_H - 12}
                width={5}
                height={5}
                className="v5-pcd-regmark"
              />
              <text x={b.x + 18} y={BLOCK_Y + 34} className="v5-pcd-block-label">
                {b.label}
              </text>
              <text x={b.x + 18} y={BLOCK_Y + 56} className="v5-pcd-block-meta">
                {b.meta}
              </text>
            </g>
          ))}

          <text x={40} y={228} className="v5-pcd-note">
            EACH ROW CARRIES THE LAST ONE&rsquo;S SEAL
          </text>
          <text x={40} y={252} className="v5-pcd-note-quiet">
            A BREAK IN THE CHAIN IS VISIBLE, NOT DENIABLE
          </text>
        </svg>
      </div>
    </figure>
  );
}
