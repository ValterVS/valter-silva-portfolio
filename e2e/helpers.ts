import type { Page } from "@playwright/test";

// Projetos da home, na ordem exibida (mesma lista de src/components/site/content.ts).
export const selectedProjects = [
  { slug: "orca-ai", title: "Orça Aí" },
  { slug: "jurimetria-ia", title: "Jurimetria IA" },
  { slug: "eitanol", title: "EiTanol" },
] as const;

// Link do título do projeto na lista da home (abre o painel).
export const projectTitleLink = (page: Page, slug: string) => page.locator(`#project-${slug} a`);

// Painel aberto (um <dialog> fechado não tem o atributo open).
export const openDialog = (page: Page) => page.locator("dialog[open]");

// Diz se o elemento com foco está dentro do painel.
export const focusIsInsideDialog = (page: Page) =>
  page.evaluate(() => {
    const active = document.activeElement;
    const dialog = document.querySelector("dialog");
    return { inside: Boolean(dialog && active && dialog.contains(active)), onBody: active === document.body };
  });
