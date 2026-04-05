'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminPostActions({ postId, published }: { postId: string; published: boolean }) {
  const router = useRouter()

  async function togglePublish() {
    const supabase = createClient()
    await supabase
      .from('posts')
      .update({
        published: !published,
        published_at: !published ? new Date().toISOString() : null,
      })
      .eq('id', postId)

    router.refresh()
  }

  async function deletePost() {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este post?')) return

    const supabase = createClient()
    await supabase.from('posts').delete().eq('id', postId)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/posts/${postId}`}
        className="text-sm text-accent transition-colors hover:text-accent-light"
      >
        Editar
      </Link>
      <button
        onClick={togglePublish}
        className="text-sm text-secondary transition-colors hover:text-foreground"
      >
        {published ? 'Despublicar' : 'Publicar'}
      </button>
      <button
        onClick={deletePost}
        className="text-sm text-red-500 transition-colors hover:text-red-700"
      >
        Eliminar
      </button>
    </div>
  )
}
