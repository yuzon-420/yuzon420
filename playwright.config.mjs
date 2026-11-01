import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "layout.spec.mjs",
  workers: 2,
  use: { baseURL: "http://127.0.0.1:8766", screenshot: "only-on-failure" },
  webServer: {
    command: "python -m http.server 8766 --bind 127.0.0.1",
    url: "http://127.0.0.1:8766",
    reuseExistingServer: !process.env.CI,
  },
});
