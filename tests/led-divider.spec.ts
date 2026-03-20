import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'Home', path: '/', expectedDividers: 7 },
  { name: 'Features', path: '/features', expectedDividers: 8 },
  { name: 'Parzival', path: '/parzival', expectedDividers: 6 },
  { name: 'Architecture', path: '/docs/architecture', expectedDividers: 8 },
];

for (const page of PAGES) {
  test(`[${page.name}] LED section divider present and animated`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await context.newPage();
    await p.goto(`http://localhost:3099${page.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(3000);

    // Count SectionDivider wrapper elements (they have 3 children, last is rounded-full LED)
    const dividerCount = await p.evaluate(() => {
      const candidates = document.querySelectorAll('[aria-hidden="true"]');
      let count = 0;
      for (const el of candidates) {
        if (el.children.length === 3) {
          const lastChild = el.children[2] as HTMLElement;
          if (lastChild.classList.contains('rounded-full')) count++;
        }
      }
      return count;
    });
    console.log(`[${page.name}] SectionDivider components: ${dividerCount} (expected: ${page.expectedDividers})`);
    expect(dividerCount).toBe(page.expectedDividers);

    // Check LED dot has strobe animation
    const ledInfo = await p.evaluate(() => {
      const dividers = document.querySelectorAll('[aria-hidden="true"]');
      for (const el of dividers) {
        if (el.children.length === 3) {
          const led = el.children[2] as HTMLElement;
          if (led.classList.contains('rounded-full')) {
            const style = window.getComputedStyle(led);
            return {
              found: true,
              width: led.offsetWidth,
              height: led.offsetHeight,
              animationName: style.animationName,
              animationDuration: style.animationDuration,
            };
          }
        }
      }
      return { found: false };
    });
    console.log(`[${page.name}] LED:`, JSON.stringify(ledInfo));
    expect(ledInfo.found).toBe(true);
    expect((ledInfo as any).animationName).toContain('led-strobe');

    // Check line element has computed background
    const lineInfo = await p.evaluate(() => {
      const dividers = document.querySelectorAll('[aria-hidden="true"]');
      for (const el of dividers) {
        if (el.children.length === 3) {
          const line = el.children[0] as HTMLElement;
          const style = window.getComputedStyle(line);
          return {
            found: true,
            width: line.offsetWidth,
            height: line.offsetHeight,
            hasBackground: style.backgroundImage !== 'none',
          };
        }
      }
      return { found: false };
    });
    console.log(`[${page.name}] Line:`, JSON.stringify(lineInfo));
    expect(lineInfo.found).toBe(true);

    // Scroll to second divider and screenshot
    await p.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await p.waitForTimeout(500);
    await p.screenshot({ path: `/tmp/led-divider-${page.name.toLowerCase()}.png`, fullPage: false });

    await context.close();
  });
}
