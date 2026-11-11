import { expect, test, type Page } from "@playwright/test";
import { focusIsInsideDialog, openDialog, projectTitleLink } from "./helpers";

async function openFromList(page: Page, slug = "orca-ai") {
  await page.goto("/");
  const opener = projectTitleLink(page, slug);
  await opener.click();
  await expect(openDialog(page)).toBeVisible();
  return opener;
}

test("abre pela lista, atualiza a URL e foca o botão Fechar", async ({ page }) => {
  await openFromList(page);
  await expect(page).toHaveURL(/\?project=orca-ai$/);
  await expect(openDialog(page).getByRole("heading", { level: 2, name: "Orça Aí" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Fechar" })).toBeFocused();
  // Resumo do projeto: status e seções principais
  await expect(openDialog(page).locator("header p").first()).toContainText("Em desenvolvimento");
  for (const section of ["Problema", "Solução", "Decisões técnicas", "Tecnologias"]) {
    await expect(openDialog(page).getByRole("heading", { level: 3, name: section })).toBeVisible();
  }
});

const closeMethods: { name: string; close: (page: Page) => Promise<unknown>; desktopOnly?: boolean }[] = [
  { name: "Escape", close: (page) => page.keyboard.press("Escape") },
  { name: "botão Fechar", close: (page) => page.getByRole("button", { name: "Fechar" }).click() },
  { name: "Voltar do navegador", close: (page) => page.goBack() },
  // Clique no fundo escurecido, à esquerda do painel (no celular o painel ocupa a tela toda).
  { name: "clique fora", close: (page) => page.mouse.click(20, 450), desktopOnly: true },
];

for (const method of closeMethods) {
  test(`fecha com ${method.name}, limpa a URL e devolve o foco ao link`, async ({ page, isMobile }) => {
    test.skip(Boolean(method.desktopOnly && isMobile), "No celular o painel cobre a tela inteira.");
    const opener = await openFromList(page);
    await method.close(page);
    await expect(openDialog(page)).toHaveCount(0);
    await expect(page).not.toHaveURL(/project=/);
    await expect(opener).toBeFocused();
  });
}

test("histórico: Voltar fecha e Avançar reabre o painel", async ({ page }) => {
  await openFromList(page, "eitanol");
  await page.goBack();
  await expect(openDialog(page)).toHaveCount(0);
  await page.goForward();
  await expect(openDialog(page).getByRole("heading", { level: 2, name: "EiTanol" })).toBeVisible();
});

test("URL compartilhada abre o painel; ao fechar, o foco vai para o projeto na lista", async ({ page }) => {
  await page.goto("/?project=jurimetria-ia");
  await expect(openDialog(page).getByRole("heading", { level: 2, name: "Jurimetria IA" })).toBeVisible();
  await page.getByRole("button", { name: "Fechar" }).click();
  await expect(openDialog(page)).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
  await expect(projectTitleLink(page, "jurimetria-ia")).toBeFocused();
});

test("foco fica preso no painel enquanto ele está aberto", async ({ page }) => {
  await openFromList(page);
  for (let step = 0; step < 12; step++) {
    await page.keyboard.press("Tab");
    // O foco pode passar pela interface do navegador (body), mas nunca pela página atrás do painel.
    const focus = await focusIsInsideDialog(page);
    expect(focus.inside || focus.onBody, `Tab ${step + 1} saiu do painel`).toBe(true);
  }
});

test("preserva a rolagem da home e rola só o painel", async ({ page, isMobile }) => {
  await page.goto("/");
  const opener = projectTitleLink(page, "eitanol");
  await opener.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(0);

  await opener.click();
  await expect(openDialog(page)).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");

  // Rolagem dentro do painel não move a página atrás
  if (isMobile) {
    await openDialog(page).evaluate((dialog) => dialog.scrollBy(0, 600));
  } else {
    await page.mouse.move(1000, 500);
    await page.mouse.wheel(0, 600);
  }
  await expect.poll(() => openDialog(page).evaluate((dialog) => dialog.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);

  await page.keyboard.press("Escape");
  await expect(openDialog(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

test("links do painel: GitHub em nova aba e página completa", async ({ page }) => {
  await openFromList(page);
  const github = openDialog(page).getByRole("link", { name: /Código no GitHub/ });
  await expect(github).toHaveAttribute("href", "https://github.com/ValterVS/OrcaAi");
  await expect(github).toHaveAttribute("target", "_blank");
  await expect(github).toHaveAttribute("rel", /noreferrer/);

  await openDialog(page).getByRole("link", { name: /Página completa/ }).click();
  await expect(page).toHaveURL(/\/projects\/orca-ai$/);
  await expect(page.getByRole("heading", { level: 1, name: "Orça Aí" })).toBeVisible();
});

test("no celular o painel ocupa a largura toda", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Só no perfil de celular.");
  await openFromList(page);
  const box = await openDialog(page).boundingBox();
  expect(box?.width).toBe(page.viewportSize()?.width);
});
