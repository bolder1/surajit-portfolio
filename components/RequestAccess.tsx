"use client";

import { useState } from "react";
import { Button } from "./Button";

interface RequestAccessProps {
  projectTitle: string;
}

/**
 * "Request access" button used on locked case studies.
 * Opens a mailto with a pre-filled body so the request hits Surajit's inbox
 * directly. No backend required for this version — keeps deployment simple.
 *
 * Both buttons go through the shared Button primitive so the white-on-dark
 * label/icon contrast rule is enforced in one place.
 */
export function RequestAccess({ projectTitle }: RequestAccessProps) {
  const [copied, setCopied] = useState(false);

  const subject = encodeURIComponent(`Case study request: ${projectTitle}`);
  const body = encodeURIComponent(
    `Hi Surajit,\n\nI'd like to read the full case study for "${projectTitle}".\n\nA bit about me: \n[your name, role, company]\n\nThanks,\n`
  );
  const href = `mailto:surajit3255@gmail.com?subject=${subject}&body=${body}`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("surajit3255@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button href={href} variant="primary" size="md">
        Request full case study
      </Button>
      <Button onClick={copyEmail} variant="outlined" size="md" noIcon>
        {copied ? "Email copied ✓" : "Copy email"}
      </Button>
    </div>
  );
}
