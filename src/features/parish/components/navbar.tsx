'use client'

import Image from 'next/image'
import { useLanguage } from '@/shared/contexts/language-context'
import type { Language } from '@/features/parish/types'

const LANGUAGES: Language[] = ['en', 'es', 'it']

const NAV_LINKS = [
  { key: 'schedule', href: '#schedule' },
  { key: 'sacraments', href: '#sacraments' },
  { key: 'donate', href: '#donate' },
] as const

export function Navbar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="bg-parish-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Main bar */}
        <div className="flex items-center justify-between gap-4 h-20">

          {/* Logo + Parish Name */}
          <a href="/" className="flex items-center gap-3 group min-h-0 py-0">
            <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border-2 border-parish-gold/50
                            group-hover:border-parish-gold transition-colors">
              <Image
                src="/images/church-logo.jpg"
                alt="Our Lady of All Souls Parish crest"
                fill
                className="object-cover object-center"
                sizes="40px"
              />
            </div>
            <div className="leading-tight">
              <p className="text-white font-serif font-bold text-senior-lg leading-snug
                            group-hover:text-parish-gold-light transition-colors">
                {t.site.shortName}
              </p>
              <p className="text-parish-gold/80 text-sm hidden sm:block">
                {t.site.location}
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-white/85 hover:text-white hover:bg-white/10
                           px-4 py-2 rounded-lg text-senior-base font-medium
                           transition-all duration-150 min-h-0"
              >
                {t.nav[key]}
              </a>
            ))}
          </nav>

          {/* Language Selector — always visible, high-contrast */}
          <div
            role="group"
            aria-label="Language selector"
            className="flex items-center gap-1 bg-white/10 rounded-xl p-1 flex-shrink-0"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                aria-label={`Switch to ${l.toUpperCase()}`}
                className={`px-3 sm:px-4 py-2 rounded-lg text-senior-base font-bold uppercase
                            transition-all duration-150 leading-none min-h-0
                            ${lang === l
                              ? 'bg-parish-gold text-white shadow-sm scale-105'
                              : 'text-white/75 hover:text-white hover:bg-white/10'
                            }`}
              >
                {t.nav.languages[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile sub-navigation (scrollable) */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden flex items-center overflow-x-auto gap-1 pb-3 -mt-1
                     scrollbar-hide"
        >
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="flex-shrink-0 text-white/80 hover:text-white
                         px-4 py-2 text-sm font-medium whitespace-nowrap
                         hover:bg-white/10 rounded-lg transition-colors min-h-0"
            >
              {t.nav[key]}
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
