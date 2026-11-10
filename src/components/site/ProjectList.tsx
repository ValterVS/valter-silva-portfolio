import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HomeDictionary } from "@/i18n/home";
import type { ProjectView } from "./content";
import { textLink } from "./ui";

// Lista editorial dos projetos. Os links apontam para a página do projeto (funciona sem JS,
// com ctrl/cmd-clique e para buscadores); com JS, o ProjectDialog intercepta o clique
// em [data-project] e abre o painel na própria home.
export function ProjectList({ projects, ui }: { projects: ProjectView[]; ui: HomeDictionary }) {
  return (
    <ol className="-mt-8">
      {projects.map((project, index) => {
        const meta = [project.category, project.status, project.academic].filter(Boolean).join(" · ");
        return (
          <li key={project.slug} className="border-b border-border py-8 last:border-b-0">
            <article aria-labelledby={`project-${project.slug}`} className="grid gap-x-6 gap-y-2 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
              <span aria-hidden="true" className="font-display text-heading text-foreground-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                {meta && <p className="text-caption text-foreground-muted">{meta}</p>}
                <h3 id={`project-${project.slug}`} className="mt-2 font-display text-[1.75rem] leading-tight font-medium">
                  {project.href ? (
                    <a href={project.href} data-project={project.slug} className="transition-colors hover:text-primary">
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="mt-3 max-w-measure text-pretty text-foreground-muted">{project.description}</p>
                {project.keyTechnologies.length > 0 && (
                  <p className="mt-4 text-small">
                    <span className="sr-only">{ui.projects.stack}: </span>
                    {project.keyTechnologies.join(" · ")}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-x-6 text-small">
                  {project.href && (
                    <a href={project.href} data-project={project.slug} className={`${textLink} inline-flex min-h-11 items-center gap-1.5`}>
                      {ui.projects.details}
                      <span className="sr-only">: {project.title}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className={`${textLink} inline-flex min-h-11 items-center gap-1.5`}>
                      {ui.projects.code}
                      <span className="sr-only">: {project.title} (GitHub)</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
