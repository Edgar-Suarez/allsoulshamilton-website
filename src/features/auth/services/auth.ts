import { createClient } from '@/lib/supabase/client'
import type { LoginCredentials, LoginResult } from '@/features/auth/types'

/**
 * Login con email/password (Supabase Auth, browser client).
 * La sesión queda en cookies (@supabase/ssr) y persiste entre visitas.
 */
export async function signIn({ email, password }: LoginCredentials): Promise<LoginResult> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (!error) return { ok: true }

  // Credenciales malas vs. problemas de red/servidor
  const isInvalid =
    error.code === 'invalid_credentials' || error.status === 400 || error.status === 422

  return { ok: false, errorKey: isInvalid ? 'errorInvalidCredentials' : 'errorGeneric' }
}

/** Cierra la sesión actual y limpia las cookies de auth */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}
