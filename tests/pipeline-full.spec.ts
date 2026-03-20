import { test } from '@playwright/test';
test('pipeline full view', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.locator('#pipeline').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  // Full section screenshot
  const el = p.locator('#pipeline');
  await el.screenshot({ path: '/tmp/pipeline-full.png' });
  await ctx.close();
});
