import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "./FadeIn";
import type { ImmersiveDictionary } from "@/i18n/immersive";
import type { ImmersiveContent } from "./content";
import { Eyebrow } from "./Eyebrow";
import { ProjectShowcase } from "./ProjectShowcase";

type WorkProps = {
  ui: ImmersiveDictionary;
  projects: ImmersiveContent["projects"];
  repositories: string;
};

export function WorkSection({ ui, projects, repositories }: WorkProps) {
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  return (
    <section id="work" aria-labelledby="work-title" className="relative px-5 py-28 sm:px-8 lg:px-14">
      <FadeIn>
        <Eyebrow index="04">{ui.work.eyebrow}</Eyebrow>
        <h2 id="work-title" className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          {ui.work.title}
        </h2>
      </FadeIn>

      <ProjectShowcase projects={featured} labels={ui.work} />

      {others.length > 0 && (
        <div className="mt-20">
          <h3 className="font-mono text-[11px] tracking-[0.3em] text-gold uppercase">{ui.work.others}</h3>
          <ul className="mt-6 border-t border-fg/10">
            {others.map((project) => {
              const href = project.href ?? project.github;
              const meta = [project.academic, project.year].filter(Boolean).join(" · ");
              const row = (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-medium tracking-tight uppercase transition-colors group-hover:text-gold-soft">
                      {project.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{project.description}</span>
                  </span>
                  <span className="hidden font-mono text-[10px] tracking-[0.2em] text-faint uppercase md:block">{meta}</span>
                  {href && (
                    <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-faint transition-colors group-hover:text-gold" />
                  )}
                </>
              );
              const rowClass = "group flex items-center gap-6 border-b border-fg/10 py-5";
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
            href={repositories}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-fg uppercase transition-colors hover:text-gold"
          >
            {ui.work.viewAll}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
