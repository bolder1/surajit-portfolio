"use client";

import { useEffect, useRef } from "react";

/**
 * RevealV2 — staggered scroll entry. Adds `.is-in` on first intersection;
 * the transition itself lives in `.v2-rv` so nothing animates via JS.
 */
export function RevealV2({
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
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -70px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={`v2-rv ${className}`}
      style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Component>
  );
}
