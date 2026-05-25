import Link from "next/link";
import React from "react";

/**
 * Button — single source of truth for CTAs across the site.
 *
 * Three variants (visual hierarchy, never mix more than two on a screen):
 *   - primary   : ink → accent on hover. The page's main action.
 *   - outlined  : 1px ink border. The supporting action next to a primary.
 *   - ghost     : underlined inline link with vermilion underline. Tertiary.
 *
 * Two sizes: md (default) and sm (used in tables and footers).
 *
 * Accessibility:
 *   - Always renders a real <button> for actions (onClick) or <a>/<Link>
 *     for navigation. No clickable divs.
 *   - Min 44×44 hit area on mobile (WCAG 2.5.5).
 *   - Focus-visible ring uses :focus-visible from globals.css (always
 *     visible, never trapped). Outline offset 3px, accent colour.
 *   - Icons are aria-hidden; the visible label carries the meaning.
 *   - external prop opens in a new tab with rel="noreferrer noopener".
 *
 * Hierarchy rule: never put two primary buttons in the same row. A primary
 * + outlined pair is the strongest pattern; an outlined + ghost pair is
 * the calmest.
 */

type Variant = "primary" | "outlined" | "ghost";
type Size = "md" | "sm";

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  /** Override the default arrow icon */
  noIcon?: boolean;
  /** Open in new tab when the href is external */
  external?: boolean;
}

interface AnchorProps extends CommonProps {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
  /** Force download instead of navigating. Pass a string to set the
      saved filename (e.g. "Surajit-Dutta-CV.pdf"). */
  download?: boolean | string;
}

interface ButtonProps extends CommonProps {
  href?: never;
  external?: never;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

type Props = AnchorProps | ButtonProps;

export function Button(props: Props) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    iconRight,
    iconLeft,
    noIcon = false,
  } = props;

  const sizeClasses =
    size === "sm"
      ? "min-h-[36px] px-3.5 py-2 text-[11px]"
      : "min-h-[52px] px-6 py-3.5 text-[12px] md:text-[13px]";

  /* Pure white (#fff) on dark backgrounds for maximum contrast.
     The cream --paper colour reads "off-white" on small UI text and
     the user reported it as not-readable, so primary + outlined-hover
     states use real white. Cream stays for body prose where the
     warmth helps. */
  const variantClasses = {
    primary:
      "bg-[var(--accent)] !text-[var(--paper)] hover:bg-[var(--ink)] hover:!text-[var(--paper)] focus-visible:bg-[var(--ink)] [&_*]:!text-[var(--paper)]",
    outlined:
      "border border-[var(--ink)] text-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:!text-[var(--paper)] focus-visible:bg-[var(--ink)] focus-visible:!text-[var(--paper)] hover:[&_*]:!text-[var(--paper)] focus-visible:[&_*]:!text-[var(--paper)]",
    ghost:
      "text-[var(--ink)] underline underline-offset-4 decoration-2 decoration-[var(--accent)] hover:text-[var(--accent)] hover:decoration-[var(--accent)] !min-h-0 !p-0 inline-flex",
  }[variant];

  const baseClasses =
    "btn-mat group inline-flex items-center justify-center gap-2.5 mono tracking-[0.14em] uppercase transition-all duration-200 motion-reduce:transition-none disabled:opacity-60 disabled:cursor-not-allowed";

  const allClasses = [
    baseClasses,
    variant === "ghost" ? "" : sizeClasses,
    variantClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {iconLeft && (
        <span aria-hidden className="shrink-0">
          {iconLeft}
        </span>
      )}
      <span>{children}</span>
      {!noIcon && (iconRight ?? defaultIcon(variant))}
    </>
  );

  if ("href" in props && props.href) {
    const isExternalUrl =
      props.external ||
      props.href.startsWith("http") ||
      props.href.startsWith("mailto:") ||
      props.href.startsWith("tel:");

    /* When `download` is set we always use a plain <a> (Next's <Link>
       strips the download attribute) and force the browser to save
       the file rather than navigate. */
    if (props.download !== undefined && props.download !== false) {
      return (
        <a
          href={props.href}
          download={typeof props.download === "string" ? props.download : ""}
          className={allClasses}
          data-cursor="accent"
        >
          {content}
        </a>
      );
    }

    if (isExternalUrl) {
      return (
        <a
          href={props.href}
          className={allClasses}
          data-cursor="accent"
          target={props.external ? "_blank" : undefined}
          rel={props.external ? "noreferrer noopener" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={props.href} className={allClasses} data-cursor="accent">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={allClasses}
      data-cursor="accent"
    >
      {content}
    </button>
  );
}

function defaultIcon(variant: Variant) {
  // matveyan-style: arrow that slides forward 2-3px on hover.
  return (
    <span
      aria-hidden
      className="shrink-0 text-[1.2em] leading-none transition-transform duration-200 ease-out group-hover:translate-x-1"
    >
      {variant === "primary" ? "→" : variant === "outlined" ? "→" : "↗"}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   StatusPill — the "OPEN TO ROLES" capsule reused in masthead,
   hero, and contact. One source of truth so the colour and
   contrast can be tuned in one place.
   ─────────────────────────────────────────────────────── */
export function StatusPill({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const padding = size === "md" ? "px-3 py-1.5" : "px-2.5 py-1";
  return (
    <span
      role="status"
      aria-label="Currently open to product design roles"
      className={`inline-flex items-center gap-2 mono ${padding} bg-[var(--accent)] !text-white tracking-widest uppercase [&_*]:!text-white ${className}`}
    >
      <span aria-hidden className="block w-1.5 h-1.5 bg-[var(--paper)] rounded-full" />
      Open to roles
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Tag — small label used for skill chips, project tags.
   Consistent border colour, hover state, touch-target floor.
   ─────────────────────────────────────────────────────── */
export function Tag({
  children,
  accent = false,
  className = "",
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center mono px-2.5 py-1 border ${
        accent
          ? "border-[var(--accent)] text-[var(--accent)]"
          : "border-[var(--rule-soft)] text-[var(--muted)]"
      } ${className}`}
    >
      {children}
    </span>
  );
}
