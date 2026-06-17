'use client'

import { useLanguage } from '@/shared/contexts/language-context'
import type { ParishContentDisplay } from '@/features/parish/types'

interface WeeklySermonProps {
  sermon?: ParishContentDisplay
}

export function WeeklySermon({ sermon }: WeeklySermonProps) {
  const { t } = useLanguage()
  const { title, subtitle, noContent, posted } = t.weeklySermon

  if (!sermon) {
    return (
      <section id="weekly-sermon" className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <header className="text-center mb-12">
            <span className="block text-5xl text-parish-gold mb-4 select-none" aria-hidden="true">
              ✝
            </span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </header>

          <article className="text-center py-12 px-6 bg-parish-cream rounded-lg border-2 border-dashed border-parish-navy/20">
            <p className="text-senior-lg text-parish-muted font-medium">{noContent}</p>
            <p className="text-senior-sm text-parish-navy/60 mt-3">
              El Padre compartirá su reflexión semanal en breve.
            </p>
          </article>
        </div>
      </section>
    )
  }

  return (
    <section id="weekly-sermon" className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12">
          <span className="block text-5xl text-parish-gold mb-4 select-none" aria-hidden="true">
            ✝
          </span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </header>

        <article className="bg-parish-cream rounded-lg border border-parish-navy/10 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-parish-navy px-6 sm:px-8 py-4">
            <p className="text-parish-gold/90 text-senior-sm font-semibold tracking-wide">
              {posted} • {new Date(sermon.created_at).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-12">
            <div className="prose prose-sm sm:prose max-w-none">
              <p className="text-senior-lg leading-relaxed text-parish-navy whitespace-pre-wrap">
                {sermon.content}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
