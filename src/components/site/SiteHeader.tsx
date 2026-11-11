import { localePath, type Locale } from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/home";
import { profile } from "@/data/profile";
import { LanguageLinks } from "./LanguageLinks";
import { textLink } from "./ui";

type HeaderProps = {
  locale: Locale;
  ui: HomeDictionary;
  resumeUrl: string | null;
  // Endereço desta página em cada idioma (troca de idioma sem perder a página).
  paths: Record<Locale, string>;
  // Prefixo das âncoras: vazio na home; o endereço da home nas demais páginas.
  anchorBase?: string;
};

// Cabeçalho simples, sem menu escondido: no celular a navegação vai para uma segunda linha.
export function SiteHeader({ locale, ui, resumeUrl, paths, anchorBase = "" }: HeaderProps) {
  const nav = [
    { href: `${anchorBase}#projects`, label: ui.nav.projects },
    { href: `${anchorBase}#experience`, label: ui.nav.experience },
    { href: `${anchorBase}#about`, label: ui.nav.about },
    { href: `${anchorBase}#contact`, label: ui.nav.contact },
  ];

  return (
    <header id="top" className="grid grid-cols-[1fr_auto] items-center gap-x-6 border-b border-border py-3 md:grid-cols-[auto_1fr_auto]">
      <a href={localePath(locale)} className="col-start-1 row-start-1 inline-flex min-h-11 items-center font-display text-heading font-medium">
        {profile.brand}
        <span className="text-primary">.</span>
      </a>

      <nav aria-label={ui.nav.label} className="col-span-2 col-start-1 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-end">
        <ul className="-ml-2 flex flex-wrap text-small md:ml-0">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-primary">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="col-start-2 row-start-1 flex items-center gap-5 md:col-start-3">
        {resumeUrl && (
          <a href={resumeUrl} download className={`${textLink} text-small`}>
            <span className="sm:hidden">{ui.nav.resumeShort}</span>
            <span className="hidden sm:inline">{ui.nav.resume}</span>
          </a>
        )}
        <LanguageLinks locale={locale} label={ui.nav.language} paths={paths} />
      </div>
    </header>
  );
}
