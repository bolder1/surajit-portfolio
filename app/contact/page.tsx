import type { Metadata } from "next";
import { ContactPageV5 } from "@/components/v5/ContactPageV5";

export const metadata: Metadata = {
  title: "Contact — Surajit Dutta",
  description: "Get in touch with Surajit Dutta — product designer for enterprise IT, identity and security teams.",
};

/** /contact — dedicated contact page. Inherits the root layout. */
export default function ContactPage() {
  return <ContactPageV5 />;
}
