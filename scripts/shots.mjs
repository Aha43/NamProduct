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

// --- "Ways to process an inbox" detail (the deep-dive overlay) ---
// Walk the single-item Process… dialog: choose → quick action → something bigger → delete.
await page.click('a[href="/inbox"]');
await page.waitForTimeout(1300);

// Per-item rows carry aria-label="Process <title>"; the deck button ("Process inbox (n)")
// has no aria-label, so this never grabs it. settle() waits out the Radix open animation.
const processItem = () => page.locator('button[aria-label^="Process "]').first();
const settle = () => page.waitForTimeout(500);

await processItem().click();
await settle();
await shot('process-choose'); // "It's one action" vs "needs planning — make a project"

await page.getByRole('button', { name: /one action/i }).click();
await settle();
await shot('process-action'); // Do it next / Park for later (backlog)

await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await processItem().click();
await settle();
await page.getByRole('button', { name: /make a project/i }).click();
await settle();
await shot('process-project'); // Make project

await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await page.locator('button[aria-label^="Delete "]').first().hover();
await shot('process-delete'); // the trash affordance, highlighted — "let it go"

// --- "Tags & views" detail ---
await page.click('a[href="/tags"]');
await page.waitForTimeout(1200);
await page.getByText('home', { exact: true }).first().click(); // filter to one tag
await page.waitForTimeout(800);
await shot('tags');
await page.click('a[href="/due"]'); // a standing view
await page.waitForTimeout(1200);
await shot('due');

await browser.close();
console.log('Done →', OUT);
