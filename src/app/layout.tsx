import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/shared/contexts/language-context'

export const metadata: Metadata = {
  title: 'Our Lady of All Souls Parish',
  description: 'Our Lady of All Souls Parish - Hamilton, Ontario',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
