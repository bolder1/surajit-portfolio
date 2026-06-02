/**
 * Browser-frame thumbnail used in case-study lists.
 *
 * Chrome (top bar + dots + address) is always visible. The interior
 * content is variant-specific and, when scoped under `.v3-root`,
 * animates in from an empty state on `.group:hover` with a staggered
 * delay. Each interior element gets:
 *   - class="el"     (animation hook)
 *   - style={{ "--i": n }}  (stagger index, 0..N)
 *   - style={{ "--o": 0.5 }} (target opacity if dimmed)
 */

type Variant = "directory" | "table" | "analytics";

type ElStyle = React.CSSProperties & {
  ["--i"]?: number | string;
  ["--o"]?: number | string;
};

const el = (i: number, o?: number): ElStyle =>
  o === undefined ? { ["--i"]: i } : { ["--i"]: i, ["--o"]: o };

export function CaseThumb({
  variant,
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 72 48"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className={`case-thumb ${variant ? `case-thumb--${variant}` : ""} ${className}`}
    >
      <defs>
        <clipPath id={`case-thumb-clip-${variant ?? "default"}`}>
          <rect x="0" y="5.5" width="72" height="42.5" />
        </clipPath>
      </defs>

      {/* Chrome — always visible */}
      <rect width="72" height="48" className="thumb-bg" />
      <rect x="0" y="0" width="72" height="5.5" className="chrome-bar" />
      <circle cx="3" cy="2.75" r="0.7" className="chrome-dot" />
      <circle cx="5.5" cy="2.75" r="0.7" className="chrome-dot" />
      <circle cx="8" cy="2.75" r="0.7" className="chrome-dot" />
      <rect
        x="14"
        y="1.3"
        width="40"
        height="2.9"
        rx="1.45"
        className="chrome-addr"
      />
      <line x1="0" y1="5.5" x2="72" y2="5.5" className="chrome-rule" />

      <g clipPath={`url(#case-thumb-clip-${variant ?? "default"})`}>
        {variant === "directory" && <DirectoryVariant />}
        {variant === "table" && <TableVariant />}
        {variant === "analytics" && <AnalyticsVariant />}
        {!variant && <DefaultVariant />}
      </g>

      <rect
        className="thumb-frame"
        x="0"
        y="0"
        width="72"
        height="48"
        fill="none"
        strokeWidth="0.3"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Variant: directory — sidebar tree + main form (ad-tools)
   ─────────────────────────────────────────────────────── */
function DirectoryVariant() {
  return (
    <g>
      {/* Sidebar background */}
      <rect className="el" style={el(0, 0.35)} x="3" y="7.5" width="18" height="37" fill="currentColor" />

      {/* Sidebar tree items */}
      <rect className="el" style={el(1)} x="5" y="10" width="13" height="1.6" fill="currentColor" />
      <rect className="el" style={el(2, 0.6)} x="7" y="13" width="10" height="1.1" fill="currentColor" />
      <rect className="el" style={el(3, 0.6)} x="7" y="15.5" width="11" height="1.1" fill="currentColor" />
      <rect className="el" style={el(4, 0.45)} x="9" y="18" width="8" height="0.9" fill="currentColor" />
      <rect className="el" style={el(5, 0.45)} x="9" y="20" width="9" height="0.9" fill="currentColor" />
      <rect className="el" style={el(6, 0.6)} x="7" y="22.5" width="10" height="1.1" fill="currentColor" />
      <rect className="el" style={el(7, 0.45)} x="9" y="25" width="7" height="0.9" fill="currentColor" />
      <rect className="el" style={el(8, 0.6)} x="7" y="27.5" width="11" height="1.1" fill="currentColor" />

      {/* Sidebar footer button */}
      <rect className="el" style={el(9)} x="5" y="39" width="14" height="2.4" rx="1.2" fill="currentColor" />

      {/* Main: title + subtitle */}
      <rect className="el" style={el(2)} x="24" y="10" width="22" height="2" fill="currentColor" />
      <rect className="el" style={el(3, 0.5)} x="24" y="13.5" width="30" height="1" fill="currentColor" />

      {/* Form fields */}
      <rect className="el" style={el(4, 0.5)} x="24" y="18" width="10" height="0.9" fill="currentColor" />
      <rect className="el" style={el(5)} x="24" y="19.5" width="42" height="3" rx="0.4" fill="none" stroke="currentColor" strokeWidth="0.3" />

      <rect className="el" style={el(6, 0.5)} x="24" y="24.5" width="12" height="0.9" fill="currentColor" />
      <rect className="el" style={el(7)} x="24" y="26" width="42" height="3" rx="0.4" fill="none" stroke="currentColor" strokeWidth="0.3" />

      <rect className="el" style={el(8, 0.5)} x="24" y="31" width="14" height="0.9" fill="currentColor" />
      <rect className="el" style={el(9)} x="24" y="32.5" width="42" height="3" rx="0.4" fill="none" stroke="currentColor" strokeWidth="0.3" />

      {/* Buttons */}
      <rect className="el" style={el(10)} x="24" y="39" width="16" height="3.4" rx="0.4" fill="currentColor" />
      <rect className="el" style={el(11)} x="42" y="39" width="12" height="3.4" rx="0.4" fill="none" stroke="currentColor" strokeWidth="0.3" />
    </g>
  );
}

/* ────────────────────────────────────────────────────────────
   Variant: table — header + filterable rows (iga-platform)
   ─────────────────────────────────────────────────────── */
function TableVariant() {
  const rows = [21, 23.5, 26, 28.5, 31, 33.5];
  return (
    <g>
      {/* Title + subtitle */}
      <rect className="el" style={el(0)} x="4" y="9" width="20" height="2" fill="currentColor" />
      <rect className="el" style={el(1, 0.5)} x="4" y="12.5" width="28" height="1" fill="currentColor" />

      {/* Filter chips top-right */}
      <rect className="el" style={el(2)} x="46" y="9" width="10" height="2.4" rx="1.2" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <rect className="el" style={el(3)} x="58" y="9" width="10" height="2.4" rx="1.2" fill="none" stroke="currentColor" strokeWidth="0.3" />

      {/* Table header */}
      <rect className="el" style={el(4, 0.18)} x="4" y="17" width="64" height="2.4" fill="currentColor" />
      <rect className="el" style={el(5, 0.7)} x="6" y="17.7" width="8" height="1" fill="currentColor" />
      <rect className="el" style={el(5, 0.7)} x="22" y="17.7" width="10" height="1" fill="currentColor" />
      <rect className="el" style={el(5, 0.7)} x="42" y="17.7" width="8" height="1" fill="currentColor" />
      <rect className="el" style={el(5, 0.7)} x="58" y="17.7" width="8" height="1" fill="currentColor" />

      {/* Table rows */}
      {rows.map((y, i) => (
        <g key={y}>
          <rect className="el" style={el(6 + i)} x="6" y={y - 0.7} width="1.4" height="1.4" rx="0.2" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect className="el" style={el(6 + i)} x="9" y={y - 0.4} width={10 - (i % 3) * 1.5} height="0.9" fill="currentColor" />
          <rect className="el" style={el(6 + i, 0.55)} x="22" y={y - 0.4} width="12" height="0.9" fill="currentColor" />
          <rect
            className="el"
            style={el(6 + i)}
            x="42"
            y={y - 0.7}
            width={i % 2 === 0 ? 7 : 9}
            height="1.4"
            rx="0.7"
            fill={i % 2 === 0 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="0.3"
            opacity={i % 2 === 0 ? 1 : undefined}
          />
          <rect className="el" style={el(6 + i, 0.55)} x="58" y={y - 0.4} width="8" height="0.9" fill="currentColor" />
        </g>
      ))}

      {/* Footer: pagination + primary action */}
      <rect className="el" style={el(13, 0.5)} x="4" y="40.5" width="14" height="1" fill="currentColor" />
      <rect className="el" style={el(14)} x="54" y="39.5" width="14" height="3.2" rx="0.4" fill="currentColor" />
    </g>
  );
}

/* ────────────────────────────────────────────────────────────
   Variant: analytics — KPI cards + chart (banking-analytics)
   ─────────────────────────────────────────────────────── */
function AnalyticsVariant() {
  const bars = [
    { x: 8, h: 2.5 },
    { x: 12, h: 4 },
    { x: 16, h: 5.5 },
    { x: 20, h: 7 },
    { x: 24, h: 5 },
    { x: 28, h: 8 },
    { x: 32, h: 6.5 },
    { x: 36, h: 9 },
    { x: 40, h: 7 },
    { x: 44, h: 10 },
    { x: 48, h: 8 },
    { x: 52, h: 11 },
  ];
  return (
    <g>
      {/* Title + subtitle */}
      <rect className="el" style={el(0)} x="4" y="9" width="18" height="2" fill="currentColor" />
      <rect className="el" style={el(1, 0.5)} x="4" y="12.5" width="26" height="1" fill="currentColor" />

      {/* Date range chip */}
      <rect className="el" style={el(2)} x="56" y="9" width="12" height="2.4" rx="1.2" fill="none" stroke="currentColor" strokeWidth="0.3" />

      {/* KPI cards */}
      {[4, 26, 48].map((x, i) => (
        <g key={x}>
          <rect className="el" style={el(3 + i)} x={x} y="16" width="20" height="9" rx="0.6" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <rect className="el" style={el(3 + i, 0.5)} x={x + 2} y="18" width="8" height="0.9" fill="currentColor" />
          <rect className="el" style={el(3 + i)} x={x + 2} y="20" width="12" height="2" fill="currentColor" />
          <rect className="el" style={el(3 + i, 0.65)} x={x + 2} y="23" width="5" height="1" rx="0.5" fill="currentColor" />
        </g>
      ))}

      {/* Chart container */}
      <rect className="el" style={el(7)} x="4" y="27" width="64" height="14" rx="0.6" fill="none" stroke="currentColor" strokeWidth="0.3" />

      {/* Chart bars */}
      {bars.map((b, i) => (
        <rect
          key={i}
          className="el"
          style={el(8 + i, 0.85)}
          x={b.x}
          y={40 - b.h}
          width="2.5"
          height={b.h}
          fill="currentColor"
        />
      ))}

      {/* Legend chips */}
      <rect className="el" style={el(20, 0.5)} x="4" y="43" width="3" height="1.4" rx="0.7" fill="currentColor" />
      <rect className="el" style={el(20, 0.4)} x="9" y="43" width="6" height="1.4" fill="currentColor" />
      <rect className="el" style={el(21, 0.5)} x="18" y="43" width="3" height="1.4" rx="0.7" fill="currentColor" />
      <rect className="el" style={el(21, 0.4)} x="23" y="43" width="6" height="1.4" fill="currentColor" />
    </g>
  );
}

/* ────────────────────────────────────────────────────────────
   Default (V1 fallback — non-animated, no variant)
   ─────────────────────────────────────────────────────── */
function DefaultVariant() {
  return (
    <g>
      <rect x="4" y="8" width="4" height="1.2" fill="currentColor" />
      <rect x="56" y="8" width="5" height="1" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="63" y="8" width="5" height="1" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="4" y="12" width="30" height="2" fill="currentColor" />
      <rect x="4" y="15.5" width="34" height="0.9" fill="currentColor" opacity="0.5" />
      <rect x="4" y="18" width="32" height="26" rx="1.2" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <rect x="6" y="20" width="10" height="1" fill="currentColor" />
      <rect x="6" y="23" width="28" height="0.2" fill="currentColor" opacity="0.4" />
      <rect x="6" y="25" width="14" height="0.8" fill="currentColor" opacity="0.55" />
      <rect x="28" y="25" width="6" height="0.8" fill="currentColor" />
      <rect x="6" y="27.5" width="12" height="0.8" fill="currentColor" opacity="0.55" />
      <rect x="30" y="27.5" width="4" height="0.8" fill="currentColor" />
      <rect x="6" y="30" width="16" height="0.8" fill="currentColor" opacity="0.55" />
      <rect x="28" y="30" width="6" height="0.8" fill="currentColor" />
      <rect x="6" y="33" width="28" height="0.2" fill="currentColor" opacity="0.4" />
      <rect x="6" y="35" width="8" height="1.2" fill="currentColor" />
      <rect x="28" y="35" width="6" height="1.4" fill="currentColor" />
      <rect x="6" y="40" width="28" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="40" y="18" width="28" height="16" rx="1.2" fill="currentColor" />
      <rect x="42" y="20" width="8" height="1.2" fill="var(--bg)" opacity="0.65" />
      <rect x="42" y="22.5" width="18" height="2" fill="var(--bg)" opacity="0.95" />
      <rect x="42" y="26" width="24" height="0.8" fill="var(--bg)" opacity="0.5" />
      <rect x="42" y="28" width="18" height="0.8" fill="var(--bg)" opacity="0.5" />
      <rect x="42" y="30" width="22" height="0.8" fill="var(--bg)" opacity="0.5" />
      <rect x="40" y="37" width="28" height="4" rx="2" fill="currentColor" />
    </g>
  );
}
