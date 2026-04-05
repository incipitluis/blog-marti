import Link from 'next/link'
import type { Category } from '@/lib/types'

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {category.name}
    </Link>
  )
}
