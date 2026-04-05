import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = false

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-lg font-semibold text-foreground">
              Panel de administración
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link href="/admin" className="text-sm text-secondary transition-colors hover:text-foreground">
                Posts
              </Link>
              <Link href="/admin/posts/new" className="text-sm text-secondary transition-colors hover:text-foreground">
                Nuevo post
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-secondary transition-colors hover:text-foreground">
              Ver web &rarr;
            </Link>
            <form action="/admin/logout" method="post">
              <LogoutButton />
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  )
}

function LogoutButton() {
  return (
    <button
      type="submit"
      className="text-sm text-muted transition-colors hover:text-foreground"
    >
      Cerrar sesión
    </button>
  )
}
