import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PadreScreen } from '@/features/voice-cms/components/padre-screen'

/**
 * Pantalla del párroco — protegida por sesión.
 * Defensa en profundidad: el proxy ya redirige, pero la página re-valida.
 */
export default async function PadrePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="flex min-h-screen items-center justify-center bg-parish-cream px-4 py-12">
      <PadreScreen />
    </main>
  )
}
