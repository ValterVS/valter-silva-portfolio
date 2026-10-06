import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ProjectCategory, ProjectStatus } from "@/data/projects";
import type { Dictionary } from "@/i18n/ui";
import { button, chip, cx } from "@/lib/styles";
import { GithubIcon } from "./icons";
import { ProjectCover } from "./ProjectCover";

export type ProjectCardData = {
  slug: string;
  title: string;
  description: string;
  categories: ProjectCategory[];
  status?: ProjectStatus;
  technologies: string[];
  github?: string;
  live?: string;
  image?: string;
  featured: boolean;
  year?: string;
  href: string | null;
};

type ProjectCardProps = {
  project: ProjectCardData;
  dict: Pick<Dictionary, "projects" | "actions">;
  large?: boolean;
};

export function ProjectBadges({
  status,
  academic,
  labels,
}: {
  status?: ProjectStatus;
  academic: boolean;
  labels: Dictionary["projects"];
}) {
  return (
    <>
      {status && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent-soft">
          <span
            className={cx("size-1.5 rounded-full", status === "in-progress" ? "animate-pulse bg-accent" : "bg-accent")}
            aria-hidden="true"
          />
          {labels.status[status]}
        </span>
      )}
      {academic && (
        <span className="inline-flex items-center rounded-full border border-line-strong bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
          {labels.academic}
        </span>
      )}
    </>
  );
}

export function ProjectCard({ project, dict, large }: ProjectCardProps) {
  const visibleTech = project.technologies.slice(0, large ? 6 : 4);
  const hiddenTech = project.technologies.length - visibleTech.length;

  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_60px_-30px_rgb(56_189_248/0.45)]">
      <div className={cx("relative overflow-hidden border-b border-line", large ? "aspect-[16/7]" : "aspect-[16/8]")}>
        <ProjectCover
          slug={project.slug}
          title={project.title}
          categories={project.categories}
          technologies={project.technologies}
          image={project.image}
          large={large}
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectBadges
            status={project.status}
            academic={project.categories.includes("academic")}
            labels={dict.projects}
          />
          {project.year && <span className="font-mono text-[11px] text-faint">{project.year}</span>}
        </div>

        <h3 className={cx("mt-3 font-semibold tracking-tight text-fg", large ? "text-xl sm:text-2xl" : "text-lg")}>
          {project.href ? (
            <Link href={project.href} className="after:absolute after:inset-0 after:content-['']">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-pretty text-muted">{project.description}</p>

        {visibleTech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <li key={tech} className={chip}>
                {tech}
              </li>
            ))}
            {hiddenTech > 0 && <li className={cx(chip, "text-faint")}>+{hiddenTech}</li>}
          </ul>
        )}

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.href && (
            <Link href={project.href} className={button.small}>
              {dict.actions.details}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className={button.small}>
              <GithubIcon size={14} />
              {dict.actions.code}
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className={button.small}>
              <ExternalLink size={14} aria-hidden="true" />
              {dict.actions.liveDemo}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
