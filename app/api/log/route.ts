import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, path, resource_type, resource_id } = body

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'path requerido' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('page_logs').insert({
      event_type: event_type ?? 'page_view',
      path,
      resource_type: resource_type ?? null,
      resource_id: resource_id ?? null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'petición inválida' }, { status: 400 })
  }
}
