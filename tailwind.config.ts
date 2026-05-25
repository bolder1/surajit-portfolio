import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Swiss palette — one accent, neutrals from token layer.
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-3": "var(--paper-3)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        "muted-soft": "var(--muted-soft)",
        rule: "var(--rule)",
        "rule-soft": "var(--rule-soft)",
        accent: "var(--accent)",
        "accent-deep": "var(--accent-deep)",
        "accent-soft": "var(--accent-soft)",
        surface: "var(--surface)",
      },
      fontFamily: {
        // Inter for everything visible; mono for labels.
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // 8px-base type scale.
        "2xs": ["10px", { lineHeight: "1.4" }],
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["13px", { lineHeight: "1.5" }],
        base: ["15px", { lineHeight: "1.5" }],
        md: ["17px", { lineHeight: "1.55" }],
        lg: ["19px", { lineHeight: "1.5" }],
        xl: ["24px", { lineHeight: "1.25" }],
        "2xl": ["32px", { lineHeight: "1.15" }],
        "3xl": ["48px", { lineHeight: "1.05" }],
        "4xl": ["64px", { lineHeight: "0.98" }],
        "5xl": ["88px", { lineHeight: "0.96" }],
        "6xl": ["120px", { lineHeight: "0.94" }],
        "display-lg": ["160px", { lineHeight: "0.92" }],
      },
      letterSpacing: {
        // Swiss prefers tight tracking on display, regular on body, wide on caps.
        tightest: "-0.04em",
        "tighter-2": "-0.035em",
        "wide-2": "0.14em",
        "wide-3": "0.18em",
      },
      spacing: {
        // Tailwind defaults follow 0.25rem (4px) which is fine; named tokens
        // for the Swiss scale so component code can read intent.
        "swiss-1": "4px",
        "swiss-2": "8px",
        "swiss-3": "12px",
        "swiss-4": "16px",
        "swiss-5": "24px",
        "swiss-6": "32px",
        "swiss-7": "48px",
        "swiss-8": "64px",
        "swiss-9": "96px",
        "swiss-10": "128px",
        "swiss-11": "192px",
      },
      maxWidth: {
        page: "1280px",
        prose: "65ch",
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0, 0, 1) forwards",
        marquee: "marquee 80s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
