// Capture the "Ways to process an inbox" screenshots from the NamWeb demo.
//
// Prereqs: NamWeb dev server running on http://localhost:5173 (`npm run dev` in ../NamWeb),
// and Playwright's chromium installed (it ships with NamWeb's devDependencies).
//
// Run from the NamWeb repo so the playwright package resolves:
//   cd ../NamWeb && node ../NamProduct/scripts/capture-details.mjs
//
// Output: ../NamProduct/public/details/inbox/*.png
// Resolved from NamWeb's node_modules; pass PLAYWRIGHT_PKG to override the location.
const { chromium } = await import(
  process.env.PLAYWRIGHT_PKG ?? '../../NamWeb/node_modules/playwright/index.mjs'
);
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.NAMWEB_URL ?? 'http://localhost:5173';
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'details', 'inbox');
mkdirSync(outDir, { recursive: true });

const shot = (page, name) => page.screenshot({ path: join(outDir, name) });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 820 },
  deviceScaleFactor: 2, // crisp on retina / when scaled up in the overlay
});

// The demo flag is set by loading /demo; the app then rewrites the URL to / and the
// router lands on /inbox with the seeded inbox items.
await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle' });

// The per-item "Process…" button (aria-label "Process <title>"), NOT the "Process inbox (n)"
// deck button — single-item mode gives the cleaner two-choice dialog we want to show.
const firstItem = 'Process Email Sara about the long weekend';
await page.getByRole('button', { name: firstItem }).waitFor();

// 1 — the inbox with its unsorted items.
await shot(page, '01-inbox.png');

// Open the Process dialog for the first inbox item and let the open animation settle so
// the modal is fully opaque in the capture.
const openProcess = async () => {
  await page.getByRole('button', { name: firstItem }).click();
  await page.getByRole('button', { name: 'It’s one action' }).waitFor();
  await page.waitForTimeout(450);
};

// 2 — the "decide what it is" step (action vs. project).
await openProcess();
await shot(page, '02-process.png');

// 3 — a quick action: do it next or park it.
await page.getByRole('button', { name: 'It’s one action' }).click();
await page.getByRole('button', { name: 'Do it next' }).waitFor();
await page.waitForTimeout(250);
await shot(page, '03-action.png');
await page.keyboard.press('Escape'); // back out without mutating the inbox

// 4 — something bigger: make a project.
await openProcess();
await page.getByRole('button', { name: 'It needs planning — make a project' }).click();
await page.getByRole('button', { name: 'Make project' }).waitFor();
await page.waitForTimeout(250);
await shot(page, '04-project.png');
await page.keyboard.press('Escape');

// 5 — nothing to do: the delete affordance, highlighted.
const del = page.getByRole('button', { name: /^Delete / }).first();
await del.hover();
await shot(page, '05-delete.png');

await browser.close();
console.log('Captured inbox detail screenshots to', outDir);
