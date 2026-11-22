# Pulkit Taneja — portfolio

Personal site of **Pulkit Taneja**, AI agents & backend engineer and co-founder of Audaxity
Technologies. **Live:** <https://portfolio-website-pi-blush-92.vercel.app>

**Stack:** Vite 6 · React 18 · TypeScript (strict) · Tailwind CSS 3 · Lenis (smooth scroll on
desktop) · Framer Motion (lazy-loaded: overlays, toasts and the desktop project stack) · cmdk (⌘K).
Self-hosted Geist, Geist Mono and Instrument Serif. Dark and light themes (Midnight + Glacier).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

Node 20+. Nothing else is required: the optional `GITHUB_TOKEN` (see `.env.example`) only raises the
GitHub rate limit for the repo count fetched at build time, and never reaches the browser.

## Edit the content

**All copy lives in [`src/data/portfolio.ts`](src/data/portfolio.ts)**, typed by
[`src/data/types.ts`](src/data/types.ts); if you break a shape, `npm run build` says where. No
component needs touching.

| To change                                                         | Edit           |
| ----------------------------------------------------------------- | -------------- |
| Name, title, one-liner, email, socials, availability, site URL    | `profile`      |
| About paragraphs (`**phrase**` = highlight, `*word*` = serif)     | `about`        |
| The "Now" row                                                     | `now`          |
| Highlight strip, terminal `stats`, Ask: sourced achievements only | `stats`        |
| Experience rows                                                   | `experience`   |
| Skills (the résumé's list; "Used in" is computed from the tags)   | `skillGroups`  |
| Flagship projects and their case studies                          | `projects`     |
| The "More" list                                                   | `sideProjects` |
| Founder card                                                      | `venture`      |
| Example traces in the left-column card                            | `agentTraces`  |
| /uses (`null` slots stay hidden)                                  | `uses`         |

Rules worth keeping: every number in `stats` has a `source`, and anything you cannot source stays
out. `profile.siteUrl` is the one place the domain lives (canonical, Open Graph, JSON-LD, sitemap,
robots). The ⌘K palette, the terminal and the Ask widget read the same data, so they update with it.

**Adding a project:** append to `projects` (`slug` becomes `/projects/<slug>`). Screenshots go in
`public/previews/` as WebP at 1024px (`name.webp`) and 640px (`name-sm.webp`), 16:10; without one,
the card shows a schematic drawn from `detail.architecture`. The sitemap picks the new page up.

**Brand assets:** after a palette or copy change, `npm run brand` re-renders the social card
(`og.png`, 1200×630), the favicon set, the apple-touch icon and the manifest icons. `npm run icons`
rebuilds the skill-logo sprite.

## Deploy to Vercel

1. Push the repository to GitHub.
2. On vercel.com: **Add New → Project**, import the repository, keep the defaults, **Deploy**.
   [`vercel.json`](vercel.json) already pins the framework (`vite`), build command and `dist/`
   output, rewrites every route to `index.html` (so `/projects/…` survives a refresh), redirects
   `/resume` to the PDF, caches hashed assets and fonts for a year and sets security headers.
3. Optional: add `GITHUB_TOKEN` under **Settings → Environment Variables** (build only).
4. With a custom domain: add it under **Settings → Domains**, set `profile.siteUrl` to it, push.

## Checks

```bash
npm run lint            # ESLint, zero warnings allowed
npm run format:check    # Prettier
npm run qa              # needs `npm run preview`: name on one line, theme, contrast, links, console
npm run check:reveal    # needs `npm run preview`: nothing left faded or blurred after scrolling
```

## Structure

```
src/
  data/portfolio.ts   all content          data/types.ts   its shape
  sections/           About, Experience, Skills, Projects (+ lazy ProjectStack), Founder, Contact
  components/         rail, cards, cursor, overlays (⌘K, terminal, Ask), toasts
  pages/              Home, ProjectDetail, Uses, NotFound
  lib/ hooks/         skills evidence, theme, Lenis, reveal, terminal and Ask logic
  index.css           tokens (PALETTE markers) and component styles
config/site-plugin.ts build-time LeetCode / GitHub counts, sitemap.xml, robots.txt
scripts/              qa, reveal check, brand assets, skill icons
_drafts/              writing outlines, outside the build
PROGRESS.md           design decisions, research and QA, round by round
```
