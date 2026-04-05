'use client'

import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AboutContent } from '@/lib/types'

export function AboutEditor({ about }: { about: AboutContent | null }) {
  const [heading, setHeading] = useState(
    about?.heading ?? 'Sobre Martí Ariza',
  )
  const [paragraph1, setParagraph1] = useState(
    about?.body
      ? (about.body.split('\n')[0] ?? '')
      : 'Psiquiatra dedicado a la salud mental comunitaria, con especial interés en los determinantes sociales de la salud mental y la intervención en contextos de vulnerabilidad.',
  )
  const [paragraph2, setParagraph2] = useState(
    about?.body
      ? (about.body.split('\n')[1] ?? '')
      : 'Este blog nace como un espacio para compartir reflexiones, análisis y evidencias sobre la intersección entre psiquiatría, sociedad y cuidado colectivo.',
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    const supabase = createClient()

    const body = [paragraph1, paragraph2].filter(Boolean).join('\n')

    const { error } = await supabase.from('about_content').upsert({
      id: 'marti-ariza',
      heading,
      body,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          Cambios guardados correctamente.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Título de la sección</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          required
          placeholder="Sobre Martí Ariza"
          className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Primer párrafo</label>
        <textarea
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
          rows={3}
          required
          placeholder="Describe quién es Martí Ariza..."
          className="resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Segundo párrafo</label>
        <textarea
          value={paragraph2}
          onChange={(e) => setParagraph2(e.target.value)}
          rows={3}
          placeholder="Información adicional (opcional)..."
          className="resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={saving || !heading || !paragraph1}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
