import { localePath, text, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { courses, education } from "@/data/education";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

// Converte os dados de src/data para o idioma atual antes de enviar para os componentes da V2.
export function buildContent(locale: Locale) {
  const dict = getDictionary(locale);

  return {
    name: profile.name,
    role: profile.role,
    headline: profile.headline[locale],
    statement: profile.statement[locale],
    about: profile.about[locale],
    focus: profile.focus[locale],
    location: profile.location[locale],
    email: profile.email,
    links: profile.links,
    education: education.map((item) => ({
      course: item.course[locale],
      institution: item.institution,
      status: item.status[locale],
      location: item.location[locale],
      conclusion: item.conclusion,
    })),
    courses,
    experience: experience.map((job) => ({
      company: job.company,
      role: job.role,
      kind: dict.experience.kind[job.kind],
      client: job.client ? `${dict.experience.client}: ${job.client}` : null,
      startYear: job.start.slice(0, 4),
      endYear: job.end?.slice(0, 4) ?? null,
      period: job.period[locale],
      summary: job.summary[locale],
      highlights: job.highlights[locale],
      tags: job.tags,
    })),
    projects: projects.map((project) => ({
      slug: project.slug,
      title: text(project.title, locale),
      description: project.description[locale],
      categories: project.categories,
      status: project.status ? dict.projects.status[project.status] : null,
      academic: project.categories.includes("academic") ? dict.projects.academic : null,
      technologies: project.technologies,
      github: project.github ?? null,
      live: project.live ?? null,
      image: project.image ?? null,
      featured: Boolean(project.featured),
      year: project.year ?? null,
      href: project.details ? localePath(locale, `/projects/${project.slug}`) : null,
    })),
    skills: skillGroups.map((group) => ({
      title: group.title[locale],
      skills: group.skills.map((skill) => ({ name: skill.name, usage: skill.usage })),
    })),
    labels: {
      usage: dict.skills.usage,
      details: dict.actions.details,
      code: dict.actions.code,
      liveDemo: dict.actions.liveDemo,
      instructor: dict.education.instructor,
    },
  };
}

export type ImmersiveContent = ReturnType<typeof buildContent>;
