// Para adicionar um idioma: inclua o código aqui e o TypeScript vai apontar
// todos os textos que ainda precisam de tradução.
export const locales = ["pt", "en"] as const;
export const defaultLocale = "pt";
export const localeCookie = "lang";

export type Locale = (typeof locales)[number];
export type Localized<T = string> = Record<Locale, T>;

export const htmlLang: Localized = { pt: "pt-BR", en: "en" };
export const ogLocale: Localized = { pt: "pt_BR", en: "en_US" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = "/") {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function text(value: string | Localized, locale: Locale) {
  return typeof value === "string" ? value : value[locale];
}
