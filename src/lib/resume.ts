import { existsSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/i18n/config";
import { profile } from "@/data/profile";

// Currículo em PDF do idioma da página, verificado no build (public/resume, veja docs/assets.md).
// Sem o arquivo desse idioma, retorna null e nenhum link de currículo é exibido: nunca um link quebrado,
// nem um PDF em outro idioma com rótulo enganoso.
export function getResumeUrl(locale: Locale) {
  const file = profile.resume[locale];
  return existsSync(path.join(process.cwd(), "public", file)) ? file : null;
}
