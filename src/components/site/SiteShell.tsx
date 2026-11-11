import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/home";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type ShellProps = {
  locale: Locale;
  ui: HomeDictionary;
  resumeUrl: string | null;
  paths: Record<Locale, string>;
  anchorBase?: string;
  children: ReactNode;
};

// Estrutura comum das páginas: coluna centralizada, cabeçalho, conteúdo principal e rodapé.
export function SiteShell({ locale, ui, resumeUrl, paths, anchorBase, children }: ShellProps) {
  return (
    <div className="mx-auto max-w-content px-gutter">
      <SiteHeader locale={locale} ui={ui} resumeUrl={resumeUrl} paths={paths} anchorBase={anchorBase} />
      <main id="content">{children}</main>
      <SiteFooter ui={ui} />
    </div>
  );
}
