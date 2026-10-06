import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import type { ProjectCardData } from "@/components/ProjectCard";
import { Projects } from "@/components/Projects";
import { Section } from "@/components/Section";
import { SkillsGrid } from "@/components/Skills";
import { isLocale, localePath, text, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { education } from "@/data/education";
import { profile, siteUrl } from "@/data/profile";
import { projects } from "@/data/projects";
import { getResumeUrl } from "@/lib/resume";

// Projetos exibidos discretamente no rodapé da hero
const heroProjects = ["eitanol", "orca-ai", "jurimetria-ia"];

function projectCards(locale: Locale): ProjectCardData[] {
  return projects.map((project) => ({
    slug: project.slug,
    title: text(project.title, locale),
    description: project.description[locale],
    categories: project.categories,
    status: project.status,
    technologies: project.technologies,
    github: project.github,
    live: project.live,
    image: project.image,
    featured: Boolean(project.featured),
    year: project.year,
    href: project.details ? localePath(locale, `/projects/${project.slug}`) : null,
  }));
}

function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.brand,
    jobTitle: profile.role,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lins",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    alumniOf: education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.institution })),
    knowsAbout: ["Java", "Spring Boot", "REST APIs", "PostgreSQL", "React", "Software Engineering"],
    sameAs: [profile.links.github, profile.links.linkedin],
    description: profile.headline[locale],
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const cards = projectCards(locale);
  const featured = heroProjects
    .map((slug) => cards.find((card) => card.slug === slug))
    .filter((card): card is ProjectCardData => Boolean(card))
    .map((card) => ({ slug: card.slug, title: card.title, href: card.href ?? `${localePath(locale)}#projects` }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)).replace(/</g, "\\u003c") }}
      />
      <Hero
        locale={locale}
        dict={{ hero: dict.hero, actions: dict.actions, a11y: dict.a11y }}
        resumeUrl={getResumeUrl(locale)}
        featured={featured}
      />
      <About locale={locale} dict={dict} />
      <Experience locale={locale} dict={dict} />
      <Section
        id="skills"
        index="03"
        eyebrow={dict.sections.skills.eyebrow}
        title={dict.sections.skills.title}
        intro={dict.sections.skills.intro}
      >
        <SkillsGrid locale={locale} labels={dict.skills} />
      </Section>
      <Section
        id="projects"
        index="04"
        eyebrow={dict.sections.projects.eyebrow}
        title={dict.sections.projects.title}
        intro={dict.sections.projects.intro}
      >
        <Projects projects={cards} dict={{ projects: dict.projects, actions: dict.actions }} />
      </Section>
      <Education locale={locale} dict={dict} />
      <Section
        id="contact"
        index="06"
        eyebrow={dict.sections.contact.eyebrow}
        title={dict.sections.contact.title}
        intro={dict.sections.contact.intro}
      >
        <Contact locale={locale} dict={{ contact: dict.contact, actions: dict.actions }} />
      </Section>
    </>
  );
}
