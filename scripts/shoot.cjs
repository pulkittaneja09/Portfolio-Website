/**
 * Screenshot harness. Drives the real installed Chrome through Playwright so
 * the cursor-driven pieces (point cloud, card spotlight) actually run.
 *
 * node shoot.cjs <outDir> <url> [--mobile] [--light] [--hover=<selector>]
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:4173';

async function shoot({ outDir, slug, url, width, height, light, hover, full = true, wait = 2600 }) {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    hasTouch: width < 700,
    isMobile: width < 700,
  });

  const page = await context.newPage();

  if (light) {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('pt-theme', 'light');
      } catch (e) {
        /* ignore */
      }
    });
  }

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 140));
  });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 140)));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });

  // A real pointer move: this is what tells the hero to fetch three.js, and
  // what lights the card spotlights.
  await page.mouse.move(width / 2, height / 2);
  await page.mouse.move(width / 2 + 60, height / 2 + 40, { steps: 12 });

  // Walk the page so every scroll reveal fires, then return to the top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });

  if (hover) {
    const el = await page.$(hover);
    if (el) {
      const box = await el.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.4, { steps: 18 });
        await page.waitForTimeout(700);
      }
    }
  }

  await page.waitForTimeout(wait);

  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${slug}.png`);
  await page.screenshot({ path: file, fullPage: full });

  await browser.close();
  return { file, errors };
}

module.exports = { shoot, BASE };

if (require.main === module) {
  const [outDir, url, ...flags] = process.argv.slice(2);
  const mobile = flags.includes('--mobile');
  const light = flags.includes('--light');
  const hoverFlag = flags.find((f) => f.startsWith('--hover='));
  const slugFlag = flags.find((f) => f.startsWith('--slug='));

  shoot({
    outDir,
    slug: slugFlag ? slugFlag.split('=')[1] : mobile ? 'mobile' : 'desktop',
    url: url.startsWith('http') ? url : BASE + url,
    width: mobile ? 390 : 1440,
    height: mobile ? 844 : 900,
    light,
    hover: hoverFlag ? hoverFlag.split('=')[1] : null,
  })
    .then(({ file, errors }) => {
      console.log('wrote', file);
      if (errors.length) console.log('CONSOLE ERRORS:\n  ' + errors.join('\n  '));
      else console.log('no console errors');
    })
    .catch((e) => {
      console.error('FAILED', e.message);
      process.exit(1);
    });
}
