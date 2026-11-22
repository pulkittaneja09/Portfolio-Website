import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Every colour resolves to a CSS variable in src/index.css, so the light theme
 * is a second set of values, not a second palette (Midnight + Glacier,
 * dark → light):
 *
 *   strong     #EEF2F8 → #0B1220  names, titles, highlighted phrases
 *   body       #A3ADBD → #404C60  running text (8.5:1 / 8.3:1 on the ground)
 *   faint      #7A8597 → #646F82  dates and metadata (5.2:1 / 4.9:1)
 *   accent     #8FB4FF → #2F5BD3  glacier blue: the active nav line, hover
 *                                 titles, metrics, the status dot, links,
 *                                 focus rings, function names
 *   secondary  #7DD3C0 → #0E7C6C  seafoam: strings, quiet gradients
 *   line       navy-tinted white → navy, always with an alpha
 *              (`border-line/[0.07]`), so one class reads right in both themes.
 *
 * `light:` targets the light theme only (html[data-theme="light"]).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        strong: 'rgb(var(--text-strong-rgb) / <alpha-value>)',
        body: 'rgb(var(--text-rgb) / <alpha-value>)',
        faint: 'rgb(var(--text-faint-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-rgb) / <alpha-value>)',
        ok: 'rgb(var(--ok-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        trace: 'var(--trace)',
      },
      boxShadow: {
        // Depth in the light theme; `none` in the dark one.
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
        overlay: 'var(--shadow-overlay)',
      },
      borderColor: {
        // Consumed by Tailwind's preflight, so no extra universal selector.
        DEFAULT: 'var(--border)',
      },
      backgroundColor: {
        surface: 'var(--surface)',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      maxWidth: {
        page: '77.5rem', // 1240px
        prose: '62ch',
      },
      transitionTimingFunction: {
        // One curve for everything: fast in, long soft settle, never bouncy.
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        400: '400ms',
      },
      keyframes: {
        // Blink by colour, not opacity: the element never rests below opacity 1.
        'caret-blink': {
          '0%,49%': { backgroundColor: 'rgb(var(--text-strong-rgb) / 0.75)' },
          '50%,100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.05s step-end infinite',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('light', ':is([data-theme="light"] &)');
    }),
  ],
} satisfies Config;
