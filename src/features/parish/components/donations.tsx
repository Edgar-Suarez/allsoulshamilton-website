'use client'

import { useLanguage } from '@/shared/contexts/language-context'

/* ─── Icon components (inline SVG — zero external deps) ───────────────────── */
function PhoneIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

/* ─── Card ─────────────────────────────────────────────────────────────────── */
interface DonationCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  highlight?: string
  highlightLabel?: string
}

function DonationCard({ icon, title, children, highlight, highlightLabel }: DonationCardProps) {
  return (
    <article className="bg-white rounded-parish shadow-sm border border-gray-100 p-7
                        flex flex-col gap-4">
      {/* Icon circle */}
      <div className="w-14 h-14 rounded-full bg-parish-navy/10 text-parish-navy
                      flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-senior-xl font-serif font-bold text-parish-navy leading-tight">
        {title}
      </h3>

      {/* Body */}
      <div className="text-senior-base text-gray-700 leading-relaxed flex-grow">
        {children}
      </div>

      {/* Highlighted value (email / pickup instruction) */}
      {highlight && (
        <div className="mt-auto pt-4 border-t border-gray-100">
          {highlightLabel && (
            <p className="text-sm text-parish-muted mb-1 font-medium">{highlightLabel}</p>
          )}
          <p className="text-parish-navy font-bold text-senior-lg break-all">{highlight}</p>
        </div>
      )}
    </article>
  )
}

/* ─── Section ──────────────────────────────────────────────────────────────── */
export function Donations() {
  const { t } = useLanguage()
  const { title, subtitle, interac, envelope, preauthorized } = t.donations

  return (
    <section id="donate" className="py-16 sm:py-24 bg-parish-cream-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="text-center mb-12">
          <span className="block text-parish-gold text-5xl mb-4 select-none" aria-hidden="true">✝</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </header>

        {/* Cards — 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Interac e-Transfer */}
          <DonationCard
            icon={<PhoneIcon />}
            title={interac.title}
            highlight={interac.email}
            highlightLabel={interac.description}
          >
            <p>{interac.instructions}</p>
          </DonationCard>

          {/* Weekly Envelope */}
          <DonationCard
            icon={<EnvelopeIcon />}
            title={envelope.title}
          >
            <p>{envelope.description}</p>
          </DonationCard>

          {/* Pre-Authorized */}
          <DonationCard
            icon={<CalendarIcon />}
            title={preauthorized.title}
          >
            <p>{preauthorized.description}</p>
            <a
              href={`tel:${t.contact.phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2 mt-4 text-parish-navy font-bold
                         hover:text-parish-gold transition-colors"
              aria-label={`Call parish office: ${t.contact.phone}`}
            >
              <span className="text-senior-lg">{t.contact.phone}</span>
            </a>
          </DonationCard>

        </div>

        {/* Note */}
        <p className="mt-8 text-center text-parish-muted text-sm italic">
          All donations support the ministries and maintenance of Our Lady of All Souls Parish.
          Charitable tax receipts available upon request.
        </p>

      </div>
    </section>
  )
}
