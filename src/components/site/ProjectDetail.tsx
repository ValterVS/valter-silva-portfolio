import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { HomeDictionary } from "@/i18n/home";
import { cx } from "@/lib/styles";
import type { ProjectView } from "./content";
import { ProjectGallery } from "./ProjectGallery";
import { textLink } from "./ui";

type Labels = HomeDictionary["project"];

type ProjectDetailProps = {
  project: ProjectView;
  labels: Labels;
  // "dialog": resumo no painel da home (título h2, seções h3).
  // "page": página completa do projeto (título h1, seções h2, inclui funcionalidades, desafios e aprendizados).
  variant: "dialog" | "page";
  titleId: string;
};

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)] text-pretty">
          <span aria-hidden="true" className="text-foreground-muted">
            –
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

// Conteúdo de um projeto, compartilhado entre o painel da home e a página /projects/<slug>.
// Sem hooks: pode ser renderizado no servidor (página) ou dentro do painel (cliente).
export function ProjectDetail({ project, labels, variant, titleId }: ProjectDetailProps) {
  const page = variant === "page";
  const Title = page ? "h1" : "h2";
  const Heading = page ? "h2" : "h3";
  const meta = [project.category, project.status, project.academic, project.year].filter(Boolean).join(" · ");

  const rows: { key: string; title: string; content: ReactNode; show: boolean }[] = [
    { key: "problem", title: labels.problem, content: <p className="text-pretty">{project.problem}</p>, show: Boolean(project.problem) },
    { key: "solution", title: labels.solution, content: <p className="text-pretty">{project.solution}</p>, show: Boolean(project.solution) },
    { key: "decisions", title: labels.decisions, content: <List items={project.decisions} />, show: project.decisions.length > 0 },
    { key: "role", title: labels.role, content: <List items={project.role} />, show: project.role.length > 0 },
    { key: "features", title: labels.features, content: <List items={project.features} />, show: page && project.features.length > 0 },
    { key: "challenges", title: labels.challenges, content: <List items={project.challenges} />, show: page && project.challenges.length > 0 },
    { key: "learnings", title: labels.learnings, content: <List items={project.learnings} />, show: page && project.learnings.length > 0 },
    {
      key: "stack",
      title: labels.stack,
      content: <p>{project.technologies.join(" · ")}</p>,
      show: project.technologies.length > 0,
    },
    {
      key: "planned",
      title: labels.planned,
      content: <p className="text-foreground-muted">{project.plannedTechnologies.join(" · ")}</p>,
      show: project.plannedTechnologies.length > 0,
    },
    { key: "authors", title: labels.authors, content: <p>{project.authors}</p>, show: Boolean(project.authors) },
  ];

  const links = [
    project.github && { href: project.github, label: labels.code },
    project.live && { href: project.live, label: labels.live },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <div className="@container">
      <header>
        {meta && <p className="text-caption text-foreground-muted">{meta}</p>}
        <Title id={titleId} className={cx("mt-2 font-display font-medium text-balance", page ? "text-display" : "text-title")}>
          {project.title}
        </Title>
        <p className="mt-4 max-w-measure text-lead text-pretty">{project.description}</p>
        {links.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 text-small">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className={`${textLink} inline-flex min-h-11 items-center gap-1.5`}>
                  {link.label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      {project.gallery.length > 0 && (
        <div className="mt-8">
          <ProjectGallery images={project.gallery} labels={labels} />
        </div>
      )}

      <div className="mt-8">
        {rows
          .filter((row) => row.show)
          .map((row) => (
            <section
              key={row.key}
              aria-labelledby={`${titleId}-${row.key}`}
              className="grid gap-x-8 gap-y-2 border-t border-border py-5 @2xl:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <Heading id={`${titleId}-${row.key}`} className="text-small font-semibold @2xl:pt-0.5">
                {row.title}
              </Heading>
              <div className="max-w-measure min-w-0">{row.content}</div>
            </section>
          ))}
      </div>
    </div>
  );
}
