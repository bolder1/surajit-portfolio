/**
 * RevealOnScrollV5 — re-export of the v4 reveal wrapper so v5 sections
 * can use the same fade+lift behaviour without duplicating the
 * IntersectionObserver wiring. The actual transition is driven by the
 * `.v5-reveal` / `.is-in` rule pair in v5.css; this component just
 * toggles the class on first intersection.
 */
"use client";

import { useEffect, useRef } from "react";

export function RevealOnScrollV5({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}: {
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as any;
  return (
    <Component
      ref={ref}
      className={`v5-reveal ${className}`}
      style={{ ["--reveal-delay" as any]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Component>
  );
}
