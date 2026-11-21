/**
 * Visual audit harness for the redesign.
 *
 * Captures every home-page section, a case study and the two overlays at
 * 1440px and 390px, dark and light, into .screenshots/audit. The GitHub API is
 * mocked so the loaded state of the activity section is always captured, no
 * matter the local rate limit.
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/audit.cjs
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.AUDIT_BASE || 'http://localhost:4173';
const OUT = path.join(__dirname, '..', '.screenshots', 'audit');
const SECTIONS = ['#hero', '#work', '#experience', '#audaxity', '#stack', '#github', '#contact', 'footer'];

const now = Date.now();
const repo = (id, name, language, description, stars = 0) => ({
  id,
  name,
  description,
  html_url: `https://github.com/pulkittaneja09/${name}`,
  homepage: null,
  language,
  stargazers_count: stars,
  forks_count: 0,
  updated_at: new Date(now - id * 86400000 * 3).toISOString(),
  fork: false,
  archived: false,
  size: 900,
  topics: [],
});

const MOCK_USER = {
  login: 'pulkittaneja09',
  name: 'Pulkit Taneja',
  avatar_url: '',
  public_repos: 22,
  followers: 14,
  html_url: 'https://github.com/pulkittaneja09',
  created_at: '2023-06-01T00:00:00Z',
};
const MOCK_REPOS = [
  repo(
    1,
    'parcelpilot',
    'Python',
    'Support-operations copilot grounded in order records and policy docs.',
    3,
  ),
  repo(2, 'scrap-2-spark', 'Python', 'Battery RUL prediction and reuse triage.', 2),
  repo(3, 'knowledgehub-ai', 'Python', 'RAG over enterprise PDFs with cited answers.', 1),
  repo(4, 'ieee-recruitment-backend', 'Go', 'Gin + PostgreSQL recruitment API.', 2),
  repo(5, 'go-movies-api', 'Go', 'RESTful CRUD in Go.'),
  repo(6, 'genai-core', 'Jupyter Notebook', 'LLM primitives, worked through.'),
  repo(7, 'portfolio', 'TypeScript', 'This site.'),
  repo(8, 'dsa', 'C++', 'Practice.'),
];

async function capture(browser, { width, light }) {
  const context = await browser.newContext({
    viewport: { width, height: width < 700 ? 844 : 900 },
    deviceScaleFactor: 1,
    hasTouch: width < 700,
    isMobile: width < 700,
  });
  await context.route('https://api.github.com/**', (route) => {
    const url = route.request().url();
    const body = url.includes('/repos') ? MOCK_REPOS : MOCK_USER;
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });

  const page = await context.newPage();
  await page.addInitScript((l) => {
    try {
      localStorage.setItem('pt-theme', l ? 'light' : 'dark');
      sessionStorage.clear();
    } catch (e) {
      /* ignore */
    }
  }, light);

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));

  const tag = `${width}-${light ? 'light' : 'dark'}`;
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.mouse.move(width * 0.7, 420);
  await page.mouse.move(width * 0.72, 440, { steps: 8 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });

  for (const selector of SECTIONS) {
    const el = await page.$(selector);
    if (!el) continue;
    await page.evaluate((s) => {
      const node = document.querySelector(s);
      window.scrollTo(0, node.getBoundingClientRect().top + window.scrollY - 20);
    }, selector);
    await page.waitForTimeout(900);
    await el.screenshot({ path: path.join(OUT, `${tag}-${selector.replace('#', '')}.png`) });
  }

  for (const [name, key] of [
    ['palette', 'Control+k'],
    ['terminal', '`'],
  ]) {
    await page.keyboard.press(key);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, `${tag}-${name}.png`) });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  await page.goto(BASE + '/projects/parcelpilot', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, `${tag}-case-study.png`), fullPage: true });

  await context.close();
  return errors.map((e) => `${tag}: ${e}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const errors = [];
  for (const width of [1440, 390]) {
    errors.push(...(await capture(browser, { width, light: false })));
  }
  await browser.close();
  console.log(`wrote ${fs.readdirSync(OUT).length} screenshots to ${OUT}`);
  console.log(errors.length ? errors.join('\n') : 'no page errors');
})();
