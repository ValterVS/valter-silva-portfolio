import { notFound } from "next/navigation";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { getResumeUrl } from "@/lib/resume";
import { mainAnchors } from "@/lib/routes";

// Páginas ainda no visual antigo (escuro) até serem reconstruídas nas próximas etapas.
export const viewport: Viewport = {
  themeColor: "#06080c",
  colorScheme: "dark",
};

export default async function ProjectsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const home = localePath(locale);

  // Páginas de projeto (e 404): mantêm o header da V1, mas a navegação leva às seções da home atual.
  return (
    <div className="legacy-theme">
      <MotionProvider>
        <Header
          locale={locale}
          dict={{ nav: dict.nav, actions: dict.actions, a11y: dict.a11y }}
          resumeUrl={getResumeUrl(locale)}
          home={home}
          anchors={mainAnchors}
        />
        <main id="content">{children}</main>
        <Footer locale={locale} dict={dict} top={`${home}#${mainAnchors.home}`} />
      </MotionProvider>
    </div>
  );
}
