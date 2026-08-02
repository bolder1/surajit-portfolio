/**
 * LegacyVaultDiagram — how shipped work becomes buildable-from.
 *
 * The claim this case makes is that legacy designs are an asset rather than
 * a migration problem, provided they are stored as something a developer can
 * compose with. So: what already shipped enters on the left, resolves down
 * four layers, and comes out on the right as a new product that inherits by
 * default. The accent is spent only on the re-point arrow, because "change
 * what a token points at, never the screen" is the entire mechanism.
 */

const LAYERS = [
  { name: "THEME MODES", holds: "which identity" },
  { name: "SEMANTIC ROLES", holds: "what it means" },
  { name: "ALIASED SCALES", holds: "the rhythm" },
  { name: "PRIMITIVES", holds: "the shipped values" },
];

const BAND_X = 336;
const BAND_W = 300;
const BAND_H = 46;
const BAND_TOP = 74;
const BAND_GAP = 14;

/** A shipped product, drawn as a plain surface — three of them, offset. */
function Legacy({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g>
      <rect x={x} y={y} width={150} height={92} className="v5-lv-screen" />
      <line x1={x + 16} y1={y + 24} x2={x + 88} y2={y + 24} className="v5-lv-ph" />
      <line x1={x + 16} y1={y + 42} x2={x + 118} y2={y + 42} className="v5-lv-ph" />
      <line x1={x + 16} y1={y + 60} x2={x + 74} y2={y + 60} className="v5-lv-ph" />
      <text x={x + 16} y={y + 84} className="v5-lv-tiny">
        SHIPPED · 0{i + 1}
      </text>
    </g>
  );
}

export function LegacyVaultDiagram() {
  const bandY = (i: number) => BAND_TOP + i * (BAND_H + BAND_GAP);
  const stackBottom = bandY(LAYERS.length - 1) + BAND_H;

  return (
    <figure className="v5-pcd v5-lv">
      <figcaption className="v5-pcd-cap">
        <span className="v5-pcd-glyph" aria-hidden />
        FIG. 01 — WHAT ALREADY SHIPPED, MADE BUILDABLE-FROM
      </figcaption>

      <div className="v5-pcd-frame">
        <svg
          viewBox="0 0 980 340"
          className="v5-lv-svg"
          role="img"
          aria-label="Shipped products are captured into four stacked layers — primitives holding the shipped values, aliased scales holding the rhythm, semantic roles holding meaning, and theme modes holding identity. A new product composes out of the same four layers, inheriting by default. Modernising re-points a role at a different primitive rather than redrawing a screen."
        >
          {/* ── left: what already exists ── */}
          <text x={40} y={40} className="v5-lv-head">
            ALREADY SHIPPED
          </text>
          <Legacy x={40} y={74} i={0} />
          <Legacy x={40} y={180} i={1} />
          <text x={40} y={300} className="v5-lv-note">
            CAPTURED, NOT CORRECTED
          </text>

          {/* capture arrows */}
          {[120, 226].map((y) => (
            <g key={y}>
              <line x1={196} y1={y} x2={BAND_X - 14} y2={y} className="v5-lv-wire" />
              <path
                d={`M ${BAND_X - 14} ${y} l -7 -4 l 0 8 z`}
                className="v5-lv-arrow"
              />
            </g>
          ))}

          {/* ── middle: the four layers ── */}
          <text x={BAND_X} y={40} className="v5-lv-head">
            ONE DEFINITION
          </text>
          {LAYERS.map((l, i) => (
            <g key={l.name}>
              <rect
                x={BAND_X}
                y={bandY(i)}
                width={BAND_W}
                height={BAND_H}
                className="v5-lv-band"
              />
              <text x={BAND_X + 16} y={bandY(i) + 20} className="v5-lv-band-n">
                {l.name}
              </text>
              <text x={BAND_X + 16} y={bandY(i) + 36} className="v5-lv-band-h">
                {l.holds}
              </text>
            </g>
          ))}

          {/* resolution direction — the stack reads downward */}
          <line
            x1={BAND_X - 22}
            y1={BAND_TOP}
            x2={BAND_X - 22}
            y2={stackBottom}
            className="v5-lv-rule"
          />
          <text
            x={BAND_X - 30}
            y={(BAND_TOP + stackBottom) / 2}
            className="v5-lv-vert"
            transform={`rotate(-90 ${BAND_X - 30} ${(BAND_TOP + stackBottom) / 2})`}
          >
            RESOLVES DOWN
          </text>

          {/* The re-point: a semantic role aims at a different primitive.
              Routed entirely in the gutter to the right of the bands — drawn
              across them it read as a line cutting through the boxes. */}
          <path
            d={`M ${BAND_X + BAND_W} ${bandY(1) + BAND_H / 2} C ${BAND_X + BAND_W + 32} ${bandY(1) + BAND_H / 2 + 18}, ${BAND_X + BAND_W + 32} ${bandY(3) + BAND_H / 2 - 18}, ${BAND_X + BAND_W} ${bandY(3) + BAND_H / 2}`}
            className="v5-lv-repoint"
            fill="none"
          />
          <path
            d={`M ${BAND_X + BAND_W} ${bandY(3) + BAND_H / 2} l 8 -4 l 0 8 z`}
            className="v5-lv-repoint-head"
          />
          {/* Vertical, like RESOLVES DOWN — the only label that fits the
              gutter without colliding with the compose arrows. */}
          <text
            x={BAND_X + BAND_W + 44}
            y={(bandY(1) + bandY(3) + BAND_H) / 2}
            className="v5-lv-repoint-t"
            transform={`rotate(-90 ${BAND_X + BAND_W + 44} ${(bandY(1) + bandY(3) + BAND_H) / 2})`}
          >
            RE-POINT
          </text>

          {/* compose arrows */}
          {[120, 226].map((y) => (
            <g key={y}>
              <line
                x1={BAND_X + BAND_W + 74}
                y1={y}
                x2={786}
                y2={y}
                className="v5-lv-wire"
              />
              <path d={`M 786 ${y} l -7 -4 l 0 8 z`} className="v5-lv-arrow" />
            </g>
          ))}

          {/* ── right: what gets built next ── */}
          <text x={790} y={40} className="v5-lv-head">
            BUILT NEXT
          </text>
          <g>
            <rect x={790} y={74} width={150} height={92} className="v5-lv-screen is-new" />
            <line x1={806} y1={98} x2={878} y2={98} className="v5-lv-ph" />
            <line x1={806} y1={116} x2={908} y2={116} className="v5-lv-ph" />
            <line x1={806} y1={134} x2={864} y2={134} className="v5-lv-ph" />
            <text x={806} y={158} className="v5-lv-tiny">
              INHERITS BY DEFAULT
            </text>
          </g>
          <g>
            <rect x={790} y={180} width={150} height={92} className="v5-lv-screen is-new" />
            <line x1={806} y1={204} x2={878} y2={204} className="v5-lv-ph" />
            <line x1={806} y1={222} x2={908} y2={222} className="v5-lv-ph" />
            <line x1={806} y1={240} x2={864} y2={240} className="v5-lv-ph" />
            <text x={806} y={264} className="v5-lv-tiny">
              NO DESIGNER REQUIRED
            </text>
          </g>
          <text x={790} y={300} className="v5-lv-note">
            DIVERGENCE LEAVES A DIFF
          </text>
        </svg>
      </div>
    </figure>
  );
}
