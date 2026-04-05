import Link from 'next/link'
import type { Post } from '@/lib/types'

export function PostCard({ post }: { post: Post }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-md">
      {post.cover_image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-surface-alt">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.blog_categories && (
          <span className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">
            {post.blog_categories.name}
          </span>
        )}
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-accent transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {date && (
          <p className="mt-3 text-xs text-muted">{date}</p>
        )}
      </div>
    </article>
  )
}
