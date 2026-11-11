import { notFound } from "next/navigation";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { ExperienceList } from "@/components/site/ExperienceList";
import { Intro } from "@/components/site/Intro";
import { ProjectDialog } from "@/components/site/ProjectDialog";
import { ProjectList } from "@/components/site/ProjectList";
import { Section } from "@/components/site/Section";
import { SiteShell } from "@/components/site/SiteShell";
import { buildHomeContent } from "@/components/site/content";
import { isLocale, localePath, locales, type Locale } from "@/i18n/config";
import { getHomeDictionary } from "@/i18n/home";
import { jsonLdScript, siteJsonLd } from "@/lib/jsonld";
import { getResumeUrl } from "@/lib/resume";

type PageProps = { params: Promise<{ locale: string }> };

// Home editorial. Tudo é renderizado no servidor; só o seletor de idioma e o painel de projeto rodam no cliente.
// Metadata, canonical e hreflang vêm do layout de [locale].
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getHomeDictionary(locale);
  const content = buildHomeContent(locale);
  // Sem o PDF em public/resume, retorna null e os links de currículo não aparecem.
  const resumeUrl = getResumeUrl(locale);
  const homePaths = Object.fromEntries(locales.map((option) => [option, localePath(option)])) as Record<Locale, string>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(siteJsonLd(locale))} />
      <SiteShell locale={locale} ui={ui} resumeUrl={resumeUrl} paths={homePaths}>
        <Intro ui={ui} headline={content.headline} github={content.links.github} />
        <Section id="projects" title={ui.projects.title}>
          <ProjectList projects={content.projects} ui={ui} />
        </Section>
        <Section id="experience" title={ui.experience.title}>
          <ExperienceList jobs={content.experience} ui={ui} />
        </Section>
        <Section id="about" title={ui.about.title}>
          <About content={content} ui={ui} />
        </Section>
        <Section id="contact" title={ui.contact.title}>
          <Contact ui={ui} email={content.email} links={content.links} resumeUrl={resumeUrl} />
        </Section>
      </SiteShell>
      <ProjectDialog projects={content.projects} labels={ui.dialog} />
    </>
  );
}
