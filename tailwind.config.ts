import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'parish-navy': '#1B3A5C',
        'parish-navy-dark': '#0F2336',
        'parish-gold': '#D4A574',
        'parish-gold-light': '#E5C5A3',
        'parish-cream': '#FAF8F3',
        'parish-muted': '#6B7280',
      },
      fontSize: {
        'senior-sm': ['16px', { lineHeight: '1.5' }],
        'senior-base': ['18px', { lineHeight: '1.5' }],
        'senior-lg': ['20px', { lineHeight: '1.6' }],
        'senior-xl': ['24px', { lineHeight: '1.6' }],
        'senior-2xl': ['28px', { lineHeight: '1.6' }],
        'senior-3xl': ['32px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'parish': '8px',
      },
    },
  },
  plugins: [],
}

export default config
