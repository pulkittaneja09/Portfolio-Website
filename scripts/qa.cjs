/**
 * Design QA for the redesign, at 1440, 1280, 1024 and 390px:
 *
 *   (a) "Pulkit Taneja" is on one line (measured from the text's line boxes)
 *   (b) no light-theme toggle in the DOM, no light-theme CSS
 *   (c) after scrolling, nothing in the viewport rests below opacity 1 or blurred
 *   (d) body text contrast is at least 7:1 — at rest, under the brightest
 *       point of the cursor spotlight, and inside a hovered row
 *
 * Screenshots for the visual review land in .screenshots/qa/.
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/qa.cjs
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.AUDIT_BASE || 'http://localhost:4173';
const OUT = path.join(__dirname, '..', '.screenshots', 'qa');
const SIZES = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [390, 844],
];

function inPage() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return { r: 0, g: 0, b: 0, a: 0 };
    const [r, g, b, a = 1] = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return { r, g, b, a };
  };
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const ground = parse(getComputedStyle(document.body).backgroundColor);

  const backgroundOf = (el, extra) => {
    const chain = [];
    for (let node = el; node && node !== document.documentElement; node = node.parentElement)
      chain.unshift(node);
    let bg = { ...ground };
    if (extra) bg = over(extra, bg);
    chain.forEach((node) => {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c.a > 0 && node !== document.body) bg = over(c, bg);
    });
    return bg;
  };

  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);

  return {
    nameLines() {
      const h1 = document.querySelector('h1');
      const range = document.createRange();
      range.selectNodeContents(h1);
      const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
      return {
        lines,
        textW: Math.round(range.getBoundingClientRect().width),
        boxW: Math.round(h1.getBoundingClientRect().width),
        font: getComputedStyle(h1).fontSize,
      };
    },
    themeToggles() {
      const hits = [];
      document.querySelectorAll('button, a, [role="switch"], input').forEach((el) => {
        const text = `${el.textContent} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''}`;
        if (/\btheme\b|light mode|dark mode|toggle (light|dark)|switch to (light|dark)/i.test(text))
          hits.push(text.trim().slice(0, 60));
      });
      if (document.documentElement.classList.contains('light')) hits.push('html.light class present');
      for (const sheet of document.styleSheets) {
        let rules;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of rules) {
          const text = rule.cssText;
          if (/html\.light|\.light\s*\{|prefers-color-scheme:\s*light/.test(text))
            hits.push(`CSS: ${text.slice(0, 60)}`);
        }
      }
      return hits;
    },
    violationsInView() {
      const out = [];
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw)
          return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const blur = /blur\(/.test(cs.filter) || /blur\(/.test(cs.backdropFilter || '');
        if (parseFloat(cs.opacity) < 1 || blur)
          out.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} op=${cs.opacity}${blur ? ' BLUR' : ''}`,
          );
      });
      return out;
    },
    contrast(spotlight) {
      // Body text: elements with their own text in the body colour (#A1A1AA).
      const body = { r: 161, g: 161, b: 170 };
      const spot = spotlight ? { r: 217, g: 199, b: 167, a: 0.045 } : null;
      let min = Infinity;
      let worst = null;
      let count = 0;
      document.querySelectorAll('main *, header *').forEach((el) => {
        if (!ownText(el)) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || parseFloat(cs.fontSize) < 13) return;
        const r = el.getBoundingClientRect();
        if (r.width < 1) return;
        const fg = parse(cs.color);
        if (!(
          Math.abs(fg.r - body.r) < 2 &&
          Math.abs(fg.g - body.g) < 2 &&
          Math.abs(fg.b - body.b) < 2 &&
          fg.a > 0.99
        ))
          return;
        const bg = backgroundOf(el, spot);
        const value = ratio(fg, bg);
        count += 1;
        if (value < min) {
          min = value;
          worst = `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 36)}"`;
        }
      });
      return { min: Math.round(min * 100) / 100, worst, count };
    },
    hoveredRowContrast() {
      const row = document.querySelector('.row-card:hover');
      if (!row) return null;
      const spot = { r: 217, g: 199, b: 167, a: 0.045 };
      let min = Infinity;
      row.querySelectorAll('li, p').forEach((el) => {
        if (!ownText(el)) return;
        const cs = getComputedStyle(el);
        const fg = parse(cs.color);
        if (fg.a < 0.99 && fg.r > 200) {
          // text-strong/80: composite the alpha over the row's background.
          const bg = backgroundOf(el, spot);
          min = Math.min(min, ratio(over(fg, bg), bg));
          return;
        }
        const bg = backgroundOf(el, spot);
        min = Math.min(min, ratio(fg, bg));
      });
      return Math.round(min * 100) / 100;
    },
  };
}

async function call(page, name, arg) {
  return page.evaluate(
    ({ source, name, arg }) => {
      const api = new Function(`return (${source})()`)();
      return api[name](arg);
    },
    { source: inPage.toString(), name, arg },
  );
}

async function settle(page) {
  let last = -1;
  let still = 0;
  while (still < 4) {
    const y = await page.evaluate(() => window.scrollY);
    still = y === last ? still + 1 : 0;
    last = y;
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(900);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const report = [];
  let failed = false;

  for (const [width, height] of SIZES) {
    const mobile = width < 700;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
    });
    await context.route('https://api.github.com/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ public_repos: 22, login: 'pulkittaneja09' }),
      }),
    );
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));

    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    if (!mobile) await page.mouse.move(160, Math.round(height * 0.66));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(OUT, `${width}-top.png`) });

    const name = await call(page, 'nameLines');
    const toggles = await call(page, 'themeToggles');
    const rest = await call(page, 'contrast', false);
    const lit = await call(page, 'contrast', true);

    // Scroll the whole page, checking the viewport at every screenful.
    const violations = [];
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= total; y += Math.round(height * 0.8)) {
      if (mobile) await page.evaluate((v) => window.scrollTo(0, v), y);
      else {
        const current = await page.evaluate(() => window.scrollY);
        await page.mouse.wheel(0, y - current);
      }
      await settle(page);
      (await call(page, 'violationsInView')).forEach((v) => violations.push(`@${y} ${v}`));
    }

    // Hover a project row (desktop) and re-check its contrast with the light on it.
    let hovered = null;
    if (!mobile) {
      await page.evaluate(() =>
        document.querySelector('#projects .row-card').scrollIntoView({ block: 'center' }),
      );
      await settle(page);
      const box = await page.locator('#projects .row-card').first().boundingBox();
      await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.3, { steps: 6 });
      await page.waitForTimeout(500);
      hovered = await call(page, 'hoveredRowContrast');
      await page.screenshot({ path: path.join(OUT, `${width}-hover.png`) });
      await page.mouse.move(160, Math.round(height * 0.66));
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `${width}-full.png`), fullPage: true });

    const pass = {
      a: name.lines === 1 && name.textW <= name.boxW,
      b: toggles.length === 0,
      c: violations.length === 0,
      d: rest.min >= 7 && lit.min >= 7 && (hovered === null || hovered >= 7),
    };
    if (!Object.values(pass).every(Boolean) || errors.length) failed = true;

    report.push(
      [
        `── ${width}×${height}`,
        `  (a) name: ${name.lines} line, ${name.textW}px text in ${name.boxW}px at ${name.font}  ${pass.a ? 'PASS' : 'FAIL'}`,
        `  (b) theme toggles / light CSS: ${toggles.length ? toggles.join(' | ') : 'none'}  ${pass.b ? 'PASS' : 'FAIL'}`,
        `  (c) hidden or blurred after scrolling: ${violations.length ? violations.slice(0, 5).join(' | ') : 'none'}  ${pass.c ? 'PASS' : 'FAIL'}`,
        `  (d) body text contrast: min ${rest.min}:1 at rest, ${lit.min}:1 under the spotlight${hovered ? `, ${hovered}:1 in a hovered row` : ''} (${rest.count} text nodes; lowest: ${rest.worst})  ${pass.d ? 'PASS' : 'FAIL'}`,
        errors.length ? `  page errors: ${errors.join(' | ')}` : '  page errors: none',
      ].join('\n'),
    );
    await context.close();
  }

  await browser.close();
  console.log(report.join('\n'));
  console.log(failed ? '\nQA: FAIL' : '\nQA: all checks pass');
  process.exit(failed ? 1 : 0);
})();
