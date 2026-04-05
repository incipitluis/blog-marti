# Martí Ariza — Blog

A personal blog built for a friend, focused on philosophy, psychiatry, and trauma studies. It features a public-facing blog with a minimal, typographic design and a full backoffice for content management.

## Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL, Storage, Row Level Security)
- **Styling**: Tailwind CSS v4
- **Rich text editor**: Tiptap (ProseMirror)
- **Fonts**: Lora (serif), Geist Sans
- **Deployment**: Vercel

## Features

- Blog with categories, rich-text posts, and cover images
- Admin backoffice (posts, categories, about section)
- Dynamic sitemap and robots.txt
- Page view logging + daily Supabase keep-alive cron
- JSON-LD schemas (WebSite, Person, Article)
- Fully responsive

## Getting Started

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a free project, and run the following in the SQL Editor:

```sql
create table public.posts (
  id uuid not null default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content jsonb,
  excerpt text,
  category_id uuid,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_pkey primary key (id)
);

create table public.blog_categories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  constraint blog_categories_pkey primary key (id)
);

create table public.about_content (
  id text not null default 'default',
  heading text not null default 'Sobre el autor',
  body text not null,
  image_url text,
  updated_at timestamptz default now(),
  constraint about_content_pkey primary key (id)
);

create table public.page_logs (
  id uuid not null default gen_random_uuid(),
  event_type text not null default 'page_view',
  path text not null,
  resource_type text,
  resource_id text,
  created_at timestamptz not null default now(),
  constraint page_logs_pkey primary key (id)
);
```

Also create a **Storage bucket** named `post-images` (public read access).

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CRON_SECRET=a-long-random-secret
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The backoffice is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Customisation

### SEO and site identity

Edit `lib/site.ts` to update the site URL, author name, email, description, and keywords.

### Hardcoded content

A few strings are hardcoded as fallbacks for when the database has no content yet:

| File | Content |
|------|---------|
| `app/page.tsx` | Hero heading and tagline |
| `app/admin/about/components/about-editor.tsx` | Default about section text |

The about section content (heading, body, photo) is fully editable from the backoffice once the project is running.

### Favicon and browser icon

Replace `app/favicon.ico` with your own `.ico` file. For full cross-browser and PWA support you can also add `app/icon.png` (512×512) and `app/apple-icon.png` (180×180) — Next.js picks them up automatically.

## Deployment

Deploy to [Vercel](https://vercel.com). Add the environment variables from `.env.local` to your Vercel project settings.

The `vercel.json` includes a daily cron job that calls `/api/cron/stay-alive` to keep the Supabase free-tier project from being paused. Make sure `CRON_SECRET` is set in Vercel environment variables.
