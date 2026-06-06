'use client'

import Image from 'next/image'
import { useLanguage } from '@/shared/contexts/language-context'

/*
  Button contrast audit (WCAG AA):
  - btn-cta-primary:  bg-amber-700 (#B45309) + white text → 4.88:1 ✓ (AA normal, AAA large)
  - btn-cta-white:    bg-white + parish-navy text          → 10.5:1 ✓ (AAA)
  - btn-cta-outline:  white text on dark overlay           → >4.5:1 ✓ (AA)
*/

export function Hero() {
  const { t } = useLanguage()

  return (
    <section
      className="relative min-h-[82vh] flex items-center justify-center overflow-hidden"
      aria-label={t.hero.welcome}
    >
      {/* Background: congregation photo */}
      <Image
        src="/images/church-exterior.jpg"
        alt="Our Lady of All Souls Parish community gathered for Mass"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Dark navy overlay — contrast tested */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(27,58,92,0.62) 0%, rgba(27,58,92,0.55) 45%, rgba(27,58,92,0.78) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-20">

        <span className="block text-parish-gold text-5xl mb-6 select-none drop-shadow-md" aria-hidden="true">✝</span>

        {/* H1 — clamp keeps it large on any screen */}
        <h1
          className="text-white font-serif font-bold leading-tight mb-5 drop-shadow-lg"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          {t.hero.welcome}
        </h1>

        <p
          className="text-white/90 mb-10 max-w-xl mx-auto drop-shadow"
          style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', lineHeight: '1.75' }}
        >
          {t.hero.subtitle}
        </p>

        {/* CTA row — stacked on mobile, inline on sm+ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center
                        justify-center gap-4 sm:gap-3">

          {/* Primary — amber-700 bg: 4.88:1 contrast with white ✓ */}
          <a
            href="#schedule"
            className="flex items-center justify-center w-full sm:w-auto
                       px-8 rounded-parish font-bold text-white shadow-lg
                       bg-amber-700 hover:bg-amber-800 active:scale-95
                       transition-all duration-150"
            style={{ fontSize: '1.125rem', minHeight: '56px' }}
          >
            {t.hero.cta.schedule}
          </a>

          {/* Secondary — white bg: 10.5:1 contrast with navy ✓ */}
          <a
            href="#bulletin"
            className="flex items-center justify-center w-full sm:w-auto
                       px-8 rounded-parish font-bold text-parish-navy bg-white shadow-lg
                       hover:bg-gray-100 active:scale-95
                       transition-all duration-150"
            style={{ fontSize: '1.125rem', minHeight: '56px' }}
          >
            {t.hero.cta.bulletin}
          </a>

          {/* Tertiary — white outline on dark overlay: ≥4.5:1 ✓ */}
          <a
            href="#sacraments"
            className="flex items-center justify-center w-full sm:w-auto
                       px-8 rounded-parish font-bold text-white
                       border-2 border-white/70 hover:bg-white/15 active:scale-95
                       transition-all duration-150"
            style={{ fontSize: '1.125rem', minHeight: '56px' }}
          >
            {t.hero.cta.sacraments}
          </a>

        </div>
      </div>

      {/* Fade into cream section below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, transparent, #FAF8F3)' }}
        aria-hidden="true"
      />
    </section>
  )
}
