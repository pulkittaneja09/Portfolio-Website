import type { Config } from 'tailwindcss';

/**
 * Quiet Futurism.
 *
 * Every colour resolves to a CSS variable in src/index.css, so the light/dark
 * swap is a single class on <html> with no JS re-render. The palette is
 * monochrome by design — there is no hue in this file.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        faint: 'rgb(var(--text-faint) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        /** Pure light, for spotlights and overlays. White in dark mode, black in light. */
        light: 'rgb(var(--light) / <alpha-value>)',
      },
      borderColor: {
        // Consumed by Tailwind's preflight, so no extra universal selector.
        DEFAULT: 'var(--border)',
        hairline: 'var(--border)',
        strong: 'var(--border-hover)',
      },
      backgroundColor: {
        surface: 'var(--surface)',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Hero: 72px on a phone, up to 120px on a wide screen.
        'display-xl': [
          'clamp(4.5rem, 9.5vw, 7.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '500' },
        ],
        'display-lg': [
          'clamp(2.25rem, 5vw, 3.5rem)',
          { lineHeight: '1', letterSpacing: '-0.035em', fontWeight: '500' },
        ],
        'display-md': [
          'clamp(1.75rem, 3.4vw, 2.5rem)',
          { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '500' },
        ],
        'display-sm': [
          'clamp(1.25rem, 2vw, 1.5rem)',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' },
        ],
      },
      maxWidth: { shell: '75rem', measure: '60ch' },
      borderRadius: { panel: '0.875rem' },
      boxShadow: {
        // Depth from elevation, never from colour.
        lift: '0 1px 2px rgb(0 0 0 / 0.2), 0 12px 32px -12px rgb(0 0 0 / 0.45)',
        float: '0 1px 2px rgb(0 0 0 / 0.25), 0 24px 64px -24px rgb(0 0 0 / 0.6)',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'caret-blink': { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
        'caret-blink': 'caret-blink 1.05s step-end infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
