// Smoke-test the detail overlay against the built site: open it from the Inbox card,
// confirm the screenshot loads, and capture a couple of frames for visual review.
const { chromium } = await import(
  process.env.PLAYWRIGHT_PKG ?? '../../NamWeb/node_modules/playwright/index.mjs'
);
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = process.env.SITE_URL ?? 'http://localhost:4321/NamProduct';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'NamProduct', '..');
const scratch = process.env.SHOT_DIR ?? '/tmp';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

const failures = [];
page.on('requestfailed', (r) => failures.push(r.url()));
page.on('response', (r) => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Learn more/ }).first().click();

const dialog = page.locator('#detail-inbox');
await dialog.waitFor({ state: 'visible' });
await page.waitForTimeout(300);

// The first slide's screenshot must actually load (naturalWidth > 0).
const imgOk = await dialog.locator('img').first().evaluate((img) => img.complete && img.naturalWidth > 0);
await page.screenshot({ path: join(scratch, 'overlay-slide1.png') });

// Advance to the last slide and back to slide 1 to exercise nav.
await page.getByRole('button', { name: 'Next' }).click();
await page.getByRole('button', { name: 'Next' }).click();
await page.waitForTimeout(150);
await page.screenshot({ path: join(scratch, 'overlay-slide3.png') });

await browser.close();
console.log(JSON.stringify({ imgOk, failures }, null, 2));
if (!imgOk || failures.length) process.exit(1);
