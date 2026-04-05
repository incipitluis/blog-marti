export type AboutContent = {
  id: string
  heading: string
  body: string
  image_url: string | null
  updated_at: string | null
}

export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  content: Record<string, unknown> | null
  excerpt: string | null
  category_id: string | null
  cover_image_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  blog_categories?: Category | null
}
