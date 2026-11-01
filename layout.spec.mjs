import { test, expect } from "@playwright/test";
import { DEFAULT_COURSE } from "../js/challenges.js";

// Use the real editor, but keep layout tests independent of CDNs, accounts, and Python downloads.
test.beforeEach(async ({ page }) => {
  await page.route("https://cdnjs.cloudflare.com/**", async route => {
    const name = new URL(route.request().url()).pathname.split("/").at(-1);
    const files = { "codemirror.min.js": "lib/codemirror.js", "codemirror.min.css": "lib/codemirror.css", "python.min.js": "mode/python/python.js" };
    await route.fulfill({ path: "node_modules/codemirror/" + files[name] });
  });
  await page.route("https://fonts.googleapis.com/**", route => route.fulfill({ body: "", contentType: "text/css" }));
  await page.route("https://cdn.jsdelivr.net/pyodide/**", route => route.fulfill({
    body: 'window.loadPyodide = async () => { throw new Error("Python disabled in layout tests"); };',
    contentType: "text/javascript",
  }));
  await page.route("**/js/config.js", route => route.fulfill({
    body: 'export const SUPABASE_URL = ""; export const SUPABASE_ANON_KEY = "";',
    contentType: "text/javascript",
  }));
});

async function expectContained(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const selector of ["#btn-reset", "#btn-run"]) {
    const button = page.locator(selector);
    if (await button.isVisible()) {
      const rect = await button.boundingBox();
      expect(rect.height, selector + " should remain a readable single-line button").toBeLessThan(60);
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
    }
  }
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`map, lesson, and exercise at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(ids => {
      localStorage.setItem("pyquest-progress-v1", JSON.stringify({ completed: Object.fromEntries(ids.map(id => [id, { stars: 3 }])) }));
    }, DEFAULT_COURSE.challenges.map(l => l.id));
    await page.goto("/");
    await expect(page.locator(".level-card")).toHaveCount(88);
    await expectContained(page);
    const cards = await page.locator(".chapter-grid").first().locator(".level-card").evaluateAll(nodes => nodes.map(n => ({ top: n.getBoundingClientRect().top, height: n.getBoundingClientRect().height })));
    for (const card of cards) {
      const row = cards.filter(c => Math.abs(c.top - card.top) < 1);
      expect(Math.max(...row.map(c => c.height)) - Math.min(...row.map(c => c.height))).toBeLessThan(2);
    }
    await page.getByRole("button", { name: "閱讀 真正隔離的路線 的講義", exact: true }).click();
    await expect(page.locator(".lesson-panel")).toBeVisible();
    await expect(page.locator(".challenge-work")).toBeHidden();
    await page.screenshot({ path: testInfo.outputPath("reading.png"), fullPage: true });
    await expectContained(page);
    await page.getByRole("button", { name: "開始練習", exact: true }).click();
    await expect(page.locator(".CodeMirror")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("exercise.png"), fullPage: true });
    await expectContained(page);
    const editor = await page.locator(".CodeMirror").boundingBox();
    expect(editor.width).toBeGreaterThan(200);
    await page.locator(".CodeMirror").click();
    await page.keyboard.press("Control+End");
    await page.keyboard.type("\n# editor still responds after reading");
    await expect(page.locator(".CodeMirror-code")).toContainText("editor still responds after reading");
  });
}

test("locked lessons remain readable without spending hints or attempts", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "閱讀 真正隔離的路線 的講義", exact: true }).click();
  await expect(page.locator("#reading-note")).toContainText("尚未解鎖");
  await expect(page.locator("#btn-practice")).toBeHidden();
  await expect(page.locator("#btn-hint")).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("pyquest-progress-v1"))).toBeNull();
});
