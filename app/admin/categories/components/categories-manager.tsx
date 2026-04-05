'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type CategoryRow = {
  id: string
  name: string
  slug: string
  post_count: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newError, setNewError] = useState<string | null>(null)

  function startEdit(cat: CategoryRow) {
    setEditingId(cat.id)
    setEditingName(cat.name)
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
    setError(null)
  }

  async function handleSaveEdit(id: string) {
    if (!editingName.trim()) return
    setError(null)
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('blog_categories')
      .update({ name: editingName.trim(), slug: slugify(editingName.trim()) })
      .eq('id', id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: editingName.trim(), slug: slugify(editingName.trim()) } : c,
      ),
    )
    setEditingId(null)
    setEditingName('')
    setSaving(false)
  }

  async function handleDelete(cat: CategoryRow) {
    const msg =
      cat.post_count > 0
        ? `"${cat.name}" tiene ${cat.post_count} post${cat.post_count > 1 ? 's' : ''} asignado${cat.post_count > 1 ? 's' : ''}. Al borrarla, esos posts quedarán sin categoría. ¿Continuar?`
        : `¿Borrar la categoría "${cat.name}"?`

    if (!window.confirm(msg)) return

    const supabase = createClient()
    const { error } = await supabase.from('blog_categories').delete().eq('id', cat.id)

    if (error) {
      setError(error.message)
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== cat.id))
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setNewError(null)
    setCreating(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name: newName.trim(), slug: slugify(newName.trim()) })
      .select('id, name, slug')
      .single()

    if (error) {
      setNewError(error.message)
      setCreating(false)
      return
    }

    setCategories((prev) =>
      [...prev, { ...(data as { id: string; name: string; slug: string }), post_count: 0 }].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    )
    setNewName('')
    setShowNew(false)
    setCreating(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-alt text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium text-center">Posts</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-secondary">
                  No hay categorías todavía.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleSaveEdit(cat.id) }
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      autoFocus
                      className="w-full rounded-md border border-accent bg-surface px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  ) : (
                    <span className="font-medium text-foreground">{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-secondary">
                  {editingId === cat.id ? slugify(editingName) : cat.slug}
                </td>
                <td className="px-4 py-3 text-center text-secondary">{cat.post_count}</td>
                <td className="px-4 py-3">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={saving || !editingName.trim()}
                        className="text-sm font-medium text-accent transition-colors hover:text-accent-light disabled:opacity-50"
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-sm text-secondary transition-colors hover:text-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="text-sm text-red-500 transition-colors hover:text-red-700"
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew ? (
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Nueva categoría</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); handleCreate() }
                if (e.key === 'Escape') { setShowNew(false); setNewName(''); setNewError(null) }
              }}
              placeholder="Nombre de la categoría"
              autoFocus
              className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => { setShowNew(false); setNewName(''); setNewError(null) }}
              className="rounded-md border border-border px-4 py-2.5 text-sm text-secondary transition-colors hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
          {newError && <p className="mt-2 text-xs text-red-600">{newError}</p>}
          {newName && (
            <p className="mt-2 text-xs text-muted">Slug: {slugify(newName)}</p>
          )}
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light"
          >
            Nueva categoría
          </button>
        </div>
      )}
    </div>
  )
}
