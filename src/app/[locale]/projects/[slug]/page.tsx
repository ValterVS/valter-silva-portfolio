import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GithubIcon } from "@/components/icons";
import { ProjectBadges } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { isLocale, localePath, ogLocale, text } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { getProject, projects } from "@/data/projects";
import { button, chip, cx } from "@/lib/styles";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((project) => project.details).map((project) => ({ slug: project.slug }));
}

async function load(params: PageProps["params"]) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  const details = project?.details;
  if (!isLocale(locale) || !project || !details) notFound();
  return { locale, project, details };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, project } = await load(params);
  const title = text(project.title, locale);
  const description = project.description[locale];
  const path = `/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { "pt-BR": path, en: localePath("en", path), "x-default": path },
    },
    openGraph: {
      type: "article",
      url: localePath(locale, path),
      title,
      description,
      locale: ogLocale[locale],
      images: [{ url: project.image ?? `/og/${locale}`, width: 1200, height: 630, alt: title }],
    },
  };
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="border-t border-line pt-8">
        <h2 className="font-mono text-xs tracking-[0.18em] text-accent uppercase">{title}</h2>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-fg/85">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, project, details } = await load(params);
  const dict = getDictionary(locale);
  const labels = dict.projects.detail;
  const title = text(project.title, locale);

  return (
    <article className="relative pt-28 pb-24 sm:pt-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />
      </div>

      <div className="container-page">
        <Link
          href={`${localePath(locale)}#projects`}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {dict.actions.backToProjects}
        </Link>

        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectBadges
              status={project.status}
              academic={project.categories.includes("academic")}
              labels={dict.projects}
            />
            {project.year && <span className="font-mono text-xs text-faint">{project.year}</span>}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-muted">{project.description[locale]}</p>
          {(project.github || project.live) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className={button.primary}>
                  <GithubIcon size={16} />
                  GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className={button.secondary}>
                  <ExternalLink size={16} aria-hidden="true" />
                  {dict.actions.liveDemo}
                </a>
              )}
            </div>
          )}
        </header>

        {project.image && (
          <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-2xl border border-line">
            <Image
              src={project.image}
              alt={title}
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            {details.problem && (
              <Block title={labels.problem}>
                <p className="text-lg leading-relaxed text-pretty text-fg/85">{details.problem[locale]}</p>
              </Block>
            )}
            {details.solution && (
              <Block title={labels.solution}>
                <p className="text-lg leading-relaxed text-pretty text-fg/85">{details.solution[locale]}</p>
              </Block>
            )}
            {details.architecture && (
              <Block title={labels.architecture}>
                <List items={details.architecture[locale]} />
              </Block>
            )}
            {details.features && (
              <Block title={labels.features}>
                <List items={details.features[locale]} />
              </Block>
            )}
            {details.challenges && (
              <Block title={labels.challenges}>
                <List items={details.challenges[locale]} />
              </Block>
            )}
            {details.learnings && (
              <Block title={labels.learnings}>
                <List items={details.learnings[locale]} />
              </Block>
            )}
            {project.screenshots && project.screenshots.length > 0 && (
              <Block title={labels.screenshots}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.screenshots.map((src, index) => (
                    <div key={src} className="relative aspect-video overflow-hidden rounded-xl border border-line">
                      <Image
                        src={src}
                        alt={`${title} — ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 420px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Block>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card space-y-6 p-6">
              {project.technologies.length > 0 && (
                <div>
                  <h2 className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">{labels.technologies}</h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li key={tech} className={cx(chip, "text-fg/85")}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.plannedTechnologies && project.plannedTechnologies.length > 0 && (
                <div>
                  <h2 className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">{labels.planned}</h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.plannedTechnologies.map((tech) => (
                      <li key={tech} className={cx(chip, "border-dashed")}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.authors && (
                <div>
                  <h2 className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">{labels.team}</h2>
                  <p className="mt-2 text-sm text-fg/85">{project.authors}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
