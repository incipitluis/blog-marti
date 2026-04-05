import { createClient } from '@/lib/supabase/server'
import type { AboutContent } from '@/lib/types'
import { AboutEditor } from './components/about-editor'

export default async function AdminAboutPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('about_content')
    .select('*')
    .eq('id', 'marti-ariza')
    .single()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Sobre Martí Ariza</h1>
        <p className="mt-1 text-sm text-secondary">
          Edita el contenido de la sección &quot;Sobre&quot; de la página principal.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <AboutEditor about={data as AboutContent | null} />
      </div>
    </div>
  )
}
