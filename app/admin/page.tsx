import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/lib/types'
import { AdminPostActions } from './components/admin-post-actions'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light"
        >
          Nuevo post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-alt text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Categoría</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Fecha</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {(posts as Post[] | null)?.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/admin/posts/${post.id}`} className="hover:text-accent">
                    {post.title || 'Sin título'}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-secondary md:table-cell">
                  {post.categories?.name || '—'}
                </td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      Borrador
                    </span>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-secondary md:table-cell">
                  {new Date(post.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-4 py-3">
                  <AdminPostActions postId={post.id} published={post.published} />
                </td>
              </tr>
            )) ?? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-secondary">
                  No hay posts todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
