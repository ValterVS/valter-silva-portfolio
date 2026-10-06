import { existsSync } from "node:fs";
import path from "node:path";
import { locales, type Locale } from "@/i18n/config";
import { profile } from "@/data/profile";

const available = (file: string) => existsSync(path.join(process.cwd(), "public", file));

// Usa o currículo do idioma atual; se ele não existir, cai para o outro. Sem nenhum PDF, retorna null.
export function getResumeUrl(locale: Locale) {
  const candidates = [locale, ...locales.filter((l) => l !== locale)].map((l) => profile.resume[l]);
  return candidates.find(available) ?? null;
}
