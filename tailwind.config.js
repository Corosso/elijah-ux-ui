
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
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'luxury-dark': '0 10px 40px -10px rgba(0,0,0,0.4)',
        'glow': '0 0 20px rgba(201, 168, 76, 0.3)',
      }
    },
  },
  plugins: [],
}
