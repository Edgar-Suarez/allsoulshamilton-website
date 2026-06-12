import { redirect } from 'next/navigation'

// Sin registro público: la cuenta del párroco se crea desde el Dashboard de
// Supabase (Fase 1). Cualquier visita a /signup va al login.
export default function SignupPage() {
  redirect('/login')
}
