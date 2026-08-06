/**
 * chapters — the spine of the case study, shared by the page and its trailer.
 *
 * One list, two consumers: the rail on /process/design-system and the preview
 * on the home page. When a chapter is renamed it is renamed in both places,
 * because there is only one place.
 */

export type Chapter = {
  id: string;
  no: string;
  name: string;
  /** One line, used as the trailer caption. */
  blurb: string;
  interactive?: boolean;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "audit",
    no: "01",
    name: "The audit",
    blurb: "Count first. A census turns a debate about taste into arithmetic.",
  },
  {
    id: "roster",
    no: "02",
    name: "The roster",
    blurb: "Five audiences who want the system to do contradictory things.",
  },
  {
    id: "architecture",
    no: "03",
    name: "The architecture",
    blurb: "Four layers, and the rule that nothing may reference a layer above it.",
  },
  {
    id: "mapping",
    no: "04",
    name: "The mapping",
    blurb: "One binding, resolved against brand and appearance independently.",
    interactive: true,
  },
  {
    id: "component",
    no: "05",
    name: "The component",
    blurb: "1,470 published of a possible 1,792. The difference is the argument.",
    interactive: true,
  },
  {
    id: "library",
    no: "06",
    name: "The library",
    blurb: "3,576 icons, and the components that exist to document components.",
  },
  {
    id: "workflow",
    no: "07",
    name: "The workflow",
    blurb: "Six pages per component. All six, or it does not publish.",
  },
  {
    id: "reckoning",
    no: "08",
    name: "The reckoning",
    blurb: "What auditing my own system found, and the one measurement that settles it.",
  },
];

export const READ_MINUTES = 9;
export const INTERACTIVE_COUNT = CHAPTERS.filter((c) => c.interactive).length;
