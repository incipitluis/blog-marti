import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Post, Category } from '@/lib/types'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { CategoryBadge } from '@/components/category-badge'
import { FadeIn } from '@/components/fade-in'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre psiquiatría social, salud mental comunitaria y reflexiones clínicas.',
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, blog_categories(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  return (
    <>
      <Nav />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <FadeIn>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Blog
            </h1>
          </FadeIn>

          {(categories as Category[] | null)?.length ? (
            <FadeIn delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {(categories as Category[]).map((cat) => (
                  <CategoryBadge key={cat.id} category={cat} />
                ))}
              </div>
            </FadeIn>
          ) : null}

          {(posts as Post[] | null)?.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(posts as Post[]).map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.05}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn delay={0.2}>
              <div className="mt-12 rounded-lg border border-border bg-surface p-12 text-center">
                <p className="text-secondary">Aún no hay artículos publicados.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
