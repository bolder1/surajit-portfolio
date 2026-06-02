import type { Metadata } from "next";
import { AIOrchestrationV5 } from "@/components/v5/AIOrchestrationV5";

export const metadata: Metadata = {
  title: "AI Orchestration — Surajit Dutta",
  description:
    "How I orchestrate Claude, Figma Make AI, Cursor and the rest of the stack into a repeatable design workflow.",
};

/** /ai — the full AI orchestration page. Inherits the v5 layout. */
export default function V5AIPage() {
  return <AIOrchestrationV5 />;
}
