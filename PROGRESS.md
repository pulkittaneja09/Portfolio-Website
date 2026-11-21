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
- [x] 9. GitHub activity section
- [x] 10. Contact section + footer
- [x] 11. Terminal mode restyle
- [x] 12. Light mode pass
- [x] 13. Mobile pass (390px) + reduced-motion pass
- [x] 14. Playwright screenshots at 1440px and 390px, audit against banned list and references, fix
- [x] 15. npm run build, fix all warnings, final summary

## Notes
- 1: Monochrome token set (CSS vars + Tailwind), self-hosted Geist/Geist Mono (old Inter/Space Grotesk/JetBrains removed), fixed dot-matrix backdrop + SVG film grain, Lenis, blur reveal, scramble headings, numbered SectionHeading, lime favicon/theme-colour replaced, custom cursor and /design page removed, all legacy tokens migrated.
- 2: Nav is a floating glass bar (16px blur, --surface, hairline) that condenses on scroll; palette is a glass sheet with blur-in, hairline selected rows, search icon; quiet button variants; programmatic scroll routed through Lenis; nested scrollers marked data-lenis-prevent.
- 3: Hero rebuilt: 120px Geist name with blur-to-sharp (no opacity, LCP-safe), live IST clock, white-dot pill, facts row; grayscale R3F point sphere lazy-loaded on first interaction, fixed cursor-bend (window pointer tracking), paused offscreen, crossfades from a 2D-canvas static fallback used on mobile/reduced motion.
- 4: Proof bar is a hairline 6-cell grid: mono index, 40px tabular numerals with muted units, live marker on the GitHub count, label cross-fades to its source on hover.
- 5: Asymmetric 12-col bento (lead 7x2, two 5-col, full-width banner); Spotlight cards (6% cursor light pool + border ring brightening near cursor, layered at z -1 so stretched links work); mono meta line (year · stack · tag, deduped); metric plates instead of 'screenshot coming'; grayscale screenshots that colour on hover; tilt removed. Case study page restyled; architecture diagram now monochrome.
- 6: Experience is a changelog timeline: mono date/location rail, hairline row dividers, pulsing white node on the current role, stack as mono metadata; education as a matching panel row.
- 7: Audaxity is the single raised surface: elevated panel, one soft white top light + lit top hairline, dot matrix, scramble heading, credentials as numbered hairline rows, pipeline as a numbered vertical flow. Lime wash, spark icons and accent frame removed.
- 8: Stack groups are numbered rows (title + live 'used in' caption on the left), tools in a hairline cell grid with faint grayscale glyphs that light on hover; no % bars.
- 9: GitHub language colours replaced by a 7-step white-opacity ramp (bar + legend + repo dots); contribution chart forced to a neutral grey ramp (grayscale + invert in dark); lime chart removed; large tabular profile numbers; repo grid on hairlines.
- 10: Contact leads with the email set large + copy button, social routes as hairline rows, transparent hairline form fields. Footer: 4-column index (numbered nav, socials, ⌘K/` shortcuts), live IST clock, huge wordmark fading to transparent (monochrome gradient).
- 11: Terminal is a glass sheet with blur-in, hairline window dots (red/amber removed), $ prompt, grey tone scale, errors underlined instead of red; emojis removed from command output ([ok] instead of check marks). Ask widget and toasts moved to the same glass language.
- 12: Light mode: ambient light pools moved to a --pool token (always white, so no grey smudges on #FAFAF9); elevation shadows tokenised per theme (much lighter in light mode); verified hero, bento, Audaxity, GitHub chart.
- 13: 390px: verified zero horizontal overflow on home + case studies; hero facts wrap instead of truncating; stack caption no longer reserves height on phones; footer pairs columns 2-up. Reduced motion verified by script: no element left at opacity 0/blurred, no running animations, Lenis off, static 2D sphere only (no three.js).
- 14: scripts/audit.cjs captures 44 shots (8 sections + palette + terminal + case study, 1440/390, dark/light, GitHub API mocked) to .screenshots/audit; source sweep clean (no hues, glows, emojis, % bars). Fixes: blur-in animations now clear `filter` on settle (it made parents backdrop roots, so glass never blurred); denser glass-strong for overlays; lime og.png and apple-touch-icon regenerated in the monochrome style.
- 15: Clean `npm run build` (no warnings), `npm run lint` passes at --max-warnings 0, Prettier formatting applied (format:check clean). README design notes updated for the new visual layer.
