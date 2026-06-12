import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/features/auth/components/login-form'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Sesión activa → directo a la pantalla del párroco
  if (user) redirect('/padre')

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  )
}
