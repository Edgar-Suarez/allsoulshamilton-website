'use client'

import { useLanguage } from '@/shared/contexts/language-context'
import type { MassEntry } from '@/features/parish/types'

/* ─── Language pill colors ─────────────────────────────────────────────────── */
const LANGUAGE_PILL_COLORS: Record<string, string> = {
  // English
  English:  'bg-blue-100  text-blue-800',
  'Inglés':  'bg-blue-100  text-blue-800',
  Inglese:  'bg-blue-100  text-blue-800',
  // Spanish
  Spanish:  'bg-orange-100 text-orange-800',
  'Español': 'bg-orange-100 text-orange-800',
  Spagnolo: 'bg-orange-100 text-orange-800',
  // Italian
  Italian:  'bg-green-100 text-green-800',
  Italiano: 'bg-green-100 text-green-800',
}

function LanguagePill({ language }: { language: string }) {
  const color = LANGUAGE_PILL_COLORS[language] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {language}
    </span>
  )
}

function NotesBadge({ notes }: { notes: string }) {
  if (!notes) return null
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-parish-gold/15 text-amber-700
                     rounded text-xs font-semibold border border-parish-gold/30">
      {notes}
    </span>
  )
}

/* Group mass entries by their day string */
function groupByDay(masses: MassEntry[]): [string, MassEntry[]][] {
  const map = new Map<string, MassEntry[]>()
  for (const mass of masses) {
    const existing = map.get(mass.day) ?? []
    map.set(mass.day, [...existing, mass])
  }
  return Array.from(map.entries())
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export function MassSchedule() {
  const { t } = useLanguage()
  const { title, subtitle, headers, masses } = t.schedule
  const grouped = groupByDay(masses)

  return (
    <section id="schedule" className="py-16 sm:py-24 bg-parish-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <header className="text-center mb-12">
          <span
            className="block text-5xl text-parish-gold mb-4 select-none"
            aria-hidden="true"
          >
            ✝
          </span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </header>

        {/* ── Desktop Table (sm and up) ───────────────────────────────────── */}
        <div className="hidden sm:block overflow-hidden rounded-parish shadow-sm border border-gray-100">
          <table className="w-full" role="table" aria-label={title}>
            <thead>
              <tr className="bg-parish-navy">
                <th scope="col" className="px-6 py-4 text-left text-senior-base font-semibold text-white w-2/5">
                  {headers.day}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-senior-base font-semibold text-white w-1/5">
                  {headers.time}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-senior-base font-semibold text-white w-1/5">
                  {headers.language}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-senior-base font-semibold text-white w-1/5">
                  {headers.notes}
                </th>
              </tr>
            </thead>
            <tbody>
              {masses.map((mass, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 last:border-0
                              transition-colors hover:bg-parish-cream-dark
                              ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4 text-senior-base font-medium text-gray-800">
                    {mass.day}
                  </td>
                  <td className="px-6 py-4 text-senior-xl font-bold text-parish-navy tabular-nums">
                    {mass.time}
                  </td>
                  <td className="px-6 py-4">
                    <LanguagePill language={mass.language} />
                  </td>
                  <td className="px-6 py-4">
                    <NotesBadge notes={mass.notes} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards (grouped by day) ───────────────────────────────── */}
        <div className="sm:hidden space-y-4" role="list" aria-label={title}>
          {grouped.map(([day, dayMasses]) => (
            <article
              key={day}
              role="listitem"
              className="bg-white rounded-parish shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Day header */}
              <div className="bg-parish-navy px-5 py-3">
                <h3 className="text-white font-serif font-bold text-senior-xl">{day}</h3>
              </div>

              {/* Times for this day */}
              <div className="divide-y divide-gray-100">
                {dayMasses.map((mass, idx) => (
                  <div key={idx} className="px-5 py-4 flex items-center justify-between gap-3">
                    <span className="text-senior-xl font-bold text-parish-navy tabular-nums flex-shrink-0">
                      {mass.time}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <LanguagePill language={mass.language} />
                      <NotesBadge notes={mass.notes} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-parish-muted text-sm italic">
          * Schedule may change on holidays and special occasions.
          Please check the weekly bulletin for updates.
        </p>

      </div>
    </section>
  )
}
