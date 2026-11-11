import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HomeDictionary } from "@/i18n/home";
import type { ProjectView } from "./content";
import { textLink } from "./ui";

// Lista editorial dos projetos. Os links apontam para a página do projeto (funciona sem JS,
// com ctrl/cmd-clique e para buscadores); com JS, o ProjectDialog intercepta o clique
// em [data-project] e abre o painel na própria home.
export function ProjectList({ projects, ui }: { projects: ProjectView[]; ui: HomeDictionary }) {
  return (
    <ol>
      {projects.map((project) => {
        const meta = [project.category, project.status, project.academic].filter(Boolean).join(" · ");
        return (
          <li key={project.slug} className="border-b border-border py-7 first:pt-0 last:border-b-0 last:pb-0">
            <article aria-labelledby={`project-${project.slug}`}>
              {meta && <p className="text-caption text-foreground-muted">{meta}</p>}
              <h3 id={`project-${project.slug}`} className="mt-1.5 font-display text-subtitle font-medium">
                {project.href ? (
                  <a href={project.href} data-project={project.slug} className="transition-colors hover:text-primary">
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-2 max-w-measure text-pretty">{project.description}</p>
              {project.keyTechnologies.length > 0 && (
                <p className="mt-3 text-small text-foreground-muted">
                  <span className="sr-only">{ui.projects.stack}: </span>
                  {project.keyTechnologies.join(" · ")}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-6 text-small">
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
            </article>
          </li>
        );
      })}
    </ol>
  );
}
