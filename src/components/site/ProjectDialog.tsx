"use client";

import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import type { HomeDictionary } from "@/i18n/home";
import { cx } from "@/lib/styles";
import type { ProjectView } from "./content";
import { textLink } from "./ui";

type Labels = HomeDictionary["dialog"];

// O projeto aberto fica na URL (?project=slug): o link pode ser compartilhado e o "voltar" do navegador fecha o painel.
// Lógica herdada do painel anterior (ProjectShowcase); o refinamento completo fica para a Etapa 3.
const changeEvent = "projectchange";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

const currentSlug = () => new URLSearchParams(window.location.search).get("project");

function openProject(slug: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("project", slug);
  window.history.pushState({ project: slug }, "", url);
  window.dispatchEvent(new Event(changeEvent));
}

function closeProject() {
  if (window.history.state?.project) {
    window.history.back();
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("project");
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(changeEvent));
}

function Gallery({ project, labels }: { project: ProjectView; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const images = project.gallery;
  const total = images.length;
  const step = (delta: number) => setIndex((current) => (current + delta + total) % total);

  function onKeyDown(event: KeyboardEvent) {
    if (total < 2) return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  // Sem captura real, não há galeria (nada de imagem provisória).
  if (total === 0) return null;

  const control =
    "grid size-11 place-items-center rounded-control border border-border-strong bg-background text-foreground transition-colors hover:border-foreground";

  return (
    <div role="group" aria-roledescription="carousel" aria-label={labels.gallery} onKeyDown={onKeyDown} className="mt-8">
      <div className="relative aspect-video overflow-hidden border border-border bg-background-subtle">
        <Image
          src={images[index]}
          alt={`${project.title} — ${index + 1}/${total}`}
          fill
          sizes="(min-width: 768px) 44rem, 100vw"
          className="object-cover"
        />
      </div>
      {total > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={control}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <p aria-live="polite" className="text-small text-foreground-muted tabular-nums">
            {index + 1} / {total}
          </p>
          <button type="button" onClick={() => step(1)} aria-label={labels.next} className={control}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-5">
      <h3 className="text-small font-semibold">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function ProjectPanel({ project, labels }: { project: ProjectView; labels: Labels }) {
  const meta = [project.category, project.status, project.academic, project.year].filter(Boolean).join(" · ");

  return (
    <div className="px-gutter pb-12">
      <div className="sticky top-0 z-10 -mx-gutter flex items-center justify-between gap-4 border-b border-border bg-background px-gutter py-2">
        <p className="text-caption text-foreground-muted">{meta}</p>
        <button
          type="button"
          autoFocus
          onClick={closeProject}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-control border border-border-strong px-3 text-small transition-colors hover:border-foreground"
        >
          <X size={16} aria-hidden="true" />
          {labels.close}
        </button>
      </div>

      <h2 id="project-title" className="mt-8 font-display text-title font-medium">
        {project.title}
      </h2>
      <p className="mt-4 text-lead text-pretty text-foreground-muted">{project.description}</p>

      <Gallery project={project} labels={labels} />

      <div className="mt-10 space-y-8">
        {project.problem && (
          <Block title={labels.problem}>
            <p className="text-pretty">{project.problem}</p>
          </Block>
        )}
        {project.solution && (
          <Block title={labels.solution}>
            <p className="text-pretty">{project.solution}</p>
          </Block>
        )}
        {project.role.length > 0 && (
          <Block title={labels.role}>
            <ul className="space-y-1.5">
              {project.role.map((item) => (
                <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)] text-pretty">
                  <span aria-hidden="true" className="text-foreground-muted">
                    –
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Block>
        )}
        {project.technologies.length > 0 && (
          <Block title={labels.stack}>
            <p>{project.technologies.join(" · ")}</p>
          </Block>
        )}
      </div>

      {(project.github || project.live || project.href) && (
        <div className="mt-10 flex flex-wrap gap-x-6 border-t border-border pt-3 text-small">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className={`${textLink} inline-flex min-h-11 items-center gap-1.5`}>
              GitHub
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className={`${textLink} inline-flex min-h-11 items-center gap-1.5`}>
              {labels.live}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {project.href && (
            <a href={project.href} className={`${textLink} inline-flex min-h-11 items-center gap-1.5`}>
              {labels.page}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectDialog({ projects, labels }: { projects: ProjectView[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const slug = useSyncExternalStore(subscribe, currentSlug, () => null);
  const open = projects.find((project) => project.slug === slug) ?? null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  // Clique normal em um link [data-project] da lista abre o painel; ctrl/cmd/shift-clique
  // e clique do meio continuam abrindo a página completa do projeto.
  useEffect(() => {
    const slugs = new Set(projects.map((project) => project.slug));
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-project]");
      const target = link?.dataset.project;
      if (!target || !slugs.has(target)) return;
      event.preventDefault();
      openProject(target);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [projects]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-title"
      onClose={() => currentSlug() && closeProject()}
      onClick={(event) => event.target === event.currentTarget && closeProject()}
      className={cx(
        "m-0 ml-auto h-dvh max-h-dvh w-full max-w-[min(48rem,100vw)] overflow-y-auto overscroll-contain border-l border-border bg-background p-0 text-foreground",
        "open:animate-[drawer-in_0.25s_ease-out] backdrop:bg-foreground/40",
      )}
    >
      {open && <ProjectPanel key={open.slug} project={open} labels={labels} />}
    </dialog>
  );
}
