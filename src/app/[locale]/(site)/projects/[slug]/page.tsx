import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { SiteShell } from "@/components/site/SiteShell";
import { buildProjectView } from "@/components/site/content";
import { htmlLang, isLocale, localePath, locales, ogLocale, text, type Locale } from "@/i18n/config";
import { getHomeDictionary } from "@/i18n/home";
import { profile, siteUrl } from "@/data/profile";
import { getProject, projects, type Project } from "@/data/projects";
import { jsonLdScript } from "@/lib/jsonld";
import { getResumeUrl } from "@/lib/resume";

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
  const cover = project.screenshots?.[0];
  const image = cover ? { url: cover.src, alt: cover.alt[locale] } : { url: `/og/${locale}`, width: 1200, height: 630, alt: title };

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
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

// Código aberto vira SoftwareSourceCode; sem repositório público, o projeto é descrito como CreativeWork.
function projectJsonLd(project: Project, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": project.github ? "SoftwareSourceCode" : "CreativeWork",
    name: text(project.title, locale),
    description: project.description[locale],
    url: `${siteUrl}${localePath(locale, `/projects/${project.slug}`)}`,
    inLanguage: htmlLang[locale],
    keywords: project.technologies.join(", "),
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    ...(project.github && { codeRepository: project.github }),
    ...(project.live && { sameAs: project.live }),
    ...(project.year && { dateCreated: project.year }),
    ...(project.screenshots?.[0] && { image: `${siteUrl}${project.screenshots[0].src}` }),
  };
}

// Página completa do projeto: mesmo conteúdo do painel da home (ProjectDetail), mais funcionalidades,
// desafios e aprendizados. É o destino dos links sem JS, do ctrl/cmd-clique e dos buscadores.
export default async function ProjectPage({ params }: PageProps) {
  const { locale, project } = await load(params);
  const ui = getHomeDictionary(locale);
  const view = buildProjectView(project, locale);
  const home = localePath(locale);
  const path = `/projects/${project.slug}`;
  const paths = Object.fromEntries(locales.map((option) => [option, localePath(option, path)])) as Record<Locale, string>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(projectJsonLd(project, locale))} />
      <SiteShell locale={locale} ui={ui} resumeUrl={getResumeUrl(locale)} paths={paths} anchorBase={home}>
        <article className="pt-6 pb-section sm:pt-10">
          <Link
            href={`${home}#projects`}
            className="-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-small text-foreground-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {ui.project.back}
          </Link>
          <div className="mt-6">
            <ProjectDetail project={view} labels={ui.project} variant="page" titleId="project-title" />
          </div>
        </article>
      </SiteShell>
    </>
  );
}
