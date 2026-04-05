'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Post, Category } from '@/lib/types'
import { TiptapEditor } from '@/components/tiptap-editor'
import { ImageUpload } from '@/components/image-upload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function PostEditor({ post, categories: initialCategories }: {
  post?: Post
  categories: Category[]
}) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [categoryId, setCategoryId] = useState(post?.category_id || '')
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || '')
  const [content, setContent] = useState<Record<string, unknown> | null>(post?.content || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [creatingCat, setCreatingCat] = useState(false)
  const [catError, setCatError] = useState<string | null>(null)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEditing || !post?.slug) {
      setSlug(slugify(value))
    }
  }

  async function handleCreateCategory() {
    if (!newCatName.trim()) return
    setCatError(null)
    setCreatingCat(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name: newCatName.trim(), slug: slugify(newCatName.trim()) })
      .select()
      .single()

    if (error) {
      setCatError(error.message)
      setCreatingCat(false)
      return
    }

    const created = data as Category
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
    setCategoryId(created.id)
    setNewCatName('')
    setShowNewCat(false)
    setCreatingCat(false)
  }

  async function handleSave(publish: boolean) {
    setError(null)
    setSaving(true)

    const supabase = createClient()

    const postData = {
      title,
      slug,
      excerpt,
      category_id: categoryId || null,
      cover_image_url: coverImageUrl || null,
      content,
      published: publish,
      published_at: publish ? (post?.published_at || new Date().toISOString()) : null,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', post.id)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('posts').insert(postData)

      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    router.push('/admin')
    router.refresh()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Título del artículo"
            className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="url-del-articulo"
            className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Categoría</label>
            <button
              type="button"
              onClick={() => { setShowNewCat((v) => !v); setCatError(null); setNewCatName('') }}
              className="text-xs font-medium text-accent transition-colors hover:text-accent-light"
            >
              {showNewCat ? 'Cancelar' : '+ Nueva categoría'}
            </button>
          </div>

          {showNewCat ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCategory() } }}
                  placeholder="Nombre de la categoría"
                  autoFocus
                  className="flex-1 rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCat || !newCatName.trim()}
                  className="rounded-md bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
                >
                  {creatingCat ? '...' : 'Crear'}
                </button>
              </div>
              {catError && (
                <p className="text-xs text-red-600">{catError}</p>
              )}
            </div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Imagen hero</label>
          <ImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Extracto</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="Breve descripción del artículo..."
          className="resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Contenido</label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving || !title || !slug}
          className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar borrador'}
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving || !title || !slug}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
        >
          {saving ? 'Publicando...' : 'Publicar'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-sm text-secondary transition-colors hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
