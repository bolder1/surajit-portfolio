/**
 * Ornaments — small SVG primitives used as section punctuation.
 *
 * ozgur.design-influenced: geometric, monoline, no fills (or single
 * laser-red fill where called out). Each ornament is sized 1em by
 * default so it sits in mono lines without breaking rhythm.
 */

type Props = {
  size?: number;
  className?: string;
  accent?: boolean;
};

export function Asterisk({ size = 16, className = "", accent }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
      style={accent ? { color: "var(--accent)" } : undefined}
    >
      <path d="M8 2v12M2 8h12M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function Triangle({ size = 16, className = "", accent }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
      style={accent ? { color: "var(--accent)" } : undefined}
    >
      <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CircleDot({ size = 16, className = "", accent }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
      style={accent ? { color: "var(--accent)" } : undefined}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}

export function Plus({ size = 16, className = "", accent }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
      style={accent ? { color: "var(--accent)" } : undefined}
    >
      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function Slash({ size = 16, className = "", accent }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
      style={accent ? { color: "var(--accent)" } : undefined}
    >
      <path d="M12 2L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

/** Brackets — open + close, used to wrap label content brutalist-style. */
export function Bracket({
  side,
  size = 24,
  className = "",
}: {
  side: "open" | "close";
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size / 2}
      height={size}
      viewBox="0 0 8 16"
      fill="none"
      aria-hidden
      className={className}
    >
      {side === "open" ? (
        <path d="M7 1H1v14h6" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M1 1h6v14H1" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}

/** A stamped serial mark, ozgur-style. */
export function SerialMark({
  no,
  total,
  className = "",
}: {
  no: number;
  total?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 mono-accent ${className}`} aria-hidden>
      <Asterisk size={11} accent />
      {String(no).padStart(2, "0")}
      {total !== undefined && (
        <span className="text-[var(--muted)]">/ {String(total).padStart(2, "0")}</span>
      )}
    </span>
  );
}
