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

## Checklist

- [x] 1. Study the 5 reference sites and write notes
- [ ] 2. Remove light theme entirely + remove sphere, stack grid, GitHub section, old headings
- [ ] 3. New tokens, fonts (add Instrument Serif), cursor spotlight
- [ ] 4. Split layout + sticky left column (name on one line, nav with scroll-spy, socials, clock)
- [ ] 5. Agent-run signature card
- [ ] 6. About + Now strip + daily tools line
- [ ] 7. Experience rows with dim-others hover
- [ ] 8. Project rows with thumbnails, metrics, dim-others hover, "More" list, GitHub line
- [ ] 9. Founder card with SVG pipeline
- [ ] 10. Contact + footer
- [ ] 11. Restyle command palette, terminal and Ask widget to match (champagne accent, no light-mode entries)
- [ ] 12. Mobile layout (390px) + reduced-motion pass
- [ ] 13. Fix/verify the reveal bug: nothing stuck blurred or invisible
- [ ] 14. Playwright QA at 1440, 1280, 1024 and 390px (one-line name, no theme toggle, no stuck opacity/blur, body contrast ≥ 7:1, not template-like)
- [ ] 15. npm run build, fix all warnings, final summary
