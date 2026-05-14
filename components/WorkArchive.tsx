"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project, ProjectCategory } from "@/lib/types";

const FILTERS: (ProjectCategory | "All")[] = [
  "All",
  "Enterprise SaaS",
  "Design System",
  "Mobile App",
  "Web App",
  "Website",
];

export function WorkArchive({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  /* Group by year so the archive reads like back-issues */
  const byYear = useMemo(() => {
    const map = new Map<string, Project[]>();
    filtered.forEach((p) => {
      const yr = p.year.split(/\s|—|→/)[0] || p.year;
      if (!map.has(yr)) map.set(yr, []);
      map.get(yr)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <section className="max-w-page mx-auto px-6 md:px-10 mt-10 md:mt-14">
      {/* Filter strip — newspaper section selector */}
      <div className="border-y-2 border-[var(--rule)] py-4 flex flex-wrap items-center gap-2 mb-12">
        <span className="mono text-[var(--accent)] mr-3">▸ FILTER BY</span>
        {FILTERS.map((f) => {
          const active = f === filter;
          const count =
            f === "All"
              ? projects.length
              : projects.filter((p) => p.category === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`mono inline-flex items-center min-h-[36px] px-3.5 py-1.5 transition-colors border ${
                active
                  ? "bg-[var(--ink)] !text-white border-[var(--ink)] [&_*]:!text-white"
                  : "border-[var(--rule-soft)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
              aria-pressed={active}
            >
              {f} <span className="opacity-60 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Year-grouped listings */}
      <div className="space-y-16 md:space-y-20">
        {byYear.map(([year, items]) => (
          <div key={year}>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="display text-[14vw] md:text-[8vw] lg:text-[120px] tracking-tightest leading-none">
                {year}
              </h2>
              <span className="mono">
                {items.length}{" "}
                {items.length === 1 ? "PROJECT" : "PROJECTS"}
              </span>
            </div>

            {/* Column heads */}
            <div className="hidden md:grid grid-cols-12 gap-6 mono pb-3 border-b-2 border-[var(--rule)]">
              <span className="col-span-1">№</span>
              <span className="col-span-5">PROJECT</span>
              <span className="col-span-3">CATEGORY</span>
              <span className="col-span-2">ROLE</span>
              <span className="col-span-1 text-right">→</span>
            </div>

            <ul>
              {items.map((p, i) => (
                <li key={p.slug}>
                  <ProjectRow index={i} project={p} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="display-italic text-3xl text-[var(--muted)]">
            Nothing in this section yet.
          </p>
          <button
            type="button"
            onClick={() => setFilter("All")}
            className="mt-6 mono link"
          >
            ← BACK TO ALL WORK
          </button>
        </div>
      )}
    </section>
  );
}

function ProjectRow({ index, project }: { index: number; project: Project }) {
  const isExternal = project.access === "external";
  /* If the figmaUrl is a same-origin path (starts with "/") we treat
     it as an internal link instead of a new-tab Figma file. Lets us
     point an "external" project at a custom in-portfolio page like
     /cheeese-bento without changing the underlying schema. */
  const isInternalRedirect =
    isExternal && (project.figmaUrl?.startsWith("/") ?? false);
  const Wrapper: React.ElementType = isExternal && !isInternalRedirect ? "a" : Link;
  const props =
    isExternal && !isInternalRedirect
      ? { href: project.figmaUrl ?? "#", target: "_blank", rel: "noreferrer" }
      : isInternalRedirect
        ? { href: project.figmaUrl ?? "#" }
        : { href: `/work/${project.slug}` };

  return (
    <Wrapper
      {...props}
      className="group block border-b border-[var(--rule-soft)] py-5 md:py-7 hover:bg-[var(--paper-2)] transition-colors"
    >
      <div className="md:grid md:grid-cols-12 md:gap-6 md:items-baseline">
        <span className="md:col-span-1 mono block md:inline">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="md:col-span-5 mt-1 md:mt-0">
          <h3 className="display text-[24px] md:text-[28px] lg:text-[32px] tracking-tightest leading-tight">
            {project.title}
            {project.confidential && (
              <span className="display-italic text-[var(--muted)] text-[16px] md:text-[18px] ml-3 align-baseline">
                (NDA)
              </span>
            )}
            {isExternal && (
              <span className="display-italic text-[var(--muted)] text-[16px] md:text-[18px] ml-3 align-baseline">
                ↗ Figma
              </span>
            )}
          </h3>
          <p className="body-prose-sm mt-1">{project.subtitle}</p>
        </div>
        <span className="md:col-span-3 mono mt-3 md:mt-0 block md:inline">
          {project.category}
        </span>
        <span className="md:col-span-2 mono mt-1 md:mt-0 block md:inline">
          {project.role}
        </span>
        <span
          aria-hidden
          className="md:col-span-1 hidden md:inline-block text-right display text-2xl text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-2 transition-all"
        >
          →
        </span>
      </div>
    </Wrapper>
  );
}
