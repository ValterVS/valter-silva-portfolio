import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSection } from "@/components/v2/AboutSection";
import { ContactSection } from "@/components/v2/ContactSection";
import { EducationSection } from "@/components/v2/EducationSection";
import { ExperienceSection } from "@/components/v2/ExperienceSection";
import { FooterV2 } from "@/components/v2/FooterV2";
import { ImmersivePage } from "@/components/v2/ImmersivePage";
import { StackSection } from "@/components/v2/StackSection";
import { WorkSection } from "@/components/v2/WorkSection";
import { buildContent } from "@/components/v2/content";
import { buildFlow } from "@/components/v2/flow";
import { isLocale, localePath } from "@/i18n/config";
import { getImmersiveDictionary } from "@/i18n/immersive";
import { getAvatarAssets } from "@/lib/model";
import { getResumeUrl } from "@/lib/resume";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: { absolute: getImmersiveDictionary(locale).meta.title },
    alternates: {
      canonical: localePath(locale, "/v2"),
      languages: { "pt-BR": "/v2", en: "/en/v2" },
    },
    // Versão experimental: fica fora dos buscadores até substituir a principal.
    robots: { index: false, follow: true },
  };
}

export default async function ImmersiveRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getImmersiveDictionary(locale);
  const content = buildContent(locale);
  const resumeUrl = getResumeUrl(locale);

  // Só a casca com scroll e 3D é client; as seções de conteúdo são renderizadas no servidor.
  return (
    <ImmersivePage
      locale={locale}
      ui={ui}
      avatar={getAvatarAssets()}
      resumeUrl={resumeUrl}
      links={content.links}
      hero={{ name: content.name, role: content.role, headline: content.headline }}
      flow={buildFlow(content)}
      footer={<FooterV2 ui={ui} name={content.name} role={content.role} classicHref={localePath(locale)} />}
    >
      <AboutSection ui={ui} content={content} />
      <StackSection ui={ui} content={content} />
      <ExperienceSection ui={ui} content={content} />
      <WorkSection
        ui={ui}
        projects={content.projects}
        labels={content.labels}
        repositories={content.links.repositories}
      />
      <EducationSection ui={ui} content={content} />
      <ContactSection ui={ui} email={content.email} links={content.links} resumeUrl={resumeUrl} />
    </ImmersivePage>
  );
}
