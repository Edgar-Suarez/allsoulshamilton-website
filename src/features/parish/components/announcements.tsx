'use client'

import { useLanguage } from '@/shared/contexts/language-context'
import type { ParishContentDisplay } from '@/features/parish/types'

interface AnnouncementsProps {
  announcements: ParishContentDisplay[]
}

export function Announcements({ announcements }: AnnouncementsProps) {
  const { t } = useLanguage()
  const { title, subtitle, noContent, posted } = t.announcements

  if (announcements.length === 0) {
    return (
      <section id="announcements" className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <header className="text-center mb-12">
            <span className="block text-5xl text-parish-gold mb-4 select-none" aria-hidden="true">
              📢
            </span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </header>

          <article className="text-center py-12 px-6 bg-parish-cream rounded-lg border-2 border-dashed border-parish-navy/20">
            <p className="text-senior-lg text-parish-muted font-medium">{noContent}</p>
            <p className="text-senior-sm text-parish-navy/60 mt-3">
              Mantente atento a los comunicados de la comunidad.
            </p>
          </article>
        </div>
      </section>
    )
  }

  return (
    <section id="announcements" className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-12">
          <span className="block text-5xl text-parish-gold mb-4 select-none" aria-hidden="true">
            📢
          </span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </header>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-6" role="list">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              role="listitem"
              className="bg-parish-cream rounded-lg border border-parish-navy/10 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-4">
                <time className="text-senior-sm text-parish-gold font-semibold">
                  {new Date(announcement.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </time>
              </div>

              <div className="px-6 pb-6">
                <p className="text-senior-lg leading-relaxed text-parish-navy whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Stack */}
        <div className="sm:hidden space-y-4" role="list">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              role="listitem"
              className="bg-parish-cream rounded-lg border border-parish-navy/10 overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-parish-navy/10">
                <time className="text-senior-sm text-parish-gold font-semibold">
                  {new Date(announcement.created_at).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC'
                  })}
                </time>
              </div>

              <div className="px-5 py-4">
                <p className="text-senior-base leading-relaxed text-parish-navy whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
