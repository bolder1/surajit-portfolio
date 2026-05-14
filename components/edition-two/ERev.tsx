"use client";

import { useEffect, useRef, useState } from "react";
import s from "@/app/edition-two/edition.module.css";

/**
 * Edition Two reveal — opacity 0/translateY(40px) → 0,0 on viewport entry.
 * One curve (cubic-bezier(0.22, 1, 0.36, 1)), 900ms, collapses to instant
 * under prefers-reduced-motion (handled in edition.module.css).
 */
export function ERev({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${s.reveal} ${visible ? s.visible : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
