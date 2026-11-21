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

        // ── Legacy aliases ────────────────────────────────────────────────
        // Only for components not yet rebuilt in this redesign. Deleted in
        // the final cleanup task once nothing references them.
        text: 'rgb(var(--text-strong-rgb) / <alpha-value>)',
        muted: 'rgb(var(--text-rgb) / <alpha-value>)',
        elevated: '#111215',
        light: 'rgb(255 255 255 / <alpha-value>)',
      },
      borderColor: {
        // Consumed by Tailwind's preflight, so no extra universal selector.
        DEFAULT: 'var(--border)',
        hairline: 'var(--border)',
        strong: 'rgba(255, 255, 255, 0.14)',
      },
      backgroundColor: {
        surface: 'var(--surface)',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        // Legacy display sizes, used only by the case-study page until it is restyled.
        'display-lg': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.75rem, 3.4vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        page: '77.5rem', // 1240px
        prose: '62ch',
        shell: '75rem',
        measure: '60ch',
      },
      borderRadius: { panel: '0.75rem' },
      boxShadow: {
        lift: '0 1px 2px rgb(0 0 0 / 0.3), 0 12px 32px -12px rgb(0 0 0 / 0.5)',
        float: '0 1px 2px rgb(0 0 0 / 0.3), 0 24px 64px -24px rgb(0 0 0 / 0.65)',
      },
      transitionTimingFunction: {
        // One curve for everything: fast in, long soft settle, never bouncy.
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
        quiet: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      keyframes: {
        'caret-blink': { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
      },
      animation: {
        'caret-blink': 'caret-blink 1.05s step-end infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
