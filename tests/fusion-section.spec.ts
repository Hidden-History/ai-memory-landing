import { test } from '@playwright/test';
test('fusion section screenshot', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);
  const el = p.locator('#fusion');
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1000);
  await p.screenshot({ path: '/tmp/fusion-viewport.png' });
  await el.screenshot({ path: '/tmp/fusion-full.png' });
  await ctx.close();
});
