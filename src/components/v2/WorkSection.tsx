"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";

type Project = ImmersiveContent["projects"][number];

const linkClass =
  "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.25em] text-fg/80 uppercase transition-colors hover:text-gold";

function ProjectLinks({ project, labels }: { project: Project; labels: ImmersiveContent["labels"] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {project.href && (
        <Link href={project.href} className={linkClass}>
          {labels.details}
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" className={linkClass}>
          GitHub
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" className={linkClass}>
          {labels.liveDemo}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function ProjectPanel({ project, index, labels }: { project: Project; index: number; labels: ImmersiveContent["labels"] }) {
  const panel = useRef<HTMLElement>(null);

  // O título acompanha levemente o cursor dentro do painel.
  function track(event: PointerEvent<HTMLElement>) {
    const element = panel.current;
    if (!element || event.pointerType !== "mouse") return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", String((event.clientX - rect.left) / rect.width - 0.5));
    element.style.setProperty("--my", String((event.clientY - rect.top) / rect.height - 0.5));
  }

  function reset() {
    panel.current?.style.setProperty("--mx", "0");
    panel.current?.style.setProperty("--my", "0");
  }

  const meta = [project.status, project.academic, project.year].filter(Boolean).join(" · ");

  return (
    <article
      ref={panel}
      onPointerMove={track}
      onPointerLeave={reset}
      className="group relative grid gap-10 border-t border-fg/10 py-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16 lg:py-24"
    >
      <div>
        <p className="font-mono text-xs tracking-[0.3em] text-gold">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-4 text-[clamp(2.6rem,7.5vw,7.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] break-words uppercase transition-[color,transform] duration-500 ease-out group-hover:text-gold-soft lg:translate-x-[calc(var(--mx,0)*18px)] lg:translate-y-[calc(var(--my,0)*10px)]">
          {project.title}
        </h3>
        {project.image && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-fg/10">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-end gap-6 lg:pb-3">
        {meta && <p className="font-mono text-[11px] tracking-[0.25em] text-faint uppercase">{meta}</p>}
        <p className="max-w-md text-[17px] leading-relaxed text-pretty text-fg/80">{project.description}</p>
        {project.technologies.length > 0 && (
          <p className="max-w-md font-mono text-[11px] leading-relaxed tracking-[0.18em] text-muted uppercase transition-colors duration-500 group-hover:text-fg/90">
            {project.technologies.join(" / ")}
          </p>
        )}
        <ProjectLinks project={project} labels={labels} />
      </div>
    </article>
  );
}

export function WorkSection({ ui, content }: { ui: ImmersiveDictionary; content: ImmersiveContent }) {
  const featured = content.projects.filter((project) => project.featured);

  return (
    <section id="work" aria-labelledby="work-title" className="relative px-5 py-28 sm:px-8 lg:px-14">
      <Reveal>
        <Eyebrow index="04">{ui.work.eyebrow}</Eyebrow>
        <h2 id="work-title" className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          {ui.work.title}
        </h2>
      </Reveal>

      <div className="mt-12">
        {featured.map((project, index) => (
          <Reveal key={project.slug}>
            <ProjectPanel project={project} index={index} labels={content.labels} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20">
        <h3 className="font-mono text-[11px] tracking-[0.3em] text-gold uppercase">{ui.work.all}</h3>
        <ul className="mt-6 border-t border-fg/10">
          {content.projects.map((project, index) => {
            const href = project.href ?? project.github;
            const meta = [project.status, project.academic, project.year].filter(Boolean).join(" · ");
            const row = (
              <>
                <span className="w-8 shrink-0 font-mono text-xs text-faint">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 text-lg font-medium uppercase tracking-tight transition-colors group-hover:text-gold-soft sm:text-xl">
                  {project.title}
                </span>
                <span className="hidden font-mono text-[10px] tracking-[0.2em] text-faint uppercase md:block">{meta}</span>
                {href && (
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                  />
                )}
              </>
            );
            const rowClass = "group flex items-center gap-4 border-b border-fg/10 py-5";
            return (
              <li key={project.slug}>
                {!href ? (
                  <div className={rowClass}>{row}</div>
                ) : project.href ? (
                  <Link href={href} className={rowClass}>
                    {row}
                  </Link>
                ) : (
                  <a href={href} target="_blank" rel="noreferrer" className={rowClass}>
                    {row}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href={content.links.repositories}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-fg uppercase transition-colors hover:text-gold"
        >
          {ui.work.viewAll}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
