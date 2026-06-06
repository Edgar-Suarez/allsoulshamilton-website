'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Language, Translations } from '@/features/parish/types'

import en from '@/locales/en.json'
import es from '@/locales/es.json'
import it from '@/locales/it.json'

const translations: Record<Language, Translations> = {
  en: en as Translations,
  es: es as Translations,
  it: it as Translations,
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('parish-lang') as Language | null
    if (saved && ['en', 'es', 'it'].includes(saved)) {
      setLangState(saved)
    }
  }, [])

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('parish-lang', newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
