"use client";

import { useState } from "react";
import {
  resolve,
  resolveAll,
  isAlpha,
  SURFACE_BINDINGS,
  type Brand,
  type Appearance,
} from "@/lib/designSystem/resolve";
import { M } from "@/lib/designSystem/metrics";

/**
 * TokenResolver — the multimapping, running rather than described.
 *
 * Two independent switches, brand and appearance. Neither is a component
 * property; both are variable modes, and the whole argument of the
 * architecture is that they compose without multiplying anything the
 * component has to know about.
 *
 * The button on the right is painted *only* from the resolved chain — every
 * colour on it comes out of `resolve()`. That is deliberate: a still image of
 * a token chain proves nothing, and a preview wired to hard-coded hexes would
 * be exactly the lie this system exists to stop.
 */

const BRANDS: Brand[] = ["Blue", "Orange"];
const APPEARANCES: Appearance[] = ["onLight", "onDark"];

function Chip({
  on,
  children,
  onClick,
  label,
}: {
  on: boolean;
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`ds-chip${on ? " is-on" : ""}`}
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TokenResolver() {
  const [brand, setBrand] = useState<Brand>("Blue");
  const [appearance, setAppearance] = useState<Appearance>("onLight");
  const [binding, setBinding] = useState(SURFACE_BINDINGS[0].token);

  const chain = resolve(binding, brand, appearance);

  // The preview is painted from the chain, not from CSS. If a binding fails to
  // resolve the swatch goes transparent rather than silently falling back to
  // something plausible — a preview that always looks fine cannot be evidence.
  const paint = (token: string) => resolve(token, brand, appearance)?.css ?? "transparent";
  const bg = paint("interactive/background/primary/default");
  const bgHot = paint("interactive/background/primary/highlighted");
  const border = paint("interactive/border/primary/default");
  const label = paint("interactive/text/primary/normal");

  const onDark = appearance === "onDark";

  return (
    <div className="ds-resolver" data-appearance={appearance}>
      <div className="ds-resolver-controls">
        <div className="ds-switch">
          <span className="ds-switch-k">BRAND</span>
          <div className="ds-switch-set" role="group" aria-label="Brand">
            {BRANDS.map((b) => (
              <Chip
                key={b}
                on={brand === b}
                onClick={() => setBrand(b)}
                label={`Brand ${b}`}
              >
                {b}
              </Chip>
            ))}
          </div>
          <span className="ds-switch-n">Theme collection · {M.themeRoles} roles</span>
        </div>

        <div className="ds-switch">
          <span className="ds-switch-k">APPEARANCE</span>
          <div className="ds-switch-set" role="group" aria-label="Appearance">
            {APPEARANCES.map((a) => (
              <Chip
                key={a}
                on={appearance === a}
                onClick={() => setAppearance(a)}
                label={`Appearance ${a}`}
              >
                {a}
              </Chip>
            ))}
          </div>
          <span className="ds-switch-n">Mode collection · {M.bindable} roles</span>
        </div>
      </div>

      <div className="ds-resolver-body">
        {/* ── the chain ───────────────────────────────────────────── */}
        <div className="ds-chain">
          <p className="ds-chain-h">
            <span className="ds-dot" aria-hidden /> RESOLUTION
          </p>

          <ul className="ds-binding-picker" aria-label="Token binding">
            {SURFACE_BINDINGS.map((b) => (
              <li key={b.token}>
                <button
                  type="button"
                  className={`ds-binding${binding === b.token ? " is-on" : ""}`}
                  aria-pressed={binding === b.token}
                  onClick={() => setBinding(b.token)}
                >
                  {b.label}
                </button>
              </li>
            ))}
          </ul>

          <ol className="ds-hops">
            {chain?.hops.map((h, i) => (
              <li key={h.token} className="ds-hop">
                <span className="ds-hop-n" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ds-hop-body">
                  <span className="ds-hop-col">{h.collection}</span>
                  <code className="ds-hop-tok">{h.token}</code>
                  {h.via && (
                    <span className="ds-hop-via">
                      mode <b>{h.via}</b>
                    </span>
                  )}
                </span>
              </li>
            ))}
            <li className="ds-hop is-leaf">
              <span className="ds-hop-n" aria-hidden>
                ↳
              </span>
              <span className="ds-hop-body">
                <span className="ds-hop-col">VALUE</span>
                <span className="ds-leaf">
                  <i
                    className="ds-leaf-sw"
                    style={{ background: chain?.css ?? "transparent" }}
                    aria-hidden
                  />
                  <code>{chain?.raw ?? "—"}</code>
                  {chain && isAlpha(chain.raw) && (
                    <span className="ds-hop-via">alpha step</span>
                  )}
                </span>
              </span>
            </li>
          </ol>

          <p className="ds-chain-note">
            The component holds hop&nbsp;01 and nothing else. Hops 02 and 03 are
            the two mode axes resolving, in that order — which is why{" "}
            {M.routed} tokens carry {M.routed * M.valuesPerRoutedBinding} values
            and no component takes a brand or mode property.
          </p>
        </div>

        {/* ── painted from the chain ───────────────────────────────── */}
        <div className="ds-preview" data-dark={onDark || undefined}>
          <p className="ds-preview-h">PAINTED FROM THE CHAIN</p>
          <div className="ds-preview-stage">
            <span
              className="ds-btn"
              style={{ background: bg, borderColor: bg, color: onDark ? "#0C1927" : "#FFFFFF" }}
            >
              Primary
            </span>
            <span
              className="ds-btn is-ghost"
              style={{ borderColor: border, color: label }}
            >
              Secondery
            </span>
            <span className="ds-btn is-link" style={{ color: label }}>
              Link
            </span>
          </div>
          <dl className="ds-preview-legend">
            {[
              ["background", bg],
              ["highlighted", bgHot],
              ["border", border],
              ["text", label],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>
                  <i style={{ background: v }} aria-hidden />
                  {k}
                </dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── all four at once ──────────────────────────────────────── */}
      <div className="ds-quad">
        <p className="ds-quad-h">
          ONE BINDING · <code>{binding}</code> · FOUR RESOLVED VALUES
        </p>
        <div className="ds-quad-grid">
          {resolveAll(binding).map(({ brand: b, appearance: a, res }) => (
            <div
              key={`${b}-${a}`}
              className={`ds-quad-cell${b === brand && a === appearance ? " is-on" : ""}`}
            >
              <span className="ds-quad-k">
                {b} · {a}
              </span>
              <i className="ds-quad-sw" style={{ background: res.css }} aria-hidden />
              <code className="ds-quad-v">{res.raw}</code>
              <code className="ds-quad-p">{res.primitive ?? "—"}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
