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

// Annotation pens. Meaning is carried by the slide description; the wobble is what says
// "drawn on, not part of the app".
const PEN = { green: '#3FA463', red: '#E5484D', blue: '#4C8DF5', amber: '#E0A53B' };

// Runs in the page: draw hand-drawn loops (+ optional number badges) into an SVG overlay.
// boxes: [{ x, y, width, height, color, n, pad, seed }]
function drawAnnotations({ boxes, strokeWidth }) {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // A wobbly ellipse that overshoots its start so the ends cross, like a marker loop.
  function loopPath(cx, cy, rx, ry, rand) {
    const N = 64, start = -0.28, end = Math.PI * 2 + 0.34, phase = rand() * Math.PI * 2, pts = [];
    for (let i = 0; i <= N; i++) {
      const a = start + (end - start) * (i / N) + (rand() - 0.5) * 0.05;
      const wob = 1 + (rand() - 0.5) * 0.05 + 0.035 * Math.sin(a * 3 + phase);
      pts.push({ x: cx + Math.cos(a) * rx * wob, y: cy + Math.sin(a) * ry * wob });
    }
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }
  const W = window.innerWidth, H = window.innerHeight;
  let inner = '';
  for (const b of boxes) {
    const pad = b.pad ?? 12;
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2, rx = b.width / 2 + pad, ry = b.height / 2 + pad;
    inner += `<path d="${loopPath(cx, cy, rx, ry, mulberry32(b.seed))}" fill="none" stroke="${b.color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (b.n != null) {
      const bx = cx - rx, by = cy - ry;
      inner += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="15" fill="${b.color}"/>`;
      inner += `<text x="${bx.toFixed(1)}" y="${(by + 5.5).toFixed(1)}" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="17" font-weight="700" fill="#fff">${b.n}</text>`;
    }
  }
  const layer = document.createElement('div');
  layer.id = '__annot';
  layer.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
  layer.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  document.body.appendChild(layer);
}

// Like shot(), but first rings one or more targets with hand-drawn loops.
//   annotations: [{ sel | union, color='green', n?, pad? }]
//     sel   = a Locator (or selector string) — rings its first match
//     union = a Locator — rings the bounding box covering ALL its matches (a group)
//     color = a PEN key;  n = optional number badge
async function shotWith(name, annotations) {
  await page.evaluate(hideDemoBanner);
  await page.waitForTimeout(400);
  const seedOf = (i) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) + i * 101;
  const boxes = [];
  for (let i = 0; i < annotations.length; i++) {
    const a = annotations[i];
    let bb = null;
    if (a.union) {
      const bbs = (await Promise.all((await a.union.all()).map((e) => e.boundingBox()))).filter(Boolean);
      if (bbs.length) {
        const x = Math.min(...bbs.map((b) => b.x)), y = Math.min(...bbs.map((b) => b.y));
        bb = { x, y, width: Math.max(...bbs.map((b) => b.x + b.width)) - x, height: Math.max(...bbs.map((b) => b.y + b.height)) - y };
      }
    } else {
      bb = await (typeof a.sel === 'string' ? page.locator(a.sel) : a.sel).first().boundingBox();
    }
    if (bb) boxes.push({ ...bb, color: PEN[a.color || 'green'], n: a.n, pad: a.pad, seed: seedOf(i) });
    else console.warn('  ! annotation target not found on', name, i);
  }
  await page.evaluate(drawAnnotations, { boxes, strokeWidth: 4 });
  await page.waitForTimeout(120);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  await page.evaluate(() => document.getElementById('__annot')?.remove());
  console.log('✓', name, `(${boxes.length} mark${boxes.length === 1 ? '' : 's'})`);
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
await shotWith('project', [
  { union: page.getByRole('button', { name: /^(List|Heat-map|Column)$/ }), color: 'green' }, // view it different ways
]);

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
await shotWith('process-choose', [
  { sel: page.getByRole('button', { name: /one action/i }), color: 'green', n: 1 },
  { sel: page.getByRole('button', { name: /make a project/i }), color: 'blue', n: 2 },
]);

await page.getByRole('button', { name: /one action/i }).click();
await settle();
await shotWith('process-action', [{ sel: page.getByRole('button', { name: 'Do it next' }), color: 'green' }]);

await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await processItem().click();
await settle();
await page.getByRole('button', { name: /make a project/i }).click();
await settle();
await shotWith('process-project', [{ sel: page.getByRole('button', { name: 'Make project' }), color: 'green' }]);

await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await page.locator('button[aria-label^="Delete "]').first().hover();
await shotWith('process-delete', [{ sel: 'button[aria-label^="Delete "]', color: 'red' }]); // "let it go"

// --- "In bulk" way of the Inbox detail: select several items, then act on the whole batch ---
await page.getByRole('button', { name: 'Select items' }).click();
await page.waitForTimeout(500);
for (const t of ['Email Sara about the long weekend', 'Look into an Italian phrasebook app', 'Birthday gift for Mom 🎁']) {
  await page.getByLabel(`Select ${t}`).check();
  await page.waitForTimeout(120);
}
await shotWith('inbox-bulk-select', [{ union: page.getByRole('checkbox'), color: 'green' }]);
await page.getByRole('button', { name: 'Select all' }).click();
await page.waitForTimeout(400);
await shotWith('inbox-bulk-file', [
  { union: page.getByRole('button', { name: /(→ Next|→ Backlog|Make projects)/ }), color: 'green', n: 1 },
  { sel: page.getByRole('button', { name: /^Delete/ }), color: 'red', n: 2 },
]);

// --- "Tags & views" detail ---
await page.click('a[href="/tags"]');
await page.waitForTimeout(1200);
await page.getByText('home', { exact: true }).first().click(); // filter to one tag
await page.waitForTimeout(800);
await shotWith('tags', [{ sel: page.getByText('home', { exact: true }).first(), color: 'green' }]); // the tag you sliced by
await page.click('a[href="/due"]'); // a standing view
await page.waitForTimeout(1200);
await shotWith('due', [
  { union: page.getByRole('link', { name: /^(Backlog|Due|Blocked|Done)$/ }), color: 'green' }, // the views in the sidebar
]);

// --- "Goal board" detail: create a board over the home-tagged projects ---
await page.click('a[href="/goals"]');
await page.waitForTimeout(1000);
await page.getByPlaceholder('New goal board…').fill('Home');
await page.getByPlaceholder('tags (space or comma)').fill('home');
await page.getByRole('button', { name: 'Create' }).click();
await page.waitForTimeout(1200);
await shot('goals');

// --- "Focus mode" detail: enter the immersive deck from the Next list ---
await page.click('a[href="/next"]');
await page.waitForTimeout(1200);
await page.click('a[href="/focus"]');
await page.waitForTimeout(1800);
await shot('focus');

await browser.close();
console.log('Done →', OUT);
