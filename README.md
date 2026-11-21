# pulkittaneja.dev

Personal portfolio for **Pulkit Taneja** — AI/backend engineer, co-founder of Audaxity Technologies.

Built with Vite, React 18, TypeScript (strict), Tailwind CSS, Framer Motion and React Three Fiber.
Deploys to Vercel.

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

| What you want to change                                                    | Export to edit |
| -------------------------------------------------------------------------- | -------------- |
| Name, tagline, rotating roles, summary, email, socials, availability badge | `profile`      |
| Degree, institution, CGPA, dates                                           | `education`    |
| The nav links and their order                                              | `nav`          |
| The animated numbers in the proof bar                                      | `stats`        |
| The four flagship projects and their case studies                          | `projects`     |
| The smaller "also on the shelf" repos                                      | `sideProjects` |
| The experience timeline                                                    | `experience`   |
| The Audaxity founder section                                               | `venture`      |
| The tech-stack grid                                                        | `skillGroups`  |
| The CS fundamentals chips                                                  | `fundamentals` |

Two rules worth keeping:

1. **Every number needs a `source`.** Each entry in `stats` carries a `source` string explaining
   where the figure comes from. It is shown on hover and read out to screen readers. If you add a
   number you cannot source, do not add it.
2. **`siteUrl` drives canonical URLs, the sitemap, Open Graph and JSON-LD.** Set it to your real
   domain after the first deploy, and update the matching URLs in [`index.html`](index.html) and
   [`public/sitemap.xml`](public/sitemap.xml).

The content also feeds three other surfaces automatically — the ⌘K palette, the terminal
(`src/lib/terminal.ts`) and the "Ask about Pulkit" widget (`src/lib/ask.ts`). Adding a project makes
it searchable in all three without extra work.

## Adding a project

Append an object to `projects` in `src/data/portfolio.ts`. The required shape is in
`types.ts`, but the parts that matter:

```ts
{
  slug: 'my-project',          // becomes /projects/my-project
  name: 'My Project',
  problem: 'One line: what was broken before this existed.',
  built: 'What you built.',
  role: 'What you personally did.',
  year: '2026',
  stack: ['FastAPI', 'React'],
  metric: { value: 'R² = 0.9', label: 'what the number measures' },
  links: { demo: '…', repo: '…', api: '…' },   // all optional
  preview: '/previews/my-project.webp',         // or null
  emphasis: 'standard',                          // see below
  tags: ['Backend'],
  detail: { overview, highlights, challenges, next, architecture },
}
```

**`emphasis` drives the bento layout**, so reordering the data reflows the grid with no CSS changes:

| Value      | Placement                                          |
| ---------- | -------------------------------------------------- |
| `lead`     | Tall 7-column feature tile                         |
| `standard` | 5-column tile, stacks beside the lead              |
| `wide`     | Full-width banner with the preview beside the copy |

**`detail.architecture`** renders as an SVG flow diagram — no diagramming library. Give each node a
`col` (left to right) and `row` (top to bottom), plus a `tone` of `client`, `service`, `model` or
`store`, then list the `edges` between them. See `ArchitectureDiagram.tsx` if you need to understand
the layout maths.

After adding a project, add its URL to `public/sitemap.xml`.

## Screenshots

Previews live in `public/previews/` as WebP, at two sizes: `name.webp` (1024px wide) and
`name-sm.webp` (640px). The card and detail page pick the right one via `srcset`. To add a pair:

```bash
python -c "
from PIL import Image
im = Image.open('shot.png').convert('RGB')
for w in (1024, 640):
    out = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    out.save(f'public/previews/my-project{\"\" if w == 1024 else \"-sm\"}.webp', 'WEBP', quality=78, method=6)
"
```

Then set `preview: '/previews/my-project.webp'` on the project. Extra frames listed in
`previewFrames` are cycled while the card is hovered.

A project with `preview: null` falls back to a labelled placeholder tile, so a missing screenshot
never leaves a hole.

## Environment variables

Copy `.env.example` to `.env`. Both variables are optional.

| Variable            | What it does                                                                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_FORMSPREE_ID` | The ID from a [Formspree](https://formspree.io) endpoint (`https://formspree.io/f/XXXXXXXX` → `XXXXXXXX`). Without it, the contact form falls back to opening the visitor's mail client with the message pre-filled, so it still works. |
| `VITE_GITHUB_TOKEN` | Raises the GitHub API rate limit **for local development only**.                                                                                                                                                                        |

> **Do not set `VITE_GITHUB_TOKEN` in Vercel.** Anything prefixed `VITE_` is inlined into the client
> bundle and is readable by anyone who views source. The unauthenticated limit (60 requests/hour per
> IP) is plenty in production, and the GitHub section degrades to an explanatory card when it is hit.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import it. The framework preset is detected as **Vite**;
   build command `npm run build`, output directory `dist`.
3. Add `VITE_FORMSPREE_ID` under **Settings → Environment Variables** if you are using the form.
4. Deploy.

[`vercel.json`](vercel.json) is already set up with:

- A rewrite sending all non-`/api` paths to `index.html`, so `/projects/parcelpilot` resolves on a
  hard refresh instead of 404ing.
- Immutable year-long caching for `/assets/*` and `/fonts/*` (both are content-hashed or stable).
- `X-Content-Type-Options`, `Referrer-Policy` and `X-Frame-Options`.

After the first deploy, point `profile.siteUrl` at the real domain and update the absolute URLs in
`index.html` and `public/sitemap.xml`.

Or from the CLI:

```bash
npx vercel --prod
```

## Project structure

```
public/
  fonts/            self-hosted variable woff2, latin subsets
  previews/         project screenshots, WebP at 1024 and 640
  Pulkit_Taneja_Resume.pdf
  og.png            1200x630 social card
  favicon.svg  robots.txt  sitemap.xml  site.webmanifest

src/
  data/
    portfolio.ts    ← all content lives here
    types.ts        the shape of it
  sections/         Hero, ProofBar, Projects, Experience, Audaxity,
                    Stack, GitHubActivity, Contact
  components/       reusable UI: cards, nav, palette, terminal, widget,
                    icons, brand glyphs, architecture diagram
  pages/            Home, ProjectDetail, NotFound
  hooks/            theme, reduced motion, media queries, count-up,
                    in-view, active section, clipboard, GitHub, shortcuts
  lib/              GitHub client, terminal commands, answer engine, helpers
  three/            PointSphere — the lazy grayscale point-cloud hero
```

## Scripts

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Dev server with HMR on port 5173                |
| `npm run build`   | Type-check with `tsc -b`, then build to `dist/` |
| `npm run preview` | Serve the production build locally              |
| `npm run lint`    | ESLint, zero warnings tolerated                 |
| `npm run format`  | Prettier over `src/`                            |

## How it is put together

A few decisions that are not obvious from reading the files:

**The visual layer is monochrome by design ("Quiet Futurism").** Every colour is a CSS variable in
`index.css` (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`…) and there is no
hue anywhere: depth, light, Geist typography and motion carry the feel. Ambient light pools use a
separate `--pool` token so they stay light in light mode, and elevation shadows are tokenised per
theme.

**The 3D hero loads on the first interaction.** `three.js` is ~220KB gzipped and the point cloud
exists to bend away from a cursor, so `HeroVisual` waits for a `pointermove`, `wheel` or `keydown`
before importing it, then crossfades from a static 2D-canvas sphere. The render loop pauses while the
hero is off screen. Touch devices, narrow viewports and anyone with `prefers-reduced-motion` get only
the static sphere and never load three at all.

**Blur reveals clear their filter when they settle.** Any element with a `filter` becomes a backdrop
root, which stops glass surfaces inside it from blurring what is behind them. `Reveal` and the overlay
entrances therefore end on `filter: none`, not `blur(0px)`.

**The hero entrance is CSS, and transform-only.** A Framer Motion fade holds its element at
`opacity: 0` until React hydrates. Since the LCP element is the hero tagline, that put 87% of a 3.6s
mobile LCP into render delay. The `.hero-rise` and `.hero-sharpen` (blur-to-sharp) keyframes in
`index.css` start at first paint instead and never hide the text.

**Framer Motion runs behind `LazyMotion`.** Components use `m.div`, not `motion.div`, and
`main.tsx` loads only the `domAnimation` feature set — 28KB gzipped instead of 40KB. `strict` mode
makes a stray `motion.*` import throw rather than quietly pulling the full bundle back in.

**The stack section mounts on approach.** Its ~30 inlined brand glyphs across five sub-grids cost
more in style recalculation than in bytes. `DeferredSection` holds the anchor id and a reserved
height so `#stack` links still land and nothing shifts when it arrives.

**GitHub data degrades instead of breaking.** `lib/github.ts` caches per session, and a 403 with
`x-ratelimit-remaining: 0` becomes a typed `RateLimitError` that renders an explanatory card with a
link to the profile. The proof bar falls back to the repo count in `portfolio.ts`.

**The contribution graph is forced to a grey ramp.** `ghchart.rshah.org` bakes a light `#eeeeee`
ground into its SVG. The chart is requested from a neutral near-black base and passed through
`grayscale(1)`; dark mode adds `invert(1)`, so the ground lands on near-black and the busiest days come
out brightest.

**The answer widget has no model behind it.** `lib/ask.ts` scores a question against topics built
from `portfolio.ts`. No API key, no network call, and no way for it to invent a credential. The file
carries a TODO describing the serverless upgrade path, with the key kept off the client.

**Everything respects `prefers-reduced-motion`.** The `Reveal` primitive renders a plain element,
the rotating roles become a static list, count-ups jump to their final value, headings skip the
scramble, Lenis smooth scroll and the card spotlights stay off, the 3D sphere does not initialise,
and a global rule collapses remaining animations.

**Visual audit.** With a preview server on port 4173, `node scripts/audit.cjs` captures every section,
the palette, the terminal and a case study at 1440px and 390px in both themes (GitHub API mocked)
into `.screenshots/audit`.

## Open TODOs

Search the codebase for `TODO(pulkit)`. At the time of writing:

- `profile.siteUrl` — set to the real domain after the first deploy.
- LeetCode profile URL in `profile.socials` (the résumé only states "120+").
- The DPIIT recognition number and date in `venture.badges`.
- The Audaxity site URL, once it is live.
- Screenshots for Scrap 2 Spark, KnowledgeHub AI and the IEEE backend —
  only ParcelPilot has real ones so far.
- A live URL for the IEEE recruitment portal, if it is still public.
- `VITE_FORMSPREE_ID` in `.env` to switch the contact form off the mailto fallback.

Not a code TODO, but worth doing: **add a description and topics to the
`parcelpilot-ai-agent` repo on GitHub.** The "Live from GitHub" section ranks
repos by how substantial they look — description, deployed demo, topics — and
your strongest project currently has no description, so it ranks below two
others. Same for `S2S-Frontend` and `Fake-Job-Detector-Deploy`.
