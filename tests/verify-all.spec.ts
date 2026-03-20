import { test, expect } from "@playwright/test";

/* ================================================================
   Test 1: All pages load without errors
   ================================================================ */
const pages = [
  { path: "/", text: "CURE AI", label: "Homepage" },
  { path: "/features", text: "Under the", label: "Features" },
  { path: "/docs", text: "Docs", label: "Docs" },
  { path: "/docs/architecture", text: "Right Information", label: "Architecture" },
  { path: "/parzival", text: "Parzival", label: "Parzival" },
  { path: "/pricing-demo", text: null, label: "Pricing Demo" },
];

for (const pg of pages) {
  test(`Page loads without errors: ${pg.label} (${pg.path})`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(pg.path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Page title should not be empty
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Expected text content
    if (pg.text) {
      await expect(page.locator(`text=${pg.text}`).first()).toBeVisible({ timeout: 15_000 });
    }

    // Filter out noisy/irrelevant console errors (e.g. third-party resources, dev warnings)
    const realErrors = consoleErrors.filter(
      (e) =>
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR") &&
        !e.includes("favicon") &&
        !e.includes("Download the React DevTools") &&
        !e.includes("Spline") &&
        !e.includes("hydration") &&    // next.js dev hydration warnings
        !e.includes("Hydration") &&
        !e.includes("NEXT_") &&
        !e.includes("webpack")
    );
    expect(realErrors).toEqual([]);
  });
}

/* ================================================================
   Test 2: Navigation links work
   ================================================================ */
test("Navigation links work from homepage", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Click "Features" nav link
  await page.locator("nav a", { hasText: "Features" }).first().click();
  await page.waitForURL("**/features", { timeout: 10_000 });
  expect(page.url()).toContain("/features");

  // Go back, click "Architecture"
  await page.goBack();
  await page.locator("nav a", { hasText: "Architecture" }).first().click();
  await page.waitForURL("**/docs/architecture", { timeout: 10_000 });
  expect(page.url()).toContain("/docs/architecture");

  // Go back, click "Docs"
  await page.goBack();
  await page.locator("nav a", { hasText: "Docs" }).first().click();
  await page.waitForURL("**/docs", { timeout: 10_000 });
  expect(page.url()).toContain("/docs");

  // Go back, click "Parzival"
  await page.goBack();
  await page.locator("nav a", { hasText: "Parzival" }).first().click();
  await page.waitForURL("**/parzival", { timeout: 10_000 });
  expect(page.url()).toContain("/parzival");

  // Go back, click "Pricing" — this links to /#pricing
  await page.goBack();
  await page.locator("nav a", { hasText: "Pricing" }).first().click();
  // Pricing is an anchor link to /#pricing so URL should contain #pricing
  await page.waitForTimeout(1000);
  expect(page.url()).toContain("#pricing");
});

/* ================================================================
   Test 3: Footer links work cross-page
   ================================================================ */
test("Footer links navigate correctly from /features", async ({ page }) => {
  await page.goto("/features", { waitUntil: "domcontentloaded" });

  // Scroll to footer so the link is visible
  await page.locator("footer").scrollIntoViewIfNeeded();

  // Click footer "Features" link (href="/#features")
  await page.locator("footer a", { hasText: "Features" }).first().click();
  await page.waitForURL("**/#features", { timeout: 10_000 });
  expect(page.url()).toContain("/#features");
});

test("Footer Architecture link navigates correctly from /docs", async ({ page }) => {
  await page.goto("/docs", { waitUntil: "domcontentloaded" });

  // Scroll to footer
  await page.locator("footer").scrollIntoViewIfNeeded();

  // Click footer "Architecture" link (href="/#architecture")
  await page.locator("footer a", { hasText: "Architecture" }).first().click();
  await page.waitForURL("**/#architecture", { timeout: 10_000 });
  expect(page.url()).toContain("/#architecture");
});

/* ================================================================
   Test 4: Skip-to-content link exists
   ================================================================ */
for (const pg of pages) {
  test(`Skip-to-content link exists on ${pg.label}`, async ({ page }) => {
    await page.goto(pg.path, { waitUntil: "domcontentloaded" });

    // The skip link should exist in the DOM (it is sr-only until focused)
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveText("Skip to main content");

    // The #main target element should exist
    const mainEl = page.locator("#main");
    await expect(mainEl).toHaveCount(1);
  });
}

/* ================================================================
   Test 5: Hero CTA links work
   ================================================================ */
test("Hero CTA: Get Started scrolls to #developer-experience", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const getStartedBtn = page.locator('a[href="#developer-experience"]', {
    hasText: "Get Started",
  });
  await expect(getStartedBtn).toBeVisible({ timeout: 15_000 });

  // Should be an anchor link, not a GitHub link
  const href = await getStartedBtn.getAttribute("href");
  expect(href).toBe("#developer-experience");
});

test("Hero CTA: View on GitHub links to github.com", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const githubBtn = page.locator("a", { hasText: "View on GitHub" }).first();
  await expect(githubBtn).toBeVisible({ timeout: 15_000 });

  const href = await githubBtn.getAttribute("href");
  expect(href).toContain("github.com");
});

/* ================================================================
   Test 6: Architecture page sections exist
   ================================================================ */
test("Architecture page has required section IDs", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("/docs/architecture", { waitUntil: "domcontentloaded" });

  // These are the actual section IDs in the architecture-v2 component
  const requiredSections = ["overview", "collections", "triggers", "reference"];

  for (const sectionId of requiredSections) {
    const section = page.locator(`#${sectionId}`);
    await expect(section).toHaveCount(1, {
      timeout: 10_000,
    });
  }

  // Filter out noisy console errors
  const realErrors = consoleErrors.filter(
    (e) =>
      !e.includes("Failed to load resource") &&
      !e.includes("net::ERR") &&
      !e.includes("favicon") &&
      !e.includes("Download the React DevTools") &&
      !e.includes("Spline") &&
      !e.includes("hydration") &&
      !e.includes("Hydration") &&
      !e.includes("NEXT_") &&
      !e.includes("webpack")
  );
  expect(realErrors).toEqual([]);
});

/* ================================================================
   Test 7: Sitemap and robots.txt
   ================================================================ */
test("Sitemap returns 200 and contains URLs", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("<url>");
  expect(body).toContain("https://");
});

test("robots.txt returns 200 and contains User-agent", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body.toLowerCase()).toContain("user-agent");
});
