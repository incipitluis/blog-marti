import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Post, Category } from '@/lib/types'
import { PostEditor } from '../components/post-editor'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-foreground">Editar post</h1>
      <div className="mt-8">
        <PostEditor post={post as Post} categories={(categories as Category[]) || []} />
      </div>
    </div>
  )
}
