'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/shared/contexts/language-context'

/* ─── Church gallery strip ─────────────────────────────────────────────────── */
function ChurchGallery() {
  const photos = [
    { src: '/images/church-building.jpg',  alt: 'Our Lady of All Souls Parish — exterior' },
    { src: '/images/ceiling-mural.jpg',    alt: 'Ceiling mural — Our Lady of All Souls' },
    { src: '/images/altar-interior.jpg',   alt: 'Church interior — altar and murals' },
    { src: '/images/church-vertical.jpg',  alt: 'Our Lady of All Souls Parish' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 overflow-hidden rounded-parish mb-12 shadow-md">
      {photos.map(({ src, alt }) => (
        <div key={src} className="relative h-44 sm:h-56 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
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

/* ─── Bulletin carousel ─────────────────────────────────────────────────────── */
const BULLETINS = [
  { src: '/images/bulletin-1.jpg', label: 'Weekly bulletin — page 1' },
  { src: '/images/bulletin-2.jpg', label: 'Weekly bulletin — page 2' },
]

function BulletinSection({ youtubeUrl }: { youtubeUrl: string }) {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % BULLETINS.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + BULLETINS.length) % BULLETINS.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <section id="bulletin" className="bg-parish-navy py-14 sm:py-20">

      {/* Header */}
      <div className="text-center mb-10 px-4">
        <span className="block text-parish-gold text-5xl mb-4 select-none" aria-hidden="true">✝</span>
        <h2 className="font-serif font-bold text-white" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
          Weekly Bulletin
        </h2>
        <p className="text-white/70 mt-2 text-senior-base">
          Distributed after Sunday Masses &middot;{' '}
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
             className="text-parish-gold font-semibold hover:underline">
            Watch on YouTube
          </a>
        </p>
      </div>

      {/* Carousel wrapper */}
      <div
        className="select-none px-4 sm:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Inner: centered, takes up most of the viewport width */}
        <div className="relative max-w-4xl mx-auto">

          {/* Slides — stacked, only current is visible */}
          <div className="relative">
            {BULLETINS.map(({ src, label }, i) => (
              <div
                key={src}
                className="transition-opacity duration-700"
                style={{
                  opacity:       i === current ? 1 : 0,
                  pointerEvents: i === current ? 'auto' : 'none',
                  position:      i === current ? 'relative' : 'absolute',
                  inset:         i === current ? 'auto' : 0,
                }}
              >
                {/* Aspect-ratio box: height follows width (portrait page ratio) */}
                <div className="relative w-full rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                     style={{ aspectRatio: '1000 / 1294' }}>
                  <Image
                    src={src}
                    alt={label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 95vw, (max-width: 1280px) 85vw, 896px"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Arrow — left, overlapping the image edge */}
          <button
            onClick={prev}
            aria-label="Previous bulletin page"
            className="absolute -left-5 top-1/3 -translate-y-1/2 z-10
                       w-12 h-12 rounded-full bg-parish-navy/80 backdrop-blur-sm
                       border border-white/20 flex items-center justify-center text-white
                       hover:bg-parish-gold hover:border-parish-gold transition-all duration-150
                       shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Arrow — right, overlapping the image edge */}
          <button
            onClick={next}
            aria-label="Next bulletin page"
            className="absolute -right-5 top-1/3 -translate-y-1/2 z-10
                       w-12 h-12 rounded-full bg-parish-navy/80 backdrop-blur-sm
                       border border-white/20 flex items-center justify-center text-white
                       hover:bg-parish-gold hover:border-parish-gold transition-all duration-150
                       shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter pill — top-right of image */}
          <div className="absolute top-3 right-3 z-10 bg-black/50 text-white text-sm
                          font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {BULLETINS.length}
          </div>

        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {BULLETINS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Bulletin page ${i + 1}`}
            className={`rounded-full transition-all duration-300
              ${i === current
                ? 'w-8 h-3 bg-parish-gold'
                : 'w-3 h-3 bg-white/30 hover:bg-white/60'
              }`}
          />
        ))}
      </div>

    </section>
  )
}

/* ─── Contact info block ────────────────────────────────────────────────────── */
function ContactBlock() {
  const { t } = useLanguage()
  const { address, phone, email, officeHoursLabel, officeHoursLines, youtubeLabel, youtubeUrl, addressLabel, contactLabel } = t.contact

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

      {/* Address + Phone */}
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-parish-gold font-semibold text-sm uppercase tracking-widest mb-3">
            {addressLabel}
          </h4>
          <address className="not-italic text-white/80 text-base leading-relaxed text-sm">
            {address}
          </address>
        </div>
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          className="inline-flex text-white font-bold text-lg hover:text-parish-gold transition-colors"
          aria-label={`Phone: ${phone}`}
        >
          {phone}
        </a>
      </div>

      {/* Office Hours */}
      <div>
        <h4 className="text-parish-gold font-semibold text-sm uppercase tracking-widest mb-3">
          {officeHoursLabel}
        </h4>
        <div className="text-white/80 text-sm leading-relaxed space-y-1">
          {officeHoursLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Email + YouTube */}
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-parish-gold font-semibold text-sm uppercase tracking-widest mb-3">
            {contactLabel}
          </h4>
          <a
            href={`mailto:${email}`}
            className="text-white/80 hover:text-white text-sm break-all transition-colors"
          >
            {email}
          </a>
        </div>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/80 hover:text-parish-gold
                     text-sm transition-colors font-medium w-fit"
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

      {/* ── Weekly Bulletin ──────────────────────────────────────────────── */}
      <BulletinSection youtubeUrl={t.contact.youtubeUrl} />

      {/* ── Sponsors Section ────────────────────────────────────────────── */}
      <section id="sponsors" className="py-20 sm:py-28 bg-parish-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-16">
            <span className="block text-parish-gold text-4xl mb-4 select-none" aria-hidden="true">✝</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-parish-navy mb-3">
              {sponsors.title}
            </h2>
            <p className="text-lg text-parish-muted max-w-2xl mx-auto">
              {sponsors.subtitle}
            </p>
          </div>

          {/* Sponsors ads image */}
          <div className="mb-16">
            <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden
                            shadow-[0_10px_40px_rgba(27,58,92,0.15)]"
                 style={{ aspectRatio: '1100 / 1485' }}>
              <Image
                src="/images/sponsors-ads.jpg"
                alt="Local business partners and sponsors"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 95vw, (max-width: 1280px) 80vw, 768px"
              />
            </div>
          </div>

          {/* Sponsor grid */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sponsors.list.map((sponsor) => (
                <SponsorCard
                  key={sponsor.name}
                  name={sponsor.name}
                  category={sponsor.category}
                  phone={sponsor.phone}
                />
              ))}

              {/* "Become a sponsor" card */}
              <a
                href={`mailto:${sponsors.contactEmail}?subject=Parish%20Bulletin%20Sponsorship`}
                className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-parish-navy/20
                           hover:border-parish-gold hover:shadow-lg transition-all group cursor-pointer
                           flex flex-col items-center justify-center gap-3 min-h-[120px]"
                aria-label="Become a sponsor"
              >
                <span className="text-3xl text-parish-navy/30 group-hover:text-parish-gold transition-colors font-light">+</span>
                <p className="text-parish-navy font-semibold text-sm">
                  Become a Sponsor
                </p>
              </a>
            </div>
          </div>

          {/* CTA banner */}
          <div className="bg-gradient-to-r from-parish-navy to-parish-navy/90 rounded-lg p-8 sm:p-12 text-center">
            <p className="text-white font-serif text-2xl sm:text-3xl font-bold mb-3">
              {sponsors.cta}
            </p>
            <p className="text-white/80 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
              {sponsors.ctaDescription}
            </p>
            <a
              href={`mailto:${sponsors.contactEmail}?subject=Parish%20Bulletin%20Sponsorship`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-parish-gold text-parish-navy
                         font-bold rounded-lg hover:bg-parish-gold-light transition-colors shadow-md"
            >
              {sponsors.cta}
            </a>
          </div>

        </div>
      </section>

      {/* ── Contact + Bottom Footer ──────────────────────────────────────── */}
      <div className="bg-parish-navy">

        {/* Contact section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10">
          <ContactBlock />
        </div>

        {/* Copyright bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6
                        flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-sm">
            {footer.copyright}
          </p>
          <p className="text-white/50 text-xs">
            {footer.lastUpdated}
          </p>
          <p className="text-white/50 text-xs">
            {footer.diocese}
          </p>
        </div>

      </div>

    </footer>
  )
}
