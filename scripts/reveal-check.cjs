/**
 * Reveal regression check: nothing on screen may rest at opacity < 1 or carry
 * a blur, after any kind of scroll. Strict — no exclusions for decorative
 * elements.
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/reveal-check.cjs
 *
 * Exits non-zero if any snapshot finds a violation.
 */
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE || 'http://localhost:4173';
const SETTLE_MS = 900; // a human beat after scrolling stops

function violationsInView() {
  const out = [];
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const opacity = parseFloat(cs.opacity);
    const blur = /blur\(/.test(cs.filter) || /blur\(/.test(cs.backdropFilter || '');
    if (opacity < 1 || blur || el.dataset.reveal === 'armed') {
      out.push(
        `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 48)} op=${cs.opacity}${blur ? ' BLUR' : ''}${el.dataset.reveal ? ` reveal=${el.dataset.reveal}` : ''}`,
      );
    }
  });
  return out;
}

/** Lenis glides on after the last wheel tick: wait until scrollY holds still. */
async function waitForScrollEnd(page) {
  let last = -1;
  let still = 0;
  while (still < 4) {
    const y = await page.evaluate(() => window.scrollY);
    still = y === last ? still + 1 : 0;
    last = y;
    await page.waitForTimeout(60);
  }
}

async function snapshot(page, label, results) {
  await waitForScrollEnd(page);
  await page.waitForTimeout(SETTLE_MS);
  const found = await page.evaluate(violationsInView);
  results.push({ label, found });
}

async function wheelTo(page, target, step = 300) {
  for (;;) {
    const y = await page.evaluate(() => window.scrollY);
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    if (y >= Math.min(target, max) - 2) break;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(110);
  }
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const results = [];

  // ── Desktop ──────────────────────────────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    // Park the cursor over the left rail (spotlight on, no row hovered): a
    // hovered row dims its siblings by design, which is not what this checks.
    await page.mouse.move(160, 600);
    await page.waitForTimeout(1500);
    await snapshot(page, 'desktop: load', results);

    // Slow wheel scroll, checking at every screenful.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 600; y < height; y += 600) {
      await wheelTo(page, y);
      await snapshot(page, `desktop: wheel to ${y}`, results);
    }

    // Jumps via the nav: skips the approach zone entirely.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.click('nav[aria-label="Sections"] a[href="#projects"]');
    await page.mouse.move(160, 600);
    await snapshot(page, 'desktop: nav jump to Projects', results);
    await page.click('nav[aria-label="Sections"] a[href="#contact"]');
    await page.mouse.move(160, 600);
    await snapshot(page, 'desktop: nav jump to Contact', results);

    // Instant jump to the bottom, then scroll back up through skipped content.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await snapshot(page, 'desktop: instant jump to bottom', results);
    for (let i = 0; i < 30; i += 1) {
      await page.mouse.wheel(0, -400);
      await page.waitForTimeout(110);
      if (i % 3 === 2) await snapshot(page, `desktop: scroll up step ${i + 1}`, results);
    }

    // Resize mid-page.
    await page.setViewportSize({ width: 1280, height: 720 });
    await snapshot(page, 'desktop: resize to 1280x720', results);
    await context.close();
  }

  // ── Deep link ────────────────────────────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + '/#projects', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await snapshot(page, 'deep link /#projects', results);
    await context.close();
  }

  // ── Full-page capture with no scroll ─────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: require('path').join(__dirname, '..', '.screenshots', 'reveal-fullpage.png'), fullPage: true });
    const armed = await page.evaluate(() => document.querySelectorAll('[data-reveal]').length);
    results.push({ label: 'full-page capture without scrolling', found: armed ? [`${armed} element(s) hidden`] : [] });
    await context.close();
  }

  // ── Mobile, touch scrolling ──────────────────────────────────────────────
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await snapshot(page, 'mobile: load', results);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 280) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(60);
      if ((y / 280) % 3 === 2) await snapshot(page, `mobile: scroll to ${y}`, results);
    }
    await snapshot(page, 'mobile: bottom', results);
    await context.close();
  }

  await browser.close();

  let failed = 0;
  results.forEach(({ label, found }) => {
    if (found.length) {
      failed += 1;
      console.log(`FAIL  ${label}\n      ${found.slice(0, 6).join('\n      ')}`);
    }
  });
  console.log(`\n${results.length} snapshots, ${failed} with violations.`);
  process.exit(failed ? 1 : 0);
})();
