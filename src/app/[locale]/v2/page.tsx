import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImmersivePage } from "@/components/v2/ImmersivePage";
import { buildContent } from "@/components/v2/content";
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

  return (
    <ImmersivePage
      locale={locale}
      ui={getImmersiveDictionary(locale)}
      content={buildContent(locale)}
      avatar={getAvatarAssets()}
      resumeUrl={getResumeUrl(locale)}
      classicHref={localePath(locale)}
    />
  );
}
