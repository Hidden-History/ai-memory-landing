import { test, expect } from '@playwright/test';

test('Pipeline legend matches right column height', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3099/docs/architecture', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(3000);

  // Scroll to pipeline section
  await p.locator('#pipeline').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);

  const layout = await p.evaluate(() => {
    const section = document.getElementById('pipeline');
    if (!section) return null;
    // Find the grid container (desktop layout)
    const grid = section.querySelector('[style*="grid-template-columns"]') as HTMLElement;
    if (!grid) return { error: 'No grid container found' };
    const leftCol = grid.children[0] as HTMLElement;
    const rightCol = grid.children[1] as HTMLElement;
    const leftInner = leftCol.querySelector('[class*="flex-col"]') as HTMLElement;

    // Count step nodes in left column
    const stepNodes = leftCol.querySelectorAll('[class*="rounded-xl"]');

    return {
      gridHeight: grid.offsetHeight,
      leftColHeight: leftCol.offsetHeight,
      rightColHeight: rightCol.offsetHeight,
      leftInnerHeight: leftInner?.offsetHeight || 0,
      stepNodeCount: stepNodes.length,
      heightMatch: Math.abs(leftCol.offsetHeight - rightCol.offsetHeight) < 5,
    };
  });

  console.log('Pipeline layout:', JSON.stringify(layout, null, 2));
  expect(layout).not.toBeNull();
  expect((layout as any).heightMatch).toBe(true);
  console.log(`Left: ${(layout as any).leftColHeight}px, Right: ${(layout as any).rightColHeight}px`);

  // Screenshot at pipeline section
  await p.screenshot({ path: '/tmp/pipeline-layout.png', fullPage: false });

  // Scroll to see more of the pipeline
  await p.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (el) window.scrollTo(0, el.offsetTop + 600);
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/pipeline-layout-mid.png', fullPage: false });

  await ctx.close();
});
