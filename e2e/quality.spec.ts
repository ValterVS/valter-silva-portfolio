import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { projects } from "../src/data/projects";
import { openDialog } from "./helpers";

const pages = ["/", "/en", "/projects/orca-ai", "/en/projects/jurimetria-ia"];

test.describe("layout responsivo", () => {
  // As larguras são definidas aqui; basta rodar em um perfil.
  test.skip(({ isMobile }) => isMobile, "Larguras testadas no perfil desktop.");

  for (const width of [360, 390, 768, 1440]) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of pages) {
        await page.goto(path);
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth, `${path} em ${width}px`).toBeLessThanOrEqual(clientWidth);
      }
    });
  }
});

test.describe("acessibilidade (axe, WCAG 2.1 A/AA)", () => {
  const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

  for (const path of pages) {
    test(`sem violações em ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
    });
  }

  test("sem violações com o painel aberto", async ({ page }) => {
    await page.goto("/?project=orca-ai");
    await expect(openDialog(page)).toBeVisible();
    // Durante a animação de entrada a opacidade é parcial e o axe mediria cores misturadas.
    await openDialog(page).evaluate((dialog) => Promise.all(dialog.getAnimations({ subtree: true }).map((animation) => animation.finished)));
    const results = await new AxeBuilder({ page }).include("dialog").withTags(tags).analyze();
    expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
  });
});

test.describe("links e arquivos", () => {
  test.skip(({ isMobile }) => isMobile, "Verificação de rede feita uma vez, no perfil desktop.");

  test("links internos, downloads e capturas declaradas respondem 200", async ({ page, request }) => {
    const targets = new Set<string>();
    for (const path of pages) {
      await page.goto(path);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
      hrefs.forEach((href) => targets.add(href.split("#")[0] || "/"));
    }
    // Capturas declaradas em src/data/projects.ts precisam existir em public/.
    projects.forEach((project) => project.screenshots?.forEach((shot) => targets.add(shot.src)));

    for (const target of targets) {
      const response = await request.get(target);
      expect(response.status(), target).toBe(200);
    }
  });

  test("links de currículo só aparecem quando o PDF existe", async ({ page, request }) => {
    for (const path of ["/", "/en"]) {
      await page.goto(path);
      const resumes = await page.locator("a[download]").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
      for (const href of resumes) {
        const response = await request.get(href);
        expect(response.status(), href).toBe(200);
        expect(response.headers()["content-type"]).toContain("application/pdf");
      }
    }
  });
});
