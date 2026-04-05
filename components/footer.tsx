import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-semibold">Martí Ariza</p>
            <p className="mt-2 text-sm text-background/60">
              Psiquiatría social, salud mental comunitaria y reflexiones clínicas.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Navegación
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/" className="text-sm text-background/70 transition-colors hover:text-background">
                Inicio
              </Link>
              <Link href="/blog" className="text-sm text-background/70 transition-colors hover:text-background">
                Blog
              </Link>
              <Link href="/#contacto" className="text-sm text-background/70 transition-colors hover:text-background">
                Contacto
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Contacto
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-background/70">
              <p>marti.ariza@ejemplo.com</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs text-background/40">
          &copy; {new Date().getFullYear()} Martí Ariza. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
