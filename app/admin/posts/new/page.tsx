import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/types'
import { PostEditor } from '../components/post-editor'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-foreground">Nuevo post</h1>
      <div className="mt-8">
        <PostEditor categories={(categories as Category[]) || []} />
      </div>
    </div>
  )
}
