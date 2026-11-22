# pulkittaneja.dev

Personal portfolio for **Pulkit Taneja** — AI agents & backend engineer, co-founder of Audaxity
Technologies.

Built with Vite, React 18, TypeScript (strict), Tailwind CSS, Framer Motion (overlays only) and Lenis.
Deploys to Vercel. Dark and light themes.

**Live:** <https://portfolio-website-pi-blush-92.vercel.app>

```bash
npm install
npm run dev      # http://localhost:5173
```

---

## Table of contents

- [Editing the content](#editing-the-content)
- [Adding a project](#adding-a-project)
- [Screenshots](#screenshots)
- [Environment variables](#environment-variables)
- [Deploying to Vercel](#deploying-to-vercel)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [How it is put together](#how-it-is-put-together)
- [Open TODOs](#open-todos)

---

## Editing the content

**All copy lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).** Nothing is hard-coded in a
component, so you can change the whole site without opening any JSX. Every field is typed in
[`src/data/types.ts`](src/data/types.ts), so if you break a shape, `npm run build` tells you where.

| What you want to change                                               | Export to edit |
| --------------------------------------------------------------------- | -------------- |
| Name, title, one-liner, email, socials, availability line             | `profile`      |
| The two About paragraphs (`**phrase**` = highlight, `*word*` = serif) | `about`        |
| The "Now" row (the LeetCode count is added at build time)             | `now`          |
| The left-column agent-run card (example traces, not metrics)          | `agentTraces`  |
| Degree, institution, dates                                            | `education`    |
| The section nav and its order                                         | `nav`          |
| The experience rows (`impact` = the two short lines on the page)      | `experience`   |
| The four flagship projects and their case studies                     | `projects`     |
| The one-line "More" list                                              | `sideProjects` |
| The founder card, its mission and pipeline                            | `venture`      |
| Sourced numbers, used by the terminal and the Ask widget              | `stats`        |
| The Skills section (also the terminal and Ask); evidence is computed  | `skillGroups`  |

Two rules worth keeping:

1. **Every number needs a `source`.** Each entry in `stats` explains where the figure comes from. If
   you cannot source a number, do not add it. The agent traces are labelled "example trace" on the
   page for the same reason: they are illustrations, not measurements.
2. **`profile.siteUrl` is the one place the domain lives.** It fills every `__SITE_URL__` in
   [`index.html`](index.html) (canonical, Open Graph, JSON-LD) and the `sitemap.xml` and `robots.txt`
   generated at build time. Change it there if you add a custom domain.

The content also feeds three other surfaces automatically — the ⌘K palette, the terminal
(`src/lib/terminal.ts`) and the "Ask about Pulkit" widget (`src/lib/ask.ts`). Adding a project makes
it searchable in all three without extra work.

## Adding a project

Append an object to `projects` in `src/data/portfolio.ts`. The required shape is in `types.ts`, but
the parts that matter:

```ts
{
  slug: 'my-project',          // becomes /projects/my-project
  name: 'My Project',
  problem: 'What was broken before this existed (case study).',
  oneLiner: 'The same problem in ~50 characters (project row).',
  built: 'What you built.',
  role: 'What you personally did.',
  year: '2026',
  stack: ['FastAPI', 'React'],
  metric: { value: 'R² = 0.9', label: 'what the number measures' },
  links: { demo: '…', repo: '…', api: '…' },   // all optional
  preview: '/previews/my-project.webp',         // or null → architecture schematic
  tags: ['Backend'],
  detail: { overview, highlights, challenges, next, architecture },
}
```

**`detail.architecture`** renders as an SVG flow diagram on the case study — no diagramming library.
Give each node a `col` (left to right) and `row` (top to bottom), plus a `tone` of `client`,
`service`, `model` or `store`, then list the `edges`. A project without a screenshot uses the same
nodes for its row thumbnail, so it never shows an empty frame.

The generated sitemap picks up the new case study automatically.

## Screenshots

Previews live in `public/previews/` as WebP, at two sizes: `name.webp` (1024px wide) and
`name-sm.webp` (640px), picked via `srcset`. Thumbnails are 16:10. To add a pair:

```bash
python -c "
from PIL import Image
im = Image.open('shot.png').convert('RGB')
for w in (1024, 640):
    out = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    out.save(f'public/previews/my-project{\"\" if w == 1024 else \"-sm\"}.webp', 'WEBP', quality=80, method=6)
"
```

## Environment variables

Copy `.env.example` to `.env`. The one variable is optional.

| Variable       | What it does                                                                    |
| -------------- | ------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Raises the GitHub rate limit for the build's repo-count fetch. Build-time only. |

> `GITHUB_TOKEN` is read by `config/site-plugin.ts` in Node and never reaches the browser (it has no
> `VITE_` prefix), so it is safe to set in Vercel. Never use a `VITE_`-prefixed token: anything with
> that prefix is inlined into the client bundle. Without a token the build uses the public API and
> falls back to the last good count, then to the figure in `portfolio.ts`.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import it. There is nothing to configure.
3. Deploy.

[`vercel.json`](vercel.json) pins the build (framework `vite`, `npm run build`, output `dist`), so it
never depends on the dashboard settings. That matters here: this repository started as a static HTML
site, and a Vercel project imported back then would otherwise keep its old preset and serve the wrong
folder. It also redirects `/resume` to the PDF (a clean URL to share), rewrites non-`/api` paths to
`index.html` (so `/projects/parcelpilot` survives a hard refresh), caches `/assets/*` and `/fonts/*`
for a year, and sets `X-Content-Type-Options`, `Referrer-Policy` and `X-Frame-Options`.

## Project structure

```
public/
  fonts/            self-hosted woff2: Geist, Geist Mono, Instrument Serif italic
  previews/         project screenshots, WebP at 1024 and 640
  skills.svg        monochrome Simple Icons sprite for the skill chips (npm run icons)
  Pulkit_Taneja_Resume.pdf
  og.png            1200x630 social card, centred so a square crop still reads
  favicon.svg  favicon.ico  apple-touch-icon.png  icon-192.png  icon-512.png
  site.webmanifest  (sitemap.xml and robots.txt are generated into dist/)

config/
  site-plugin.ts    build-time LeetCode + GitHub counts, last-updated date,
                    the site URL in index.html, sitemap.xml and robots.txt

src/
  data/
    portfolio.ts    ← all content lives here
    types.ts        the shape of it
  sections/         About, Experience, Skills, Projects, Founder, Contact
  components/       identity rail (Identity, SectionNav, ProfileLinks, AgentRun),
                    MobileBar, rows and thumbnails, PipelineFlow, palette,
                    terminal, Ask widget, cursor spotlight, architecture diagram
  pages/            Home (the split layout), ProjectDetail, NotFound, Resume
  hooks/            reduced motion, media queries, scroll-spy, Lenis,
                    clipboard, shortcuts
  lib/              theme, reveal, build-time stats, view transitions, terminal
                    commands, answer engine, helpers
scripts/
  qa.cjs            design QA at 1440 / 1280 / 1024 / 390
  reveal-check.cjs  strict "nothing stuck invisible" regression check
  skill-icons.mjs   builds public/skills.svg from the slugs in SKILL_ICONS
```

## Scripts

| Command                | What it does                                                                                                                                                                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Dev server with HMR on port 5173                                                                                                                                                                                                                                                                               |
| `npm run build`        | Type-check with `tsc -b`, then build to `dist/`                                                                                                                                                                                                                                                                |
| `npm run preview`      | Serve the production build locally                                                                                                                                                                                                                                                                             |
| `npm run lint`         | ESLint, zero warnings tolerated                                                                                                                                                                                                                                                                                |
| `npm run format`       | Prettier over `src/`                                                                                                                                                                                                                                                                                           |
| `npm run qa`           | With a preview server on :4173, at four widths and in both themes: one-line name, no theme flash and a working toggle, nothing hidden after scrolling, body contrast ≥ 7:1, accent contrast ≥ 4.5:1, exact LeetCode links, no GPA, no console errors or third-party requests; screenshots to `.screenshots/qa` |
| `npm run check:reveal` | With a preview server on :4173: strict snapshots (about 35) across scrolls, jumps, deep links, resize, a no-scroll full-page capture and mobile                                                                                                                                                                |
| `npm run icons`        | Rebuilds `public/skills.svg` from the Simple Icons slugs listed in `SKILL_ICONS` (`src/data/types.ts`)                                                                                                                                                                                                         |

## How it is put together

A few decisions that are not obvious from reading the files:

**A split layout.** On desktop the left column is a sticky, full-height rail (name, title, one-liner,
status, the section nav, the agent-run card, links and a live Chennai clock); the right column
scrolls. Its spacing steps down in height tiers (roomy above 780px tall, compact to 680, tight to 620,
static below) so the rail fits real laptop viewports without ever squeezing the card. Below 1024px
the rail becomes the page header and a thin bar carries the current section and a Menu/⌘K button.

**Two themes, one brand.** Dark is the default design: body `#A1A1AA` (7.6:1 on `#0B0C0E`), names and
highlights `#F2F2F2`, metadata `#5C5C66`, and champagne `#D9C7A7` only on the active nav line, hover
titles, metrics, the status dot, ✓ marks and link underlines. Light is a clean, corporate counterpart,
not an inversion: warm off-white `#FAFAF9`, pure-white surfaces, body `#52525B` (7.4:1), black
hairlines, depth from soft shadows instead of glows, and deep bronze `#7A5C2E` (5.9:1) in the same
places as the champagne. The page-wide cursor spotlight peaks at 4.5% champagne in dark (measured to
keep every word above 7:1 under the pointer) and is off in light. Every colour is a CSS variable, so a
theme is one block of values in `index.css`; `border-line/[0.07]` is white in dark and black in light.

**No flash, remembered choice.** An inline script in `index.html` sets `html[data-theme]` before any
CSS loads: the saved choice, else the system setting (followed live until the visitor picks). The sun
/ moon toggle sits beside the socials (in the top bar on phones), and ⌘K and the terminal's `theme`
command do the same. The switch is a circle growing from the toggle on the View Transitions API, instant
without it or under reduced motion.

**Seven type sizes.** 12px mono for labels and metadata, 14px for row text, 16px body, then 20, 24, 48
and 60px, each with one job. The serif accent word is set at 1.14em of its sentence. Before adding a
size, check whether one of these already does the job.

**The agent-run card** is driven by one elapsed-time clock in a rAF loop: the prompt types out, a
line lands every 350ms, timings resolve with a ✓, the result holds for 4s, then the next example
plays. Hover pauses it; the loop stops when it is off screen or the tab is hidden; reduced motion shows
one complete trace. The traces are plain ASCII on purpose — the mono font's latin subset has no
arrow glyphs.

**Reveals can never leave content hidden.** `lib/reveal.ts` keeps everything visible by default. An
element is only hidden after the visitor has actually scrolled, only while it is fully below the fold,
and it is shown the moment it enters; a sweep after every scroll catches anything else. Full-page
screenshots, prints and crawlers see every element. Decorative motion (status pulse, caret, trace
lines) is done with colour, so nothing on screen ever rests below opacity 1, and nothing carries a
blur.

**The page calls no third-party API.** The LeetCode solved count and the public repo count are
fetched once per build (`config/site-plugin.ts`, exposed as `virtual:site-stats`), so CORS and rate
limits cannot break the page or log a console error. A failed fetch falls back to the last good value
cached in `node_modules/.cache`, then to no number at all: the Now row then reads "LeetCode ↗".

**Case studies open with a View Transition.** `TransitionLink` wraps the route change in
`document.startViewTransition`: the page crossfades with a 10px lift, and on desktop the clicked
project's thumbnail morphs into the case study's screenshot (and back on the way out). Navigation and
scroll both happen inside the update callback, so the new snapshot is already in place. Browsers
without the API, and reduced motion, get a plain navigation.

**Skills show their evidence.** Each chip's "Used in" tooltip, and the click that highlights the
matching experience and project rows (the rest fade to 40%, with a "Showing work with FastAPI · Clear"
pill above Projects), is computed by `lib/skills.ts` from the real `stack` and `tags` in
`portfolio.ts`; a skill's `aliases` bridge naming differences ("Gemini 2.5 Flash" counts for LLM APIs).
Nothing is typed by hand, and a skill with no tagged work is listed but not clickable. The logos come
from one cached SVG sprite, so they cost nothing in the JS bundle.

**Rows dim their siblings with `:has()`.** Hovering an experience or project row lifts it onto a 3%
panel and fades the others to 50%; hovering the gap between rows dims nothing.

**Framer Motion runs behind `LazyMotion`** and is only used by the overlays (palette, terminal, Ask
widget, toasts), which are themselves lazy chunks warmed once the page is idle.

**The answer widget has no model behind it.** `lib/ask.ts` scores a question against topics built
from `portfolio.ts`. No API key, no network call, and no way for it to invent a credential. Nothing
floats over the content: on desktop it opens from a 36px button sized to sit in the page gutter, on
phones from the top bar's Ask button, and from ⌘K everywhere.

**Everything respects `prefers-reduced-motion`.** No Lenis, no spotlight, no entrances, reveals or
view transitions, a static agent trace, and a global rule collapses any remaining animation.

**It prints.** Every colour is a token, so `@media print` swaps the tokens for ink on white and hides
the fixed chrome; reveals are forced visible on `beforeprint`.

## Open TODOs

Search the codebase for `TODO(pulkit)`. At the time of writing:

- `profile.siteUrl` — change it if you add a custom domain or rename the Vercel project.
- The DPIIT recognition number and date in `venture.badges`.
- The Audaxity site URL, once it is live (the Audaxity row links to the founder card meanwhile).
- Company URLs for SDG Corporation and Dezors, which turn those experience rows into links.
- A dashboard screenshot for Scrap 2 Spark and a cited-answer screenshot for KnowledgeHub AI (the
  current thumbnails are the live demos' landing screens), and an IEEE preview if one exists.
- A live URL for the IEEE recruitment portal, if it is still public.
