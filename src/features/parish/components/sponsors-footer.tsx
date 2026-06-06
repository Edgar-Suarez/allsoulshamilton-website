'use client'

import Image from 'next/image'
import { useLanguage } from '@/shared/contexts/language-context'

/* ─── Church gallery strip ─────────────────────────────────────────────────── */
function ChurchGallery() {
  const photos = [
    { src: '/images/church-building.jpg',  alt: 'Our Lady of All Souls Parish — exterior' },
    { src: '/images/ceiling-mural.jpg',    alt: 'Ceiling mural — Our Lady of All Souls' },
    { src: '/images/altar-interior.jpg',   alt: 'Church interior — altar and murals' },
  ]

  return (
    <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-parish mb-12 shadow-md">
      {photos.map(({ src, alt }) => (
        <div key={src} className="relative h-44 sm:h-56 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  )
}

/* ─── Sponsor card ──────────────────────────────────────────────────────────── */
interface SponsorCardProps {
  name: string
  category: string
  phone: string
}

function SponsorCard({ name, category, phone }: SponsorCardProps) {
  return (
    <div className="bg-white/70 border border-gray-200 rounded-lg px-4 py-3 text-center">
      <p className="font-bold text-parish-navy text-senior-base leading-tight">{name}</p>
      <p className="text-parish-muted text-sm mt-0.5">{category}</p>
      {phone && (
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          className="text-sm text-parish-gold font-medium mt-1 block hover:underline"
          aria-label={`Call ${name}: ${phone}`}
        >
          {phone}
        </a>
      )}
    </div>
  )
}

/* ─── Contact info block ────────────────────────────────────────────────────── */
function ContactBlock() {
  const { t } = useLanguage()
  const { address, phone, email, officeHoursLabel, officeHoursLines, youtubeLabel, youtubeUrl, addressLabel, contactLabel } = t.contact

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">

      {/* Address + Phone */}
      <div>
        <h4 className="text-parish-gold font-semibold text-senior-base mb-3 uppercase tracking-wide">
          {addressLabel}
        </h4>
        <address className="not-italic text-white/85 text-senior-base leading-relaxed">
          {address}
        </address>
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          className="block mt-2 text-white font-bold text-senior-lg hover:text-parish-gold transition-colors"
          aria-label={`Phone: ${phone}`}
        >
          {phone}
        </a>
      </div>

      {/* Office Hours */}
      <div>
        <h4 className="text-parish-gold font-semibold text-senior-base mb-3 uppercase tracking-wide">
          {officeHoursLabel}
        </h4>
        <div className="text-white/85 text-senior-base leading-relaxed space-y-1">
          {officeHoursLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Email + YouTube */}
      <div>
        <h4 className="text-parish-gold font-semibold text-senior-base mb-3 uppercase tracking-wide">
          {contactLabel}
        </h4>
        <a
          href={`mailto:${email}`}
          className="block text-white/85 hover:text-white text-senior-base break-all transition-colors"
        >
          {email}
        </a>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 text-white/85 hover:text-parish-gold
                     text-senior-base transition-colors font-medium"
          aria-label={youtubeLabel}
        >
          <YoutubeIcon />
          {youtubeLabel}
        </a>
      </div>

    </div>
  )
}

function YoutubeIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export function SponsorsFooter() {
  const { t } = useLanguage()
  const { sponsors, footer } = t

  return (
    <footer>

      {/* ── Sponsors Section ────────────────────────────────────────────── */}
      <section id="sacraments" className="py-16 sm:py-24 bg-parish-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Church photo gallery */}
          <ChurchGallery />

          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="section-title">{sponsors.title}</h2>
            <p className="section-subtitle">{sponsors.subtitle}</p>
          </div>

          {/* Sponsor grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {sponsors.list.map((sponsor) => (
              <SponsorCard
                key={sponsor.name}
                name={sponsor.name}
                category={sponsor.category}
                phone={sponsor.phone}
              />
            ))}

            {/* "Become a sponsor" placeholder card */}
            <a
              href={`mailto:${sponsors.contactEmail}?subject=Parish%20Bulletin%20Sponsorship`}
              className="bg-parish-navy/5 border-2 border-dashed border-parish-navy/25 rounded-lg
                         px-4 py-3 text-center flex flex-col items-center justify-center gap-2
                         hover:border-parish-gold hover:bg-parish-gold/5 transition-all group
                         cursor-pointer"
              aria-label={sponsors.cta}
            >
              <span className="text-2xl text-parish-navy/30 group-hover:text-parish-gold transition-colors">+</span>
              <p className="text-parish-navy/60 text-sm font-medium group-hover:text-parish-navy leading-tight">
                {sponsors.cta}
              </p>
            </a>
          </div>

          {/* CTA banner */}
          <div className="bg-parish-navy rounded-parish p-6 sm:p-8 text-center">
            <p className="text-white font-serif text-senior-xl font-bold mb-2">
              {sponsors.cta}
            </p>
            <p className="text-white/80 text-senior-base mb-5">{sponsors.ctaDescription}</p>
            <a
              href={`mailto:${sponsors.contactEmail}?subject=Parish%20Bulletin%20Sponsorship`}
              className="btn-gold inline-flex"
            >
              {sponsors.cta}
            </a>
          </div>

        </div>
      </section>

      {/* ── Contact + Bottom Footer ──────────────────────────────────────── */}
      <div className="bg-parish-navy">

        {/* Contact strip */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-b border-white/10">
          <ContactBlock />
        </div>

        {/* Copyright bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/60 text-sm text-center sm:text-left">
            {footer.copyright} · {footer.diocese}
          </p>
          <p className="text-white/40 text-sm text-center">
            {footer.lastUpdated}
          </p>
        </div>

      </div>

    </footer>
  )
}
