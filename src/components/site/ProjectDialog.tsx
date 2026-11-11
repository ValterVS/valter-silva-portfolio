"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { HomeDictionary } from "@/i18n/home";
import { cx } from "@/lib/styles";
import type { ProjectView } from "./content";
import { ProjectDetail } from "./ProjectDetail";
import { textLink } from "./ui";

type Labels = HomeDictionary["project"];

// O projeto aberto fica na URL (?project=slug): o link pode ser compartilhado e o "voltar" do navegador fecha o painel.
// Sem JS, os links da lista levam à página completa /projects/<slug>, com o mesmo conteúdo (ProjectDetail).
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

// Barra fixa do painel: link para a página completa e botão de fechar (recebe o foco ao abrir).
function ProjectPanel({ project, labels }: { project: ProjectView; labels: Labels }) {
  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-gutter py-2">
        {project.href ? (
          <a href={project.href} className={`${textLink} inline-flex min-h-11 items-center gap-1.5 text-small`}>
            {labels.page}
            <span className="sr-only">: {project.title}</span>
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        ) : (
          <span />
        )}
        <button
          type="button"
          data-dialog-close
          onClick={closeProject}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-control border border-border-strong px-3 text-small transition-colors hover:border-foreground"
        >
          <X size={16} aria-hidden="true" />
          {labels.close}
        </button>
      </div>
      <div className="px-gutter pt-8 pb-12">
        <ProjectDetail project={project} labels={labels} variant="dialog" titleId="project-title" />
      </div>
    </>
  );
}

export function ProjectDialog({ projects, labels }: { projects: ProjectView[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const slug = useSyncExternalStore(subscribe, currentSlug, () => null);
  const open = projects.find((project) => project.slug === slug) ?? null;

  // Quem abriu o painel (link da lista) e qual projeto estava aberto, para devolver o foco ao fechar.
  const opener = useRef<HTMLElement | null>(null);
  const shownSlug = useRef<string | null>(null);
  // O evento "close" chega depois, numa tarefa separada. Marcamos quando o fechamento partiu daqui
  // (URL já sem ?project=) para não confundi-lo com um Escape e voltar o histórico uma vez a mais.
  const closingFromUrl = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open) {
      shownSlug.current = open.slug;
      if (!element.open) {
        element.showModal();
        // Foco inicial no botão Fechar (o navegador focaria o primeiro link do painel).
        element.querySelector<HTMLElement>("[data-dialog-close]")?.focus();
      }
      return;
    }
    if (element.open) {
      closingFromUrl.current = true;
      element.close();
    }
    if (!shownSlug.current) return;
    // Vale para todas as formas de fechar (Escape, botão, Voltar, clique fora). Aberto pela URL
    // direta, não há quem o tenha aberto: o foco vai para o título do projeto na lista.
    const fromUrl = !opener.current;
    const target = opener.current ?? document.querySelector<HTMLElement>(`#project-${shownSlug.current} a`);
    opener.current = null;
    shownSlug.current = null;
    target?.focus({ preventScroll: !fromUrl });
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
      opener.current = link ?? null;
      openProject(target);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [projects]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-title"
      onClose={() => {
        if (closingFromUrl.current) {
          closingFromUrl.current = false;
          return;
        }
        // Fechado pelo navegador (Escape): sincroniza a URL.
        if (currentSlug()) closeProject();
      }}
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
