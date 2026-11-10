import { notFound } from "next/navigation";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { getResumeUrl } from "@/lib/resume";
import { legacyPath } from "@/lib/routes";

// Páginas ainda no visual antigo (escuro) até serem reconstruídas nas próximas etapas.
export const viewport: Viewport = {
  themeColor: "#06080c",
  colorScheme: "dark",
};

export default async function LegacyLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const home = localePath(locale, legacyPath);

  // V1 completa em /v1, com a navegação apontando para as próprias seções.
  return (
    <div className="legacy-theme">
      <MotionProvider>
        <Header
          locale={locale}
          dict={{ nav: dict.nav, actions: dict.actions, a11y: dict.a11y }}
          resumeUrl={getResumeUrl(locale)}
          home={home}
        />
        <main id="content">{children}</main>
        <Footer locale={locale} dict={dict} top={`${home}#home`} />
      </MotionProvider>
    </div>
  );
}
