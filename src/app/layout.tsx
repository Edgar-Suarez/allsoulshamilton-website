import type { Metadata } from 'next'
import { LanguageProvider } from '@/shared/contexts/language-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Our Lady of All Souls Parish — Hamilton, Ontario',
  description:
    'Our Lady of All Souls Parish in Hamilton, Ontario. ' +
    'Mass schedules, sacraments, and community news in English, Spanish, and Italian.',
  keywords: ['Catholic church', 'Hamilton', 'Ontario', 'parish', 'mass schedule'],
  openGraph: {
    title: 'Our Lady of All Souls Parish',
    description: 'Catholic parish in Hamilton, Ontario serving our trilingual community.',
    siteName: 'All Souls Parish Hamilton',
    locale: 'en_CA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
