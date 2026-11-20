import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/playwright",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5401",
    headless: true,
  },
  webServer: {
    command: "npx serve public -p 5401 -s --no-clipboard",
    url: "http://localhost:5401",
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
