# pulkittaneja.dev

Personal portfolio for **Pulkit Taneja** — AI agents & backend engineer, co-founder of Audaxity
Technologies.

Built with Vite, React 18, TypeScript (strict), Tailwind CSS, Framer Motion (overlays only) and Lenis.
Deploys to Vercel. Dark only.

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

| What you want to change                                               | Export to edit      |
| --------------------------------------------------------------------- | ------------------- |
| Name, title, one-liner, email, socials, availability line             | `profile`           |
| The two About paragraphs (`**phrase**` = highlight, `*word*` = serif) | `about`             |
| The "Now" strip and the "Daily tools" line                            | `now`, `dailyTools` |
| The left-column agent-run card (example traces, not metrics)          | `agentTraces`       |
| Degree, institution, CGPA, dates                                      | `education`         |
| The section nav and its order                                         | `nav`               |
| The experience rows (`impact` = the two short lines on the page)      | `experience`        |
| The four flagship projects and their case studies                     | `projects`          |
| The one-line "More" list                                              | `sideProjects`      |
| The founder card, its mission and pipeline                            | `venture`           |
| Sourced numbers, used by the terminal and the Ask widget              | `stats`             |
| Skills, used by the terminal's `skills` command                       | `skillGroups`       |

Two rules worth keeping:

1. **Every number needs a `source`.** Each entry in `stats` explains where the figure comes from. If
   you cannot source a number, do not add it. The agent traces are labelled "example trace" on the
   page for the same reason: they are illustrations, not measurements.
2. **`siteUrl` drives canonical URLs, the sitemap, Open Graph and JSON-LD.** Set it to your real
   domain after the first deploy, and update the matching URLs in [`index.html`](index.html) and
   [`public/sitemap.xml`](public/sitemap.xml).

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

After adding a project, add its URL to `public/sitemap.xml`.

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

| Variable            | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `VITE_GITHUB_TOKEN` | Raises the GitHub API rate limit **for local development only**. |

> **Do not set `VITE_GITHUB_TOKEN` in Vercel.** Anything prefixed `VITE_` is inlined into the client
> bundle. The site makes one cached request (the public repo count under Projects) and falls back to
> the number in `portfolio.ts` if the unauthenticated limit is ever hit.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import it. There is nothing to configure.
3. Deploy.

[`vercel.json`](vercel.json) pins the build (framework `vite`, `npm run build`, output `dist`), so it
never depends on the dashboard settings. That matters here: this repository started as a static HTML
site, and a Vercel project imported back then would otherwise keep its old preset and serve the wrong
folder. It also rewrites non-`/api` paths to `index.html` (so `/projects/parcelpilot` survives a hard
refresh), caches `/assets/*` and `/fonts/*` for a year, and sets `X-Content-Type-Options`,
`Referrer-Policy` and `X-Frame-Options`.

## Project structure

```
public/
  fonts/            self-hosted woff2: Geist, Geist Mono, Instrument Serif italic
  previews/         project screenshots, WebP at 1024 and 640
  Pulkit_Taneja_Resume.pdf
  og.png            1200x630 social card
  favicon.svg  robots.txt  sitemap.xml  site.webmanifest

src/
  data/
    portfolio.ts    ← all content lives here
    types.ts        the shape of it
  sections/         About, Experience, Projects, Founder, Contact
  components/       identity rail (Identity, SectionNav, ProfileLinks, AgentRun),
                    MobileBar, rows and thumbnails, PipelineFlow, palette,
                    terminal, Ask widget, cursor spotlight, architecture diagram
  pages/            Home (the split layout), ProjectDetail, NotFound
  hooks/            reduced motion, media queries, scroll-spy, Lenis,
                    clipboard, GitHub, shortcuts
  lib/              reveal, GitHub client, terminal commands, answer engine, helpers
scripts/
  qa.cjs            design QA at 1440 / 1280 / 1024 / 390
  reveal-check.cjs  strict "nothing stuck invisible" regression check
```

## Scripts

| Command                | What it does                                                                                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Dev server with HMR on port 5173                                                                                                                                      |
| `npm run build`        | Type-check with `tsc -b`, then build to `dist/`                                                                                                                       |
| `npm run preview`      | Serve the production build locally                                                                                                                                    |
| `npm run lint`         | ESLint, zero warnings tolerated                                                                                                                                       |
| `npm run format`       | Prettier over `src/`                                                                                                                                                  |
| `npm run qa`           | With a preview server on :4173: one-line name, no theme toggle, nothing hidden after scrolling, body contrast ≥ 7:1, at four widths; screenshots to `.screenshots/qa` |
| `npm run check:reveal` | With a preview server on :4173: 33 strict snapshots across scrolls, jumps, deep links, resize, a no-scroll full-page capture and mobile                               |

## How it is put together

A few decisions that are not obvious from reading the files:

**A split layout.** On desktop the left column is a sticky, full-height rail (name, title, one-liner,
status, the section nav, the agent-run card, links and a live Chennai clock); the right column
scrolls. Its spacing steps down in height tiers (roomy above 780px tall, compact to 680, tight to 620,
static below) so the rail fits real laptop viewports without ever squeezing the card. Below 1024px
the rail becomes the page header and a thin bar carries the current section and a Menu/⌘K button.

**Two greys and one colour.** Body text is `#A1A1AA` (7.6:1 on `#0B0C0E`), names and highlights
`#F2F2F2`, metadata `#5C5C66`. Champagne `#D9C7A7` appears only on the active nav line, hover titles,
metrics, the status dot, ✓ marks and link underlines. The page-wide cursor spotlight peaks at 4.5%
champagne — measured to keep every word above 7:1 even directly under the pointer.

**The agent-run card** is driven by one elapsed-time clock in a rAF loop: the prompt types out, a
line lands every 350ms, timings resolve with a ✓, the result holds for 4s, then the next example
plays. Hover pauses it; the loop stops when it is off screen or the tab is hidden; reduced motion shows
one complete trace. The traces are plain ASCII on purpose — the mono font's latin subset has no
arrow glyphs.

**Reveals can never leave content hidden.** `lib/reveal.ts` keeps everything visible by default. An
element is only hidden after the visitor has actually scrolled, only while it is fully below the fold,
and it is shown the moment it enters; a sweep after every scroll catches anything else. Full-page
screenshots, prints and crawlers see every element. Decorative motion (status pulse, caret, trace
lines, grain) is done with colour, so nothing on screen ever rests below opacity 1, and nothing
carries a blur.

**Rows dim their siblings with `:has()`.** Hovering an experience or project row lifts it onto a 3%
panel and fades the others to 50%; hovering the gap between rows dims nothing.

**Framer Motion runs behind `LazyMotion`** and is only used by the overlays (palette, terminal, Ask
widget, toasts), which are themselves lazy chunks warmed once the page is idle.

**The answer widget has no model behind it.** `lib/ask.ts` scores a question against topics built
from `portfolio.ts`. No API key, no network call, and no way for it to invent a credential.

**Everything respects `prefers-reduced-motion`.** No Lenis, no spotlight, no entrances or reveals, a
static agent trace, and a global rule collapses any remaining animation.

## Open TODOs

Search the codebase for `TODO(pulkit)`. At the time of writing:

- `profile.siteUrl` — set to the real domain after the first deploy.
- The DPIIT recognition number and date in `venture.badges`.
- The Audaxity site URL, once it is live (the Audaxity row links to the founder card meanwhile).
- Company URLs for SDG Corporation and Dezors, which turn those experience rows into links.
- A dashboard screenshot for Scrap 2 Spark and a cited-answer screenshot for KnowledgeHub AI (the
  current thumbnails are the live demos' landing screens), and an IEEE preview if one exists.
- A live URL for the IEEE recruitment portal, if it is still public.
