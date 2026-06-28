import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        clay: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          overlay: 'var(--surface-overlay)',
          fg: 'var(--fg)',
          'fg-bright': 'var(--fg-bright)',
          muted: 'var(--muted)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          sage: 'var(--sage)',
          coral: 'var(--coral)',
          yellow: 'var(--warm-yellow)',
        },
      },
      borderRadius: {
        clay: '24px',
        'clay-lg': '32px',
        'clay-pill': '50px',
      },
    },
  },
  plugins: [],
}
export default config
