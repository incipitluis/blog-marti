import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Post, Category, AboutContent } from '@/lib/types'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { CategoryBadge } from '@/components/category-badge'
import { FadeIn } from '@/components/fade-in'

export default async function Home() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, blog_categories(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  const { data: aboutData } = await supabase
    .from('about_content')
    .select('*')
    .eq('id', 'marti-ariza')
    .single()

  const about = aboutData as AboutContent | null

  const aboutHeading = about?.heading ?? 'Sobre Martí Ariza'
  const aboutParagraphs = about?.body
    ? about.body.split('\n')
    : ['Investigador predoctoral en el CSIC, experto en filosofía, psiquiatría y estudios del trauma',
    ]

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="max-w-2xl">
              <h1 className="animate-fade-in-up font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Filosofía, psiquiatría y estudios del trauma
              </h1>
              <p className="animate-fade-in-up-delay-1 mt-6 text-lg leading-relaxed text-secondary md:text-xl">
                Un espacio de reflexión sobre los fundamentos históricos, epistemológicos y sociales de la experiencia traumática y de los dispositivos clínicos que la interpretan
              </p>
              <p className="animate-fade-in-up-delay-2 mt-2 text-base text-muted">
                Por Martí Ariza
              </p>
              <div className="animate-fade-in-up-delay-3 mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
                >
                  Leer artículos
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-accent/5 to-transparent" />
        </section>

        {(posts as Post[] | null)?.length ? (
          <section className="bg-background py-20">
            <div className="mx-auto max-w-6xl px-6">
              <FadeIn>
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                    Últimos artículos
                  </h2>
                  <Link href="/blog" className="text-sm font-medium text-accent transition-colors hover:text-accent-light">
                    Ver todos &rarr;
                  </Link>
                </div>
              </FadeIn>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(posts as Post[]).map((post, i) => (
                  <FadeIn key={post.id} delay={i * 0.1}>
                    <PostCard post={post} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-background py-20">
            <div className="mx-auto max-w-6xl px-6">
              <FadeIn>
                <div className="rounded-lg border border-border bg-surface p-12 text-center">
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    Próximamente
                  </h2>
                  <p className="mt-3 text-secondary">
                    Los artículos se publicarán pronto. ¡Vuelve a visitarnos!
                  </p>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {(categories as Category[] | null)?.length ? (
          <section id="categorias" className="bg-surface-alt py-20">
            <div className="mx-auto max-w-6xl px-6">
              <FadeIn>
                <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                  Categorías
                </h2>
                <p className="mt-3 text-secondary">
                  Explora los artículos por temática.
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {(categories as Category[]).map((cat) => (
                    <CategoryBadge key={cat.id} category={cat} />
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>
        ) : null}

        <section className="bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6">
            <FadeIn>
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                    {aboutHeading}
                  </h2>
                  {aboutParagraphs.map((p, i) => (
                    <p key={i} className={`${i === 0 ? 'mt-4' : 'mt-3'} leading-relaxed text-secondary`}>
                      {p}
                    </p>
                  ))}
                  <a
                    href="mailto:martiari@ucm.es"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-light"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    martiari@ucm.es
                  </a>
                </div>
                <div className="flex justify-center">
                  <div className="h-64 w-64 rounded-full bg-surface-alt border border-border flex items-center justify-center overflow-hidden">
                    {about?.image_url ? (
                      <img
                        src={about.image_url}
                        alt={aboutHeading}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-6xl text-muted">MA</span>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
