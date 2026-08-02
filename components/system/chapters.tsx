"use client";

import type { Chapter } from "@/lib/systemStory";
import { PinnedChapter } from "./PinnedChapter";
import { DriftVisual, RosterVisual, StackVisual, ScaleVisual } from "./visuals";
import { RepointVisual, DropdownVisual } from "./interactive";

/**
 * Thin client wrappers, one per chapter.
 *
 * PinnedChapter takes a render prop so a visual can read the active step, and
 * a function cannot cross the server/client boundary — so the composition
 * happens here rather than in the page. That keeps app/system/page.tsx a
 * server component, which is what lets it export metadata and prerender.
 */

export function ChapterDrift({ chapter }: { chapter: Chapter }) {
  return <PinnedChapter chapter={chapter}>{({ active }) => <DriftVisual active={active} />}</PinnedChapter>;
}

export function ChapterRoster({ chapter }: { chapter: Chapter }) {
  return <PinnedChapter chapter={chapter}>{({ active }) => <RosterVisual active={active} />}</PinnedChapter>;
}

export function ChapterStack({ chapter }: { chapter: Chapter }) {
  return <PinnedChapter chapter={chapter}>{({ active }) => <StackVisual active={active} />}</PinnedChapter>;
}

export function ChapterScale({ chapter }: { chapter: Chapter }) {
  return <PinnedChapter chapter={chapter}>{({ active }) => <ScaleVisual active={active} />}</PinnedChapter>;
}

/* The two interactive chapters ignore the scroll step — they advance when
   the reader does something, which is the whole point of them. */
export function ChapterRepoint({ chapter }: { chapter: Chapter }) {
  return <PinnedChapter chapter={chapter}>{() => <RepointVisual />}</PinnedChapter>;
}

export function ChapterDropdown({ chapter }: { chapter: Chapter }) {
  return <PinnedChapter chapter={chapter}>{() => <DropdownVisual />}</PinnedChapter>;
}
