'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '@/shared/contexts/language-context'
import { signOut } from '@/features/auth/services/auth'

/**
 * Placeholder de la pantalla del párroco (Fase 2).
 * En Fase 4 se reemplaza por el recorder-screen de la feature voice-cms.
 */
export function PadrePlaceholder() {
  const { t } = useLanguage()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md text-center">
      <span aria-hidden="true" className="text-parish-gold text-5xl">✝</span>

      <h1 className="text-senior-3xl font-serif font-bold text-parish-navy mt-4">
        {t.auth.padreGreeting}
      </h1>

      <p className="text-senior-lg text-parish-muted mt-4">
        {t.auth.padreComingSoon}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="mt-10 w-full min-h-[56px] rounded-lg border-2 border-parish-navy/30 bg-white
                   text-senior-lg font-bold text-parish-navy
                   hover:bg-parish-cream-dark transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-parish-gold focus:ring-offset-2"
      >
        {t.auth.signOut}
      </button>
    </div>
  )
}
