'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type LogPayload = {
  event_type: string
  path: string
  resource_type: string | null
  resource_id: string | null
}

function parsePathInfo(path: string): Pick<LogPayload, 'resource_type' | 'resource_id'> {
  if (path === '/') return { resource_type: 'home', resource_id: null }
  if (path === '/blog') return { resource_type: 'blog_index', resource_id: null }

  const postMatch = path.match(/^\/blog\/([^/]+)$/)
  if (postMatch) return { resource_type: 'post', resource_id: postMatch[1] }

  const catMatch = path.match(/^\/categoria\/([^/]+)$/)
  if (catMatch) return { resource_type: 'category', resource_id: catMatch[1] }

  return { resource_type: 'page', resource_id: null }
}

export function PageLogger() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    const sessionKey = `logged:${pathname}`
    if (sessionStorage.getItem(sessionKey)) return

    const { resource_type, resource_id } = parsePathInfo(pathname)

    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'page_view', path: pathname, resource_type, resource_id }),
    }).catch(() => {})

    sessionStorage.setItem(sessionKey, '1')
  }, [pathname])

  return null
}
