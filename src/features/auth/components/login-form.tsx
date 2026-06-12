'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useLanguage } from '@/shared/contexts/language-context'
import { signIn } from '@/features/auth/services/auth'
import type { LoginErrorKey } from '@/features/auth/types'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

/**
 * Formulario de login del personal parroquial.
 * Senior-friendly: texto grande, alto contraste, touch targets ≥ 56px.
 */
export function LoginForm() {
  const { t } = useLanguage()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorKey, setErrorKey] = useState<LoginErrorKey | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorKey(null)

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const emailInvalid = parsed.error.issues.some((i) => i.path[0] === 'email')
      setErrorKey(emailInvalid ? 'errorEmailInvalid' : 'errorPasswordRequired')
      return
    }

    setSubmitting(true)
    const result = await signIn(parsed.data)

    if (result.ok) {
      router.push('/padre')
      router.refresh() // refresca Server Components con la nueva sesión
      return
    }

    setErrorKey(result.errorKey ?? 'errorGeneric')
    setSubmitting(false)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-parish-navy/10 p-8 sm:p-10">
      <div className="text-center mb-8">
        <span aria-hidden="true" className="text-parish-gold text-4xl">✝</span>
        <h1 className="text-senior-2xl font-serif font-bold text-parish-navy mt-3">
          {t.auth.loginTitle}
        </h1>
        <p className="text-senior-base text-parish-muted mt-2">{t.auth.loginSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-senior-base font-semibold text-parish-navy mb-2">
          {t.auth.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-[56px] px-4 rounded-lg border-2 border-parish-navy/20 bg-white
                     text-senior-lg text-parish-navy
                     focus:border-parish-gold focus:outline-none focus:ring-2 focus:ring-parish-gold/30"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-senior-base font-semibold text-parish-navy mb-2">
          {t.auth.passwordLabel}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-h-[56px] px-4 rounded-lg border-2 border-parish-navy/20 bg-white
                     text-senior-lg text-parish-navy
                     focus:border-parish-gold focus:outline-none focus:ring-2 focus:ring-parish-gold/30"
        />
      </div>

      {errorKey && (
        <p role="alert" className="text-senior-base font-medium text-red-700 bg-red-50
                                   border border-red-200 rounded-lg px-4 py-3">
          {t.auth[errorKey]}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full min-h-[56px] rounded-lg bg-parish-navy text-white
                   text-senior-lg font-bold tracking-wide
                   hover:bg-parish-navy-dark transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-parish-gold focus:ring-offset-2"
      >
        {submitting ? t.auth.signingIn : t.auth.signIn}
      </button>
      </form>
    </div>
  )
}
