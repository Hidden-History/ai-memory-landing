import { test } from '@playwright/test';
test('arch hero screenshot', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: '/tmp/arch-hero.png' });
  await ctx.close();
});
