"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { ProjectCategory } from "@/data/projects";
import type { Dictionary } from "@/i18n/ui";
import { profile } from "@/data/profile";
import { button, cx } from "@/lib/styles";
import { GithubIcon } from "./icons";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

type Filter = "all" | ProjectCategory;

const filters: Filter[] = ["all", "backend", "fullstack", "ai", "games", "academic"];

type ProjectsProps = {
  projects: ProjectCardData[];
  dict: Pick<Dictionary, "projects" | "actions">;
};

export function Projects({ projects, dict }: ProjectsProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const available = filters.filter(
    (option) => option === "all" || projects.some((project) => project.categories.includes(option)),
  );
  const visible = projects.filter((project) => filter === "all" || project.categories.includes(filter));
  const featured = visible.filter((project) => project.featured);
  const others = visible.filter((project) => !project.featured);

  return (
    <>
      <div
        role="group"
        aria-label={dict.projects.filterLabel}
        className="mb-10 flex flex-wrap gap-1"
      >
        {available.map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={cx(
                "relative h-9 rounded-full px-4 text-sm transition-colors",
                active ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {active && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full border border-accent/40 bg-accent/10"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{dict.projects.filters[option]}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 && <p className="text-muted">{dict.projects.empty}</p>}

      {featured.length > 0 && (
        <motion.ul layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {featured.map((project) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} dict={dict} large />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {others.length > 0 && (
        <div className={cx(featured.length > 0 && "mt-14")}>
          <h3 className="mb-5 font-mono text-xs tracking-[0.18em] text-faint uppercase">{dict.projects.others}</h3>
          <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {others.map((project) => (
                <motion.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={project} dict={dict} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      )}

      <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3 text-muted">
          <GithubIcon size={20} className="text-fg" />
          {profile.links.github.replace("https://", "")}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className={button.primary}>
            {dict.actions.viewGithub}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={profile.links.repositories} target="_blank" rel="noreferrer" className={button.secondary}>
            {dict.actions.allRepos}
          </a>
        </div>
      </div>
    </>
  );
}
