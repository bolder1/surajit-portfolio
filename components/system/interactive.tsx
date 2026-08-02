"use client";

import { useState } from "react";
import { AXES, AXIS_VALUES, REPOINT_TARGETS } from "@/lib/systemStory";

/* ══ 04 · the re-point ════════════════════════════════════════════
   The claim is that modernising a surface touches no screen. Asserting
   that is cheap, so this lets you do it: re-point the role and watch the
   chain re-resolve while the component markup, the token name and the
   files-opened counter all stay exactly where they were. */

export function RepointVisual() {
  const [target, setTarget] = useState(0);
  const t = REPOINT_TARGETS[target];

  return (
    <div className="sys-rp">
      <div className="sys-rp-chain">
        <div className="sys-rp-node">
          <span className="k">COMPONENT</span>
          <code>Card / Base</code>
        </div>
        <span className="sys-rp-arrow" aria-hidden>
          ↓
        </span>
        <div className="sys-rp-node is-fixed">
          <span className="k">REFERENCES ROLE</span>
          <code>surface/raised</code>
          <span className="sys-rp-lock">NEVER CHANGES</span>
        </div>
        <span className="sys-rp-arrow" aria-hidden>
          ↓
        </span>
        <div className="sys-rp-node is-live">
          <span className="k">RESOLVES TO</span>
          <code>{t.label}</code>
        </div>
      </div>

      <div className="sys-rp-stage">
        {/* The surface. Geometry is identical between states on purpose —
            only the resolved value moves. */}
        <div
          className="sys-rp-card"
          style={{ background: t.swatch, color: t.ink, borderColor: t.ink + "33" }}
        >
          <span className="sys-rp-card-h" style={{ background: t.ink }} />
          <span className="sys-rp-card-l" style={{ background: t.ink, opacity: 0.5 }} />
          <span className="sys-rp-card-l is-short" style={{ background: t.ink, opacity: 0.5 }} />
          <span className="sys-rp-card-btn" style={{ borderColor: t.ink, color: t.ink }}>
            ACTION
          </span>
        </div>

        <div className="sys-rp-controls">
          <p className="sys-rp-q">Point the role somewhere else:</p>
          {REPOINT_TARGETS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`sys-rp-btn${i === target ? " is-on" : ""}`}
              aria-pressed={i === target}
              onClick={() => setTarget(i)}
            >
              <span className="sw" style={{ background: r.swatch }} aria-hidden />
              {r.label}
            </button>
          ))}
          <dl className="sys-rp-tally">
            <div>
              <dt>PRODUCT FILES OPENED</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>COMPONENTS EDITED</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>SCREENS REDRAWN</dt>
              <dd>0</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ══ 05 · no designer on the ticket ═══════════════════════════════
   The strong version of the claim is not "the defaults are good", it is
   "the wrong answer is unreachable". So the free-text field is real, and
   it refuses anything that is not a token in the set. */

export function DropdownVisual() {
  const [sel, setSel] = useState<Record<string, string>>({
    pad: AXES[0].options[2],
    radius: AXES[1].options[1],
    tone: AXES[2].options[0],
  });
  const [typed, setTyped] = useState("");

  const known = AXES.some((a) => a.options.includes(typed.trim()));
  const attempted = typed.trim().length > 0;

  const padding = AXIS_VALUES.pad[sel.pad];
  const radius = AXIS_VALUES.radius[sel.radius];
  const tone = AXIS_VALUES.tone[sel.tone];

  return (
    <div className="sys-dd">
      <div className="sys-dd-axes">
        {AXES.map((a) => (
          <div className="sys-dd-axis" key={a.id} role="group" aria-label={a.label}>
            <span className="sys-dd-k">{a.label}</span>
            <div className="sys-dd-opts">
              {a.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`sys-dd-opt${sel[a.id] === o ? " is-on" : ""}`}
                  aria-pressed={sel[a.id] === o}
                  onClick={() => setSel((s) => ({ ...s, [a.id]: o }))}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="sys-dd-try">
          <label className="sys-dd-k" htmlFor="sys-dd-raw">
            or type a raw value
          </label>
          <input
            id="sys-dd-raw"
            className={`sys-dd-input${attempted && !known ? " is-bad" : ""}`}
            value={typed}
            placeholder="7px"
            onChange={(e) => setTyped(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <p className="sys-dd-msg" role="status">
            {!attempted
              ? "The field accepts token names only."
              : known
                ? `“${typed.trim()}” is in the set — that is why it works.`
                : `“${typed.trim()}” is not a token. There is no word for it, so it cannot be expressed.`}
          </p>
        </div>
      </div>

      <div className="sys-dd-stage">
        <button
          type="button"
          className={`sys-dd-preview is-${sel.tone}`}
          style={{ padding, borderRadius: radius }}
          onClick={(e) => e.preventDefault()}
        >
          Continue
        </button>
        <code className="sys-dd-spec">
          {sel.pad} · {sel.radius} · {sel.tone} ({tone})
        </code>
      </div>
    </div>
  );
}
