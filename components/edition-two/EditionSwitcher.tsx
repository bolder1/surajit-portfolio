"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Floating switcher pill — top-right corner, fixed. Lets the visitor
 * jump between the cream editorial Folio (/) and the dark Edition
 * Two (/edition-two). Auto-aware of current route so the labels feel
 * right on both sides.
 */
export function EditionSwitcher() {
  const pathname = usePathname() ?? "/";
  const onEditionTwo = pathname.startsWith("/edition-two");
  const target = onEditionTwo ? "/" : "/edition-two";
  const targetLabel = onEditionTwo ? "EDITION ONE · CREAM" : "EDITION TWO · DARK";

  return (
    <div
      aria-label="Compare design editions"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <Link
        href={target}
        prefetch
        style={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          minHeight: 36,
          padding: "8px 14px",
          borderRadius: 999,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textDecoration: "none",
          background: onEditionTwo
            ? "rgba(243, 236, 222, 0.92)"
            : "rgba(22, 17, 9, 0.92)",
          color: onEditionTwo ? "#161109" : "#f3ecde",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: onEditionTwo
            ? "1px solid rgba(22, 17, 9, 0.18)"
            : "1px solid rgba(243, 236, 222, 0.18)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span aria-hidden style={{ display: "inline-flex", gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              background: "#c52e16",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              background: "#ff5c2a",
              transform: "rotate(45deg)",
              opacity: 0.6,
            }}
          />
        </span>
        <span>{`→ ${targetLabel}`}</span>
      </Link>
    </div>
  );
}
