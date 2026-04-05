import { createClient } from '@/lib/supabase/server'
import { CategoriesManager } from './components/categories-manager'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_categories')
    .select('id, name, slug, posts(count)')
    .order('name')

  const categories = (data ?? []).map((cat) => ({
    id: cat.id as string,
    name: cat.name as string,
    slug: cat.slug as string,
    post_count: (cat.posts as unknown as { count: number }[])[0]?.count ?? 0,
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Categorías</h1>
        <p className="mt-1 text-sm text-secondary">
          Gestiona las categorías de los artículos del blog.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  )
}
