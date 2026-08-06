"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { ShaderWipeTransition } from "@/components/v5/ShaderWipeTransition";

type Lenis = { scrollTo: (t: number, o?: { immediate?: boolean }) => void };
const lenis = () => (window as unknown as { lenis?: Lenis }).lenis;

/**
 * PageTransition — the displacement wipe, wired to route changes.
 *
 * The wipe holds the outgoing page until it is fully covered, swaps
 * underneath, then carries on out. Holding is the whole point: a route change
 * that swaps in the open is a flash, and no overlay hides a flash that has
 * already happened.
 *
 * ## Why this intercepts clicks
 *
 * The router scrolls to the top the instant a new route commits — while the
 * outgoing page is still on screen and only partly covered, so the page you
 * are leaving visibly snaps to its top before being wiped away.
 *
 * Trying to undo that after the fact does not work, and both attempts are
 * worth recording so nobody repeats them:
 *
 * - An effect plus a rAF loop restored the position two frames late, which
 *   painted the jump *and then* jumped back. A double flicker, worse than the
 *   artifact it replaced.
 * - A layout effect ran *before* the router's own scroll, so the router simply
 *   overwrote it and the rAF loop was still late.
 *
 * So the reset is never allowed to happen. A capture-phase listener claims
 * internal link clicks before Next's own handler sees them and routes with
 * `scroll: false`. Scroll then belongs entirely to this component, and it is
 * moved once, at full cover, where nothing can be seen moving.
 *
 * It also means a plain `<a href="/…">` anywhere in the tree gets client-side
 * routing and the transition, rather than a full document reload.
 *
 * Back and forward are left alone: the browser restores the position the
 * reader left, and forcing those to the top would throw that away.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const popped = useRef(false);

  useEffect(() => {
    // Mark history navigations so the cover handler leaves their scroll alone.
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);

    const onClick = (e: MouseEvent) => {
      // Anything the browser treats as "open elsewhere" stays the browser's.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      // Same-document hashes, downloads, new tabs and external hosts are all
      // somebody else's job. Only in-app routes are claimed.
      if (
        !href ||
        !href.startsWith("/") ||
        a.hasAttribute("download") ||
        (a.getAttribute("target") ?? "") === "_blank"
      ) {
        return;
      }
      if (href === window.location.pathname) return;

      e.preventDefault();
      // Capture phase plus stopPropagation, so Next's own Link handler never
      // runs — otherwise it would route a second time, with scroll reset on.
      e.stopPropagation();
      popped.current = false;
      router.push(href, { scroll: false });
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [router]);

  // Full cover: the one moment nothing on screen is visible, so the only
  // moment it is safe to move the page.
  const onCover = useCallback(() => {
    if (popped.current) {
      popped.current = false;
      return;
    }
    const l = lenis();
    if (l) l.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, []);

  return (
    <ShaderWipeTransition transitionKey={pathname} onCover={onCover}>
      {children}
    </ShaderWipeTransition>
  );
}
