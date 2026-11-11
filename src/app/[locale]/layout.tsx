import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { htmlLang, isLocale, localePath, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { profile, siteUrl } from "@/data/profile";
import "../globals.css";

// Fontes da home editorial (tokens font-text e font-display em design-tokens.css).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Sem o eixo opsz e sem itálico: cada um quase triplicava o peso da fonte (medido: 129 KiB + 144 KiB).
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });

// Geist só é usada pelas páginas antigas (projetos e /v1), por isso sem preload na home.
const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", preload: false });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", preload: false });

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Tema claro. As páginas antigas (projetos e /v1) sobrescrevem com o tema escuro nos próprios layouts.
export const viewport: Viewport = {
  themeColor: "#f6f5f0",
  colorScheme: "light",
};

export async function generateMetadata({ params }: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const image = { url: `/og/${locale}`, width: 1200, height: 630, alt: dict.meta.title };

  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s | ${profile.name}` },
    description: dict.meta.description,
    applicationName: profile.brand,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: [
      profile.name,
      "Software Developer",
      "Software Engineer",
      "Backend Developer",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "React",
      "Next.js",
    ],
    alternates: {
      canonical: localePath(locale),
      languages: { "pt-BR": "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: localePath(locale),
      siteName: profile.brand,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => ogLocale[other]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [image.url],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={`${sans.variable} ${mono.variable} ${inter.variable} ${newsreader.variable}`}>
      <body>
        <a
          href="#content"
          className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-control bg-primary px-4 py-2 text-small font-medium text-primary-foreground focus:translate-y-0"
        >
          {dict.a11y.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
