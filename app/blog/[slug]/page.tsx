import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/lib/types'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { TiptapRenderer } from '@/components/tiptap-renderer'
import { siteUrl, siteConfig } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image_url, published_at, updated_at')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Artículo no encontrado' }

  const url = `${siteUrl}/blog/${slug}`

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt || undefined,
      locale: 'es_ES',
      siteName: siteConfig.name,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [siteConfig.author],
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, blog_categories(*)')
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: typedPost.title,
    description: typedPost.excerpt || undefined,
    url: `${siteUrl}/blog/${slug}`,
    datePublished: typedPost.published_at || undefined,
    dateModified: typedPost.updated_at || typedPost.published_at || undefined,
    image: typedPost.cover_image_url || undefined,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      email: siteConfig.email,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteUrl,
    },
    inLanguage: 'es',
    ...(typedPost.blog_categories && {
      articleSection: typedPost.blog_categories.name,
      keywords: [typedPost.blog_categories.name, ...siteConfig.keywords].join(', '),
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Nav />
      <main className="flex-1 bg-background">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <div className="mb-8">
            <Link href="/blog" className="text-sm text-accent transition-colors hover:text-accent-light">
              &larr; Volver al blog
            </Link>
          </div>

          {typedPost.blog_categories && (
            <Link
              href={`/categoria/${typedPost.blog_categories.slug}`}
              className="text-xs font-medium uppercase tracking-wider text-accent"
            >
              {typedPost.blog_categories.name}
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
                <time dateTime={typedPost.published_at || undefined}>{date}</time>
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
