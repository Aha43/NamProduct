// Regenerate the demo screenshots used in the landing-page slideshow.
//
//   npm run shots
//
// Needs Playwright browsers once:  npx playwright install chromium
// Captures the live no-account demo (usenam.app/demo) at 16:10 with the demo
// banner hidden, into public/shots/. Set SHOTS_OUT to capture elsewhere.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir } from 'node:fs/promises';

const DEMO = 'https://usenam.app/demo';
const OUT = process.env.SHOTS_OUT || join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'shots');

// Runs in the page: hide the "you're in a demo" bar so the app fills the frame.
function hideDemoBanner() {
  const all = [...document.querySelectorAll('body *')];
  const banner = all.find(
    (e) => /in a demo/i.test(e.textContent || '') && (e.textContent || '').length < 160 && e.children.length <= 4,
  );
  if (!banner) return;
  let node = banner;
  while (node.parentElement && node.parentElement.tagName !== 'BODY' && !node.parentElement.querySelector('a[href="/inbox"]')) {
    node = node.parentElement;
  }
  node.style.display = 'none';
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1792, height: 1120 }, deviceScaleFactor: 1, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto(DEMO, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3500);

async function shot(name) {
  await page.evaluate(hideDemoBanner);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log('✓', name);
}

await shot('inbox');

await page.click('a[href="/next"]');
await page.waitForTimeout(1300);
await shot('next');

// Open a project from a Next-view link, then expand its collapsed sections.
await page.click('a[href^="/projects/"]');
await page.waitForTimeout(1600);
for (const label of ['ACTIONS', 'SUB-PROJECTS']) {
  try {
    await page.getByText(label, { exact: false }).first().click({ timeout: 4000 });
    await page.waitForTimeout(400);
  } catch {
    /* section already expanded or absent */
  }
}
await shot('project');

await page.click('a[href="/projects"]');
await page.waitForTimeout(1300);
await shot('projects');

await browser.close();
console.log('Done →', OUT);
