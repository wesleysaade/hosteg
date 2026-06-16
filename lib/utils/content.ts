import { createClient } from '@/lib/supabase/server'

export async function fetchPageSection(pageSlug: string, sectionKey: string): Promise<any> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('page_sections')
      .select('content')
      .eq('page_slug', pageSlug)
      .eq('section_key', sectionKey)
      .single()

    if (error) return null
    return data?.content ?? null
  } catch {
    return null
  }
}

export async function fetchAllPageSections(pageSlug: string): Promise<Record<string, any>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('page_sections')
      .select('section_key, content')
      .eq('page_slug', pageSlug)

    if (error || !data) return {}

    const result: Record<string, any> = {}
    for (const row of data) {
      result[row.section_key] = row.content
    }
    return result
  } catch {
    return {}
  }
}
