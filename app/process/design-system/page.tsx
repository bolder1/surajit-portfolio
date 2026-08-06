import type { Metadata } from "next";
import { DesignSystemCase } from "@/components/v5/ds/DesignSystemCase";
import { M } from "@/lib/designSystem/metrics";

/**
 * /process/design-system
 *
 * A static segment, so it outranks /process/[slug] and the generic case-study
 * template never sees this route. The other three process cases share that
 * template; this one does not, because its argument is made of the system's
 * own data rather than of a narrative shape the template could hold.
 */

export const metadata: Metadata = {
  title: "Central Design System — Case study",
  description: `A four-layer variable architecture behind five enterprise products: ${M.totalVariables.toLocaleString(
    "en-US"
  )} variables, ${M.buttonPublished.toLocaleString("en-US")} button variants, and a rebrand that costs ${M.rebrandCost} tokens.`,
  openGraph: {
    title: "Central Design System — Case study",
    description:
      "One binding, four resolved values. The token architecture behind IAM, PAM, IGA, UEM and ITDR.",
  },
};

export default function DesignSystemCasePage() {
  return <DesignSystemCase />;
}
