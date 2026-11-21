import type { Config } from 'tailwindcss';

/**
 * Dark only. Every colour resolves to a CSS variable in src/index.css.
 *
 *   strong  #F2F2F2  names, titles, highlighted phrases
 *   body    #A1A1AA  running text (7.6:1 on the ground)
 *   faint   #5C5C66  dates and metadata
 *   accent  #D9C7A7  champagne — the active nav line, hover titles, metrics,
 *                    the status dot, ✓ marks and link underlines. Nothing else.
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
        title: '#E6E6E6',
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
  plugins: [],
} satisfies Config;
