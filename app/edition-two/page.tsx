import { EditionTwo } from "@/components/edition-two/EditionTwo";
import { EditionSwitcher } from "@/components/edition-two/EditionSwitcher";

/**
 * Folio · Edition Two — a parallel cinematic dark edition of the
 * portfolio that pulls the same facts as the cream editorial home
 * but rebuilds the IA on a deep warm-carbon stage with oversized
 * type and scroll-triggered reveals.
 */
export default function EditionTwoPage() {
  return (
    <>
      <EditionSwitcher />
      <EditionTwo />
    </>
  );
}
