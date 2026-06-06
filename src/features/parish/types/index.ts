export type Language = 'en' | 'es' | 'it'

export interface MassEntry {
  day: string
  time: string
  language: string
  notes: string
}

export interface SponsorEntry {
  name: string
  category: string
  phone: string
}

export interface Translations {
  site: {
    name: string
    shortName: string
    location: string
  }
  nav: {
    schedule: string
    bulletin: string
    sacraments: string
    donate: string
    menuLabel: string
    languages: { en: string; es: string; it: string }
  }
  hero: {
    welcome: string
    subtitle: string
    cta: { schedule: string; bulletin: string; sacraments: string }
  }
  schedule: {
    title: string
    subtitle: string
    headers: { day: string; time: string; language: string; notes: string }
    masses: MassEntry[]
  }
  donations: {
    title: string
    subtitle: string
    interac: { title: string; description: string; email: string; instructions: string }
    envelope: { title: string; description: string }
    preauthorized: { title: string; description: string }
  }
  contact: {
    address: string
    phone: string
    email: string
    officeHoursLabel: string
    officeHoursLines: string[]
    youtubeLabel: string
    youtubeUrl: string
    addressLabel: string
    contactLabel: string
  }
  sponsors: {
    title: string
    subtitle: string
    cta: string
    ctaDescription: string
    contactEmail: string
    list: SponsorEntry[]
  }
  footer: {
    copyright: string
    lastUpdated: string
    diocese: string
  }
}
