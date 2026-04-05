import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authHeader = req.headers.get('authorization')

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from('page_logs').insert([
    { event_type: 'stay_alive', path: '/', resource_type: 'home', resource_id: null },
    { event_type: 'stay_alive', path: '/blog', resource_type: 'blog_index', resource_id: null },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
}
