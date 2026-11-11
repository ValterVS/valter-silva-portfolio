import { expect, test } from "@playwright/test";
import { openDialog, selectedProjects } from "./helpers";

for (const project of selectedProjects) {
  for (const locale of ["pt", "en"] as const) {
    const prefix = locale === "pt" ? "" : "/en";
    const path = `${prefix}/projects/${project.slug}`;

    test(`página ${path}: título, navegação e idioma`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
      await expect(page.locator('main a[href$="#projects"]')).toHaveAttribute("href", locale === "pt" ? "/#projects" : "/en#projects");
      const otherPath = locale === "pt" ? `/en/projects/${project.slug}` : `/projects/${project.slug}`;
      await expect(page.locator("header a[hreflang]")).toHaveAttribute("href", otherPath);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.valtersilva.dev.br${path}`);
    });
  }
}

test("painel e página mostram o mesmo conteúdo", async ({ page }) => {
  await page.goto("/?project=eitanol");
  const fromDialog = await openDialog(page).locator('section[aria-labelledby$="-problem"] p').textContent();
  const dialogSections = await openDialog(page).locator("h3").allTextContents();

  await page.goto("/projects/eitanol");
  const fromPage = await page.locator('main section[aria-labelledby$="-problem"] p').textContent();
  const pageSections = await page.locator("main h2").allTextContents();

  expect(fromDialog).toBeTruthy();
  expect(fromPage).toBe(fromDialog);
  // A página completa tem tudo o que o painel mostra (e mais).
  for (const section of dialogSections) expect(pageSections).toContain(section);
});

test("menu da página do projeto leva às seções da home", async ({ page }) => {
  await page.goto("/projects/orca-ai");
  await page.locator('header nav a[href="/#experience"]').click();
  await expect(page).toHaveURL(/\/#experience$/);
  await expect(page.locator("#experience h2")).toBeInViewport();
});

test("projeto inexistente ou sem página responde 404", async ({ page }) => {
  for (const path of ["/projects/nao-existe", "/projects/forest-of-the-fallen"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  }
});
