import type { Metadata } from "next";
import { GalleryMacV5 } from "@/components/v5/GalleryMacV5";

export const metadata: Metadata = {
  title: "Gallery — Surajit Dutta",
  description:
    "The full body of work — a Macintosh-desktop gallery of everything Surajit Dutta has shipped.",
};

/** /gallery — the immersive "Macintosh desktop" gallery. Inherits the v5 layout. */
export default function V5GalleryPage() {
  return <GalleryMacV5 />;
}
