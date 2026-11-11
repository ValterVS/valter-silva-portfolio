import { htmlLang, localePath, text, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { courses, education } from "@/data/education";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { getProject, type Project } from "@/data/projects";
import { essentialSkills } from "@/data/skills";

// Projetos da home, nesta ordem.
export const selectedProjectSlugs = ["orca-ai", "jurimetria-ia", "eitanol"] as const;

function formatMonth(value: string, locale: Locale) {
  const [year, month] = value.split("-").map(Number);
  // Só mês abreviado e ano ("set. 2025" / "Sep 2025"), sem o "de" que o pt-BR insere.
  const parts = new Intl.DateTimeFormat(htmlLang[locale], { month: "short", year: "numeric", timeZone: "UTC" }).formatToParts(
    new Date(Date.UTC(year, month - 1, 1)),
  );
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("month")} ${part("year")}`;
}

// Visão de um projeto no idioma atual: usada na lista da home, no painel e na página do projeto.
export function buildProjectView(project: Project, locale: Locale) {
  const dict = getDictionary(locale);
  const details = project.details;
  return {
    slug: project.slug,
    title: text(project.title, locale),
    description: project.description[locale],
    category: project.category?.[locale] ?? null,
    status: project.status ? dict.projects.status[project.status] : null,
    academic: project.categories.includes("academic") ? dict.projects.academic : null,
    year: project.year ?? null,
    authors: project.authors ?? null,
    keyTechnologies: project.keyTechnologies ?? project.technologies.slice(0, 4),
    technologies: project.technologies,
    plannedTechnologies: project.plannedTechnologies ?? [],
    github: project.github ?? null,
    live: project.live ?? null,
    href: details ? localePath(locale, `/projects/${project.slug}`) : null,
    // Só capturas reais declaradas em src/data/projects.ts.
    gallery: [project.image, ...(project.screenshots ?? [])].filter((src): src is string => Boolean(src)),
    problem: details?.problem?.[locale] ?? null,
    solution: details?.solution?.[locale] ?? null,
    decisions: details?.architecture?.[locale] ?? [],
    role: details?.role?.[locale] ?? [],
    features: details?.features?.[locale] ?? [],
    challenges: details?.challenges?.[locale] ?? [],
    learnings: details?.learnings?.[locale] ?? [],
  };
}

function buildProjects(locale: Locale) {
  return selectedProjectSlugs.flatMap((slug) => {
    const project = getProject(slug);
    return project ? [buildProjectView(project, locale)] : [];
  });
}

export type ProjectView = ReturnType<typeof buildProjectView>;

export function buildHomeContent(locale: Locale) {
  return {
    name: profile.name,
    email: profile.email,
    links: profile.links,
    headline: profile.headline[locale],
    about: profile.about[locale],
    projects: buildProjects(locale),
    experience: experience.map((job) => ({
      company: job.company,
      role: job.role,
      client: job.client ?? null,
      start: { iso: job.start, label: formatMonth(job.start, locale) },
      end: job.end ? { iso: job.end, label: formatMonth(job.end, locale) } : null,
      summary: job.summary[locale],
      highlights: job.highlights[locale],
    })),
    education: education.map((item) => ({
      course: item.course[locale],
      institution: item.institution,
      status: item.status[locale],
    })),
    courses: courses.map((course) => ({ title: course.title, instructor: course.instructor })),
    skills: essentialSkills.map((skill) => ({ group: skill.group[locale], items: skill.items[locale] })),
  };
}

export type HomeContent = ReturnType<typeof buildHomeContent>;
