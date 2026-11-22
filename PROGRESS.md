# Portfolio redesign v3 — split layout, champagne accent, agent-run signature

Resume rule: read this file first, then continue from the first unticked task in the checklist at the
bottom. Do not redo finished work. (The previous "Quiet Futurism" redesign log is in git history.)

## Reference notes

Studied live in Chrome via Playwright (1440×900 + 390px), with computed styles pulled from each page.

**brittanychiang.com** — the layout reference

- 1280px container, 96px gutters; the left `<header>` is 48% wide, `sticky top-0 max-h-screen`,
  `flex-col justify-between` with 96px vertical padding. The right column is 52% and just scrolls. The
  whole page is only ~3,900px tall, so you can scan it in seconds.
- Hierarchy comes from two greys, not size: body is slate-400 16/26px, and names, titles and key phrases
  are slate-200, medium weight. The name is only 48px/700 with -1.2px tracking. Restraint reads as confidence.
- Rows are a single stretched link (an absolutely positioned span inside the `<a>`). On hover the row
  gets a soft panel and an inset 1px top highlight, while every _other_ row drops to `opacity-50`
  (`group-hover/list`). The arrow moves 4px up-right. All transitions are 150ms, so it feels instant.
- The nav is a 1px line + 12px bold uppercase label, and the line grows 32→64px when active. The page
  spotlight is a fixed `radial-gradient(600px at x y, rgba(29,78,216,.15), transparent 80%)`, the only
  "effect" on the page.

**rauno.me** — restraint plus one bold idea

- One big gesture per screen: an oversized, deliberately indented sentence ("is an Estonian / interaction
  designer…") with a single flat shape behind it. Nothing else competes.
- Tiny instrument-like details carry the craft: a tick-mark minimap at the top for scroll position, and a
  crosshair cursor.
- A single typeface (a custom grotesk) at a handful of sizes. Spacing is exact and generous, with no
  decoration.

**emilkowal.ski** — calm, intentional micro-detail

- A 692px column, 14–16px type, line-height ~1.65, near-black on warm off-white. Two weights at most.
- Sections are a plain small label ("Today", "Projects") followed by name + one-line description pairs.
  There are huge vertical gaps, and no cards, borders or icons.
- Links are underlined in a soft grey (`rgb(188,187,181)`), so emphasis comes from the underline, not
  from colour. The craft shows in the interactions rather than in the static layout.

**paco.me** — confidence through minimalism

- Dark `#1A1A1A` and a text-only page. The name is set at 16px, the same size as the body: the work speaks.
- One italic serif (Newsreader) appears only on the emphasised phrase ("_Crafting interfaces._",
  "_everything around me is someone's life work_"). That is exactly the personality-without-colour move.
- Links keep a dim 2.5px-offset underline that brightens on hover (`text-decoration-color .24s`). Lists are
  laid out in three quiet columns (Building / Projects / Writing) under 14px grey labels, plus a "Now" note.

**leerob.com** — simple, fast, clear writing

- A warm near-black (`#1B1A19`) with warm off-white text (`#E8E5DF`) and a single serif. It feels like
  paper, not a dashboard.
- A Bio with a "Default / Long" toggle: one small, useful interaction instead of decoration.
- Blog rows are title-left, date-right, hairline-separated. The whole page fits in about 1.3 screens.

**What I'm taking from them (not copying)**

1. A short, scannable page: a sticky identity column plus one scrolling column of rows. No stack of
   identical full-bleed sections.
2. Two text tones do the hierarchy (`#F2F2F2` vs `#A1A1AA`). Size changes only for the name.
3. Exactly two memorable details: the live "agent run" trace card and the page-wide champagne
   spotlight. Everything else is quiet.
4. Interactions are fast (150–300ms) and specific: dim-the-others list hover, growing nav lines,
   2px arrow nudges, and underlines drawn from the left.
5. One italic serif accent word per section for voice, the way Paco uses Newsreader.

## Task notes

- 1: Studied all five sites live (screenshots + computed styles); notes above. Brittany's 48/52 sticky split, 150ms transitions and opacity-50 sibling dimming set the interaction baseline.
- 2: Dark only: ThemeProvider/useTheme, ThemeToggle, the pre-paint theme script, light tokens, light theme-color, the palette entry and the terminal `theme` command are gone. Removed the 3D sphere (three.js deps uninstalled, ~219KB gzip chunk gone), stack grid, GitHub section, proof bar, hero, scramble headings and SectionHeading; sections now open with a plain SectionLabel.
- 3: New dark tokens exactly as specified (hex vars + -rgb twins for alpha), champagne #D9C7A7 accent, body 16/1.65 at 7.6:1 contrast. Instrument Serif italic self-hosted from Google Fonts and preloaded with Geist + Geist Mono. Page-wide 600px champagne cursor spotlight (fixed layer behind content, rAF-eased CSS vars, fine pointers only, off under reduced motion). Grain at 2%, dot grid and scroll bar removed. Legacy aliases kept only for not-yet-rebuilt components.
- 4: Split layout: 1240px container; 45/55 split with 96px gutters from 1280px, 48/52 with 48px gutters at 1024–1279 so the one-liner stays on 2 lines (measured: it needs 431px at 16px). Sticky full-height rail (vh-based spacing, falls back to static under 600px tall): one-line name (clamp(40px,4.6vw,60px), never wraps — verified 1024–1440 and 390), title, one-liner, pulsing champagne status line, line+label nav with a scroll-position spy (last section wins at the bottom), GitHub/LinkedIn/copy-email, Résumé ↗, live 'Chennai · HH:MM IST'. Mobile: rail becomes a normal header plus a thin bar (PT monogram, current section, Menu/⌘K). Old floating nav deleted; pages own <main>; Lenis offsets −96 desktop / −72 mobile; /#hash deep links scroll after render.
- 5: Agent-run card (360px, 2% white, 8% hairline, 12px Geist Mono, 'agent.run — example trace' header with 3 dots + project slug). One rAF clock drives it: the prompt types out, a line every 350ms, timings resolve '···' to the value with a champagne ✓ 200ms later, 4s hold, fade, next trace (audaxity → scrap-2-spark → parcelpilot). Hover pauses (header says 'paused'); the loop stops when off screen or the tab is hidden; reduced motion shows the complete first trace; screen readers get it as plain text. Traces live in portfolio.ts in ASCII (the mono latin subset has no arrow/≥ glyphs). Rail never shrinks the card: height tiers (>780 roomy, ≤780 compact, ≤680 tight, ≤620 static) — verified fitting at 1440×900/790, 1536×740, 1280×690, 1366×650, 1280×621, 1024×768.
- 6: About: two short first-person paragraphs opening 'I build *agents* that actually ship.' (Instrument Serif), key phrases in #F2F2F2 via a tiny `**phrase**` / `*word*` renderer so copy stays plain text in portfolio.ts; 'Now' strip (Co-founder @ Audaxity · B.Tech CSE, VIT Chennai '28); daily-tools line that wraps after a dot, never before. New reveal primitive (lib/reveal.ts): visible by default, only hidden while below the fold and approaching, shown on entry, plus a post-scroll sweep — no blur anywhere.
- 7: Experience rows (Audaxity, SDG, Dezors): mono date column (27%, same-year ranges shortened to 'Jun — Jul 2026' so they fit one line), role · company, two short verb-first impact lines (new `impact` field; long bullets kept for terminal/Ask), tag chips. Hover: 3% panel + 6% hairline, radius 12px, champagne title, body text lifts to keep ≥7:1 under the spotlight, ↗ nudges 2px; :has()-based sibling dimming to 50% (gaps between rows dim nothing). Audaxity row links to #founder; SDG/Dezors are cards with TODO(pulkit) for real URLs (not invented). 'View full résumé ↗' after the list.
- 8: Project rows in the same 27% column as experience dates: 16:10 thumbnails (1px border, radius 8px, dimmed until hover). Real screenshots captured from the live Scrap 2 Spark and KnowledgeHub AI demos (webp 1024/640); IEEE gets a schematic built from its own architecture data (CSS-drawn elbows, nothing invented). Name ↗, ~50-char one-line problem (new `oneLiner`), champagne mono metric, 4 chips + count, Live ↗ / Code ↗ with left-drawn underlines; stretched link opens the case study; same dim-the-others hover. One-line 'More' list (blurb truncates, metric in accent) and a live '22 public repos · View GitHub ↗' line (single cached /users request, falls back to data). Case study rebuilt as one calm column (label/value fact rows, monochrome diagram with champagne only on the model node). Reveal fix found here: a full-page capture resizes the viewport, which my resize listener treated as a first scroll — resize now only sweeps, and nothing is ever hidden before a real scroll.
- 9: Founder card: the only non-row surface — hairline border, white 6%→0 gradient from the top edge, role · since, one-line mission with a serif accent ('Lectures in, syllabus-mapped *knowledge* out.'), the Lecture → Transcript → Knowledge → Syllabus coverage pipeline as an inline mono SVG sized from the label lengths (step labels whisper/llm/map on the connectors; stacks vertically below 640px), V-NEST and DPIIT credentials with champagne ✓, stack line.
- 10: Contact: 'Let's build *something*.' as one big line, a two-line availability note, the email set large (click copies with toast + inline 'Copied to clipboard' in champagne, mailto fallback), GitHub / LinkedIn / LeetCode / Résumé links. The old Formspree form is gone (email is the single route). Footer: one small mono line whose ⌘K and ` are real buttons into the palette and terminal. Old Footer, MagneticButton and StatusBadge deleted.
- 11: Palette, terminal, Ask widget and toasts moved onto the new tokens (no legacy classes left in any component). Palette: the selected command carries a 2px champagne line like the active nav item; 'Top' now really scrolls to the top (the old hero id is gone); no theme entry. Terminal: champagne for accent lines, errors underlined not red. Overlay entrances are fade + scale + lift, no blur. Ask copy no longer points at the removed hero. Also fixed: the agent card header wrapped on the 'scrap-2-spark' trace — now one line with a truncating slug; card height verified constant (185px) across all traces at 1440/1024/390.
- 12: 390px: zero horizontal overflow; header → links → agent card → sections; glass top bar shows the current section once past the header (mounted, not opacity-hidden); project thumbnails tuck under their text; pipeline stacks vertically; Now strip and tools line wrap after dots. Name measured on one line at 360/375/390/414/768/1024/1280/1440/1920. 404 page rebuilt (it had lost its gutters). Reduced motion verified by script at 1440 and 390: no running animations, Lenis and spotlight off, nothing armed or hidden, complete static trace with no caret. Thumbnails now dim with brightness instead of opacity, so nothing on screen rests below opacity 1.
- 13: Reveal bug fixed at the root and verified. Cause of stuck content: hiding was keyed to load/IntersectionObserver state, so anything below the fold stayed invisible in captures that never scroll, and a capture's viewport resize looked like a scroll. Now: visible by default, hidden only after a real scroll and only while fully below the fold, shown on entry, swept after every scroll; no blur anywhere. Decorative motion (status pulse, caret, trace lines, trace fade, grain) moved to colour/alpha-in-filter so no element ever rests below opacity 1; always-on surfaces lost their backdrop blur. `npm run check:reveal` (scripts/reveal-check.cjs): 33 strict snapshots — load, slow wheel scroll, nav jumps, instant jump to bottom and scroll back up, resize, /#projects deep link, full-page capture without scrolling, mobile touch scroll — 0 violations.
- 14: `npm run qa` (scripts/qa.cjs) at 1440×900, 1280×800, 1024×768, 390×844 — all PASS: (a) name one line, measured from line boxes (340px of 444 at 1440; 243 of 350 at 390); (b) no theme toggle in the DOM, no `html.light` / light-scheme CSS; (c) nothing hidden or blurred in view after scrolling; (d) body text 7.64:1 at rest, 7.16:1 directly under the spotlight, 9.74:1 inside a hovered row. To get (d) there: spotlight peak 5%→4.5% (5% measured 6.95:1 under the cursor), opaque grounds under the agent and founder cards, chips and More blurbs lift on hover. (e) Reviewed the captures against the references: Brittany's skeleton by request, but the agent trace, champagne-on-warm-dark, serif accents, date-column thumbnails, schematic thumb and founder pipeline are specific to this site; ~4,300px tall at 1440. Old audit.cjs (targeted removed sections) deleted.
- 15: Legacy aliases, CSS classes and variables removed (all verified unused first); dead projectMeta.ts and useIsDesktopPointer deleted; Formspree var dropped from .env.example; og.png regenerated in the new identity (name, title, serif line, example trace with champagne ✓). `npm run build`: no warnings (largest chunk react 46KB gzip; three.js gone). `npm run lint`: 0 warnings. Prettier clean. README rewritten for the new design. Final `npm run qa` all PASS and `npm run check:reveal` 0/33 violations after cleanup.

## Final summary

**What changed**

- **Layout.** Brittany-style split inside a 1240px container: a sticky, full-height identity rail
  (one-line name, title, one-liner, champagne status pulse, line + label scroll-spy nav, the agent-run
  card, GitHub / LinkedIn / copy-email, Résumé ↗, live "Chennai · HH:MM IST") beside one scrolling
  column. Height tiers keep the rail fitting real laptop viewports down to 620px tall.
- **Signature element.** The "agent.run — example trace" card plays three illustrative traces (Audaxity,
  Scrap 2 Spark, ParcelPilot) line by line with timings and champagne ✓, holds 4s, fades, replays;
  hover pauses; reduced motion shows one complete trace.
- **Sections.** About (two first-person paragraphs, serif *agents*, Now strip, daily tools) →
  Experience rows → Projects rows with 16:10 thumbnails (real screenshots captured from the live demos;
  an architecture schematic for IEEE), metrics in champagne mono, a one-line More list and a live repo
  count → Founder card with an inline SVG pipeline → Contact ("Let's build *something*.", copy-on-click
  email) → one-line footer whose ⌘K and ` are buttons.
- **Visual system.** Dark only; the exact tokens requested; Geist + Geist Mono + Instrument Serif
  italic (self-hosted, preloaded); champagne limited to the listed uses; page-wide cursor spotlight;
  2% grain; no grid, no glows, no blur reveals, no emojis.
- **Removed.** Light theme (toggle, tokens, provider, palette entry, terminal command), the 3D sphere
  and three.js, the stack logo grid, the GitHub section, the proof bar, scramble headings and the long
  section titles, the contact form.
- **Kept and restyled.** All data, the ⌘K palette, terminal mode (including the easter egg), the Ask
  widget, toasts and the case-study pages.

**Verification:** `npm run qa` passes (a)–(d) at 1440, 1280, 1024 and 390; `npm run check:reveal`
reports 0 violations in 33 strict snapshots; build, lint and format are clean.

**Judgement calls worth knowing**

- Spotlight peak is 4.5%, not 5%: at 5%, body text directly under the cursor measured 6.95:1.
- The agent and founder cards keep their specified translucent fills over an opaque ground, so the
  spotlight cannot lower the contrast of their text.
- Footer and timing text use the `--text-faint` token (#5C5C66) rather than a second near-identical
  grey (#55555A).
- SDG and Dezors rows are cards, not links, until real company URLs are added (TODO(pulkit) in data);
  the Audaxity row links to the Founder card.
- The agent card cycles three traces rather than two, adding a ParcelPilot "403 before retrieval" run.
- The Formspree contact form was dropped: the spec defines Contact as the email plus socials.

## Polish pass: gap list (P3)

All six sites captured live in Chrome at 1440×900 and 390×844, with the same DOM measurements on each.

|                          | Mine (before → after)  | Brittany | Rauno | Emil  | Paco  | Lee   |
| ------------------------ | ---------------------- | -------- | ----- | ----- | ----- | ----- |
| Font sizes in use        | 17 → 10 (7 in the UI)  | 5        | 4     | 2     | 3     | 5     |
| Text colours             | 7 → 6                  | 6        | 3     | 2     | 5     | 3     |
| Page height at 1440      | 4,306 → 4,122px        | 3,798    | 6,108 | 1,854 | 1,424 | 1,220 |
| Words                    | 758 → 682              | 650      | 52    | 168   | 194   | 166   |
| Floating UI over content | Ask pill → none        | none     | none  | none  | none  | none  |
| Transferred              | 258kB                  | 2.9MB    | 637kB | 2.2MB | 366kB | 641kB |

**What they do that mine didn't**

- A tight type scale (2–5 sizes). Mine had 17, six of them between 11 and 16px.
- Nothing sits on top of the content. My "Ask about Pulkit" pill covered 73px of the content column at
  1280 and sat over body text on phones.
- A first screen that is already finished. My agent card painted nearly empty and started typing a
  second later, so the first impression was a dark box with two lines in it.
- "Now" as a plain line of text (Paco). Mine was a bordered box inside About.
- Short lists that read as finished (Emil: a name and a few words). Every line of my More list ended in
  an ellipsis.
- Link previews that resolve, and a colophon or last-updated line (Brittany, Lee): see P4.

**Heavier or busier on mine**

- 9.5px step labels on the founder pipeline: below legibility, and repeated by the stack line under it.
- "+4" overflow counters on the chips, and a mono metric label that wrapped on most project rows.
- Two whites (#E6E6E6 for the title, #F2F2F2 elsewhere), and inactive nav labels at 70% body (4.2:1,
  under AA for 12px text).
- A full-screen blended grain layer: invisible at 2%, but a permanent compositing layer on every scroll.
- The email at 32px under the 48px closing line: two loud sizes stacked.

**Kept on purpose:** the agent card and the spotlight (the two signature details), the split layout,
the founder card, the section labels, Live/Code links. **Not adopted:** a writing section (there are
no posts to put in it), Lee's Default/Long bio toggle, Rauno's crosshair cursor and minimap. Each would
add to the page, not take away.

## Polish pass notes

- P1: LeetCode now points to https://leetcode.com/u/PULKITTANEJA/ everywhere (data → rail, Contact, terminal `contact`, Ask answer; JSON-LD sameAs), the palette's Elsewhere group is built from the data instead of hard-coded GitHub/LinkedIn URLs (it had no LeetCode), and the rail shows the official LeetCode mark beside GitHub and LinkedIn. Verified in Chrome: the icon opens exactly that URL; the old `/u/pulkittaneja09` link is gone.
- P2: CGPA removed from the data (the `score`/`scoreLabel` fields are gone from the type too), the Now strip, terminal `education` and its help text, the Ask widget's answer and keywords (a GPA question now gets the honest 'nothing here matches' reply), README, PORTFOLIO_PROMPT.md and the old task-6 note; the built `dist/` has no '8.25', 'CGPA' or 'GPA'. Left alone on purpose: `public/Pulkit_Taneja_Resume.pdf` still prints 'CGPA: 8.25/10.0' (it is your document, so replace the PDF to remove it there), and older commits keep it in git history.
- P3: Simplified without moving anything. Type scale 17 → 7 UI sizes (12 mono / 14 / 16 / 20 / 24 / 48 / 60: chips and dates 11→12, row text 15→14, founder mission 18→16, email 32→24, pipeline step labels removed and the diagram drawn at natural size); one white instead of two; inactive nav 70→80% (5.1:1). Now + Daily tools are unboxed label/value rows on the experience grid; chip counters gone; metric labels in sans with `text-wrap: pretty`; the More list has short one-liners (the full blurbs still feed the terminal and Ask). The agent card paints a complete trace first. The Ask launcher is a 36px button in the gutter on desktop (0px overlap at 1024 and 1280, label on hover) and an Ask button in the phone top bar; the panel gained a close button and Escape, and ⌘K has an Ask command. Grain layer removed. `npm run qa` all PASS at four widths; `check:reveal` 32 snapshots, 0 violations (one fewer because the page is 184px shorter).
- P4: Added: the LeetCode count, fetched at build time from LeetCode's public GraphQL (and the GitHub repo count moved to build time too, so the page calls no third-party API and the rate-limit console error is gone), with a cached fallback and then plain 'LeetCode ↗' with no number (both failure paths tested); 'Building Audaxity' (links to the founder card) in the Now row in place of 'Co-founder @ Audaxity'; a favicon set from the real Geist SemiBold 'PT' outlines (svg, ico 16/32/48, 180 touch, 192/512 maskable) and a centred OG image that survives WhatsApp's square crop; one `siteUrl` (now the URL actually deployed) feeding index.html plus a generated sitemap (every case study) and robots.txt; 'Last updated November 2026' in the footer from the last commit; the palette key named per platform (Ctrl K off Apple); View Transitions into and out of case studies (crossfade, and the thumbnail morphs into the screenshot on desktop; plain navigation under reduced motion or without the API); `/resume` → the PDF; print styles (ink tokens, chrome hidden). Found and fixed on the way: Lenis 1.3 applies scroll-margin itself, so sections landed 192px down instead of 96px. Skipped: a new 404 (the existing one already matches; only its key label changed) and more footer hint text (the keys were already there as buttons). `npm run qa` all PASS, `check:reveal` 0/32, no console errors, no third-party requests.
- P5: QA at 1440 / 1024 / 390 (screenshots reviewed): one-line name, exact LeetCode links (the icon opens the profile), nothing faded or blurred after scrolling, no console errors or failed requests on any route or overlay; `npm run qa` extended with (e) LeetCode links, (f) no GPA, (g) no console errors or third-party requests and passes at four widths; `check:reveal` 0/32; build without warnings and no GPA in `dist/`.

## Polish pass summary

**What changed (layout and style unchanged)**

- **LeetCode.** One URL everywhere, https://leetcode.com/u/PULKITTANEJA/, with its mark beside GitHub
  and LinkedIn; the palette's profile commands now come from the data instead of hard-coded links.
- **CGPA.** Gone from the site, terminal, Ask widget, docs and the build output.
- **Calmer.** 17 font sizes → 7, one white instead of two, Now and Daily tools as unboxed rows on the
  experience grid, no chip counters, More one-liners that fit, the pipeline without its 9.5px labels, a
  finished agent card at first paint, nothing floating over the content (a 36px gutter button on
  desktop, Ask in the phone top bar, an Ask command in the palette), no grain layer. Page 4,306 →
  4,122px. The gap list above has the reasoning.
- **Added.** "120 problems solved on LeetCode ↗" and the repo count, both fetched at build time, so the
  page makes no third-party requests; "Building Audaxity" in Now; a favicon set and a centred social
  card; one `siteUrl` (now the URL actually deployed) with a generated sitemap and robots.txt;
  "Last updated" in the footer; the palette key named for the visitor's platform; View Transitions into
  and out of case studies; `/resume`; print styles.
- **Fixed on the way.** Sections landed 192px from the top instead of 96px (Lenis 1.3 already applies
  scroll-margin).

**Verification (P5).** At 1440, 1024 and 390: the name is on one line, every LeetCode link is exact and
the icon opens the profile, nothing is faded or blurred once scrolling settles, and there are no console
errors or failed requests across the home page, a case study, the 404, the palette, the terminal and
the Ask widget. `npm run qa` (now also checking LeetCode links, GPA and console/third-party requests)
passes at four widths; `npm run check:reveal` 0 violations in 32 snapshots; `npm run build` has no
warnings and its output has no "8.25", "CGPA" or "GPA"; lint and Prettier are clean.

**Still yours to do**

- `public/Pulkit_Taneja_Resume.pdf` itself still prints "CGPA: 8.25/10.0"; export a new PDF to remove it
  there too. Older commits also keep it in git history.
- `profile.siteUrl` is now https://portfolio-website-pi-blush-92.vercel.app (the URL in your original
  README). Change that one value if you add a custom domain or rename the Vercel project.
- Optional: a `GITHUB_TOKEN` in Vercel (build-time only, never shipped) if the repo count ever has to
  fall back.

## Round 3: what AI engineers show that mine didn't (R3)

Studied live in Chrome: karpathy.ai, eugeneyan.com, huyenchip.com, hamel.dev, jxnl.co,
simonwillison.net and lilianweng.github.io, plus brittanychiang.com, rauno.me, emilkowal.ski and
leerob.com again.

- **Writing, dated, with RSS: 6 of 7** (Eugene lists 183 posts; Lilian's long-form log; Simon's daily
  entries and TILs; Hamel's blog and notes; Chip's blog; Jason's essays). Mine had none.
  **Built:** Markdown notes rendered at build time, `/notes` and `/notes/:slug`, a one-line-each list
  on the home page, RSS, sitemap entries, plus the nav, ⌘K and the terminal. All of it stays hidden
  until a note is published. Three draft outlines from real projects are waiting for you.
- **How the work was evaluated** (Eugene, Hamel and Jason write mostly about evals). Mine showed one
  metric per project with no method. **Built:** an Evaluation line on case studies (Scrap 2 Spark:
  dataset, cells and the held-out R²; ParcelPilot: the pytest authorization check). KnowledgeHub stays a
  TODO(pulkit) rather than an invented number.
- **Papers and a Scholar or arXiv link** (Karpathy, Chip, Hamel, Lilian). **Skipped:** the résumé lists
  no papers or research, so there is no Research list.
- **Talks and teaching** (Eugene's talks, Hamel's course, Karpathy's videos). **Skipped:** none to list.
- **A photo beside the bio** (Karpathy, Chip, Hamel). **Skipped:** there is no photo in the repo; it
  would be your call.
- **A newsletter** (Eugene, Hamel). **Skipped:** nothing to send yet; RSS covers following along.
- **Search, tags and archives** (Simon, Lilian, Eugene). **Skipped:** worth it past roughly 20 posts.
- **A /uses page.** **Built** from real tools only; TODO slots stay hidden until you fill them in, and
  it is linked from the footer only.
- **An open-source list** (Hamel's OSS, Simon's tools). Already covered by the More list and the live
  repo count.

## Round 3 notes
- R1: Light theme as a second token set under `html[data-theme='light']`, with the exact tokens requested; depth from soft shadows on hovered rows, the agent card (white, #3F3F46 trace, bronze ✓), the founder card, thumbnails (no dimming), toasts and overlays. Spotlight off in light (it read as a smudge and would have pulled body text to 6.99:1); grain was already gone. Hardcoded white alphas became a `line` colour (white in dark, black in light) and the rest became tokens, so dark is pixel-identical (diffed home + case study at 1440 and 390: only the new toggle differs). An inline head script sets the theme before any CSS (saved choice, else system, followed live until chosen) and syncs theme-color. The toggle sits beside the socials (top bar on phones), plus ⌘K 'Toggle theme' and terminal `theme [light|dark]`, with a 500ms circular View Transition from the toggle (instant under reduced motion). At 1024 the link row needed 6px more, so its gaps tighten there only. Every component checked in light: palette, terminal, Ask, toasts, case study, 404, focus ring, scrollbar, selection; the OG image stays the dark brand card. `npm run qa` now runs both themes at four widths (body 7.64:1 dark / 7.4:1 light, accent 10.35 / 5.92, no flash): all PASS; `check:reveal` 0/32.
- R2: Skills section between Experience and Projects (in the rail nav, the scroll-spy and ⌘K): the six groups as asked, cross-checked against the résumé's Technical Skills and the data, plus the real ones that were missing (Embeddings, Whisper, Pandas, NumPy, NLP (TF-IDF), Express, MongoDB, SQLite, Postman). True tags were added to stacks so the evidence is complete (Python on Scrap 2 Spark and KnowledgeHub; Vercel on the three Vercel-hosted demos). Chips: mono, 6px radius, hairline, a tiny monochrome logo from one Simple Icons sprite (`public/skills.svg`, 16KB gzipped, `npm run icons`). Evidence comes from the real stack/tags via aliases (`lib/skills.ts`), nothing typed: 28 of 40 chips have tagged work and get a 'Used in: … · at …' tooltip; a click highlights the matching roles, projects and side projects (others 0.4), scrolls to Projects (or Experience for role-only skills) and shows a sticky 'Showing work with FastAPI · Clear ✕' pill; Escape or a second click clears. The 12 with no tagged work (Node.js, Java, DSA…) are listed but not clickable. Hover dimming yields to the filter, so matches never fade. Daily tools removed from About. The sixth nav item meant shifting the rail tiers (compact below 840px tall, tight below 720px): it fits from 1280×621 to 1440×900. QA all PASS in both themes; `check:reveal` 0/35.
- R3: Gap list above. Built: Markdown notes in `content/notes` (frontmatter, rendered to HTML at build time by `config/notes.ts`; `marked` is a dev dependency and costs nothing in the browser) with `/notes`, `/notes/:slug` (reading time, note typography in both themes), a one-line home list, an RSS feed with full content, sitemap entries, a feed `<link>`, a Notes nav item, ⌘K entries and a terminal `notes` command — all only once a note is published. Drafts are never in a production build (verified: no draft text anywhere in `dist/`), and the dev server shows them marked as drafts. Three outlines from real projects (MCP server, KnowledgeHub RAG, battery RUL), facts and TODO(pulkit) only. The published path was tested with a temporary fixture (one RSS item, valid XML, sitemap, nav, both themes) and the fixture deleted. A seven-item nav scrolls with the page below 650px tall. Evaluation lines on case studies (Scrap 2 Spark, ParcelPilot; KnowledgeHub TODO); /uses from real tools with hidden TODO slots, footer link only. Skipped Research (nothing on the résumé), talks, photo, newsletter and search, with reasons above.
- R4: Final QA. 66 screenshots: every section plus header and footer, the case study, /uses and the 404, in both themes at 1440 / 1024 / 390 (`.screenshots/r4`). Hard reload after toggling, both directions: no flash, the choice persists. All 40 skill chips checked against evidence recomputed independently from portfolio.ts (28 tooltips, 0 mismatches); filter → clear verified for FastAPI, MCP and scikit-learn, by Escape and by the pill. Drafts are absent from `dist/`, the nav, the home page, the routes and the feed. No console errors or failed requests on any route or overlay in either theme. `npm run qa` all PASS (8 runs); `check:reveal` 0/35; build 0 warnings; lint and Prettier clean.

## Round 3 summary

**What changed**

- **Light theme, designed as a corporate counterpart.** A second token set under
  `html[data-theme="light"]` with the exact tokens requested: warm off-white ground, pure-white
  surfaces, black hairlines, body #52525B and deep bronze #7A5C2E in the same places as the champagne.
  Depth comes from soft shadows on rows, cards, thumbnails, overlays, toasts and tooltips, and the
  spotlight is off. Dark is pixel-identical apart from the new toggle. An inline head script sets the
  theme before any CSS (the saved choice, else the system setting, followed live until chosen). The
  toggle sits beside the socials and in the phone bar, with ⌘K "Toggle theme" and terminal
  `theme [light|dark]`; the switch is a 500ms circular reveal from the toggle.
- **Skills.** Grouped rows between Experience and Projects (in the nav, the scroll-spy and ⌘K): your
  six groups plus the real skills that were missing, with tiny monochrome logos from one Simple Icons
  sprite. The "Used in" tooltips and click-to-filter (others fade to 0.4, with a "Showing work with …
  · Clear" pill) are computed from the real tags in portfolio.ts. Daily tools is gone from About.
- **AI-engineer pass.** Notes are ready but hidden: Markdown rendered at build time, `/notes`,
  `/notes/:slug`, a home list, RSS, sitemap, nav, ⌘K and terminal, all switched on by the first
  published note. Three draft outlines from your real projects are waiting in `content/notes`.
  Evaluation lines on case studies (real numbers only), and a `/uses` page from real tools, linked in
  the footer. No Research list: the résumé has none.

**Verification (R4):** 66 screenshots in both themes at three widths; no flash on hard reload and the
choice persists, both ways; body text 7.64:1 dark (7.16 under the spotlight) and 7.4:1 light, accent
10.35:1 and 5.92:1; all 28 skill tooltips match the evidence recomputed from the data, and filter →
clear works; name on one line, nothing faded or blurred after scrolling, no console errors, drafts
nowhere; build without warnings.

**Judgement calls worth knowing**

- Spotlight off in light (the brief allowed it): at 4% bronze it read as a smudge and pulled body text
  to 6.99:1 under the cursor.
- The toggle needed 6px more at 1024–1279px, so the link row's gaps tighten there only. Six nav items
  shifted the rail spacing tiers (compact below 840px tall, tight below 720px); a seventh (Notes, once
  published) makes the rail scroll with the page below 650px tall.
- The OG image stays the dark brand card: link previews do not follow a visitor's theme.
- Twelve skills with no tagged work (Node.js, Express, MongoDB, Java, C / C++, Git, Postman, Tailwind
  CSS and the CS Core four) are listed but not clickable, rather than given invented evidence. True tags
  were added so the evidence is complete: Python on two projects, Vercel on the three Vercel-hosted demos.
- "LLM APIs (Claude, Gemini)" has no logo, since no single logo fits it, and Simple Icons has none for
  ChromaDB or Whisper.
- `/uses` hides its TODO slots rather than showing "TODO" to visitors.
- `npm audit` reports two moderate react-router advisories (an open redirect through user-supplied link
  targets, and SSR hydration). Neither applies here: every navigation target is static and the site
  renders only in the browser. The fix is a major upgrade to React Router 7, left as a follow-up.

## Checklist

- [x] 1. Study the 5 reference sites and write notes
- [x] 2. Remove light theme entirely + remove sphere, stack grid, GitHub section, old headings
- [x] 3. New tokens, fonts (add Instrument Serif), cursor spotlight
- [x] 4. Split layout + sticky left column (name on one line, nav with scroll-spy, socials, clock)
- [x] 5. Agent-run signature card
- [x] 6. About + Now strip + daily tools line
- [x] 7. Experience rows with dim-others hover
- [x] 8. Project rows with thumbnails, metrics, dim-others hover, "More" list, GitHub line
- [x] 9. Founder card with SVG pipeline
- [x] 10. Contact + footer
- [x] 11. Restyle command palette, terminal and Ask widget to match (champagne accent, no light-mode entries)
- [x] 12. Mobile layout (390px) + reduced-motion pass
- [x] 13. Fix/verify the reveal bug: nothing stuck blurred or invisible
- [x] 14. Playwright QA at 1440, 1280, 1024 and 390px (one-line name, no theme toggle, no stuck opacity/blur, body contrast ≥ 7:1, not template-like)
- [x] 15. npm run build, fix all warnings, final summary

### Polish pass (keep the layout and style; no redesign)

- [x] P1. Fix the LeetCode link everywhere (https://leetcode.com/u/PULKITTANEJA/) and show its icon with the other socials
- [x] P2. Remove the CGPA everywhere (keep "B.Tech CSE, VIT Chennai '28")
- [x] P3. Compare side by side with brittanychiang.com, rauno.me, emilkowal.ski, paco.me, leerob.com; write a gap list; simplify anything that adds clutter
- [x] P4. Add what's missing, only where it fits the minimal style (note why anything was skipped)
- [x] P5. Final QA at 1440 / 1024 / 390, build with no warnings, short summary

### Round 3: light mode, skills, AI-engineer pass (dark design unchanged unless a task says so)

- [x] R1. Light mode as a clean "corporate" theme (exact tokens, soft shadows, every component), system default + saved choice, no flash, toggle in rail / phone bar / ⌘K / terminal, circular View Transition reveal
- [x] R2. Skills section between Experience and Projects (grouped rows, chips with tiny monochrome logos, "Used in" tooltips and click-to-filter from real tags), in nav and ⌘K; drop the Daily tools line
- [x] R3. Study top AI engineers' portfolios + design refs; gap list; implement what fits with real content (notes infrastructure with drafts, evaluation lines, research if real, /uses)
- [x] R4. Final QA: every section in both themes at 1440 / 1024 / 390; no theme flash, persistence, contrast, skills filter, drafts hidden; build with no warnings; final summary
