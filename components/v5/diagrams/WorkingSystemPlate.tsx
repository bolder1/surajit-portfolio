/**
 * WorkingSystemPlate — the differentiator, drawn instead of argued.
 *
 * Two panels with the SAME surface geometry. On the left, a comp: the
 * picture of a product, with nothing underneath it. On the right, the
 * same picture wired to the machinery that makes it true — the joins,
 * the states, the audit write. Most design deliverables stop at the
 * left panel; this practice ships the right one.
 *
 * Vermilion is spent on the spine connecting surface to machinery,
 * because that connection is the entire claim.
 */

const PANEL_W = 384;
const L_X = 44;
const R_X = 552;
const SCREEN_Y = 52;
const SCREEN_H = 116;

/** placeholder content inside both surfaces — identical by design */
const ROWS = [
  { y: 22, w: 150 },
  { y: 40, w: 214 },
  { y: 58, w: 182 },
];

const MACHINERY = [
  { label: "JOIN 3 SOURCES, OUT OF ORDER" },
  { label: "PARTIAL + FAILED STATES" },
  { label: "AUDIT WRITE, EVERY ACTION" },
];

function Surface({ x, dashed }: { x: number; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={SCREEN_Y}
        width={PANEL_W}
        height={SCREEN_H}
        className={dashed ? "v5-wsp-screen is-comp" : "v5-wsp-screen"}
      />
      {ROWS.map((r) => (
        <line
          key={r.y}
          x1={x + 22}
          y1={SCREEN_Y + r.y}
          x2={x + 22 + r.w}
          y2={SCREEN_Y + r.y}
          className="v5-wsp-placeholder"
        />
      ))}
      <rect
        x={x + PANEL_W - 116}
        y={SCREEN_Y + 20}
        width={94}
        height={52}
        className="v5-wsp-placeholder-box"
      />
      <line
        x1={x + 22}
        y1={SCREEN_Y + 92}
        x2={x + 118}
        y2={SCREEN_Y + 92}
        className="v5-wsp-placeholder"
      />
    </g>
  );
}

export function WorkingSystemPlate() {
  // Spine hangs from the left of the surface so the machinery labels run
  // clear of it to the right.
  const spineX = R_X + 26;

  return (
    <figure className="v5-pcd v5-wsp">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 06 — SAME PICTURE, DIFFERENT OBJECT
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox="0 0 980 350"
          className="v5-wsp-svg"
          role="img"
          aria-label="Two panels with identical surfaces. The left, a comp, has nothing beneath it. The right, a prototype, is wired to the machinery that makes it work: joining three out-of-order sources, partial and failed states, and an audit write on every action."
        >
          {/* ── left: a comp ── */}
          <text x={L_X} y={30} className="v5-wsp-title">
            A COMP
          </text>
          <text x={L_X + PANEL_W} y={30} className="v5-wsp-sub">
            WHAT MOST DELIVERABLES ARE
          </text>
          <Surface x={L_X} dashed />
          <text x={L_X + PANEL_W / 2} y={SCREEN_Y + SCREEN_H + 62} className="v5-wsp-void">
            NOTHING UNDERNEATH
          </text>
          <line
            x1={L_X + 84}
            y1={SCREEN_Y + SCREEN_H + 88}
            x2={L_X + PANEL_W - 84}
            y2={SCREEN_Y + SCREEN_H + 88}
            className="v5-wsp-void-rule"
          />

          {/* divider */}
          <line x1={490} y1={20} x2={490} y2={330} className="v5-wsp-divider" />

          {/* ── right: the working system ── */}
          <text x={R_X} y={30} className="v5-wsp-title">
            THE PROTOTYPE
          </text>
          <text x={R_X + PANEL_W} y={30} className="v5-wsp-sub is-hot">
            WHAT SHIPS HERE
          </text>
          <Surface x={R_X} />

          {/* spine: surface wired to machinery */}
          <line
            x1={spineX}
            y1={SCREEN_Y + SCREEN_H}
            x2={spineX}
            y2={SCREEN_Y + SCREEN_H + 26}
            className="v5-wsp-spine"
          />
          {MACHINERY.map((m, i) => {
            const y = SCREEN_Y + SCREEN_H + 26 + i * 40;
            const isLast = i === MACHINERY.length - 1;
            return (
              <g key={m.label}>
                {/* spine continues past each node, stopping at the last */}
                <line
                  x1={spineX}
                  y1={y}
                  x2={spineX}
                  y2={isLast ? y + 20 : y + 40}
                  className="v5-wsp-spine"
                />
                <rect
                  x={spineX - 6}
                  y={y + 14}
                  width={12}
                  height={12}
                  className="v5-wsp-node"
                  transform={`rotate(45 ${spineX} ${y + 20})`}
                />
                <text x={spineX + 26} y={y + 24} className="v5-wsp-machine">
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
