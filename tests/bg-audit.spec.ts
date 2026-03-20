import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Parzival', path: '/parzival' },
  { name: 'Architecture', path: '/docs/architecture' },
];

for (const page of PAGES) {
  test(`[${page.name}] Background layer audit`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await context.newPage();
    await p.goto(`http://localhost:3099${page.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(3000);

    // Check for bg-mesh
    const bgMesh = await p.locator('.bg-mesh').count();
    console.log(`[${page.name}] bg-mesh elements: ${bgMesh}`);

    // Check for particle-drift animation
    const particleDrift = await p.evaluate(() => {
      const els = document.querySelectorAll('*');
      let count = 0;
      for (const el of els) {
        const anim = el.getAttribute('style') || '';
        if (anim.includes('particle-drift')) count++;
      }
      return count;
    });
    console.log(`[${page.name}] Elements with particle-drift animation: ${particleDrift}`);

    // Check main element background
    const mainBg = await p.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return 'NO MAIN';
      const style = window.getComputedStyle(main);
      return {
        backgroundColor: style.backgroundColor,
        inlineStyle: main.getAttribute('style') || 'none',
      };
    });
    console.log(`[${page.name}] Main background:`, JSON.stringify(mainBg));

    // Check section backgrounds
    const sectionBgs = await p.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const results: { id: string; bg: string; opaque: boolean }[] = [];
      for (const section of sections) {
        const style = window.getComputedStyle(section);
        const bg = style.backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        const opaque = match
          ? (match[4] === undefined || parseFloat(match[4]) > 0.9) &&
            (parseInt(match[1]) + parseInt(match[2]) + parseInt(match[3])) > 0
          : false;
        if (opaque) {
          results.push({
            id: section.id || section.className.substring(0, 50),
            bg,
            opaque,
          });
        }
      }
      return results;
    });
    console.log(`[${page.name}] Sections with OPAQUE backgrounds:`, JSON.stringify(sectionBgs));

    // Check canvas elements (ParticleMesh)
    const canvasCount = await p.locator('canvas').count();
    console.log(`[${page.name}] Canvas elements: ${canvasCount}`);

    // Check for fixed background overlays at z < 10
    const fixedOverlays = await p.evaluate(() => {
      const els = document.querySelectorAll('.fixed, [style*="position: fixed"]');
      const results: { classes: string; zIndex: string; visible: boolean }[] = [];
      for (const el of els) {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' && el.tagName !== 'NAV') {
          const rect = (el as HTMLElement).getBoundingClientRect();
          results.push({
            classes: (el.className || '').toString().substring(0, 60),
            zIndex: style.zIndex,
            visible: rect.width > 0 && rect.height > 0 && style.opacity !== '0',
          });
        }
      }
      return results;
    });
    console.log(`[${page.name}] Fixed overlays:`, JSON.stringify(fixedOverlays));

    // Screenshot
    await p.screenshot({ path: `/tmp/bg-audit-${page.name.toLowerCase()}.png`, fullPage: false });

    // Scroll mid-page and screenshot
    await p.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await p.waitForTimeout(500);
    await p.screenshot({ path: `/tmp/bg-audit-${page.name.toLowerCase()}-mid.png`, fullPage: false });

    // Scroll further and screenshot
    await p.evaluate(() => window.scrollTo(0, window.innerHeight * 5));
    await p.waitForTimeout(500);
    await p.screenshot({ path: `/tmp/bg-audit-${page.name.toLowerCase()}-deep.png`, fullPage: false });

    await context.close();
  });
}
