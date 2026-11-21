# Quiet Futurism redesign — progress

Resume rule: read this file first, continue from the first unticked task, do not redo finished work.

- [x] 1. Set up design tokens, fonts, background grid/grain, and remove all old styles
- [x] 2. Navbar + command palette restyle
- [x] 3. Hero with the grayscale point-cloud sphere
- [x] 4. Proof bar / stats
- [x] 5. Projects bento grid with spotlight cards + project detail view
- [x] 6. Experience timeline
- [x] 7. Audaxity founder section
- [x] 8. Tech stack section
- [ ] 9. GitHub activity section
- [ ] 10. Contact section + footer
- [ ] 11. Terminal mode restyle
- [ ] 12. Light mode pass
- [ ] 13. Mobile pass (390px) + reduced-motion pass
- [ ] 14. Playwright screenshots at 1440px and 390px, audit against banned list and references, fix
- [ ] 15. npm run build, fix all warnings, final summary

## Notes
- 1: Monochrome token set (CSS vars + Tailwind), self-hosted Geist/Geist Mono (old Inter/Space Grotesk/JetBrains removed), fixed dot-matrix backdrop + SVG film grain, Lenis, blur reveal, scramble headings, numbered SectionHeading, lime favicon/theme-colour replaced, custom cursor and /design page removed, all legacy tokens migrated.
- 2: Nav is a floating glass bar (16px blur, --surface, hairline) that condenses on scroll; palette is a glass sheet with blur-in, hairline selected rows, search icon; quiet button variants; programmatic scroll routed through Lenis; nested scrollers marked data-lenis-prevent.
- 3: Hero rebuilt: 120px Geist name with blur-to-sharp (no opacity, LCP-safe), live IST clock, white-dot pill, facts row; grayscale R3F point sphere lazy-loaded on first interaction, fixed cursor-bend (window pointer tracking), paused offscreen, crossfades from a 2D-canvas static fallback used on mobile/reduced motion.
- 4: Proof bar is a hairline 6-cell grid: mono index, 40px tabular numerals with muted units, live marker on the GitHub count, label cross-fades to its source on hover.
- 5: Asymmetric 12-col bento (lead 7x2, two 5-col, full-width banner); Spotlight cards (6% cursor light pool + border ring brightening near cursor, layered at z -1 so stretched links work); mono meta line (year · stack · tag, deduped); metric plates instead of 'screenshot coming'; grayscale screenshots that colour on hover; tilt removed. Case study page restyled; architecture diagram now monochrome.
- 6: Experience is a changelog timeline: mono date/location rail, hairline row dividers, pulsing white node on the current role, stack as mono metadata; education as a matching panel row.
- 7: Audaxity is the single raised surface: elevated panel, one soft white top light + lit top hairline, dot matrix, scramble heading, credentials as numbered hairline rows, pipeline as a numbered vertical flow. Lime wash, spark icons and accent frame removed.
- 8: Stack groups are numbered rows (title + live 'used in' caption on the left), tools in a hairline cell grid with faint grayscale glyphs that light on hover; no % bars.
