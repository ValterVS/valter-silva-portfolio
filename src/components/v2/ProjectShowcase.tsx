"use client";

import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import { cx } from "@/lib/styles";
import type { ImmersiveContent } from "./content";

type Project = ImmersiveContent["projects"][number];
type Labels = ImmersiveDictionary["work"];

// O projeto aberto fica na URL (?project=slug): o link pode ser compartilhado e o "voltar" do navegador fecha o painel.
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

function Shot({ src, alt, sizes, placeholder, className }: { src?: string; alt: string; sizes: string; placeholder: string; className?: string }) {
  if (src) {
    return (
      <div className={cx("relative overflow-hidden bg-fg/[0.03]", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
      </div>
    );
  }
  // Espaço reservado assumidamente provisório, até a captura real ser adicionada em src/data/projects.ts.
  return (
    <div
      className={cx(
        "relative grid place-items-center overflow-hidden border border-dashed border-fg/15 bg-[radial-gradient(circle_at_30%_20%,rgb(214_166_64/0.08),transparent_60%)]",
        className,
      )}
    >
      <span aria-hidden="true" className="text-outline px-6 text-center text-[clamp(1.5rem,3vw,2.5rem)] font-semibold text-fg/25 uppercase">
        {alt}
      </span>
      <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.25em] text-faint uppercase">{placeholder}</span>
    </div>
  );
}

function Trigger({ project, className, children }: { project: Project; className: string; children: ReactNode }) {
  // Clique normal abre o painel; ctrl/cmd-clique e o link em si continuam levando à página do projeto.
  function onClick(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openProject(project.slug);
  }

  if (project.href) {
    return (
      <a href={project.href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => openProject(project.slug)} className={cx(className, "text-left")}>
      {children}
    </button>
  );
}

function meta(project: Project) {
  return [project.status, project.academic, project.year].filter(Boolean).join(" · ");
}

function Gallery({ project, labels }: { project: Project; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const images = project.gallery;
  const total = images.length;
  const step = (delta: number) => setIndex((current) => (current + delta + total) % total);

  function onKeyDown(event: KeyboardEvent) {
    if (total < 2) return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  if (total === 0) {
    return <Shot alt={project.title} sizes="100vw" placeholder={labels.drawer.placeholder} className="aspect-video rounded-2xl" />;
  }

  return (
    <div role="group" aria-roledescription="carousel" aria-label={labels.drawer.gallery} onKeyDown={onKeyDown}>
      <div className="relative">
        <Shot
          src={images[index]}
          alt={`${project.title} — ${index + 1}/${total}`}
          sizes="(min-width: 1024px) 60rem, 100vw"
          placeholder=""
          className="aspect-video rounded-2xl"
        />
        {total > 1 && (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <button type="button" onClick={() => step(-1)} aria-label={labels.drawer.previous} className="grid size-10 place-items-center rounded-full bg-ink/80 text-fg backdrop-blur transition-colors hover:text-gold">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label={labels.drawer.next} className="grid size-10 place-items-center rounded-full bg-ink/80 text-fg backdrop-blur transition-colors hover:text-gold">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {total > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, thumb) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(thumb)}
                aria-label={`${thumb + 1}/${total}`}
                aria-current={thumb === index}
                className={cx(
                  "relative block h-14 w-24 overflow-hidden rounded-lg border transition-colors",
                  thumb === index ? "border-gold" : "border-fg/10 opacity-60 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectPanel({ project, labels }: { project: Project; labels: Labels }) {
  const story = [
    { title: labels.drawer.problem, text: project.problem },
    { title: labels.drawer.solution, text: project.solution },
  ].filter((item) => item.text);

  return (
    <div className="px-5 pb-12 sm:px-10">
      <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between gap-4 bg-ink/90 px-5 py-4 backdrop-blur sm:-mx-10 sm:px-10">
        <p className="font-mono text-[11px] tracking-[0.25em] text-gold uppercase">{meta(project)}</p>
        <button
          type="button"
          autoFocus
          onClick={closeProject}
          className="inline-flex items-center gap-2 rounded-full border border-fg/15 px-4 py-2 text-sm text-fg transition-colors hover:border-gold hover:text-gold"
        >
          <X size={15} aria-hidden="true" />
          {labels.drawer.close}
        </button>
      </div>

      <h2 id="project-title" className="mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.04em] uppercase">
        {project.title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-fg/80">{project.description}</p>

      <div className="mt-8">
        <Gallery project={project} labels={labels} />
      </div>

      {story.length > 0 && (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {story.map((item) => (
            <section key={item.title}>
              <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-pretty text-fg/80">{item.text}</p>
            </section>
          ))}
        </div>
      )}

      {project.role.length > 0 && (
        <section className="mt-10">
          <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{labels.drawer.role}</h3>
          <ul className="mt-3 space-y-2">
            {project.role.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-fg/80">
                <span className="mt-3 h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.technologies.length > 0 && (
        <section className="mt-10">
          <h3 className="font-mono text-[11px] tracking-[0.3em] text-faint uppercase">{labels.drawer.stack}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="rounded-full border border-fg/15 px-3 py-1 text-sm text-fg/80">
                {tech}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(project.live || project.github || project.href) && (
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-fg/10 pt-8">
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-soft">
              {labels.drawer.live}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-fg/20 px-5 py-2.5 text-sm text-fg transition-colors hover:border-gold hover:text-gold">
              GitHub
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {project.href && (
            <Link href={project.href} className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm text-muted transition-colors hover:text-fg">
              {labels.drawer.page}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Cards dos projetos em destaque. Os três primeiros recebem mais espaço; clicar abre o painel na própria página.
export function ProjectShowcase({ projects, labels }: { projects: Project[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const slug = useSyncExternalStore(subscribe, currentSlug, () => null);
  const open = projects.find((project) => project.slug === slug) ?? null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const [lead, ...rest] = projects.slice(0, 3);
  const secondary = projects.slice(3);

  return (
    <>
      <ul className="mt-12 grid gap-5 lg:grid-cols-2">
        {lead && (
          <li className="lg:col-span-2">
            <Trigger project={lead} className="group grid h-full overflow-hidden rounded-3xl border border-fg/10 bg-fg/[0.02] transition-colors hover:border-gold/40 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <Shot src={lead.gallery[0]} alt={lead.title} sizes="(min-width: 1024px) 58vw, 100vw" placeholder={labels.drawer.placeholder} className="aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" />
              <CardText project={lead} labels={labels} large />
            </Trigger>
          </li>
        )}
        {rest.map((project) => (
          <li key={project.slug}>
            <Trigger project={project} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-fg/10 bg-fg/[0.02] transition-colors hover:border-gold/40">
              <Shot src={project.gallery[0]} alt={project.title} sizes="(min-width: 1024px) 45vw, 100vw" placeholder={labels.drawer.placeholder} className="aspect-[16/10]" />
              <CardText project={project} labels={labels} />
            </Trigger>
          </li>
        ))}
      </ul>

      {secondary.length > 0 && (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((project) => (
            <li key={project.slug}>
              <Trigger project={project} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-fg/10 bg-fg/[0.02] transition-colors hover:border-gold/40">
                <Shot src={project.gallery[0]} alt={project.title} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" placeholder={labels.drawer.placeholder} className="aspect-video" />
                <CardText project={project} labels={labels} compact />
              </Trigger>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="project-title"
        onClose={() => currentSlug() && closeProject()}
        onClick={(event) => event.target === event.currentTarget && closeProject()}
        className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-[min(64rem,100vw)] overflow-y-auto overscroll-contain border-l border-fg/10 bg-ink p-0 text-fg open:animate-[drawer-in_0.35s_cubic-bezier(0.22,1,0.36,1)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {open && <ProjectPanel key={open.slug} project={open} labels={labels} />}
      </dialog>
    </>
  );
}

function CardText({ project, labels, large, compact }: { project: Project; labels: Labels; large?: boolean; compact?: boolean }) {
  return (
    <div className={cx("flex flex-1 flex-col", compact ? "p-5" : "p-6 sm:p-8")}>
      <p className="font-mono text-[10px] tracking-[0.25em] text-faint uppercase">{meta(project)}</p>
      <h3
        className={cx(
          "mt-3 font-semibold tracking-[-0.03em] uppercase transition-colors group-hover:text-gold-soft",
          large ? "text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95]" : compact ? "text-xl" : "text-[clamp(1.75rem,3vw,2.5rem)] leading-none",
        )}
      >
        {project.title}
      </h3>
      <p className={cx("mt-3 leading-relaxed text-pretty text-muted", compact ? "text-sm" : "text-[15px]")}>{project.description}</p>
      {!compact && project.technologies.length > 0 && (
        <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.18em] text-faint uppercase">
          {project.technologies.slice(0, 4).join(" / ")}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm text-fg/80 transition-colors group-hover:text-gold">
        {labels.open}
        <ArrowRight size={14} aria-hidden="true" />
      </span>
    </div>
  );
}
