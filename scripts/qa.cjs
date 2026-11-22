/**
 * Design QA at 1440, 1280, 1024 and 390px, in both themes:
 *
 *   (a) "Pulkit Taneja" is on one line (measured from the text's line boxes)
 *   (b) theme: set before <body> exists and never flipped after mount (no
 *       flash), the toggle is present, and <meta name="theme-color"> matches
 *   (c) after scrolling, nothing in the viewport rests below opacity 1 or blurred
 *   (d) body text contrast is at least 7:1 — at rest, under the brightest
 *       point of the cursor spotlight (dark only; it is off in light), and
 *       inside a hovered row
 *   (e) every LeetCode link is exactly https://leetcode.com/u/PULKITTANEJA/
 *   (f) no GPA anywhere in the rendered page
 *   (g) no console errors, no failed requests, and no third-party requests
 *       (the LeetCode and GitHub counts are fetched at build time)
 *   (h) accent text (metrics, hover titles) is at least 4.5:1
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
const LEETCODE = 'https://leetcode.com/u/PULKITTANEJA/';
const OUT = path.join(__dirname, '..', '.screenshots', 'qa');
const THEMES = ['dark', 'light'];
const THEME_COLOR = { dark: '#0B0C0E', light: '#FAFAF9' };
const SIZES = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [390, 844],
];

/** Runs in the page before any of its own scripts: logs every data-theme value. */
function watchTheme() {
  window.__themeLog = [];
  const log = (when) =>
    window.__themeLog.push(`${when}:${document.documentElement.getAttribute('data-theme')}`);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') log('changed');
      else if (!window.__sawBody && document.body) {
        window.__sawBody = true;
        log('body');
      }
    }
  }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-theme'] });
}

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
  const token = (name) => {
    const [r, g, b] = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
      .split(/\s+/)
      .map(Number);
    return { r, g, b };
  };
  const same = (fg, ref) =>
    Math.abs(fg.r - ref.r) < 2 && Math.abs(fg.g - ref.g) < 2 && Math.abs(fg.b - ref.b) < 2 && fg.a > 0.99;
  const light = document.documentElement.dataset.theme === 'light';
  const ground = parse(getComputedStyle(document.body).backgroundColor);
  // The cursor spotlight's brightest point; there is no spotlight in light.
  const spotlight = light ? null : { ...token('--accent-rgb'), a: 0.045 };

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

  /** Lowest contrast among visible text whose colour matches `ref`. */
  const lowest = (ref, extra, minSize) => {
    let min = Infinity;
    let worst = null;
    let count = 0;
    document.querySelectorAll('main *, header *').forEach((el) => {
      if (!ownText(el)) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || parseFloat(cs.fontSize) < minSize) return;
      if (el.getBoundingClientRect().width < 1) return;
      const fg = parse(cs.color);
      if (!same(fg, ref)) return;
      const value = ratio(fg, backgroundOf(el, extra));
      count += 1;
      if (value < min) {
        min = value;
        worst = `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 36)}"`;
      }
    });
    return { min: count ? Math.round(min * 100) / 100 : null, worst, count };
  };

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
    themeState() {
      const toggle = [...document.querySelectorAll('[data-theme-toggle]')].find(
        (el) => el.getClientRects().length > 0,
      );
      return {
        log: window.__themeLog || [],
        toggle: Boolean(toggle),
        themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
      };
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
    contrast(withSpotlight) {
      return lowest(token('--text-rgb'), withSpotlight ? spotlight : null, 13);
    },
    accentContrast() {
      return lowest(token('--accent-rgb'), spotlight, 0);
    },
    hoveredRowContrast() {
      const row = document.querySelector('.row-card:hover');
      if (!row) return null;
      let min = Infinity;
      row.querySelectorAll('li, p, h3').forEach((el) => {
        if (!ownText(el)) return;
        const fg = parse(getComputedStyle(el).color);
        const bg = backgroundOf(el, spotlight);
        // Translucent text (text-strong/80 in a hovered row) is composited first.
        min = Math.min(min, ratio(fg.a < 0.99 ? over(fg, bg) : fg, bg));
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
    for (const theme of THEMES) {
      const mobile = width < 700;
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        isMobile: mobile,
        hasTouch: mobile,
        // The system preference points the other way, so (b) also proves the
        // saved choice wins before first paint.
        colorScheme: theme === 'dark' ? 'light' : 'dark',
      });
      await context.addInitScript((value) => {
        try {
          localStorage.setItem('theme', value);
        } catch {
          // ignore
        }
      }, theme);
      await context.addInitScript(watchTheme);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
      const noise = [];
      page.on('console', (m) => m.type() === 'error' && noise.push(`console: ${m.text().slice(0, 100)}`));
      page.on('response', (r) => r.status() >= 400 && noise.push(`HTTP ${r.status()} ${r.url()}`));
      page.on('request', (r) => {
        const host = new URL(r.url()).hostname;
        if (host !== new URL(BASE).hostname) noise.push(`third-party request: ${host}`);
      });

      await page.goto(BASE + '/', { waitUntil: 'networkidle' });
      if (!mobile) await page.mouse.move(160, Math.round(height * 0.66));
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(OUT, `${width}-${theme}-top.png`) });

      const name = await call(page, 'nameLines');
      const state = await call(page, 'themeState');
      const leetcode = await page.$$eval('a[href*="leetcode.com"]', (links) =>
        links.map((link) => link.getAttribute('href')),
      );
      const wrongLeetcode = leetcode.filter((href) => href !== LEETCODE);
      const gpa = await page.evaluate(() => /8\.25|cgpa|\bgpa\b/i.test(document.body.innerText));
      const rest = await call(page, 'contrast', false);
      const lit = await call(page, 'contrast', true);

      // Scroll the whole page, checking the viewport at every screenful.
      const violations = [];
      let accent = { min: Infinity, worst: null };
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= total; y += Math.round(height * 0.8)) {
        if (mobile) await page.evaluate((v) => window.scrollTo(0, v), y);
        else {
          const current = await page.evaluate(() => window.scrollY);
          await page.mouse.wheel(0, y - current);
        }
        await settle(page);
        (await call(page, 'violationsInView')).forEach((v) => violations.push(`@${y} ${v}`));
        const a = await call(page, 'accentContrast');
        if (a.min !== null && a.min < accent.min) accent = a;
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
        const a = await call(page, 'accentContrast');
        if (a.min !== null && a.min < accent.min) accent = a;
        await page.screenshot({ path: path.join(OUT, `${width}-${theme}-hover.png`) });
        await page.mouse.move(160, Math.round(height * 0.66));
      }

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, `${width}-${theme}-full.png`), fullPage: true });

      const pass = {
        a: name.lines === 1 && name.textW <= name.boxW,
        b:
          // The inline script sets it before <body> exists (a "changed" entry
          // first is expected); it must never read as the other theme.
          state.log.includes(`body:${theme}`) &&
          state.log.every((entry) => entry.endsWith(`:${theme}`)) &&
          state.toggle &&
          state.themeColor === THEME_COLOR[theme],
        c: violations.length === 0,
        d: rest.min >= 7 && (lit.min ?? 99) >= 7 && (hovered === null || hovered >= 7),
        e: leetcode.length > 0 && wrongLeetcode.length === 0,
        f: !gpa,
        g: noise.length === 0,
        h: accent.min >= 4.5,
      };
      if (!Object.values(pass).every(Boolean) || errors.length) failed = true;

      const spot = theme === 'dark' ? `, ${lit.min}:1 under the spotlight` : '';
      report.push(
        [
          `── ${width}×${height} ${theme}`,
          `  (a) name: ${name.lines} line, ${name.textW}px text in ${name.boxW}px at ${name.font}  ${pass.a ? 'PASS' : 'FAIL'}`,
          `  (b) theme: ${state.log.join(' ')}; toggle ${state.toggle ? 'present' : 'MISSING'}; theme-color ${state.themeColor}  ${pass.b ? 'PASS' : 'FAIL'}`,
          `  (c) hidden or blurred after scrolling: ${violations.length ? violations.slice(0, 5).join(' | ') : 'none'}  ${pass.c ? 'PASS' : 'FAIL'}`,
          `  (d) body text contrast: min ${rest.min}:1 at rest${spot}${hovered ? `, ${hovered}:1 in a hovered row` : ''} (${rest.count} text nodes; lowest: ${rest.worst})  ${pass.d ? 'PASS' : 'FAIL'}`,
          `  (e) LeetCode links: ${leetcode.length}, ${wrongLeetcode.length ? `wrong: ${wrongLeetcode.join(' | ')}` : `all ${LEETCODE}`}  ${pass.e ? 'PASS' : 'FAIL'}`,
          `  (f) GPA in the page: ${gpa ? 'found' : 'none'}  ${pass.f ? 'PASS' : 'FAIL'}`,
          `  (g) console errors, failed or third-party requests: ${noise.length ? [...new Set(noise)].slice(0, 4).join(' | ') : 'none'}  ${pass.g ? 'PASS' : 'FAIL'}`,
          `  (h) accent text contrast: min ${accent.min}:1 (lowest: ${accent.worst})  ${pass.h ? 'PASS' : 'FAIL'}`,
          errors.length ? `  page errors: ${errors.join(' | ')}` : '  page errors: none',
        ].join('\n'),
      );
      await context.close();
    }
  }

  await browser.close();
  console.log(report.join('\n'));
  console.log(failed ? '\nQA: FAIL' : '\nQA: all checks pass');
  process.exit(failed ? 1 : 0);
})();
