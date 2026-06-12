'use client'

import { useLanguage } from '@/shared/contexts/language-context'
import type { SacramentItem } from '@/features/parish/types'

/* ─── Icons ─────────────────────────────────────────────────────────────────── */
function ConfessionsIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
    </svg>
  )
}

function BaptismIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 2C8 2 4 8 4 13a8 8 0 0016 0c0-5-4-11-8-11z" />
    </svg>
  )
}

function MarriageIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <circle cx="8" cy="12" r="4" />
      <circle cx="16" cy="12" r="4" />
    </svg>
  )
}

function SickVisitsIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

const ICONS: Record<string, React.ReactNode> = {
  confessions: <ConfessionsIcon />,
  baptism:     <BaptismIcon />,
  marriage:    <MarriageIcon />,
  sickVisits:  <SickVisitsIcon />,
}

/* ─── Card ─────────────────────────────────────────────────────────────────── */
function SacramentCard({ item }: { item: SacramentItem }) {
  return (
    <article className="bg-white rounded-parish shadow-sm border border-gray-100 p-7 flex flex-col gap-4">
      <div className="w-14 h-14 rounded-full bg-parish-navy/10 text-parish-navy
                      flex items-center justify-center flex-shrink-0">
        {ICONS[item.id] ?? <ConfessionsIcon />}
      </div>

      <div>
        <h3 className="text-senior-xl font-serif font-bold text-parish-navy leading-tight mb-2">
          {item.title}
        </h3>
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700
                      bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <ClockIcon />
          {item.schedule}
        </p>
      </div>

      <p className="text-senior-base text-gray-700 leading-relaxed">
        {item.details}
      </p>
    </article>
  )
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  )
}

/* ─── Section ──────────────────────────────────────────────────────────────── */
export function Sacraments() {
  const { t } = useLanguage()
  const { title, subtitle, items, contactNote } = t.sacraments

  return (
    <section id="sacraments" className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <header className="text-center mb-12">
          <span className="block text-parish-gold text-5xl mb-4 select-none" aria-hidden="true">✝</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <SacramentCard key={item.id} item={item} />
          ))}
        </div>

        <p className="mt-10 text-center text-parish-muted text-senior-base italic">
          {contactNote}
        </p>

      </div>
    </section>
  )
}
