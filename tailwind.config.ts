import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Every colour resolves to a CSS variable in src/index.css, so the light theme
 * is a second set of values, not a second palette (dark → light):
 *
 *   strong  #F2F2F2 → #0F0F10  names, titles, highlighted phrases
 *   body    #A1A1AA → #52525B  running text (7.6:1 / 7.4:1 on the ground)
 *   faint   #5C5C66 → #8A8A93  dates and metadata
 *   accent  #D9C7A7 → #7A5C2E  champagne / deep bronze — the active nav line,
 *                              hover titles, metrics, the status dot, ✓ marks
 *                              and link underlines. Nothing else.
 *   line    white  → black     hairlines and faint fills, always with an alpha
 *                              (`border-line/[0.07]`), so one class reads right
 *                              in both themes.
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
