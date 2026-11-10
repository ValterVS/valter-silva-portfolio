import { notFound } from "next/navigation";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { ExperienceList } from "@/components/site/ExperienceList";
import { Intro } from "@/components/site/Intro";
import { ProjectDialog } from "@/components/site/ProjectDialog";
import { ProjectList } from "@/components/site/ProjectList";
import { Section } from "@/components/site/Section";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { buildHomeContent } from "@/components/site/content";
import { isLocale } from "@/i18n/config";
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(siteJsonLd(locale))} />
      <div className="mx-auto max-w-content px-gutter">
        <SiteHeader locale={locale} ui={ui} resumeUrl={resumeUrl} />
        <main id="content">
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
        </main>
        <SiteFooter ui={ui} />
      </div>
      <ProjectDialog projects={content.projects} labels={ui.dialog} />
    </>
  );
}
