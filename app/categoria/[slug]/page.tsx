import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Post, Category } from '@/lib/types'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { FadeIn } from '@/components/fade-in'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single()

  if (!category) return { title: 'Categoría no encontrada' }

  return {
    title: category.name,
    description: `Artículos sobre ${category.name}.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const typedCategory = category as Category

  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(*)')
    .eq('category_id', typedCategory.id)
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Nav />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <FadeIn>
            <Link href="/blog" className="text-sm text-accent transition-colors hover:text-accent-light">
              &larr; Volver al blog
            </Link>
            <h1 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
              {typedCategory.name}
            </h1>
          </FadeIn>

          {(posts as Post[] | null)?.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(posts as Post[]).map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.05}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn delay={0.1}>
              <div className="mt-12 rounded-lg border border-border bg-surface p-12 text-center">
                <p className="text-secondary">No hay artículos en esta categoría todavía.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
