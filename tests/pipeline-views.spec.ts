import { test } from '@playwright/test';
test('pipeline viewport screenshots', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);
  const pipeline = p.locator('#pipeline');
  await pipeline.scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/pipeline-top.png' });
  // Scroll down through the section
  await p.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (el) window.scrollTo(0, el.offsetTop + 400);
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/pipeline-mid1.png' });
  await p.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (el) window.scrollTo(0, el.offsetTop + 900);
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/pipeline-mid2.png' });
  await p.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (el) window.scrollTo(0, el.offsetTop + 1500);
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/pipeline-bottom.png' });
  await ctx.close();
});
