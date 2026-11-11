import { expect, test } from "@playwright/test";
import { selectedProjects } from "./helpers";

const locales = [
  {
    path: "/",
    lang: "pt-BR",
    title: "Olá, eu sou o Valter.",
    nav: ["Projetos", "Experiência", "Sobre", "Contato"],
  },
  {
    path: "/en",
    lang: "en",
    title: "Hi, I'm Valter.",
    nav: ["Projects", "Experience", "About", "Contact"],
  },
];

for (const locale of locales) {
  test(`home ${locale.path}: idioma, título, menu e projetos`, async ({ page }) => {
    await page.goto(locale.path);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.title);
    await expect(page.locator("header nav a")).toHaveText(locale.nav);
    await expect(page.locator("#projects h3")).toHaveText(selectedProjects.map((project) => project.title));
  });
}

test("menu leva a cada seção da página", async ({ page }) => {
  await page.goto("/");
  for (const id of ["projects", "experience", "about", "contact"]) {
    await page.locator(`header nav a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id} h2`)).toBeInViewport();
  }
});

test("links dos projetos apontam para as páginas individuais", async ({ page }) => {
  await page.goto("/");
  for (const project of selectedProjects) {
    await expect(page.locator(`#project-${project.slug} a`)).toHaveAttribute("href", `/projects/${project.slug}`);
  }
  await page.goto("/en");
  await expect(page.locator("#project-orca-ai a")).toHaveAttribute("href", "/en/projects/orca-ai");
});

test("troca de idioma grava a preferência e não redireciona de volta", async ({ page, context }) => {
  await page.goto("/");
  await page.locator('header a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en$/);
  expect((await context.cookies()).find((cookie) => cookie.name === "lang")?.value).toBe("en");

  await page.locator('header a[hreflang="pt-BR"]').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});

test("primeiro Tab é o link para pular ao conteúdo, com foco visível", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});
