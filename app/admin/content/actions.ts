'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function clonePage(formData: FormData) {
  const fromSlug = formData.get('from_slug') as string
  const toSlug   = formData.get('to_slug') as string

  if (!fromSlug || !toSlug || fromSlug === toSlug) return

  const supabase = createClient()

  // Busca todas as seções da página de origem
  const { data: sourceSections } = await supabase
    .from('page_sections')
    .select('section_key, content')
    .eq('page_slug', fromSlug)

  if (!sourceSections || sourceSections.length === 0) {
    redirect(`/admin/content?error=empty`)
  }

  // Remove seções existentes do destino e insere as da origem
  await supabase.from('page_sections').delete().eq('page_slug', toSlug)

  const now = new Date().toISOString()
  await supabase.from('page_sections').insert(
    sourceSections.map((s: any) => ({
      page_slug:   toSlug,
      section_key: s.section_key,
      content:     s.content,
      updated_at:  now,
    }))
  )

  revalidatePath('/admin/content')
  revalidatePath(`/${toSlug}`)
  redirect('/admin/content?saved=1')
}
