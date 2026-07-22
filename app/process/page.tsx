import type { Metadata } from "next";
import { ProcessShowcaseV5 } from "@/components/v5/ProcessShowcaseV5";

export const metadata: Metadata = {
  title: "Real-time builds — Surajit Dutta",
  description:
    "How Surajit Dutta ships real products in days: stakeholder requirements → PRD → Figma prototype → Claude Code build → client demo → developer handoff. ITDR, CARE, DPDP Compliance, Function OS, healthcare.",
};

/** /process — the real-time engagement loop, stage by stage. */
export default function ProcessPage() {
  return <ProcessShowcaseV5 />;
}
