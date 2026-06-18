'use client'

import Image from 'next/image'
import { useLanguage } from '@/shared/contexts/language-context'
import type { Language } from '@/features/parish/types'

const LANGUAGES: Language[] = ['en', 'es', 'it']

const NAV_LINKS = [
  { key: 'schedule', href: '#schedule', ariaLabel: 'Ver horarios de Misa' },
  { key: 'weeklySermon', href: '#weekly-sermon', ariaLabel: 'Leer sermón de la semana' },
  { key: 'dailyQuote', href: '#daily-quote', ariaLabel: 'Leer frase del día' },
  { key: 'sacraments', href: '#sacraments', ariaLabel: 'Información sobre sacramentos' },
  { key: 'announcements', href: '#announcements', ariaLabel: 'Ver avisos parroquiales' },
  { key: 'donate', href: '#donate', ariaLabel: 'Opciones de donación' },
] as const

export function Navbar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="bg-parish-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16">

          {/* Logo + Name Section */}
          <a href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-parish-gold/50 group-hover:border-parish-gold transition-colors">
              <Image
                src="/images/church-logo.jpg"
                alt="All Souls Parish"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-serif font-bold text-base leading-tight group-hover:text-parish-gold-light transition-colors">
                All Souls
              </p>
              <p className="text-parish-gold/70 text-xs">
                Hamilton
              </p>
            </div>
          </a>

          {/* Desktop Navigation - Centered */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {NAV_LINKS.map(({ key, href, ariaLabel }) => (
              <a
                key={key}
                href={href}
                aria-label={ariaLabel}
                className="text-white/80 hover:text-white hover:bg-parish-gold/20
                           px-3 py-2 rounded-md text-sm font-medium
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-parish-gold"
              >
                {(t.nav[key as keyof typeof t.nav] as string | undefined) || key}
              </a>
            ))}
          </nav>

          {/* Language Selector - Right */}
          <div
            role="group"
            aria-label="Language selector"
            className="flex items-center gap-1 bg-white/10 rounded-lg p-1 flex-shrink-0"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                aria-label={`${l.toUpperCase()}`}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold uppercase
                            transition-all duration-150
                            ${lang === l
                              ? 'bg-parish-gold text-parish-navy shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide"
        >
          {NAV_LINKS.map(({ key, href, ariaLabel }) => (
            <a
              key={key}
              href={href}
              aria-label={ariaLabel}
              className="flex-shrink-0 text-white/80 hover:text-white
                         px-3 py-1.5 text-xs font-medium whitespace-nowrap
                         hover:bg-white/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-parish-gold"
            >
              {(t.nav[key as keyof typeof t.nav] as string | undefined) || key}
            </a>
          ))}
        </nav>

      </div>
    </header>
  )
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {/* Latin cross */}
      <rect x="13" y="2"  width="6"  height="28" rx="1" />
      <rect x="4"  y="10" width="24" height="6"  rx="1" />
    </svg>
  )
}
