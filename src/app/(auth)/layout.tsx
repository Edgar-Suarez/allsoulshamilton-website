export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-parish-cream">
      {/* Layout para rutas de autenticación */}
      {children}
    </div>
  )
}
