import { test } from '@playwright/test';
test('pipeline scroll-driven experience', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);

  // Get the pipeline section offset and height
  const sectionInfo = await p.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (!el) return { top: 0, height: 0 };
    return { top: el.offsetTop, height: el.offsetHeight };
  });
  console.log('Pipeline section:', sectionInfo);

  // Scroll to the start of the pipeline section
  const scrollPositions = [
    { name: 'step1', offset: 0.05 },
    { name: 'step2', offset: 0.15 },
    { name: 'step3', offset: 0.25 },
    { name: 'step4', offset: 0.35 },
    { name: 'step5', offset: 0.50 },
    { name: 'step6', offset: 0.60 },
    { name: 'step7', offset: 0.70 },
    { name: 'step8', offset: 0.80 },
    { name: 'step9', offset: 0.90 },
  ];

  for (const pos of scrollPositions) {
    const scrollTo = sectionInfo.top + (sectionInfo.height * pos.offset);
    await p.evaluate((y) => window.scrollTo(0, y), scrollTo);
    await p.waitForTimeout(600); // Let animations settle
    await p.screenshot({ path: `/tmp/pipeline-${pos.name}.png` });
  }

  await ctx.close();
});
