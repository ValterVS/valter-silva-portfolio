import { htmlLang, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/ui";
import { education } from "@/data/education";
import { profile, siteUrl } from "@/data/profile";

// Person + WebSite da home. Dados públicos apenas: cidade e região, nunca endereço completo.
export function siteJsonLd(locale: Locale) {
  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
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
    affiliation: education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.institution })),
    knowsAbout: ["Java", "Spring Boot", "REST APIs", "Backend Development", "PostgreSQL", "React", "Software Engineering"],
    sameAs: [profile.links.github, profile.links.linkedin],
    description: profile.headline[locale],
  };
  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: profile.name,
    alternateName: profile.brand,
    description: getDictionary(locale).meta.description,
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${siteUrl}/#person` },
  };
  return { "@context": "https://schema.org", "@graph": [person, website] };
}

// Serializa para <script type="application/ld+json"> sem permitir fechar a tag.
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
