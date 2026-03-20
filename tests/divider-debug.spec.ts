import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'Home', path: '/', expected: 7 },
  { name: 'Features', path: '/features', expected: 8 },
  { name: 'Parzival', path: '/parzival', expected: 6 },
  { name: 'Architecture', path: '/docs/architecture', expected: 8 },
];

for (const page of PAGES) {
  test(`[${page.name}] section divider verify`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:3099${page.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(3000);

    const info = await p.evaluate(() => {
      const dividers = document.querySelectorAll('[aria-hidden="true"]');
      let count = 0;
      let detail = null;
      for (const el of dividers) {
        // SectionDivider: flex-col wrapper with 2 children (horiz line + vertical stem container)
        if (el.children.length === 2) {
          const hLine = el.children[0] as HTMLElement;
          const stem = el.children[1] as HTMLElement;
          if (hLine.offsetHeight <= 1 && stem.children.length === 3) {
            count++;
            if (!detail) {
              const hStyle = window.getComputedStyle(hLine);
              const travelDot = stem.children[1] as HTMLElement;
              const junctionDot = stem.children[2] as HTMLElement;
              const travelStyle = window.getComputedStyle(travelDot);
              const junctionStyle = window.getComputedStyle(junctionDot);
              detail = {
                hLineWidth: hLine.offsetWidth,
                hLineBgImage: hStyle.backgroundImage.substring(0, 60),
                hLineAnim: hStyle.animationName,
                stemHeight: (stem as HTMLElement).offsetHeight,
                travelDotAnim: travelStyle.animationName,
                travelDotBg: travelStyle.backgroundColor,
                junctionDotBg: junctionStyle.backgroundColor,
                junctionDotShadow: junctionStyle.boxShadow.substring(0, 40),
              };
            }
          }
        }
      }
      return { count, detail };
    });

    console.log(`[${page.name}] Dividers: ${info.count} (expected: ${page.expected})`);
    console.log(`[${page.name}] Detail:`, JSON.stringify(info.detail, null, 2));
    expect(info.count).toBe(page.expected);
    expect(info.detail).not.toBeNull();
    expect((info.detail as any).hLineAnim).toBe('divider-color-shift');
    expect((info.detail as any).travelDotAnim).toBe('data-particle');

    // Screenshot at a divider
    await p.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
    await p.waitForTimeout(500);
    await p.screenshot({ path: `/tmp/divider-final-${page.name.toLowerCase()}.png`, fullPage: false });
    await ctx.close();
  });
}
