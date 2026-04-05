'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-foreground">
          Martí Ariza
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/blog" className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link href="/#categorias" className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
            Categorías
          </Link>
          <Link href="/#contacto" className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
            Contacto
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          aria-label="Menú"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link href="/#categorias" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
              Categorías
            </Link>
            <Link href="/#contacto" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
