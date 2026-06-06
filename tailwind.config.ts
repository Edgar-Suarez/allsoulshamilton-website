import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        parish: {
          navy:  '#1B3A5C',
          'navy-dark': '#122840',
          gold:  '#C4922A',
          'gold-light': '#E8B84B',
          cream: '#FAF8F3',
          'cream-dark': '#F0EDE4',
          muted: '#5A6A7A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans:  ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      fontSize: {
        // Senior-friendly scale — minimum 18px for body text
        'senior-sm':   ['1rem',    { lineHeight: '1.7' }],   // 16px fallback
        'senior-base': ['1.125rem', { lineHeight: '1.75' }], // 18px
        'senior-lg':   ['1.25rem',  { lineHeight: '1.75' }], // 20px
        'senior-xl':   ['1.5rem',   { lineHeight: '1.6' }],  // 24px
        'senior-2xl':  ['1.875rem', { lineHeight: '1.4' }],  // 30px
        'senior-3xl':  ['2.25rem',  { lineHeight: '1.3' }],  // 36px
        'senior-4xl':  ['3rem',     { lineHeight: '1.2' }],  // 48px
      },
      spacing: {
        // Minimum 48px touch targets for seniors
        'touch': '3rem',
      },
      borderRadius: {
        'parish': '0.75rem',
      },
    },
  },
  plugins: [],
}

export default config
