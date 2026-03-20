import { test } from '@playwright/test';
test('hooks section screenshot', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);
  const el = p.locator('#hooks');
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1000);
  await el.screenshot({ path: '/tmp/hooks-full.png' });
  // Viewport shot at the diagram
  await p.screenshot({ path: '/tmp/hooks-viewport.png' });
  // Scroll down to cards
  await p.evaluate(() => {
    const el = document.getElementById('hooks');
    if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight - 900);
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/hooks-cards.png' });
  await ctx.close();
});
