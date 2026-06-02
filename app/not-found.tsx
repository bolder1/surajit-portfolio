import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--v5-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--v5-accent-bright)",
        }}
      >
        Error · 404
      </p>
      <h1
        style={{
          fontFamily: "var(--v5-sans), sans-serif",
          fontWeight: 300,
          fontSize: "clamp(40px, 8vw, 110px)",
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          color: "var(--v5-ink)",
        }}
      >
        Lost the{" "}
        <em style={{ fontFamily: "var(--v5-serif), Georgia, serif", fontStyle: "italic" }}>
          thread
        </em>
        .
      </h1>
      <p style={{ color: "var(--v5-ink-soft)", maxWidth: "44ch", lineHeight: 1.6 }}>
        This page doesn&rsquo;t exist. Head back home and start fresh.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 26px",
          borderRadius: 999,
          border: "1px solid var(--v5-ink)",
          color: "var(--v5-ink)",
          textDecoration: "none",
          fontFamily: "var(--v5-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Back home →
      </Link>
    </main>
  );
}
