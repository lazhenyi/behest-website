import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        neon: {
          purple: '#7C3AED',
          cyan: '#06B6D4',
          pink: '#F43F5E',
          yellow: '#FACC15',
          green: '#22D3EE',
        },
        surface: {
          DEFAULT: '#0A0A0A',
          raised: '#111111',
          overlay: '#1A1A1A',
        },
      },
      boxShadow: {
        brutal: '4px 4px 0 0 currentColor',
        'brutal-sm': '2px 2px 0 0 currentColor',
        'brutal-lg': '6px 6px 0 0 currentColor',
        'brutal-purple': '4px 4px 0 0 #7C3AED',
        'brutal-cyan': '4px 4px 0 0 #06B6D4',
        'brutal-pink': '4px 4px 0 0 #F43F5E',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'brutal': '2px',
      },
    },
  },
  plugins: [],
}
export default config
