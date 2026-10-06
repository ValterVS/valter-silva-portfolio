import type { MetadataRoute } from "next";
import { htmlLang, localePath, locales } from "@/i18n/config";
import { siteUrl } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...projects.filter((project) => project.details).map((project) => `/projects/${project.slug}`)];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((other) => [htmlLang[other], `${siteUrl}${localePath(other, path)}`])),
      },
    })),
  );
}
