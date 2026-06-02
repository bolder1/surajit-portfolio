import type { Metadata } from "next";
import { WorkPageV5 } from "@/components/v5/WorkPageV5";

export const metadata: Metadata = {
  title: "Work — Surajit Dutta",
  description: "The full archive of Surajit Dutta's product design work across enterprise SaaS, mobile, web and design systems.",
};

/** /work — the full work archive. Inherits the root layout. */
export default function WorkPage() {
  return <WorkPageV5 />;
}
