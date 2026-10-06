import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { getResumeUrl } from "@/lib/resume";

export default async function ClassicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Header
        locale={locale}
        dict={{ nav: dict.nav, actions: dict.actions, a11y: dict.a11y }}
        resumeUrl={getResumeUrl(locale)}
      />
      <main id="content">{children}</main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
