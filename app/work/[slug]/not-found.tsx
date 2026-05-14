import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { Folio } from "@/components/Folio";

export default function NotFound() {
  return (
    <>
      <Masthead variant="compact" />
      <main
        id="main"
        className="min-h-[70vh] flex items-center border-b border-[var(--rule)]"
      >
        <div className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-32">
          <div className="section-tag mb-8">▸ ERROR &middot; № 404</div>
          <h1 className="display text-[14vw] md:text-[10vw] lg:text-[160px] tracking-tightest leading-[0.88] mb-8">
            That project{" "}
            <span className="display-italic text-[var(--accent)]">
              isn&rsquo;t in this issue
            </span>
            .
          </h1>
          <p className="body-prose max-w-md mb-10 drop-cap">
            The page you tried may have moved, gone private, or never existed.
            Head back and pick something from the archive.
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 bg-[var(--ink)] text-white px-5 py-3 mono hover:bg-[var(--accent)] transition-colors"
          >
            BACK TO THE ARCHIVE <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
      <Folio pageNum="404" />
    </>
  );
}
