
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          page: 'var(--bg-page)',
          'section-dark': 'var(--bg-section-dark)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        gold: {
          DEFAULT: 'var(--accent-gold)',
          hover: 'var(--accent-gold-hover)',
          light: 'var(--accent-gold-light)',
        },
        border: 'var(--border)',
        overlay: 'var(--overlay)',
        origin: 'var(--color-origin)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
      },
      fontSize: {
        /* ── Modular scale: 1.250 (Major Third) ratio, base 16px ── */

        // Micro: form labels, badges, legal metadata (10px)
        'micro': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.06em' }],

        // Caption: small body text, eyebrows, table cells (13px)
        'caption': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.03em' }],

        // Body: default paragraph text (16px)
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],

        // Body Large: lead paragraphs, prominent copy (20px)
        'body-lg': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],

        // Heading XS: card titles, modal titles (25px)
        'heading-xs': ['1.5625rem', { lineHeight: '1.35', letterSpacing: '-0.005em' }],

        // Heading SM: section headings mobile (31px)
        'heading-sm': ['1.9375rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],

        // Heading MD: section headings desktop (39px)
        'heading-md': ['2.4375rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],

        // Heading LG: primary section headings (49px)
        'heading-lg': ['3.0625rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],

        // Display SM: CTA / hero headings (61px)
        'display-sm': ['3.8125rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],

        // Display LG: maximum impact headings (76px)
        'display-lg': ['4.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],

        /* ── Fluid variants (smooth scaling, no breakpoint jumps) ── */
        'heading-sm-fluid': ['var(--fs-heading-sm)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md-fluid': ['var(--fs-heading-md)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'heading-lg-fluid': ['var(--fs-heading-lg)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm-fluid': ['var(--fs-display-sm)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-lg-fluid': ['var(--fs-display-lg)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'luxury-dark': '0 10px 40px -10px rgba(0,0,0,0.4)',
        'glow': '0 0 20px rgba(185, 149, 47, 0.3)',
      }
    },
  },
  plugins: [],
}
