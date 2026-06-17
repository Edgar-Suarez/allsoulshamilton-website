'use client'

import { useLanguage } from '@/shared/contexts/language-context'
import type { ParishContentDisplay } from '@/features/parish/types'

interface DailyQuoteProps {
  quote?: ParishContentDisplay
}

export function DailyQuote({ quote }: DailyQuoteProps) {
  const { t } = useLanguage()
  const { title, subtitle, noContent, posted } = t.dailyQuote

  if (!quote) {
    return (
      <section id="daily-quote" className="py-16 sm:py-24 bg-parish-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <header className="text-center mb-12">
            <span className="block text-5xl text-parish-gold mb-4 select-none" aria-hidden="true">
              ✝
            </span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </header>

          <article className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg px-6 sm:px-10 py-10 sm:py-12 border-l-4 border-parish-gold/30 shadow-sm">
              <p className="text-senior-lg text-parish-muted font-medium italic">{noContent}</p>
              <p className="text-senior-sm text-parish-navy/60 mt-4">
                Vuelve pronto para tu reflexión espiritual diaria.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }

  return (
    <section id="daily-quote" className="py-16 sm:py-24 bg-parish-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12">
          <span className="block text-5xl text-parish-gold mb-4 select-none" aria-hidden="true">
            ✝
          </span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </header>

        <article className="max-w-2xl mx-auto text-center">
          {/* Quote block */}
          <div className="bg-white rounded-lg px-6 sm:px-10 py-10 sm:py-12 border-l-4 border-parish-gold shadow-sm">
            <blockquote className="text-senior-2xl sm:text-senior-3xl font-serif font-semibold text-parish-navy leading-tight mb-6">
              "{quote.content}"
            </blockquote>

            <footer className="text-senior-sm text-parish-muted font-medium">
              {posted} • {new Date(quote.created_at).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </footer>
          </div>
        </article>
      </div>
    </section>
  )
}
