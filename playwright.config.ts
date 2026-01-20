import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    trace: "on-first-retry",
  },
  projects: [{ name: "cli", testMatch: "*.e2e.ts" }],
});
