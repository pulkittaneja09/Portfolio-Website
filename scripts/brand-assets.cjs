/**
 * Regenerates the brand assets in the site's palette (Midnight + Glacier):
 *
 *   public/og.png                1200×630 social card (Open Graph + Twitter)
 *   public/favicon.svg           the "PT" mark
 *   public/favicon.ico           16 + 32px, PNG-in-ICO
 *   public/apple-touch-icon.png  180px
 *   public/icon-192.png, icon-512.png  manifest icons
 *   public/icon-maskable.png     512px, full bleed, mark inside the 80% safe zone
 *
 * Everything is rendered by Chrome from HTML with the site's own fonts, so the
 * card always matches the page. Run after a palette or copy change:
 *
 *   npm run brand
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const font = (file) =>
  `data:font/woff2;base64,${fs.readFileSync(path.join(PUBLIC, 'fonts', file)).toString('base64')}`;

// Palette tokens (dark theme), from src/index.css.
const C = {
  bg: '#0A0E14',
  strong: '#EEF2F8',
  text: '#A3ADBD',
  faint: '#7A8597',
  accent: '#8FB4FF',
  secondary: '#7DD3C0',
};

const fonts = `
  @font-face { font-family: Geist; src: url(${font('geist-latin.woff2')}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Geist Mono'; src: url(${font('geist-mono-latin.woff2')}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Instrument Serif'; font-style: italic; src: url(${font('instrument-serif-italic-latin.woff2')}) format('woff2'); }
`;

const og = `<!doctype html><html><head><style>${fonts}
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${C.bg}; color: ${C.text}; font-family: Geist; overflow: hidden; position: relative; }
  .pool { position: absolute; border-radius: 50%; }
  .a { width: 900px; height: 900px; left: -260px; top: -420px; background: radial-gradient(closest-side, rgba(143,180,255,0.16), transparent); }
  .b { width: 800px; height: 800px; right: -300px; bottom: -480px; background: radial-gradient(closest-side, rgba(125,211,192,0.10), transparent); }
  .wrap { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .status { font: 22px 'Geist Mono'; color: ${C.text}; display: flex; align-items: center; gap: 14px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: ${C.accent}; }
  h1 { margin-top: 30px; font-size: 104px; font-weight: 600; letter-spacing: -0.035em; color: ${C.strong}; line-height: 1; }
  h2 { margin-top: 26px; font-size: 38px; font-weight: 500; letter-spacing: -0.012em; color: ${C.strong}; }
  p { margin-top: 30px; font-size: 30px; color: ${C.text}; }
  em { font-family: 'Instrument Serif'; font-size: 1.14em; padding-right: 0.08em;
       background: linear-gradient(100deg, ${C.accent} 20%, color-mix(in srgb, ${C.accent} 55%, ${C.secondary}));
       -webkit-background-clip: text; background-clip: text; color: transparent; }
  .tags { position: absolute; bottom: 44px; left: 0; right: 0; text-align: center; font: 18px 'Geist Mono'; letter-spacing: 0.14em; color: ${C.faint}; }
  .rule { position: absolute; left: 80px; right: 80px; bottom: 92px; height: 1px; background: linear-gradient(to right, transparent, rgba(196,212,240,0.12), transparent); }
</style></head><body>
  <div class="pool a"></div><div class="pool b"></div>
  <div class="wrap">
    <div class="status"><span class="dot"></span>Open to AI/ML &amp; backend internships · 2027</div>
    <h1>Pulkit Taneja</h1>
    <h2>AI Agents &amp; Backend Engineer</h2>
    <p>I build <em>agents</em> that actually ship.</p>
  </div>
  <div class="rule"></div>
  <div class="tags">MCP · LANGGRAPH · RAG · FASTAPI · GO</div>
</body></html>`;

// The mark: "PT" in Geist on the midnight ground, a glacier hairline.
const markSvg = (
  size,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="14" fill="${C.bg}"/>
  <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="${C.accent}" stroke-opacity="0.35" stroke-width="2"/>
</svg>`;

const markHtml = (size) => `<!doctype html><html><head><style>${fonts}
  * { margin: 0; } body { width: ${size}px; height: ${size}px; background: transparent; }
  .m { position: relative; width: ${size}px; height: ${size}px; }
  .m svg { position: absolute; inset: 0; }
  .t { position: absolute; inset: 0; display: grid; place-items: center; font-family: Geist; font-weight: 600;
       font-size: ${size * 0.44}px; letter-spacing: -0.04em; color: ${C.strong}; }
</style></head><body><div class="m">${markSvg(size)}<div class="t">PT</div></div></body></html>`;

/** A minimal ICO container holding PNG images (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  await page.setContent(og, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(PUBLIC, 'og.png') });

  const render = async (size) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(markHtml(size), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    return page.screenshot({ omitBackground: true });
  };
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), await render(180));
  fs.writeFileSync(path.join(PUBLIC, 'icon-192.png'), await render(192));
  fs.writeFileSync(path.join(PUBLIC, 'icon-512.png'), await render(512));
  // Maskable: full-bleed ground, the mark scaled into the safe zone.
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(
    `<!doctype html><html><head><style>${fonts} *{margin:0} body{width:512px;height:512px;background:${C.bg};display:grid;place-items:center;font-family:Geist;font-weight:600;font-size:150px;letter-spacing:-0.04em;color:${C.strong}}</style></head><body>PT</body></html>`,
    { waitUntil: 'load' },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(PUBLIC, 'icon-maskable.png') });
  fs.writeFileSync(
    path.join(PUBLIC, 'favicon.ico'),
    ico([
      { size: 16, data: await render(16) },
      { size: 32, data: await render(32) },
    ]),
  );

  // The SVG favicon keeps the glyphs as outlines from the previous mark, on the new colours.
  const svgPath = path.join(PUBLIC, 'favicon.svg');
  const svg = fs.readFileSync(svgPath, 'utf8');
  const glyphs = svg
    .slice(svg.indexOf('<g '), svg.lastIndexOf('</g>') + 4)
    .replace(/fill="#[0-9A-Fa-f]{6}"/, `fill="${C.strong}"`);
  fs.writeFileSync(
    svgPath,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${C.bg}"/><rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="${C.accent}" stroke-opacity="0.35" stroke-width="2"/>${glyphs}</svg>`,
  );

  await browser.close();
  console.log(
    'og.png, favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable.png written to public/',
  );
})();
