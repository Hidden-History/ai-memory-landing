import { test } from '@playwright/test';
test('hero screenshot', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: '/tmp/hero-before.png' });
  await ctx.close();
});
