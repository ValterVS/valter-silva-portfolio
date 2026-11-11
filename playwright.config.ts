import { defineConfig, devices } from "@playwright/test";

// Testes de ponta a ponta. O próprio Playwright gera o build de produção e sobe o servidor
// numa porta separada, para não colidir com o `npm run dev` (3000).
const port = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    // Artefatos só em falhas, gravados em test-results/ (ignorado pelo Git).
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    url: `http://localhost:${port}`,
    // Sempre um build novo: testar um servidor antigo esconderia regressões.
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
