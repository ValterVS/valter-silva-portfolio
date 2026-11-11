"use client";

import { htmlLang, localeCookie, locales, type Locale } from "@/i18n/config";

const names: Record<Locale, string> = { pt: "Português", en: "English" };

// Grava a escolha no cookie lido pelo proxy, para que a raiz (/) não redirecione de volta ao idioma anterior.
function remember(next: Locale) {
  document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
}

// Links comuns entre idiomas: funcionam sem JS; com JS, o clique também salva a preferência.
export function LanguageLinks({ locale, label, paths }: { locale: Locale; label: string; paths: Record<Locale, string> }) {
  return (
    <ul aria-label={label} className="flex items-center text-small">
      {locales.map((option, index) => (
        <li key={option} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="px-1.5 text-border-strong">
              /
            </span>
          )}
          {option === locale ? (
            <span aria-current="true" lang={htmlLang[option]} className="font-semibold uppercase">
              {option}
              <span className="sr-only"> ({names[option]})</span>
            </span>
          ) : (
            <a
              href={paths[option]}
              hrefLang={htmlLang[option]}
              lang={htmlLang[option]}
              onClick={() => remember(option)}
              className="inline-flex min-h-11 items-center uppercase text-foreground-muted transition-colors hover:text-primary"
            >
              {option}
              <span className="sr-only"> ({names[option]})</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
