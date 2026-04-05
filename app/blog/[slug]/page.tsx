import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/lib/types'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { TiptapRenderer } from '@/components/tiptap-renderer'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const typedPost = post as Post

  const date = typedPost.published_at
    ? new Date(typedPost.published_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      <Nav />
      <main className="flex-1 bg-background">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <div className="mb-8">
            <Link href="/blog" className="text-sm text-accent transition-colors hover:text-accent-light">
              &larr; Volver al blog
            </Link>
          </div>

          {typedPost.categories && (
            <Link
              href={`/categoria/${typedPost.categories.slug}`}
              className="text-xs font-medium uppercase tracking-wider text-accent"
            >
              {typedPost.categories.name}
            </Link>
          )}

          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {typedPost.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-muted">
            <span>Martí Ariza</span>
            {date && (
              <>
                <span className="text-border">·</span>
                <time>{date}</time>
              </>
            )}
          </div>

          {typedPost.cover_image_url && (
            <div className="mt-8 overflow-hidden rounded-lg">
              <img
                src={typedPost.cover_image_url}
                alt={typedPost.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose-blog mt-10">
            <TiptapRenderer content={typedPost.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
