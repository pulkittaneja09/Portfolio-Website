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
- 6: About: two short first-person paragraphs opening 'I build *agents* that actually ship.' (Instrument Serif), key phrases in #F2F2F2 via a tiny `**phrase**` / `*word*` renderer so copy stays plain text in portfolio.ts; 'Now' strip (Co-founder @ Audaxity · B.Tech CSE, VIT Chennai '28 · CGPA 8.25); daily-tools line that wraps after a dot, never before. New reveal primitive (lib/reveal.ts): visible by default, only hidden while below the fold and approaching, shown on entry, plus a post-scroll sweep — no blur anywhere.
- 7: Experience rows (Audaxity, SDG, Dezors): mono date column (27%, same-year ranges shortened to 'Jun — Jul 2026' so they fit one line), role · company, two short verb-first impact lines (new `impact` field; long bullets kept for terminal/Ask), tag chips. Hover: 3% panel + 6% hairline, radius 12px, champagne title, body text lifts to keep ≥7:1 under the spotlight, ↗ nudges 2px; :has()-based sibling dimming to 50% (gaps between rows dim nothing). Audaxity row links to #founder; SDG/Dezors are cards with TODO(pulkit) for real URLs (not invented). 'View full résumé ↗' after the list.
- 8: Project rows in the same 27% column as experience dates: 16:10 thumbnails (1px border, radius 8px, dimmed until hover). Real screenshots captured from the live Scrap 2 Spark and KnowledgeHub AI demos (webp 1024/640); IEEE gets a schematic built from its own architecture data (CSS-drawn elbows, nothing invented). Name ↗, ~50-char one-line problem (new `oneLiner`), champagne mono metric, 4 chips + count, Live ↗ / Code ↗ with left-drawn underlines; stretched link opens the case study; same dim-the-others hover. One-line 'More' list (blurb truncates, metric in accent) and a live '22 public repos · View GitHub ↗' line (single cached /users request, falls back to data). Case study rebuilt as one calm column (label/value fact rows, monochrome diagram with champagne only on the model node). Reveal fix found here: a full-page capture resizes the viewport, which my resize listener treated as a first scroll — resize now only sweeps, and nothing is ever hidden before a real scroll.
- 9: Founder card: the only non-row surface — hairline border, white 6%→0 gradient from the top edge, role · since, one-line mission with a serif accent ('Lectures in, syllabus-mapped *knowledge* out.'), the Lecture → Transcript → Knowledge → Syllabus coverage pipeline as an inline mono SVG sized from the label lengths (step labels whisper/llm/map on the connectors; stacks vertically below 640px), V-NEST and DPIIT credentials with champagne ✓, stack line.
- 10: Contact: 'Let's build *something*.' as one big line, a two-line availability note, the email set large (click copies with toast + inline 'Copied to clipboard' in champagne, mailto fallback), GitHub / LinkedIn / LeetCode / Résumé links. The old Formspree form is gone (email is the single route). Footer: one small mono line whose ⌘K and ` are real buttons into the palette and terminal. Old Footer, MagneticButton and StatusBadge deleted.
- 11: Palette, terminal, Ask widget and toasts moved onto the new tokens (no legacy classes left in any component). Palette: the selected command carries a 2px champagne line like the active nav item; 'Top' now really scrolls to the top (the old hero id is gone); no theme entry. Terminal: champagne for accent lines, errors underlined not red. Overlay entrances are fade + scale + lift, no blur. Ask copy no longer points at the removed hero. Also fixed: the agent card header wrapped on the 'scrap-2-spark' trace — now one line with a truncating slug; card height verified constant (185px) across all traces at 1440/1024/390.
- 12: 390px: zero horizontal overflow; header → links → agent card → sections; glass top bar shows the current section once past the header (mounted, not opacity-hidden); project thumbnails tuck under their text; pipeline stacks vertically; Now strip and tools line wrap after dots. Name measured on one line at 360/375/390/414/768/1024/1280/1440/1920. 404 page rebuilt (it had lost its gutters). Reduced motion verified by script at 1440 and 390: no running animations, Lenis and spotlight off, nothing armed or hidden, complete static trace with no caret. Thumbnails now dim with brightness instead of opacity, so nothing on screen rests below opacity 1.
- 13: Reveal bug fixed at the root and verified. Cause of stuck content: hiding was keyed to load/IntersectionObserver state, so anything below the fold stayed invisible in captures that never scroll, and a capture's viewport resize looked like a scroll. Now: visible by default, hidden only after a real scroll and only while fully below the fold, shown on entry, swept after every scroll; no blur anywhere. Decorative motion (status pulse, caret, trace lines, trace fade, grain) moved to colour/alpha-in-filter so no element ever rests below opacity 1; always-on surfaces lost their backdrop blur. `npm run check:reveal` (scripts/reveal-check.cjs): 33 strict snapshots — load, slow wheel scroll, nav jumps, instant jump to bottom and scroll back up, resize, /#projects deep link, full-page capture without scrolling, mobile touch scroll — 0 violations.

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
- [ ] 14. Playwright QA at 1440, 1280, 1024 and 390px (one-line name, no theme toggle, no stuck opacity/blur, body contrast ≥ 7:1, not template-like)
- [ ] 15. npm run build, fix all warnings, final summary
